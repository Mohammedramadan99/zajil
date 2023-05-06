export interface ConfigInterface {
    port: number;
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
