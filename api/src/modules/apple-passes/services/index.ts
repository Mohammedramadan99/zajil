import { promises as fs } from 'fs';
import path from 'path';
import { PKPass } from 'passkit-generator';
import { getCertificates } from '../utils';

export async function generatePass(props: { cardTemplateId: number }) {
    const [iconFromModel, certificates] = await Promise.all([
        fs.readFile(path.resolve(__dirname, `../../../../public/card-templates/${props.cardTemplateId}/icon.png`)),
        getCertificates(),
    ]);

    const pass = new PKPass(
        {},
        {
            wwdr: certificates.wwdr,
            signerCert: certificates.signerCert,
            signerKey: certificates.signerKey,
        },
        {
            ...props,
            description: 'Example Apple Wallet Pass',
            serialNumber: `nmyuxofgna${Math.random()}`,
            organizationName: `Test Organization ${Math.random()}`,
        },
    );

    pass.type = 'generic';

    pass.setBarcodes({
        message: '123456789',
        format: 'PKBarcodeFormatQR',
    });

    pass.headerFields.push(
        {
            key: 'header-field-test-1',
            value: 'Unknown',
        },
        {
            key: 'header-field-test-2',
            value: 'unknown',
        },
    );

    pass.primaryFields.push(
        {
            key: 'primaryField-1',
            value: 'NAP',
        },
        {
            key: 'primaryField-2',
            value: 'VCE',
        },
    );

    /**
     * Required by Apple. If one is not available, a
     * pass might be openable on a Mac but not on a
     * specific iPhone model
     */

    pass.addBuffer('icon.png', iconFromModel);
    pass.addBuffer('icon@2x.png', iconFromModel);
    pass.addBuffer('icon@3x.png', iconFromModel);

    return pass;
}
