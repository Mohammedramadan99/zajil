import { Op } from 'sequelize';
import { HttpError } from '../../../common';
import { RequestMod } from '../../../common/interfaces/request.mod';
import { Branch } from '../../branches/models/branch.model';
import { Business } from '../../businesses/models/business.model';
import { User } from '../models/user.model';
import { CreateUserDto } from '../dto/create-user';
import { UpdateUserDto } from '../dto/update-user';
import { hashPassword, sendAccountActivationEmail, verifyUserAccountActivationToken } from '../../../helpers';
import { CardTemplate } from '../../card-templates/models/card-template.model';
import { Card } from '../../cards/models/card.model';
import { getOneSubscriptionByBusinessId } from '../../plans/services';

export const createUser = (createUserDto: CreateUserDto): Promise<User> => {
    createUserDto.password = hashPassword(createUserDto.password);
    const user = new User({ ...createUserDto });
    return user.save().then(async (user) => {
        // send account activation email
        await sendAccountActivationEmail(user);

        return user;
    });
};

// only select users who share a business with the logged in user
export const findAllUsers = async ({
    limit = 10,
    offset = 0,
    req,
}: {
    limit: number;
    offset: number;
    req: RequestMod;
}) => {
    const { businessId, branchId } = req.query;

    if (!businessId && !branchId) throw new HttpError(400, 'businessId or branchId is required');
    if (businessId && branchId) throw new HttpError(400, 'businessId and branchId cannot be used together');

    if (branchId) return getUsersByBranchId(Number(branchId), limit, offset);
    return getUsersByBusinessId(Number(businessId), limit, offset);
};

export const findOneUserById = (userId: number): Promise<User> => {
    return User.findOne({
        where: {
            id: userId,
        },
        include: [
            {
                model: Business,
                as: 'businesses',
            },
            {
                model: Branch,
                as: 'employedAt',
            },
        ],
    });
};

export const updateUserById = async (userId: number, updateUserDto: UpdateUserDto): Promise<User> => {
    const user = await findOneUserById(userId);
    if (!user) throw new HttpError(404, 'User not found');

    if (updateUserDto.password) updateUserDto.password = hashPassword(updateUserDto.password);
    return user.update(updateUserDto);
};

export const deleteUserById = async (userId: number) => {
    const user = await findOneUserById(userId);
    if (!user) throw new HttpError(404, 'User not found');

    return user.destroy().then(() => ({ message: 'User deleted successfully' }));
};

function getUsersByBranchId(branchId: number, limit: number, offset: number) {
    return User.findAndCountAll({
        include: [
            {
                model: Business,
                as: 'businesses',
            },
            {
                model: Branch,
                where: {
                    id: branchId,
                },
                required: true,
                as: 'employedAt',
            },
        ],
        limit,
        offset,
    });
}

function getUsersByBusinessId(businessId: number, limit: number, offset: number) {
    return User.findAndCountAll({
        include: [
            {
                model: Business,
                where: {
                    id: businessId,
                },
                as: 'businesses',
            },
            {
                model: Branch,
                as: 'employedAt',
            },
        ],
        limit,
        offset,
    });
}

export const activateAccount = async (token: string) => {
    // validate token
    const userId: string = verifyUserAccountActivationToken(token);

    // find user
    const user = await User.findOne({
        where: {
            id: userId,
        },
    });
    if (!user) throw new HttpError(404, 'User not found');

    // activate user
    user.active = true;

    return user.save().then(() => ({ message: 'Account activated successfully' }));
};

export async function requestAccountActivation(user: User) {
    await sendAccountActivationEmail(user);
    return { message: 'Account activation email sent successfully' };
}

export async function getUserProfile(user: User) {
    let allData = {};

    const userData = await User.findByPk(user.id);

    allData = {
        ...allData,
        user: userData,
    };

    const businesses: any = await Business.findAll({
        where: {
            id: {
                [Op.in]: user.businesses.map((business) => business.id),
            },
        },
        include: [
            {
                model: Branch,
                as: 'branches',
            },
        ],
    });

    const businessesWithBranchesNumber = businesses.map((business) => {
        return {
            ...business.toJSON(),
            branchesNumber: business.branches.length,
        };
    });

    const businessesWithPlansAndSubscriptions = await Promise.all(
        businessesWithBranchesNumber.map(async (business) => {
            try {
                const subscriptionAndPlan = await getOneSubscriptionByBusinessId(business.id);
                return {
                    ...business,
                    subscription: subscriptionAndPlan.subscription,
                    plan: subscriptionAndPlan.plan,
                };
            } catch (error) {
                return {
                    ...business,
                    subscription: null,
                    plan: null,
                };
            }
        }),
    );

    const businessesWithCardsAndCardTemplates = await Promise.all(
        businessesWithPlansAndSubscriptions.map(async (business) => {
            // get all cardTemplates
            const cardTemplates = await CardTemplate.findAll({
                where: {
                    businessId: business.id,
                },
            });

            const cardTemplatesByType = cardTemplates.reduce((acc, cardTemplate) => {
                const cardType = cardTemplate.cardType;
                if (!acc[cardType]) {
                    acc[cardType] = 1;
                } else {
                    acc[cardType]++;
                }
                return acc;
            }, {});

            let usedCouponCards = 0;
            let usedLoyaltyCards = 0;
            let usedEventCards = 0;
            let usedItemsSubscriptionCards = 0;

            for (const cardTemplate of cardTemplates) {
                switch (cardTemplate.cardType) {
                    case 'COUPON':
                        usedCouponCards += await Card.count({
                            where: {
                                templateId: cardTemplate.id,
                            },
                        });
                        break;
                    case 'LOYALTY':
                        usedLoyaltyCards += await Card.count({
                            where: {
                                templateId: cardTemplate.id,
                            },
                        });
                        break;
                    case 'EVENT_TICKET':
                        usedEventCards += await Card.count({
                            where: {
                                templateId: cardTemplate.id,
                            },
                        });
                        break;
                    case 'ITEMS_SUBSCRIPTION':
                        usedItemsSubscriptionCards += await Card.count({
                            where: {
                                templateId: cardTemplate.id,
                            },
                        });
                        break;
                }
            }

            return {
                ...business,
                usage: {
                    Loyalty_Templates: { type: 'loyalty', templates: cardTemplatesByType['LOYALTY'] || 0 },
                    Coupon_Templates: { type: 'coupon', templates: cardTemplatesByType['COUPON'] || 0 },
                    Event_Templates: { type: 'events', templates: cardTemplatesByType['EVENT_TICKET'] || 0 },
                    Subscription_Templates: {
                        type: 'subscription',
                        templates: cardTemplatesByType['ITEMS_SUBSCRIPTION'] || 0,
                    },
                    Coupon_Cards: { type: 'loyalty', cards: usedCouponCards },
                    Loyalty_Cards: { type: 'coupon', cards: usedLoyaltyCards },
                    Event_Cards: { type: 'events', cards: usedEventCards },
                    Subscription_Cards: { type: 'subscription', cards: usedItemsSubscriptionCards },
                },
            };
        }),
    );

    allData = {
        ...allData,
        businesses: businessesWithCardsAndCardTemplates,
    };

    return allData;
}
