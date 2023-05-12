import { NextFunction, Request, Response } from 'express';
import * as businessServices from '../services/businesses';
import { HttpError } from '../common';
import { RequestMod } from '../common/interfaces/request.mod';
import ICRUDController from './interfaces/crud.controller';
import { CreateBusinessDto } from '../dto/business/create-business';
import { UpdateBusinessDto } from '../dto/business/update-business';

export const BusinessController: ICRUDController = {
    create: function (req: RequestMod, res: Response, next: NextFunction): void {
        const body: CreateBusinessDto = req.body;
        businessServices
            .createBusiness(body, req)
            .then((business) => res.status(201).json(business))
            .catch((err) => {
                console.error(err);
                next(new HttpError(500, err.message));
            });
    },

    getOne: function (req: RequestMod, res: Response, next: NextFunction): void {
        const businessId = Number(req.params.id);

        businessServices
            .findOneBusinessById(businessId)
            .then((business) => res.json(business))
            .catch((err) => {
                console.error(err);
                next(new HttpError(404, err.message));
            });
    },
    getAll: function (req: RequestMod, res: Response, next: NextFunction): void {
        const limit = Number(req.query.limit) || 10;
        const offset = Number(req.query.offset) || 0;

        businessServices
            .findAllBusinesses({ limit, offset, req })
            .then((business) => res.json(business))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },
    update: function (req: Request, res: Response, next: NextFunction): void {
        const businessId = Number(req.params.id);
        const body: UpdateBusinessDto = req.body;

        businessServices
            .updateBusinessById(businessId, body)
            .then((business) => res.json(business))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },
    delete: function (req: Request, res: Response, next: NextFunction): void {
        const businessId = Number(req.params.id);

        businessServices
            .deleteBusinessById(businessId)
            .then((business) => res.json(business))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },
};
