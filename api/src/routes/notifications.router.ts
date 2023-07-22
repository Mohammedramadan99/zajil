import express from 'express';
import { validateMiddleware } from '../middlewares/methods/validate.middleware';
import { CreateCardNotificationDto } from '../modules/notifications/dto/create-notification';
import { NotificationsController } from '../modules/notifications/controllers/notifications.controller';

const notificationsRouter = express.Router();
notificationsRouter.post(
    '/card-notification',
    validateMiddleware(CreateCardNotificationDto),
    NotificationsController.createCardNotification,
);
export default notificationsRouter;
