import { promises as fs, writeFileSync } from 'fs';
import path from 'path';
import { PKPass } from 'passkit-generator';
import {
    getCertificates,
    itemsSubGenerateStickersIfPossible,
    loyaltyGenerateStickersIfPossible,
    populateVariables,
} from '../utils';
import { IAppleCardProps } from '../../../common/interfaces/apple-card-props';
import { signApplePassAuthTokens } from '../../auth/services/jwt';
import config from '../../../config';
// import { getFile, s3LocationToKey } from '../../aws/s3';
import { getFile } from '../../aws/s3';
import { CardTemplate, CardType } from '../../card-templates/models/card-template.model';
import { Business } from '../../businesses/models/business.model';

export async function generatePass(props: { cardTemplateId: number; cardId: string }) {
    const cardTemplate = await CardTemplate.findByPk(props.cardTemplateId, {
        include: [
            {
                model: Business,
                as: 'business',
            },
        ],
    });

    const appleJSON = cardTemplate.design;
    const [certificates] = await Promise.all([getCertificates()]);

    // get images from the card template folder in aws s3
    // const [icon, logo, thumbnail, footer, strip, background] = await Promise.all([
    //     getFile(s3LocationToKey(cardTemplate.iconUrl)),
    //     getFile(s3LocationToKey(cardTemplate.logoUrl)),
    //     getFile(s3LocationToKey(cardTemplate.thumbnailUrl)).catch(() => null),
    //     getFile(s3LocationToKey(cardTemplate.footerUrl)).catch(() => null),
    //     getFile(s3LocationToKey(cardTemplate.stripUrl)).catch(() => null),
    //     getFile(s3LocationToKey(cardTemplate.backgroundUrl)).catch(() => null),
    // ]);

    // get images from the card template folder in cloudinary
    const [icon, logo, thumbnail, footer, strip, background] = await Promise.all([
        getFile(cardTemplate.iconUrl),
        getFile(cardTemplate.logoUrl),
        getFile(cardTemplate.thumbnailUrl).catch(() => null),
        getFile(cardTemplate.footerUrl).catch(() => null),
        getFile(cardTemplate.stripUrl).catch(() => null),
        getFile(cardTemplate.backgroundUrl).catch(() => null),
    ]);

    const appleJSONObj: IAppleCardProps = JSON.parse(
        await populateVariables(JSON.stringify(appleJSON), Number(props.cardId)),
    );

    const pass = new PKPass(
        {},
        {
            wwdr: certificates.wwdr,
            signerCert: certificates.signerCert,
            signerKey: certificates.signerKey,
        },
        {
            ...appleJSONObj,
            serialNumber: props.cardId,
            organizationName: cardTemplate.business.name,
            webServiceURL: config.applePasses.webServiceURL,
            authenticationToken: signApplePassAuthTokens({
                cardId: props.cardId,
                cardType: appleJSONObj.type,
            }),

            // to work with passbook
            semantics: {},
            userInfo: {},
            sharingProhibited: true,
        },
    );

    pass.type = appleJSONObj.type;

    // Add header, primary, secondary, auxiliary, and back fields
    if (appleJSONObj.headerFields) appleJSONObj.headerFields.forEach((field: any) => pass.headerFields.push(field));
    if (appleJSONObj.primaryFields) appleJSONObj.primaryFields.forEach((field: any) => pass.primaryFields.push(field));
    if (appleJSONObj.secondaryFields)
        appleJSONObj.secondaryFields.forEach((field: any) => pass.secondaryFields.push(field));
    if (appleJSONObj.auxiliaryFields)
        appleJSONObj.auxiliaryFields.forEach((field: any) => pass.auxiliaryFields.push(field));
    if (appleJSONObj.backFields) appleJSONObj.backFields.forEach((field: any) => pass.backFields.push(field));

    // add barcode
    pass.setBarcodes({
        message: props.cardId,
        format: appleJSONObj.barcode.format,
    });

    // add icon images
    pass.addBuffer('icon.png', icon.Body as Buffer);
    pass.addBuffer('icon@2x.png', icon.Body as Buffer);

    // add logo images
    pass.addBuffer('logo.png', logo.Body as Buffer);
    pass.addBuffer('logo@2x.png', logo.Body as Buffer);

    // add thumbnail image
    if (thumbnail) {
        pass.addBuffer('thumbnail.png', thumbnail.Body as Buffer);
        pass.addBuffer('thumbnail@2x.png', thumbnail.Body as Buffer);
    }
    // add footer image
    if (footer) {
        pass.addBuffer('footer.png', footer.Body as Buffer);
        pass.addBuffer('footer@2x.png', footer.Body as Buffer);
    }
    // add background image
    if (background) {
        pass.addBuffer('background.png', background.Body as Buffer);
        pass.addBuffer('background@2x.png', background.Body as Buffer);
    }

    // add strip image
    if (strip) {
        let success = false;

        // generate stickers if possible
        if (cardTemplate.cardType === CardType.ITEMS_SUBSCRIPTION)
            success = await itemsSubGenerateStickersIfPossible(
                pass,
                props.cardTemplateId,
                Number(props.cardId),
                strip.Body as Buffer,
            );
        else if (cardTemplate.cardType === CardType.LOYALTY)
            success = await loyaltyGenerateStickersIfPossible(
                pass,
                props.cardTemplateId,
                Number(props.cardId),
                strip.Body as Buffer,
            );

        if (!success) {
            pass.addBuffer('strip.png', strip.Body as Buffer);
            pass.addBuffer('strip@2x.png', strip.Body as Buffer);
        }
    }

    pass.setLocations();

    return pass;
}
