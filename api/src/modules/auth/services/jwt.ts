import { sign, verify } from 'jsonwebtoken';
import { IJWTPayload } from '../../../common/interfaces/jwt-payload';
import { User } from '../../users/models/user.model';
import config from '../../../config';

export const signJWT = (user: User) => {
    const payload: IJWTPayload = {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        businesses: user.businesses.map((business) => business.id),
        roles: user.roles,
        employedAt: user.employedAt.map((branch) => branch.id),
    };
    return sign(payload, config.JWT.secret, { expiresIn: config.JWT.expiresIn });
};

export const verifyJWT = (token: string): IJWTPayload => {
    // @ts-ignore
    return verify(token, config.JWT.secret);
};
