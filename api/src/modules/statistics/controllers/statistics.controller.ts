import { NextFunction, Response } from 'express';
import { RequestMod } from '../../../common/interfaces/request.mod';
import * as statisticsServices from '../services/statistics.service';

export const StatisticsController = {
    getCardStatistics: function (req: RequestMod, res: Response, next: NextFunction): void {
        // get query params
        const { limit, type, businessId } = req.query as any;

        statisticsServices
            .getCardStatistics(req.user, limit || 10, type || 'new', businessId)
            .then((o) => {
                res.json(o);
            })
            .catch((err) => {
                next(err);
            });
    },
};
