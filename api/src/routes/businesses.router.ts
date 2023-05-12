import express from 'express';
import { BusinessController } from '../controllers/Business';
import { validateMiddleware } from '../middlewares/methods/validate.middleware';
import { CreateBusinessDto } from '../dto/business/create-business';
import { UpdateBusinessDto } from '../dto/business/update-business';
import cardTemplatesRouter from './card-templates.router';

const businessesRouter = express.Router();
businessesRouter.post('/', validateMiddleware(CreateBusinessDto), BusinessController.create);
businessesRouter.get('/', BusinessController.getAll);
businessesRouter.get('/' + ':id', BusinessController.getOne);
businessesRouter.patch('/' + ':id', validateMiddleware(UpdateBusinessDto), BusinessController.update);
businessesRouter.delete('/' + ':id', BusinessController.delete);

// Card Templates
businessesRouter.use('/:businessId/card-templates', cardTemplatesRouter);

export default businessesRouter;
