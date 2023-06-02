import { promises as fs } from 'fs';
import path from 'path';

interface Cache {
    certificates:
        | {
              signerCert: Buffer | string;
              signerKey: Buffer | string;
              wwdr: Buffer | string;
          }
        | undefined;
}

const cache: Cache = {
    certificates: undefined,
};

export async function getCertificates(): Promise<Exclude<Cache['certificates'], undefined>> {
    if (cache.certificates) {
        return cache.certificates;
    }

    const [signerCert, signerKey, wwdr] = await Promise.all([
        fs.readFile(path.resolve(__dirname, '../../../certs/signerCert.pem')),
        fs.readFile(path.resolve(__dirname, '../../../certs/signerKey.key')),
        fs.readFile(path.resolve(__dirname, '../../../certs/wwdr.pem')),
    ]);

    cache.certificates = {
        signerCert,
        signerKey,
        wwdr,
    };

    return cache.certificates;
}