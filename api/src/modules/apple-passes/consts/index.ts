import { IAppleCardProps } from '../../../common/interfaces/apple-card-props';

export const APPLE_PASS_TYPE_IDENTIFIER = 'pass.com.zajil.passes';
export const APPLE_TEAM_IDENTIFIER = 'ARG99W9YF6';

export const APPLE_PASS_PLACEHOLDER = ({
    serialNumber,
    description,
    organizationName,
    qrCodeMessage,
    qrCodeFormat,
    designType,
}): IAppleCardProps => ({
    type: designType,
    formatVersion: '1',
    passTypeIdentifier: APPLE_PASS_TYPE_IDENTIFIER,
    teamIdentifier: APPLE_TEAM_IDENTIFIER,
    serialNumber: serialNumber,
    description: description,
    organizationName: organizationName,
    barcode: {
        message: qrCodeMessage,
        format: qrCodeFormat || 'PKBarcodeFormatQR',
    },
});
