import { promises as fs } from 'fs';
import path from 'path';
import { PKPass } from 'passkit-generator';
import { getCertificates } from '../utils';
import { IAppleCardProps } from '../../../common/interfaces/apple-card-props';

export async function generatePass(props: { cardTemplateId: number; serialNumber: string }) {
    const [iconFromTemplate, logoFromTemplate, thumbnailFromTemplate, appleJSON, certificates] = await Promise.all([
        fs.readFile(path.resolve(__dirname, `../../../../public/card-templates/${props.cardTemplateId}/icon.png`)),
        fs.readFile(path.resolve(__dirname, `../../../../public/card-templates/${props.cardTemplateId}/logo.png`)),
        fs
            .readFile(
                path.resolve(__dirname, `../../../../public/card-templates/${props.cardTemplateId}/thumbnail.png`),
            )
            .catch(() => null),
        fs.readFile(
            path.resolve(__dirname, `../../../../public/card-templates/${props.cardTemplateId}/applePass.json`),
        ),
        getCertificates(),
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
        message: appleJSONObj.barcode.message,
        format: appleJSONObj.barcode.format,
    });

    // add icon images
    pass.addBuffer('icon.png', iconFromTemplate);
    pass.addBuffer('icon@2x.png', iconFromTemplate);

    // add logo images
    pass.addBuffer('logo.png', logoFromTemplate);
    pass.addBuffer('logo@2x.png', logoFromTemplate);

    // add thumbnail image
    if (thumbnailFromTemplate) {
        pass.addBuffer('thumbnail.png', thumbnailFromTemplate);
        pass.addBuffer('thumbnail@2x.png', thumbnailFromTemplate);
    }

    return pass;
}
