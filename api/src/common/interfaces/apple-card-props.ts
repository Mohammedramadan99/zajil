import { Field } from 'passkit-generator';
import { BarcodeFormat } from 'passkit-generator/lib/schemas';

export interface IAppleCardProps {
    type: 'generic';
    formatVersion: any;
    passTypeIdentifier: string;
    teamIdentifier: string;
    serialNumber: string;
    description: string;
    organizationName: string;
    logoText?: string;
    backgroundColor?: string;
    foregroundColor?: string;
    headerFields?: Field[];
    primaryFields?: Field[];
    secondaryFields?: Field[];
    auxiliaryFields?: Field[];
    backFields?: Field[];
    barcode: {
        message: string;
        format: BarcodeFormat;
        messageEncoding?: string;
    };
    webServiceURL?: string;
    authenticationToken?: string;
}
