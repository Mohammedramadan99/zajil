import express from 'express';
import { StatisticsController } from '../modules/statistics/controllers/statistics.controller';
import { validateMiddleware } from '../middlewares/methods/validate.middleware';
import { GetCardsQueryDto } from '../modules/statistics/dto/get-cards.query.dto';
import { GetCardsTotalQueryDto } from '../modules/statistics/dto/get-cards-total.query.dto';
import { GetCardsChartQueryDto } from '../modules/statistics/dto/get-cards-chart.query.dto';
import { GetCardsRewardsRedeemedChartQueryDto } from '../modules/statistics/dto/get-cards-rewards-redeemed-chart.query.dto';

const statisticsRouter = express.Router();
statisticsRouter.get('/cards', validateMiddleware(GetCardsQueryDto, true), StatisticsController.getCardStatistics);
statisticsRouter.get(
    '/cards/total',
    validateMiddleware(GetCardsTotalQueryDto, true),
    StatisticsController.getCardsTotal,
);
statisticsRouter.get(
    '/cards/chart',
    validateMiddleware(GetCardsChartQueryDto, true),
    StatisticsController.getCardsChart,
);
statisticsRouter.get(
    '/cards/rewards-redeemed/chart',
    validateMiddleware(GetCardsRewardsRedeemedChartQueryDto, true),
    StatisticsController.getCardsRewardsRedeemedChart,
);
// statisticsRouter.get('/activities', StatisticsController.);
// statisticsRouter.get('/activities/chart', StatisticsController.);
export default statisticsRouter;
