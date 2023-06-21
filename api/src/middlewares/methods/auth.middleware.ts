import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../../common';
import { RequestMod } from '../../common/interfaces/request.mod';
import { IJWTPayload } from '../../common/interfaces/jwt-payload';
import { findOneUserById } from '../../modules/users/services';
import { verifyJWT } from '../../modules/auth/services/jwt';

const authMiddleware = async (req: RequestMod, res: Response, next: NextFunction) => {
    try {
        // Get the authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new Error('Authorization header is required');

        // Get the token
        const token = authHeader.split(' ')[1];
        if (!token) throw new Error('Access token required');

        // Verify the token
        const decoded: IJWTPayload = verifyJWT(token);

        // Get the user from the database
        const user = await findOneUserById(decoded.userId);
        if (!user) throw new Error('User not found');

        // Attach the user to the request
        req.user = user;

        next();
    } catch (error) {
        next(new HttpError(401, error.message));
    }
};

export default {
    middleware: authMiddleware,
    condition: (req: RequestMod, res: Response, next: NextFunction) => {
        const exceptRegex = [
            /\/login/,                  // /login
            /\/register/,               // /register
            /\/activate-account/,       // /activate-account
            /\/businesses\/\d+\/cards/, // /businesses/:id/cards
            /\/v1\/.*/,                 // /v1/*
        ]

        return !exceptRegex.some((regex) => regex.test(req.path));
    },
};
