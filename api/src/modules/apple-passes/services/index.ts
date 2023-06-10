import { promises as fs } from 'fs';
import path from 'path';
import { PKPass } from 'passkit-generator';
import { getCertificates } from '../utils';
import { IAppleCardProps } from '../../../common/interfaces/apple-card-props';

export async function generatePass(props: { cardTemplateId: number; serialNumber: string, cardId: string }) {
    const folderPath = path.resolve(__dirname, `../../../../public/card-templates/${props.cardTemplateId}`);

    const [appleJSON, certificates] = await Promise.all([
        fs.readFile(`${folderPath}/applePass.json`),
        getCertificates(),
    ]);

    // get images from the card template folder
    const [icon, logo, thumbnail, footer, strip, background] = await Promise.all([
        fs.readFile(`${folderPath}/icon.png`),
        fs.readFile(`${folderPath}/logo.png`),
        fs.readFile(`${folderPath}/thumbnail.png`).catch(() => null),
        fs.readFile(`${folderPath}/footer.png`).catch(() => null),
        fs.readFile(`${folderPath}/strip.png`).catch(() => null),
        fs.readFile(`${folderPath}/background.png`).catch(() => null),
    ]);

    const appleJSONObj: IAppleCardProps = JSON.parse(appleJSON.toString());

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
    pass.addBuffer('icon.png', icon);
    pass.addBuffer('icon@2x.png', icon);

    // add logo images
    pass.addBuffer('logo.png', logo);
    pass.addBuffer('logo@2x.png', logo);

    // add thumbnail image
    if (thumbnail) {
        pass.addBuffer('thumbnail.png', thumbnail);
        pass.addBuffer('thumbnail@2x.png', thumbnail);
    }
    // add footer image
    if (footer) {
        pass.addBuffer('footer.png', footer);
        pass.addBuffer('footer@2x.png', footer);
    }
    // add strip image
    if (strip) {
        pass.addBuffer('strip.png', strip);
        pass.addBuffer('strip@2x.png', strip);
    }
    // add background image
    if (background) {
        pass.addBuffer('background.png', background);
        pass.addBuffer('background@2x.png', background);
    }

    return pass;
}
