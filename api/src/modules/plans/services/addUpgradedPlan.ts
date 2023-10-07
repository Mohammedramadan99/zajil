import { CreatePlanDto } from '../dto/create-plan';
import { Plan } from '../models/plan.model';
import { getOnePlanById } from '.';


export const addUpgradedPlan = async (createPlanDto: CreatePlanDto, planId: number): Promise<Plan> => {
    const oldPlan = await getOnePlanById(planId);

    // creaste new plan with oldPlan data + new data like if in olf plan was maxCar..=10 and in new plan is maxCar
};
