export interface ConfigInterface {
    port: number;
    host: string;
    apiPrefix: string;
    bcrypt: {
        saltRounds: number;
    };
    JWT: {
        secret: string;
        expiresIn: string;
    };
    db: {
        uri: string;
        logging: boolean;
        sync: boolean;
        syncForce: boolean;
        syncAlter: boolean;
    };
    applePasses: {
        webServiceURL: string;
    };
    aws: {
        secretAccessKey: string;
        accessKeyId: string;
        region: string;
        s3: {
            bucketName: string;
        };
    };
}
