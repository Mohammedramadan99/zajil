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
        // all routes except:r login and register
        const except = ['/login', '/register', '/activate-account'];
        const regex = new RegExp(except.join('|'), 'i');
        return !regex.test(req.path);
    },
};
