const moment = require('moment');
import { HttpError } from '../../../common';
import { Activity, ActivityType } from '../../businesses/models/activity.model';
import { Business } from '../../businesses/models/business.model';
import { CardTemplate } from '../../card-templates/models/card-template.model';
import { Card } from '../../cards/models/card.model';
import { User } from '../../users/models/user.model';
import { Op } from 'sequelize';

export const getCardStatistics = async (
    user: User,
    limit: number,
    type: string,
    businessId?: number,
): Promise<Card[]> => {
    let cards: Card[] = [];

    switch (type) {
        case 'new': // default
            cards = await getNewCards(user, limit, businessId);
            break;
        case 'active':
            cards = await getActiveCards(user, limit, businessId);
            break;
        default:
            throw new Error('Invalid type');
    }

    return cards;
};

// the newest {limit} cards across all businesses or a specific business
const getNewCards = async (user: User, limit: number, businessId?: number): Promise<Card[]> => {
    const userBusinesses = user.businesses.map((business) => business.id);

    if (businessId) {
        // check if user has access to this business
        if (!userBusinesses.includes(businessId))
            throw new HttpError(403, 'Forbidden, user does not have access to this business');

        return await Card.findAll({
            include: [
                {
                    model: CardTemplate,
                    as: 'cardTemplate',
                    include: [
                        {
                            model: Business,
                            as: 'business',
                            where: {
                                id: businessId,
                            },
                            required: true,
                        },
                    ],
                },
            ],
            order: [['id', 'DESC']],
            limit,
        });
    } else {
        return await Card.findAll({
            include: [
                {
                    model: CardTemplate,
                    as: 'cardTemplate',
                    include: [
                        {
                            model: Business,
                            as: 'business',
                            where: {
                                id: userBusinesses,
                            },
                            required: true,
                        },
                    ],
                },
            ],
            order: [['id', 'DESC']],
            limit,
        });
    }
};

// get {limit} active cards across all businesses or a specific business
// an active card, is a card that has user at least once in the last 30 days
const getActiveCards = async (user: User, limit: number, businessId?: number): Promise<Card[]> => {
    const userBusinesses = user.businesses.map((business) => business.id);

    if (businessId) {
        // check if user has access to this business
        if (!userBusinesses.includes(businessId))
            throw new HttpError(403, 'Forbidden, user does not have access to this business');

        return await Card.findAll({
            include: [
                {
                    model: CardTemplate,
                    as: 'cardTemplate',
                    required: true,
                    include: [
                        {
                            model: Business,
                            as: 'business',
                            where: {
                                id: businessId,
                            },
                            required: true,
                        },
                    ],
                },
                {
                    model: Activity,
                    as: 'activities',
                    where: {
                        createdAt: {
                            [Op.gte]: moment().subtract(30, 'days').toDate(),
                        },
                    },
                    required: true,
                },
            ],
            limit,
        });
    } else {
        return await Card.findAll({
            include: [
                {
                    model: CardTemplate,
                    as: 'cardTemplate',
                    required: true,
                    include: [
                        {
                            model: Business,
                            as: 'business',
                            where: {
                                id: userBusinesses,
                            },
                            required: true,
                        },
                    ],
                },
                {
                    model: Activity,
                    as: 'activities',
                    where: {
                        createdAt: {
                            [Op.gte]: moment().subtract(30, 'days').toDate(),
                        },
                    },
                    required: true,
                },
            ],
            limit,
        });
    }
};

export const getCardsTotal = async (user: User, businessId?: number) => {
    const userBusinesses = user.businesses.map((business) => business.id);

    if (businessId) {
        // check if user has access to this business
        if (!userBusinesses.includes(businessId))
            throw new HttpError(403, 'Forbidden, user does not have access to this business');

        return await Card.count({
            include: [
                {
                    model: CardTemplate,
                    as: 'cardTemplate',
                    required: true,
                    include: [
                        {
                            model: Business,
                            as: 'business',
                            where: {
                                id: businessId,
                            },
                            required: true,
                        },
                    ],
                },
            ],
        });
    } else {
        return await Card.count({
            include: [
                {
                    model: CardTemplate,
                    as: 'cardTemplate',
                    required: true,
                    include: [
                        {
                            model: Business,
                            as: 'business',
                            where: {
                                id: userBusinesses,
                            },
                            required: true,
                        },
                    ],
                },
            ],
        });
    }
};

