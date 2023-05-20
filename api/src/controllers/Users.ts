import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '../dto/users/create-user';
import * as usersServices from '../services/users';
import { HttpError } from '../common';
import { RequestMod } from '../common/interfaces/request.mod';
import ICRUDController from './interfaces/crud.controller';
import { UpdateUserDto } from '../dto/users/update-user';

export const UsersController: ICRUDController & {
    activateAccount: (req: Request, res: Response, next: NextFunction) => void;
} = {
    create: function (req: Request, res: Response, next: NextFunction): void {
        const body: CreateUserDto = req.body;
        usersServices
            .createUser(body)
            .then((user) => res.status(201).json(user))
            .catch((err) => {
                console.error(err);
                next(new HttpError(500, err.message));
            });
    },

    getOne: function (req: RequestMod, res: Response, next: NextFunction): void {
        const userId = Number(req.params.id);
        console.log('userId', userId);

        usersServices
            .findOneUserById(userId)
            .then((user) => res.json(user))
            .catch((err) => {
                console.error(err);
                next(new HttpError(404, err.message));
            });
    },
    getAll: function (req: RequestMod, res: Response, next: NextFunction): void {
        const limit = Number(req.query.limit) || 10;
        const offset = Number(req.query.offset) || 0;

        usersServices
            .findAllUsers({ limit, offset, req })
            .then((users) => res.json(users))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },
    update: function (req: Request, res: Response, next: NextFunction): void {
        const userId = Number(req.params.id);
        const body: UpdateUserDto = req.body;

        usersServices
            .updateUserById(userId, body)
            .then((user) => res.json(user))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },
    delete: function (req: Request, res: Response, next: NextFunction): void {
        const userId = Number(req.params.id);

        usersServices
            .deleteUserById(userId)
            .then((user) => res.json(user))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },

    activateAccount: function (req: Request, res: Response, next: NextFunction): void {
        const token = req.params.token;

        usersServices
            .activateAccount(token)
            .then((user) => res.json(user))
            .catch((err) => {
                console.error(err);
                next(new HttpError(500, err.message));
            });
    },
};
