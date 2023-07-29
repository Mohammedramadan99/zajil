const moment = require('moment');
import { HttpError } from '../../../common';
import { Activity } from '../../businesses/models/activity.model';
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
