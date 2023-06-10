import { NextFunction, Request, Response } from 'express';
import * as cardTemplateServices from '../services';
import { HttpError } from '../../../common';
import { RequestMod } from '../../../common/interfaces/request.mod';
import ICRUDController from '../../../common/interfaces/crud.controller';
import { CreateCardTemplateDto } from '../dto/create-card-template';
import { UpdateCardTemplateDto } from '../dto/update-card-template';

export const CardTemplateController: ICRUDController = {
    create: function (req: RequestMod, res: Response, next: NextFunction): void {
        const businessId = Number(req.params.businessId);
        const body: CreateCardTemplateDto = req.body;
        cardTemplateServices
            .createCardTemplate(body, businessId, req)
            .then((cardTemplate) => res.status(201).json(cardTemplate))
            .catch((err) => {
                console.error(err);
                next(new HttpError(500, err.message));
            });
    },

    getOne: function (req: RequestMod, res: Response, next: NextFunction): void {
        const cardTemplateId = Number(req.params.id);
        const businessId = Number(req.params.businessId);

        cardTemplateServices
            .findOneCardTemplateById(cardTemplateId, businessId)
            .then((cardTemplate) => res.json(cardTemplate))
            .catch((err) => {
                console.error(err);
                next(new HttpError(404, err.message));
            });
    },
    getAll: function (req: RequestMod, res: Response, next: NextFunction): void {
        const limit = Number(req.query.limit) || 10;
        const offset = Number(req.query.offset) || 0;
        const businessId = Number(req.params.businessId);

        cardTemplateServices
            .findAllCardTemplates({ limit, offset, req, businessId })
            .then((cardTemplate) => res.json(cardTemplate))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },
    update: function (req: Request, res: Response, next: NextFunction): void {
        const cardTemplateId = Number(req.params.id);
        const body: UpdateCardTemplateDto = req.body;

        cardTemplateServices
            .updateCardTemplateById(cardTemplateId, body)
            .then((cardTemplate) => res.json(cardTemplate))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },
    delete: function (req: Request, res: Response, next: NextFunction): void {
        const cardTemplateId = Number(req.params.id);

        cardTemplateServices
            .deleteCardTemplateById(cardTemplateId)
            .then((cardTemplate) => res.json(cardTemplate))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },
};
