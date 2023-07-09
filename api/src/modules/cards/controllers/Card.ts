import { NextFunction, Request, Response } from 'express';
import * as cardServices from '../services';
import { HttpError } from '../../../common';
import { RequestMod } from '../../../common/interfaces/request.mod';
import ICRUDController from '../../../common/interfaces/crud.controller';
import { CreateCardDto } from '../dto/create-card';
import { UpdateCardDto } from '../dto/update-card';

export const CardController: ICRUDController & {
    loyaltyAddPoints: (req: RequestMod, res: Response, next: NextFunction) => void;
    loyaltyRedeemGift: (req: RequestMod, res: Response, next: NextFunction) => void;
    itemSubscriptionUse: (req: RequestMod, res: Response, next: NextFunction) => void;
    registerDevice: (req: RequestMod, res: Response, next: NextFunction) => void;
    unregisterDevice: (req: RequestMod, res: Response, next: NextFunction) => void;
    getSerialNumbers: (req: RequestMod, res: Response, next: NextFunction) => void;
    sendUpdatedPass: (req: RequestMod, res: Response, next: NextFunction) => void;
    log: (req: RequestMod, res: Response, next: NextFunction) => void;
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

        cardServices
            .findOneCardById(cardId, req)
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
        const sort = req.query.sort === 'asc' ? 'asc' : 'desc';

        cardServices
            .findAllCards({ limit, offset, req, businessId, sort })
            .then((card) => res.json(card))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },
    update: function (req: RequestMod, res: Response, next: NextFunction): void {
        const cardId = Number(req.params.id);
        const businessId = Number(req.params.businessId);
        const body: UpdateCardDto = req.body;

        cardServices
            .updateCardById(cardId, businessId, body, req)
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

    loyaltyAddPoints: function (req: RequestMod, res: Response, next: NextFunction): void {
        const cardId = Number(req.params.id);

        cardServices
            .loyaltyAddPoints(cardId, req.user)
            .then((card) => res.json(card))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },

    loyaltyRedeemGift: function (req: RequestMod, res: Response, next: NextFunction): void {
        const cardId = Number(req.params.id);
        const giftId = Number(req.body.giftId);

        cardServices
            .loyaltyRedeemGift(cardId, giftId, req.user)
            .then((card) => res.json(card))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },

    itemSubscriptionUse: function (req: RequestMod, res: Response, next: NextFunction): void {
        const cardId = Number(req.params.id);

        cardServices
            .itemsSubscriptionUseItems(cardId, req.body, req.user)
            .then((card) => res.json(card))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },

    registerDevice: function (req: Request, res: Response, next: NextFunction): void {
        const serialNumber = Number(req.params.serialNumber);
        const deviceLibraryIdentifier = req.params.deviceLibraryIdentifier;
        const pushToken = req.body.pushToken;

        console.log(serialNumber, pushToken);

        cardServices
            .registerDevice({ serialNumber, pushToken, deviceLibraryIdentifier })
            .then((card) => res.status(201).json(card))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },

    unregisterDevice: function (req: Request, res: Response, next: NextFunction): void {
        const deviceLibraryIdentifier = req.params.deviceLibraryIdentifier;
        const passTypeIdentifier = req.params.passTypeIdentifier;
        const serialNumber = Number(req.params.serialNumber);

        cardServices
            .unregisterDevice({ deviceLibraryIdentifier, passTypeIdentifier, serialNumber })
            .then((card) => res.json(card))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },

    getSerialNumbers: function (req: Request, res: Response, next: NextFunction): void {
        const deviceLibraryIdentifier = req.params.deviceLibraryIdentifier;

        cardServices
            .getSerialNumbers({
                deviceLibraryIdentifier,
            })
            .then((card) => res.json(card))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },

    sendUpdatedPass: function (req: Request, res: Response, next: NextFunction): void {
        const passTypeIdentifier = req.params.passTypeIdentifier;
        const serialNumber = Number(req.params.serialNumber);

        cardServices
            .sendUpdatedPass({ passTypeIdentifier, serialNumber })
            .then((pkpassBuffer) => {
                res.writeHead(200, {
                    'Content-Type': 'application/vnd.apple.pkpass',
                    'Content-disposition': 'attachment;filename=' + 'pass.pkpass',
                });
                res.end(pkpassBuffer);
            })
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },

    log: function (req: Request, res: Response, next: NextFunction): void {
        const logs = req.body.logs;
        console.log(logs);
    },
};
