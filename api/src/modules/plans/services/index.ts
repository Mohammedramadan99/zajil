import { HttpError } from '../../../common';
import { RequestMod } from '../../../common/interfaces/request.mod';
import { CreatePlanDto } from '../dto/create-plan';
import { UpdatePlanDto } from '../dto/update-plan';
import { createSubscribeDto } from '../dto/add-subscribe';
import { UpdateSubscribeDto } from '../dto/update-subscribe';
import { Plan, chartsObj } from '../models/plan.model';
import { Subscription } from '../models/subscription.model';
import { Business } from '../../businesses/models/business.model';

const reformatPlan = (plan: Plan) => {
    // Coupon_Templates : {type: "coupon", templates: n }
    // maxItemSubscriptionCards => Subscription_Cards : {type: "subscription", cards: n }
    const planNewFormat = {
        id: plan.id,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        active: plan.active,
        allActivetie: {
            Branches: plan.maxBranches,
            Coupon_Templates: { type: 'coupon', templates: plan.maxCouponTemplates },
            Loyalty_Templates: { type: 'loyalty', templates: plan.maxLoyaltyTemplates },
            Subscription_Templates: { type: 'subscription', templates: plan.maxItemSubscriptionTemplates },
            Coupon_Cards: { type: 'coupon', cards: plan.maxCouponCards },
            Loyalty_Cards: { type: 'loyalty', cards: plan.maxLoyaltyCards },
            Subscription_Cards: { type: 'subscription', cards: plan.maxItemSubscriptionCards },
        },
        charts: {
            getActivities: plan.charts.getActivities,
            getCardsChart: plan.charts.getCardsChart,
            getCardsTotal: plan.charts.getCardsTotal,
            getCardStatistics: plan.charts.getCardStatistics,
            getActivitiesChart: plan.charts.getActivitiesChart,
            getCardsRewardsRedeemedChart: plan.charts.getCardsRewardsRedeemedChart,
        },
        supPlanId: plan.supPlanId,
        creatorId: plan.creatorId,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt,
    };

    return planNewFormat;
};

export const createPlan = async (createPlanDto: CreatePlanDto, req: RequestMod): Promise<any> => {
    const { charts } = createPlanDto;
    let newCharts = chartsObj;

    if (charts) {
        for (const key in newCharts) {
            if (charts[key]) {
                newCharts[key] = charts[key];
            }
        }
    }

    const reqData = {
        ...createPlanDto,
        charts: newCharts,
        creatorId: req.user.id,
    };

    const plan = await Plan.create(reqData);

    const data = reformatPlan(plan);

    return data;
};

export const getOnePlanById = async (planId: number): Promise<any> => {
    const plan = await Plan.findOne({ where: { id: planId } });

    if (!plan) {
        throw new HttpError(404, 'Plan not found');
    }

    const planNewFormat = reformatPlan(plan);

    return planNewFormat;
};

export const getAllPlans = async (): Promise<any[]> => {
    const plans = await Plan.findAll();

    const formattedPlans = plans.map((plan) => reformatPlan(plan));

    return formattedPlans;
};

export const updatePlanById = async (planId: number, updatePlanDto: UpdatePlanDto): Promise<any> => {
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

    const updatedPlan = await plan.update(data);

    const planNewFormat = reformatPlan(updatedPlan);

    return planNewFormat;
};

export const deletePlanById = async (planId: number): Promise<void> => {
    const plan = await getOnePlanById(planId);

    if (!plan) {
        throw new HttpError(404, 'Plan not found');
    }

    return await plan.destroy();
};

export const addUpgradedPlan = async (createPlanDto: CreatePlanDto, planId: number, req: RequestMod): Promise<any> => {
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

    const plan = await Plan.create(data);

    const planNewFormat = reformatPlan(plan);

    return planNewFormat;
};

export const getApggradedPlansForPlan = async (planId: number): Promise<any[]> => {
    const plans = await Plan.findAll({ where: { supPlanId: planId } });

    const plansNewFormat = plans.map((plan) => reformatPlan(plan));

    return plansNewFormat;
};

