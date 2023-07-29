import { NextFunction, Response } from 'express';
import { RequestMod } from '../../../common/interfaces/request.mod';
import * as statisticsServices from '../services/statistics.service';
import { GetCardsQueryDto } from '../dto/get-cards.query.dto';
import { GetCardsTotalQueryDto } from '../dto/get-cards-total.query.dto';

export const StatisticsController = {
    getCardStatistics: function (req: RequestMod, res: Response, next: NextFunction): void {
        // get query params
        const { limit, type, businessId } = req.query as GetCardsQueryDto

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
    }
};
