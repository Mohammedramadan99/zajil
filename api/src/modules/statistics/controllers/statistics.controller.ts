import { NextFunction, Response } from 'express';
import { RequestMod } from '../../../common/interfaces/request.mod';
import * as statisticsServices from '../services/statistics.service';
import { GetCardsQueryDto } from '../dto/get-cards.query.dto';
import { GetCardsTotalQueryDto } from '../dto/get-cards-total.query.dto';
import { GetCardsChartQueryDto } from '../dto/get-cards-chart.query.dto';
import { GetActivitiesQueryDto } from '../dto/get-activities.query.dto';

export const StatisticsController = {
    getCardStatistics: function (req: RequestMod, res: Response, next: NextFunction): void {
        // get query params
        const { limit, type, businessId } = req.query as GetCardsQueryDto;

        statisticsServices
            .getCardStatistics(req.user, limit, type, businessId)
            .then((o) => {
                res.json(o);
            })
            .catch((err) => {
                next(err);
            });
    },

    getCardsTotal: function (req: RequestMod, res: Response, next: NextFunction): void {
        // get query params
        const { businessId } = req.query as GetCardsTotalQueryDto;

        statisticsServices
            .getCardsTotal(req.user, businessId)
            .then((o) => {
                res.json(o);
            })
            .catch((err) => {
                next(err);
            });
    },

    getCardsChart: function (req: RequestMod, res: Response, next: NextFunction): void {
        // get query params
        const { businessId, startDate, endDate, nPoints } = req.query as any;

        statisticsServices
            .getCardsChart(req.user, startDate, endDate, nPoints, businessId)
            .then((o) => {
                res.json(o);
            })
            .catch((err) => {
                next(err);
            });
    },

    getCardsRewardsRedeemedChart: function (req: RequestMod, res: Response, next: NextFunction): void {
        // get query params
        const { businessId, startDate, endDate, nPoints } = req.query as any;

        statisticsServices
            .getCardsRewardsRedeemedChart(req.user, startDate, endDate, nPoints, businessId)
            .then((o) => {
                res.json(o);
            })
            .catch((err) => {
                next(err);
            });
    },

    getActivities: function (req: RequestMod, res: Response, next: NextFunction): void {
        // get query params
        const { businessId, limit } = req.query as GetActivitiesQueryDto;

        statisticsServices
            .getActivities(req.user, limit, businessId)
            .then((o) => {
                res.json(o);
            })
            .catch((err) => {
                next(err);
            });
    },

    getActivitiesChart: function (req: RequestMod, res: Response, next: NextFunction): void {
        // get query params
        const { businessId, startDate, endDate, nPoints } = req.query as any;

        statisticsServices
            .getActivitiesChart(req.user, startDate, endDate, nPoints, businessId)
            .then((o) => {
                res.json(o);
            })
            .catch((err) => {
                next(err);
            });
    }
};
