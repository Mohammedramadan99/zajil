require('dotenv').config();
import { ConfigInterface } from './config.interface';

const config: ConfigInterface = {
    port: parseInt(process.env.PORT, 10) || 3000,
    host: process.env.HOST || 'localhost',
    bcrypt: {
        saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
    },
    JWT: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
    db: {
        uri: process.env.DB_URI,
        logging: process.env.DB_LOGGING === 'true',
        sync: process.env.DB_SYNC === 'true',
        syncForce: process.env.DB_SYNC_FORCE === 'true',
        syncAlter: process.env.DB_SYNC_ALTER === 'true',
    },
};

export default config;
