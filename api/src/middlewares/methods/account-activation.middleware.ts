import { NextFunction, Response } from 'express';
import { HttpError } from '../../common';
import { RequestMod } from '../../common/interfaces/request.mod';

// check if user account is activated
const accountActivationMiddleware = async (req: RequestMod, res: Response, next: NextFunction) => {
    try {
        // Get the user from the request
        const user = req.user;

        // Check if user account is activated
        if (!user.active) throw new Error('User account is not activated');

        next();
    } catch (error) {
        next(new HttpError(401, error.message));
    }
};

export default {
    middleware: accountActivationMiddleware,
    condition: (req: RequestMod, res: Response, next: NextFunction) => {
        const exceptRegex = [
            /\/login/,                        // /login
            /\/register/,                     // /register
            /\/activate-account/,             // /activate-account
            /\/request-account-activation/,   // /request-account-activation
            /\/businesses\/\d+\/cards/,       // /businesses/:id/cards
            /\/v1\/.*/,                       // /v1/*
        ]

        return !exceptRegex.some((regex) => regex.test(req.path));
    },
};
