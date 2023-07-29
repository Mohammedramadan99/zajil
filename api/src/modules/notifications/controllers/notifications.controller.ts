import { NextFunction, Response } from 'express';
import { RequestMod } from '../../../common/interfaces/request.mod';
import * as notificationsService from '../services/notifications.service';
import { CreateCardNotificationDto } from '../dto/create-notification';

export const NotificationsController = {
    createCardNotification: function (req: RequestMod, res: Response, next: NextFunction): void {
        const body: CreateCardNotificationDto = req.body;

        notificationsService
            .sendCardNotification(body, req.user)
            .then((file) => {
                res.json(file);
            })
            .catch((err) => {
                next(err);
            });
    },
};
