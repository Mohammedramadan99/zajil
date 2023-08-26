import { NextFunction, Request, Response } from 'express';
import * as eventServices from '../services';
import { HttpError } from '../../../common';
import { RequestMod } from '../../../common/interfaces/request.mod';
import ICRUDController from '../../../common/interfaces/crud.controller';
import { CreateEventDto } from '../dto/create-event';
import { UpdateEventDto } from '../dto/update-event';

export const EventsController: ICRUDController = {
    create: function (req: RequestMod, res: Response, next: NextFunction): void {
        const body: CreateEventDto = req.body;
        const buinessId = Number(req.params.businessId);

        eventServices
            .createEvent(body, buinessId)
            .then((event) => res.status(201).json(event))
            .catch((err) => {
                console.error(err);
                next(new HttpError(500, err.message));
            });
    },

    getOne: function (req: RequestMod, res: Response, next: NextFunction): void {
        const eventId = Number(req.params.id);

        eventServices
            .findOneEventById(eventId)
            .then((event) => res.json(event))
            .catch((err) => {
                console.error(err);
                next(new HttpError(404, err.message));
            });
    },
    getAll: function (req: RequestMod, res: Response, next: NextFunction): void {
        const limit = Number(req.query.limit) || 10;
        const offset = Number(req.query.offset) || 0;
        const businessId = Number(req.params.businessId);

        eventServices
            .findAllEvents({ limit, offset, businessId })
            .then((event) => res.json(event))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },
    update: function (req: Request, res: Response, next: NextFunction): void {
        const eventId = Number(req.params.id);
        const body: UpdateEventDto = req.body;

        eventServices
            .updateEventById(eventId, body)
            .then((event) => res.json(event))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },
    delete: function (req: Request, res: Response, next: NextFunction): void {
        const eventId = Number(req.params.id);

        eventServices
            .deleteEventById(eventId)
            .then((event) => res.json(event))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },
};
