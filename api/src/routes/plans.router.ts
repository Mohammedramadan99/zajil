import express from 'express';
import { validateMiddleware } from '../middlewares/methods/validate.middleware';
import { CreatePlanDto } from '../modules/plans/dto/create-plan';
import { PlanController } from '../modules/plans/controllers/Plan';
import { UpdatePlanDto } from '../modules/plans/dto/update-plan';

const plansRouter = express.Router();

plansRouter.post('/', validateMiddleware(CreatePlanDto), PlanController.create);
plansRouter.get('/:id', PlanController.getOne);
plansRouter.get('/', PlanController.getAll);
plansRouter.put('/:id', validateMiddleware(UpdatePlanDto), PlanController.update);
plansRouter.delete('/:id', PlanController.delete);
plansRouter.post('/add-upgraded-plan/:id', PlanController.addUpgradedPlan);
plansRouter.get('/get-upgraded-plans/:id', PlanController.getApggradedPlansForPlan);
plansRouter.post('/subscribe/:businessId', PlanController.subscribe);
plansRouter.put('/subscribe/upgrade-subscribe/:businessId', PlanController.upgrateSubscribe);
plansRouter.put('/subscribe/update-subscribe/:businessId', PlanController.updateSubscribe);
plansRouter.delete('/subscribe/delete-subscribe/:businessId', PlanController.deleteSubscribe);
plansRouter.get('/subscribe/get-one-subscription/:businessId', PlanController.getOneSubscriptionByBusinessId);
plansRouter.get('/subscribe/get-one-subscription-by-id/:id', PlanController.getOneSubscriptionById);
plansRouter.get('/subscribe/get-all-subscriptions', PlanController.getAllSubscriptions);
plansRouter.post('/event/create-plan', PlanController.createEventPlan);
plansRouter.get('/event/get-all-plans', PlanController.getAllEventPlans);
plansRouter.get('/event/get-one-plan/:id', PlanController.getOneEventPlan);
plansRouter.put('/event/update-plan/:id', PlanController.updateEventPlan);
plansRouter.patch('/event/disable-plan/:id', PlanController.disableEventPlan);
plansRouter.delete('/event/delete-plan/:id', PlanController.deleteEventPlan);
plansRouter.post('/event/subscribe-plan/:planId/:businessId', PlanController.eventSubscribe);
plansRouter.put('/event/subscribe-plan/:id', PlanController.eventUpdateSubscribe);
plansRouter.delete('/event/subscribe-plan/:id', PlanController.eventDeleteSubscribe);

export default plansRouter;
