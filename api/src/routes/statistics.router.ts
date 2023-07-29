import express from 'express';
import { StatisticsController } from '../modules/statistics/controllers/statistics.controller';

const statisticsRouter = express.Router();
statisticsRouter.get('/cards', StatisticsController.getCardStatistics);
// statisticsRouter.get('/cards/total', StatisticsController.);
// statisticsRouter.get('/cards/chart', StatisticsController.);
// statisticsRouter.get('/cards/rewards-redeemed/chart', StatisticsController.);
// statisticsRouter.get('/activities', StatisticsController.);
// statisticsRouter.get('/activities/chart', StatisticsController.);
export default statisticsRouter;
