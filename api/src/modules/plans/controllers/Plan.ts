import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../../../common';
import { RequestMod } from '../../../common/interfaces/request.mod';
import ICRUDController from '../../../common/interfaces/crud.controller';
import { CreatePlanDto } from '../dto/create-plan';
import { UpdatePlanDto } from '../dto/update-plan';
import * as planServices from '../services';

export const PlanController: ICRUDController & {
    addUpgradedPlan: (req: RequestMod, res: Response, next: NextFunction) => void;
    getApggradedPlansForPlan: (req: RequestMod, res: Response, next: NextFunction) => void;
    subscribe: (req: RequestMod, res: Response, next: NextFunction) => void;
    upgrateSubscribe: (req: RequestMod, res: Response, next: NextFunction) => void;
    updateSubscribe: (req: RequestMod, res: Response, next: NextFunction) => void;
    deleteSubscribe: (req: RequestMod, res: Response, next: NextFunction) => void;
    getOneSubscription: (req: RequestMod, res: Response, next: NextFunction) => void;
    getAllSubscriptions: (req: RequestMod, res: Response, next: NextFunction) => void;
} = {
    create: function (req: RequestMod, res: Response, next: NextFunction): void {
        const body: CreatePlanDto = req.body;

        planServices
            .createPlan(body, req)
            .then((plan) => res.status(201).json(plan))
            .catch((err) => {
                console.error(err);
                next(new HttpError(500, err.message));
            });
    },
    getOne: function (req: RequestMod, res: Response, next: NextFunction): void {
        const planId = Number(req.params.id);

        planServices
            .getOnePlanById(planId)
            .then((plan) => res.json(plan))
            .catch((err) => {
                console.error(err);
                next(new HttpError(404, err.message));
            });
    },
    getAll: function (req: RequestMod, res: Response, next: NextFunction): void {
        planServices
            .getAllPlans()
            .then((plan) => res.json(plan))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },
    update: function (req: RequestMod, res: Response, next: NextFunction): void {
        const planId = Number(req.params.id);
        const body: UpdatePlanDto = req.body;

        planServices
            .updatePlanById(planId, body)
            .then((plan) => res.json(plan))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },
    delete: function (req: RequestMod, res: Response, next: NextFunction): void {
        const planId = Number(req.params.id);

        planServices
            .deletePlanById(planId)
            .then((plan) => res.json(plan))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },
    addUpgradedPlan: function (req: RequestMod, res: Response, next: NextFunction): void {
        const planId = Number(req.params.id);
        const body: CreatePlanDto = req.body;

        planServices
            .addUpgradedPlan(body, planId, req)
            .then((plan) => res.json(plan))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },
    getApggradedPlansForPlan: function (req: RequestMod, res: Response, next: NextFunction): void {
        const planId = Number(req.params.id);

        planServices
            .getApggradedPlansForPlan(planId)
            .then((plans) => res.json(plans))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },
    // requre validation
    subscribe: function (req: RequestMod, res: Response, next: NextFunction): void {},
    // requre validation
    upgrateSubscribe: function (req: RequestMod, res: Response, next: NextFunction): void {},
    // requre validation
    updateSubscribe: function (req: RequestMod, res: Response, next: NextFunction): void {},
    deleteSubscribe: function (req: RequestMod, res: Response, next: NextFunction): void {},
    getOneSubscription: function (req: RequestMod, res: Response, next: NextFunction): void {},
    getAllSubscriptions: function (req: RequestMod, res: Response, next: NextFunction): void {},
};
