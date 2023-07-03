import { promises as fs, writeFileSync } from 'fs';
import path from 'path';
import { PKPass } from 'passkit-generator';
import { generateStickersIfPossible, getCertificates, populateVariables } from '../utils';
import { IAppleCardProps } from '../../../common/interfaces/apple-card-props';
import { signApplePassAuthTokens } from '../../auth/services/jwt';
import config from '../../../config';
import { getFile } from '../../aws/s3';

export async function generatePass(props: { cardTemplateId: number; serialNumber: string; cardId: string }) {
    const folderPath = `card-templates/${props.cardTemplateId}`;

    const [appleJSON, certificates] = await Promise.all([getFile(`${folderPath}/applePass.json`), getCertificates()]);

    // get images from the card template folder
    const [icon, logo, thumbnail, footer, strip, background] = await Promise.all([
        getFile(`${folderPath}/icon.png`),
        getFile(`${folderPath}/logo.png`),
        getFile(`${folderPath}/thumbnail.png`).catch(() => null),
        getFile(`${folderPath}/footer.png`).catch(() => null),
        getFile(`${folderPath}/strip.png`).catch(() => null),
        getFile(`${folderPath}/background.png`).catch(() => null),
    ]);

    const appleJSONObj: IAppleCardProps = JSON.parse(
        await populateVariables(appleJSON.Body.toString(), Number(props.cardId)),
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
            serialNumber: props.serialNumber,
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
        // generate stickers if possible
        const success = await generateStickersIfPossible(
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
