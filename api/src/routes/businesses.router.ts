import express from 'express';
import { setCRUDRoutes } from '../helpers';
import { BusinessController } from '../controllers/Business';

const businessesRouter = express.Router();
setCRUDRoutes(businessesRouter, BusinessController)
export default businessesRouter;
