export interface ConfigInterface {
    port: number;
    host: string;
    dbUri: string;
    bcrypt: {
        saltRounds: number;
    };
    JWT: {
        secret: string;
        expiresIn: string;
    };
    dbLogging: boolean;
}