// finds cards created between startDate and endDate
// partitions the time interval into nPoints
// for each point, it counts the number of cards created
// returns an array of numbers of length nPoints
export const getCardsChart = async (
    user: User,
    startDate: string,
    endDate: string,
    nPoints: number,
    businessId?: number,
) => {
    const userBusinesses = user.businesses.map((business) => business.id);
    let businessToUse: number[] = [];

    if (businessId) {
        // check if user has access to this business
        if (!userBusinesses.includes(businessId))
            throw new HttpError(403, 'Forbidden, user does not have access to this business');

        businessToUse = [businessId];
    } else {
        businessToUse = userBusinesses;
    }

    // find cards created between startDate and endDate
    const cards = await Card.findAll({
        include: [
            {
                model: CardTemplate,
                as: 'cardTemplate',
                include: [
                    {
                        model: Business,
                        as: 'business',
                        where: {
                            id: businessToUse,
                        },
                        required: true,
                    },
                ],
                required: true,
            },
        ],
        where: {
            createdAt: {
                [Op.between]: [startDate, endDate],
            },
        },
    });

    // partitions the time interval into nPoints
    const interval = moment(endDate).diff(moment(startDate), 'milliseconds');
    const intervalPerPoint = interval / nPoints;

    // for each point, it counts the number of cards created
    // returns an array of numbers of length nPoints
    const points = [];
    for (let i = 0; i < nPoints; i++) {
        const pointStart = moment(startDate).add(i * intervalPerPoint, 'milliseconds');
        const pointEnd = moment(startDate).add((i + 1) * intervalPerPoint, 'milliseconds');

        const cardsInPoint = cards.filter((card) => {
            return moment(card.createdAt).isBetween(pointStart, pointEnd);
        });

        points.push(cardsInPoint.length);
    }

    return points;
};

export const getCardsRewardsRedeemedChart = async (
    user: User,
    startDate: string,
    endDate: string,
    nPoints: number,
    businessId?: number,
) => {
    const userBusinesses = user.businesses.map((business) => business.id);
    let businessToUse: number[] = [];

    if (businessId) {
        // check if user has access to this business
        if (!userBusinesses.includes(businessId))
            throw new HttpError(403, 'Forbidden, user does not have access to this business');

        businessToUse = [businessId];
    } else {
        businessToUse = userBusinesses;
    }

    // find rewards redeemed activity between startDate and endDate
    // look for messages of this format:  message: `Card ${loyaltyCard.id} scanned, gift ${gift.name} redeemed`,
    const activities = await Activity.findAll({
        where: {
            createdAt: {
                [Op.between]: [startDate, endDate],
            },
            type: {
                [Op.contains]: [ActivityType.SCAN_CARD, ActivityType.LOYALTY_GIFT_REDEEM],
            },
        },
    });

    // partitions the time interval into nPoints
    const interval = moment(endDate).diff(moment(startDate), 'milliseconds');
    const intervalPerPoint = interval / nPoints;

    // for each point, it counts the number of cards created
    // returns an array of numbers of length nPoints
    const points = [];
    for (let i = 0; i < nPoints; i++) {
        const pointStart = moment(startDate).add(i * intervalPerPoint, 'milliseconds');
        const pointEnd = moment(startDate).add((i + 1) * intervalPerPoint, 'milliseconds');

        const activitiesInPoint = activities.filter((activity) => {
            return moment(activity.createdAt).isBetween(pointStart, pointEnd);
        });

        points.push(activitiesInPoint.length);
    }

    return points;
};

export const getActivities = async (user: User, limit: number, businessId?: number) => {
    const userBusinesses = user.businesses.map((business) => business.id);
    const businessToUse = businessId ? [businessId] : userBusinesses;

    if (businessId) {
        // check if user has access to this business
        if (!userBusinesses.includes(businessId))
            throw new HttpError(403, 'Forbidden, user does not have access to this business');
    }

    return await Activity.findAll({
        include: [
            {
                model: Card,
                as: 'card',
                include: [
                    {
                        model: CardTemplate,
                        as: 'cardTemplate',
                        include: [
                            {
                                model: Business,
                                as: 'business',
                            },
                        ],
                    },
                ],
            },
        ],
        where: {
            businessId: businessToUse,
        },
        order: [['id', 'DESC']],
        limit,
    });
};

export const getActivitiesChart = async (
    user: User,
    startDate: string,
    endDate: string,
    nPoints: number,
    businessId?: number,
) => {
    const userBusinesses = user.businesses.map((business) => business.id);
    let businessToUse: number[] = [];

    if (businessId) {
        // check if user has access to this business
        if (!userBusinesses.includes(businessId))
            throw new HttpError(403, 'Forbidden, user does not have access to this business');

        businessToUse = [businessId];
    } else {
        businessToUse = userBusinesses;
    }

    // find activities between startDate and endDate
    const activities = await Activity.findAll({
        where: {
            createdAt: {
                [Op.between]: [startDate, endDate],
            },
            businessId: businessToUse,
        },
    });

    // partitions the time interval into nPoints
    const interval = moment(endDate).diff(moment(startDate), 'milliseconds');
    const intervalPerPoint = interval / nPoints;

    // for each point, it counts the number of cards created
    // returns an array of numbers of length nPoints
    const points = [];
    for (let i = 0; i < nPoints; i++) {
        const pointStart = moment(startDate).add(i * intervalPerPoint, 'milliseconds');
        const pointEnd = moment(startDate).add((i + 1) * intervalPerPoint, 'milliseconds');

        const activitiesInPoint = activities.filter((activity) => {
            return moment(activity.createdAt).isBetween(pointStart, pointEnd);
        });

        points.push(activitiesInPoint.length);
    }

    return points;
};
