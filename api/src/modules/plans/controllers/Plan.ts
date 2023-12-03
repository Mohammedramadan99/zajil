import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../../../common';
import { RequestMod } from '../../../common/interfaces/request.mod';
import ICRUDController from '../../../common/interfaces/crud.controller';
import { CreatePlanDto } from '../dto/create-plan';
import { UpdatePlanDto } from '../dto/update-plan';
import { createSubscribeDto } from '../dto/add-subscribe';
import { UpdateSubscribeDto } from '../dto/update-subscribe';
import * as planServices from '../services';
import { CreateEventPlanDto } from '../dto/create-event-plan';
import { UpdateEventPlanDto } from '../dto/update-event-plan';
import { CreateEventSubscriptionDto } from '../dto/create-envet-subscription';
import { UpdateEventSubscriptionDto } from '../dto/update-envet-subscription';

export const PlanController: ICRUDController & {
    addUpgradedPlan: (req: RequestMod, res: Response, next: NextFunction) => void;
    getApggradedPlansForPlan: (req: RequestMod, res: Response, next: NextFunction) => void;
    subscribe: (req: RequestMod, res: Response, next: NextFunction) => void;
    upgrateSubscribe: (req: RequestMod, res: Response, next: NextFunction) => void;
    updateSubscribe: (req: RequestMod, res: Response, next: NextFunction) => void;
    deleteSubscribe: (req: RequestMod, res: Response, next: NextFunction) => void;
    getOneSubscriptionByBusinessId: (req: RequestMod, res: Response, next: NextFunction) => void;
    getAllSubscriptions: (req: RequestMod, res: Response, next: NextFunction) => void;
    getOneSubscriptionById: (req: RequestMod, res: Response, next: NextFunction) => void;
    createEventPlan: (req: RequestMod, res: Response, next: NextFunction) => void;
    getOneEventPlan: (req: RequestMod, res: Response, next: NextFunction) => void;
    getAllEventPlans: (req: RequestMod, res: Response, next: NextFunction) => void;
    updateEventPlan: (req: RequestMod, res: Response, next: NextFunction) => void;
    disableEventPlan: (req: RequestMod, res: Response, next: NextFunction) => void;
    deleteEventPlan: (req: RequestMod, res: Response, next: NextFunction) => void;
    eventSubscribe: (req: RequestMod, res: Response, next: NextFunction) => void;
    eventUpdateSubscribe: (req: RequestMod, res: Response, next: NextFunction) => void;
    eventDeleteSubscribe: (req: RequestMod, res: Response, next: NextFunction) => void;
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
    subscribe: function (req: RequestMod, res: Response, next: NextFunction): void {
        const body: createSubscribeDto = req.body;
        const planId = Number(body.planId);
        const numberOfMonths = Number(body.numberOfMonths);
        const businessId = Number(req.params.businessId);

        planServices
            .subscribeToPlan(planId, numberOfMonths, businessId)
            .then((plan) => res.json(plan))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },
    upgrateSubscribe: function (req: RequestMod, res: Response, next: NextFunction): void {
        const body: createSubscribeDto = req.body;
        const planId = Number(body.planId);
        const numberOfMonths = Number(body.numberOfMonths);
        const businessId = Number(req.params.businessId);

        planServices
            .upgrateSubscribe(planId, numberOfMonths, businessId)
            .then((plan) => res.json(plan))
            .catch((err) => {
                console.error(err);
                next(new HttpError(500, err.message));
            });
    },
    updateSubscribe: function (req: RequestMod, res: Response, next: NextFunction): void {
        const body: UpdateSubscribeDto = req.body;
        const businessId = Number(req.params.businessId);

        planServices
            .updateSubscribe(body, businessId)
            .then((plan) => res.json(plan))
            .catch((err) => {
                console.error(err);
                next(new HttpError(500, err.message));
            });
    },
    deleteSubscribe: function (req: RequestMod, res: Response, next: NextFunction): void {
        const businessId = Number(req.params.businessId);

        planServices
            .deleteSubscribe(businessId)
            .then((plan) => res.json(plan))
            .catch((err) => {
                console.error(err);
                next(new HttpError(500, err.message));
            });
    },
    getOneSubscriptionByBusinessId: function (req: RequestMod, res: Response, next: NextFunction): void {
        const businessId = Number(req.params.businessId);

        planServices
            .getOneSubscriptionByBusinessId(businessId)
            .then((data) => res.json(data))
            .catch((err) => {
                console.error(err);
                next(new HttpError(404, err.message));
            });
    },
    getOneSubscriptionById: function (req: RequestMod, res: Response, next: NextFunction): void {
        const subscriptionId = Number(req.params.id);

        planServices
            .getOneSubscriptionById(subscriptionId)
            .then((data) => res.json(data))
            .catch((err) => {
                console.error(err);
                next(new HttpError(404, err.message));
            });
    },
    getAllSubscriptions: function (req: RequestMod, res: Response, next: NextFunction): void {
        planServices
            .getAllSubscriptions()
            .then((data) => res.json(data))
            .catch((err) => {
                console.error(err);
                next(new HttpError(404, err.message));
            });
    },
    createEventPlan: function (req: RequestMod, res: Response, next: NextFunction): void {
        const body: CreateEventPlanDto = req.body;

        planServices
            .createEventPlan(body, req)
            .then((data) => res.status(201).json(data))
            .catch((err) => {
                console.error(err);
                next(new HttpError(500, err.message));
            });
    },
    getOneEventPlan: function (req: RequestMod, res: Response, next: NextFunction): void {
        const planId = Number(req.params.id);

        planServices
            .getOneEventPlan(planId)
            .then((data) => res.json(data))
            .catch((err) => {
                console.error(err);
                next(new HttpError(404, err.message));
            });
    },
    getAllEventPlans: function (req: RequestMod, res: Response, next: NextFunction): void {
        planServices
            .getAllEventPlans()
            .then((data) => res.json(data))
            .catch((err) => {
                console.error(err);
                next(new HttpError(404, err.message));
            });
    },
    updateEventPlan: function (req: RequestMod, res: Response, next: NextFunction): void {
        const enevntPlanId = Number(req.params.id);
        const body: UpdateEventPlanDto = req.body;

        planServices
            .updateEventPlan(enevntPlanId, body)
            .then((data) => res.json(data))
            .catch((err) => {
                console.error(err);
                next(new HttpError(500, err.message));
            });
    },
    disableEventPlan: function (req: RequestMod, res: Response, next: NextFunction): void {
        const enevntPlanId = Number(req.params.id);

        planServices
            .disableEventPlan(enevntPlanId)
            .then((data) => res.json(data))
            .catch((err) => {
                console.error(err);
                next(new HttpError(500, err.message));
            });
    },
    deleteEventPlan: function (req: RequestMod, res: Response, next: NextFunction): void {
        const enevntPlanId = Number(req.params.id);

        planServices
            .deleteEventPlan(enevntPlanId)
            .then((data) => res.json(data))
            .catch((err) => {
                console.error(err);
                next(new HttpError(500, err.message));
            });
    },
    eventSubscribe: function (req: RequestMod, res: Response, next: NextFunction): void {
        const body: CreateEventSubscriptionDto = req.body;
        const eventPlanId = Number(req.params.planId);
        const businessId = Number(req.params.businessId);

        planServices
            .eventSubscribe(eventPlanId, businessId, body)
            .then((data) => res.json(data))
            .catch((err) => {
                console.error(err);
                next(new HttpError(500, err.message));
            });
    },
    eventUpdateSubscribe: function (req: RequestMod, res: Response, next: NextFunction): void {
        const body: UpdateEventSubscriptionDto = req.body;
        const eventSubscriptionId = Number(req.params.id);

        planServices
            .eventUpdateSubscribe(eventSubscriptionId, body)
            .then((data) => res.json(data))
            .catch((err) => {
                console.error(err);
                next(new HttpError(500, err.message));
            });
    },
    eventDeleteSubscribe: function (req: RequestMod, res: Response, next: NextFunction): void {
        const eventSubscriptionId = Number(req.params.id);

        planServices
            .eventDeleteSubscribe(eventSubscriptionId)
            .then((data) => res.json(data))
            .catch((err) => {
                console.error(err);
                next(new HttpError(500, err.message));
            });
    },
};
