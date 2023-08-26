import { Router } from 'express';
import { validateMiddleware } from '../middlewares/methods/validate.middleware';
import { EventsController } from '../modules/events/controllers/events';
import { CreateEventDto } from '../modules/events/dto/create-event';
import { UpdateEventDto } from '../modules/events/dto/update-event';

const menuRouter = Router({ mergeParams: true });

// Create Events
menuRouter.post('/', validateMiddleware(CreateEventDto), EventsController.create);

// find one
menuRouter.get('/:eventId', EventsController.getOne);

// Get menu
menuRouter.get('/', EventsController.getAll);

// Update menu item
menuRouter.patch('/:eventId', validateMiddleware(UpdateEventDto), EventsController.update);

// Delete menu item
menuRouter.delete('/:eventId', EventsController.delete);

export default menuRouter;
