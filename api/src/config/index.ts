require('dotenv').config();
import { ConfigInterface } from './config.interface';

const config: ConfigInterface = {
    port: parseInt(process.env.PORT, 10) || 3000,
    dbUri: process.env.DB_URI,
    bcrypt: {
        saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
    },
    JWT: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
    dbLogging: process.env.DB_LOGGING === 'true',
};

export default config;
