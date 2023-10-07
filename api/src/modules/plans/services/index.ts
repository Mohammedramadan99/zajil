import { HttpError } from '../../../common';
import { RequestMod } from '../../../common/interfaces/request.mod';
import { CreatePlanDto } from '../dto/create-plan';
import { UpdatePlanDto } from '../dto/update-plan';
import { Plan, chartsObj } from '../models/plan.model';

export const createPlan = (createPlanDto: CreatePlanDto, req: RequestMod): Promise<Plan> => {
    const { charts } = createPlanDto;
    let newCharts = chartsObj;

    if (charts) {
        for (const key in newCharts) {
            if (charts[key]) {
                newCharts[key] = charts[key];
            }
        }
    }

    const data = {
        ...createPlanDto,
        charts: newCharts,
        creatorId: req.user.id,
    };

    return Plan.create(data);
};

export const getOnePlanById = async (planId: number): Promise<Plan> => {
    const plan = await Plan.findOne({ where: { id: planId } });
    return plan;
};

export const getAllPlans = async (): Promise<Plan[]> => {
    const plans = await Plan.findAll();
    return plans;
};

export const updatePlanById = async (planId: number, updatePlanDto: UpdatePlanDto): Promise<Plan> => {
    const plan = await getOnePlanById(planId);

    if (!plan) {
        throw new HttpError(404, 'Plan not found');
    }

    const { charts } = updatePlanDto;
    let newCharts = chartsObj;

    if (charts) {
        for (const key in newCharts) {
            if (charts[key]) {
                newCharts[key] = charts[key];
            }
        }
    }

    const data = {
        ...updatePlanDto,
        charts: newCharts,
    };

    return await plan.update(data);
};

export const deletePlanById = async (planId: number): Promise<void> => {
    const plan = await getOnePlanById(planId);

    if (!plan) {
        throw new HttpError(404, 'Plan not found');
    }

    return await plan.destroy();
};

export const addUpgradedPlan = async (createPlanDto: CreatePlanDto, planId: number, req: RequestMod): Promise<Plan> => {
    const oldPlan = await getOnePlanById(planId);

    if (!oldPlan) {
        throw new HttpError(404, 'Plan not found');
    }

    const { charts } = createPlanDto;
    let newCharts = chartsObj;

    if (charts) {
        for (const key in newCharts) {
            if (charts[key]) {
                newCharts[key] = charts[key];
            }
        }
    }

    const data = {
        ...createPlanDto,
        charts: newCharts,
        creatorId: req.user.id,
        supPlanId: planId,
    };

    return await Plan.create(data);
};

export const getApggradedPlansForPlan = async (planId: number): Promise<Plan[]> => {
    const plans = await Plan.findAll({ where: { supPlanId: planId } });
    return plans;
};
