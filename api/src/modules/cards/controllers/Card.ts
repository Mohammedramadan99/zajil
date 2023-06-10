import { NextFunction, Request, Response } from 'express';
import * as cardServices from '../services';
import { HttpError } from '../../../common';
import { RequestMod } from '../../../common/interfaces/request.mod';
import ICRUDController from '../../../common/interfaces/crud.controller';
import { CreateCardDto } from '../dto/create-card';
import { UpdateCardDto } from '../dto/update-card';

export const CardController: ICRUDController & {
    loyaltyAddPoints: (req: RequestMod, res: Response, next: NextFunction) => void;
    loyaltySubtractPoints: (req: RequestMod, res: Response, next: NextFunction) => void;
    itemSubscriptionUse: (req: RequestMod, res: Response, next: NextFunction) => void;
} = {
    create: function (req: RequestMod, res: Response, next: NextFunction): void {
        const body: CreateCardDto = req.body;
        
        cardServices
            .createCard(body, req)
            .then((card) => res.status(201).json(card))
            .catch((err) => {
                console.error(err);
                next(new HttpError(500, err.message));
            });
    },

    getOne: function (req: RequestMod, res: Response, next: NextFunction): void {
        const cardId = Number(req.params.id);
        const businessId = Number(req.params.businessId);

        cardServices
            .findOneCardById(cardId, businessId)
            .then((card) => res.json(card))
            .catch((err) => {
                console.error(err);
                next(new HttpError(404, err.message));
            });
    },
    getAll: function (req: RequestMod, res: Response, next: NextFunction): void {
        const limit = Number(req.query.limit) || 10;
        const offset = Number(req.query.offset) || 0;
        const businessId = Number(req.params.businessId);

        cardServices
            .findAllCards({ limit, offset, req, businessId })
            .then((card) => res.json(card))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },
    update: function (req: Request, res: Response, next: NextFunction): void {
        const cardId = Number(req.params.id);
        const businessId = Number(req.params.businessId);
        const body: UpdateCardDto = req.body;

        cardServices
            .updateCardById(cardId, businessId, body)
            .then((card) => res.json(card))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },
    delete: function (req: Request, res: Response, next: NextFunction): void {
        const cardId = Number(req.params.id);

        cardServices
            .deleteCardById(cardId)
            .then((card) => res.json(card))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },

    // Custom methods

    loyaltyAddPoints: function (req: Request, res: Response, next: NextFunction): void {
        const cardId = Number(req.params.id);

        cardServices
            .loyaltyAddPoints(cardId)
            .then((card) => res.json(card))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },

    loyaltySubtractPoints: function (req: Request, res: Response, next: NextFunction): void {
        const cardId = Number(req.params.id);
        const value = req.body.value;

        cardServices
            .loyaltySubtractPoints(cardId, value)
            .then((card) => res.json(card))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },

    itemSubscriptionUse: function (req: Request, res: Response, next: NextFunction): void {
        const cardId = Number(req.params.id);
        const value = req.body.value;

        cardServices
            .itemsSubscriptionUseItems(cardId, value)
            .then((card) => res.json(card))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },
};
