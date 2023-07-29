import express from 'express';
import { StatisticsController } from '../modules/statistics/controllers/statistics.controller';
import { validateMiddleware } from '../middlewares/methods/validate.middleware';
import { GetCardsQueryDto } from '../modules/statistics/dto/get-cards.query.dto';
import { GetCardsTotalQueryDto } from '../modules/statistics/dto/get-cards-total.query.dto';
import { GetCardsChartQueryDto } from '../modules/statistics/dto/get-cards-chart.query.dto';
import { GetCardsRewardsRedeemedChartQueryDto } from '../modules/statistics/dto/get-cards-rewards-redeemed-chart.query.dto';
import { GetActivitiesQueryDto } from '../modules/statistics/dto/get-activities.query.dto';
import { GetActivitiesChartQueryDto } from '../modules/statistics/dto/get-activities-chart.query.dto';

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
statisticsRouter.get(
    '/activities',
    validateMiddleware(GetActivitiesQueryDto, true),
    StatisticsController.getActivities,
);
statisticsRouter.get(
    '/activities/chart',
    validateMiddleware(GetActivitiesChartQueryDto, true),
    StatisticsController.getActivitiesChart,
);
export default statisticsRouter;
