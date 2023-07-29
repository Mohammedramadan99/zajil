import express from 'express';
import { StatisticsController } from '../modules/statistics/controllers/statistics.controller';
import { validateMiddleware } from '../middlewares/methods/validate.middleware';
import { GetCardsQueryDto } from '../modules/statistics/dto/get-cards.query.dto';

const statisticsRouter = express.Router();
statisticsRouter.get('/cards', validateMiddleware(GetCardsQueryDto, true), StatisticsController.getCardStatistics);
// statisticsRouter.get('/cards/total', StatisticsController.);
// statisticsRouter.get('/cards/chart', StatisticsController.);
// statisticsRouter.get('/cards/rewards-redeemed/chart', StatisticsController.);
// statisticsRouter.get('/activities', StatisticsController.);
// statisticsRouter.get('/activities/chart', StatisticsController.);
export default statisticsRouter;
