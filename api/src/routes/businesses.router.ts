import express from 'express';
import { BusinessController } from '../modules/businesses/controllers/Business';
import { validateMiddleware } from '../middlewares/methods/validate.middleware';
import { CreateBusinessDto } from '../modules/businesses/dto/create-business';
import { UpdateBusinessDto } from '../modules/businesses/dto/update-business';
import cardTemplatesRouter from './card-templates.router';
import { canUseBusinessId } from '../middlewares/methods/canUseBusinessId.middleware';
import cardsRouter from './cards.router';
import menuRouter from './menu.router';

const businessesRouter = express.Router();
businessesRouter.post('/', validateMiddleware(CreateBusinessDto), BusinessController.create);
businessesRouter.get('/', BusinessController.getAll);
businessesRouter.get('/' + ':id', BusinessController.getOne);
businessesRouter.patch('/' + ':id', validateMiddleware(UpdateBusinessDto), BusinessController.update);
businessesRouter.delete('/' + ':id', BusinessController.delete);

// Card Templates
businessesRouter.use('/:businessId/card-templates', canUseBusinessId, cardTemplatesRouter);

// Cards
businessesRouter.use('/:businessId/cards', cardsRouter);

// Menu
businessesRouter.use('/:businessId/menu', canUseBusinessId, menuRouter);

export default businessesRouter;
