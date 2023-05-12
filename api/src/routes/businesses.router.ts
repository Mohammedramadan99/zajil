import express from 'express';
import { setCRUDRoutes } from '../helpers';
import { BusinessController } from '../controllers/Business';

const businessesRouter = express.Router();
setCRUDRoutes(businessesRouter, BusinessController);

// businessesRouter.use('/:businessId/card-templates', cardTemplatesRouter);

export default businessesRouter;
