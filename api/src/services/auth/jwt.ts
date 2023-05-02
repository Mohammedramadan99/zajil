import { sign, verify } from 'jsonwebtoken';
import config from '../../config';
import { IJWTPayload } from '../../common/interfaces/jwt-payload';
import { User } from '../../db/models/user.model';
import { Business } from '../../db/models/business.model';
import { Branch } from '../../db/models/branch.model';

export const signJWT = (
    user: User & {
        businesses: Business[];
        employedAt: Branch[];
    },
) => {
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