export const subscribeToPlan = async (
    planId: number,
    numberOfMonths: number,
    businessId: number,
): Promise<Subscription> => {
    const business = await Business.findOne({ where: { id: businessId } });

    if (business.type === 'CARD') {
        throw new HttpError(400, 'You can not subscribe to a plan with a CARD business');
    }

    const plan = await getOnePlanById(planId);

    if (!plan || plan.active === false) {
        throw new HttpError(404, 'Plan not found or not active');
    }

    const subscription = await Subscription.findOne({ where: { businessId, status: 'active' } });

    if (subscription) {
        throw new HttpError(400, 'You are already subscribed to a plan');
    }

    // TODO: create a pyament gateway and add the payment logic here

    // endDate = startDate + numberOfMonths
    const endDate = new Date(new Date().setMonth(new Date().getMonth() + numberOfMonths));
    const data = {
        planId,
        businessId,
        status: 'active',
        startDate: new Date(),
        endDate: endDate,
    };

    return await Subscription.create(data);
};

export const updateSubscribe = async (
    updateSubscribeDto: UpdateSubscribeDto,
    businessId: number,
): Promise<Subscription> => {
    const business = await Business.findOne({ where: { id: businessId } });

    if (business.type === 'CARD') {
        throw new HttpError(400, 'You can not subscribe to a plan with a CARD business');
    }

    const subscription = await Subscription.findOne({ where: { businessId } });

    if (!subscription) {
        throw new HttpError(404, 'Subscription not found');
    }

    let numberOfMonths = updateSubscribeDto.numberOfMonths;
    let endDate = subscription.endDate;

    if (numberOfMonths) {
        endDate = new Date(new Date().setMonth(new Date().getMonth() + numberOfMonths));
    }

    const data = {
        ...updateSubscribeDto,
        endDate: endDate,
    };

    return await subscription.update(data);
};

export const deleteSubscribe = async (businessId: number): Promise<Subscription> => {
    const subscription = await Subscription.findOne({ where: { businessId, status: 'active' } });

    if (!subscription) {
        throw new HttpError(404, 'Subscription not found');
    }

    // update status to cancelled
    const data = {
        status: 'cancelled',
    };

    return await subscription.update(data);
};

export const getOneSubscriptionByBusinessId = async (businessId: number): Promise<any> => {
    const subscription = await Subscription.findOne({ where: { businessId, status: 'active' } });

    if (!subscription) {
        throw new HttpError(404, 'Subscription not found');
    }

    const plan = await getOnePlanById(subscription.planId);

    if (!plan) {
        throw new HttpError(404, 'Plan not found');
    }

    const data = {
        subscription: subscription,
        plan: plan,
    };

    return data;
};

export const getOneSubscriptionById = async (id: number): Promise<Subscription> => {
    const subscription = await Subscription.findOne({ where: { id } });

    if (!subscription) {
        throw new HttpError(404, 'Subscription not found');
    }

    return subscription;
};

export const getAllSubscriptions = async (): Promise<Subscription[]> => {
    const subscriptions = await Subscription.findAll();
    return subscriptions;
};

export const upgrateSubscribe = async (
    planId: number,
    numberOfMonths: number,
    businessId: number,
): Promise<Subscription> => {
    const business = await Business.findOne({ where: { id: businessId } });

    if (business.type === 'CARD') {
        throw new HttpError(400, 'You can not subscribe to a plan with a CARD business');
    }

    const subscription = await Subscription.findOne({ where: { businessId, status: 'active' } });

    if (!subscription) {
        throw new HttpError(404, 'Subscription not found');
    }

    if (subscription.id === planId) {
        throw new HttpError(400, 'You can not upgrade to the same plan');
    }

    const plan = await getOnePlanById(planId);

    if (!plan || plan.active === false) {
        throw new HttpError(404, 'Plan not found or not active');
    }

    if (plan.supPlanId !== subscription.planId) {
        throw new HttpError(400, 'This plan is not an upgrade for your current plan');
    }

    const data = {
        status: 'upgrading',
    };

    await subscription.update(data);

    // TODO: create a pyament gateway and add the payment logic here

    const endDate = new Date(new Date().setMonth(new Date().getMonth() + numberOfMonths));
    const newData = {
        planId,
        businessId,
        status: 'active',
        startDate: new Date(),
        endDate: endDate,
    };

    return await Subscription.create(newData);
};
