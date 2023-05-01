import { NextFunction, Request, Response } from 'express';
import { validateDto } from '../helpers';
import { LoginDto } from '../dto/auth/login';
import { login } from '../services/auth';
import { HttpError } from '../common';

export const AuthController = {
    login: (req: Request, res: Response, next: NextFunction) => {
        const loginDto = validateDto(LoginDto, req.body);
        login(loginDto)
            .then((out) => res.json(out))
            .catch((err) => {
                next(new HttpError(401, err.message));
            });
    },
};
