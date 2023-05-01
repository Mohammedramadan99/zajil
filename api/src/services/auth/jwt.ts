import { sign, verify } from 'jsonwebtoken';
import config from '../../config';
import { IJWTPayload } from '../../common/interfaces/jwt-payload';
import { User } from '../../db/models/user.model';

export const signJWT = (user: User) => {
    const payload: IJWTPayload = {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
    };
    return sign(payload, config.JWT.secret, { expiresIn: config.JWT.expiresIn });
};

export const verifyJWT = (token: string): IJWTPayload => {
    // @ts-ignore
    return verify(token, config.JWT.secret);
};
