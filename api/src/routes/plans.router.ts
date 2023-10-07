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

export default plansRouter;
