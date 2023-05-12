import { Op } from 'sequelize';
import { HttpError } from '../../common';
import { RequestMod } from '../../common/interfaces/request.mod';
import { CreateCardDto } from '../../dto/card/create-card';
import { Card } from '../../db/models/card/card.model';
import { LoyaltyCard } from '../../db/models/card/loyalty-card.model';
import { ItemsSubscriptionCard } from '../../db/models/card/items-subscription-card.model';
import { CardTemplate, CardType } from '../../db/models/card-template/card-template.model';
import { UpdateCardDto } from '../../dto/card/update-card';
import { ItemsSubscriptionCardTemplate } from '../../db/models/card-template/items-subscription-card-template.model';

export const createCard = async (createCardDto: CreateCardDto, req: RequestMod): Promise<any> => {
    /*
     * create a card then create a loyalty card or items subscription card based on the card type
     */

    // Get card template
    const cardTemplate = await CardTemplate.findOne({
        where: {
            id: createCardDto.templateId,
        },
    });
    if (!cardTemplate) throw new HttpError(404, 'Card template not found');

    // Create a base card
    const card = await Card.create({
        clientName: createCardDto.clientName,
        clientPhone: createCardDto.clientPhone,
        templateId: createCardDto.templateId,
    });

    // Create a sub card based on the card type
    let subCard: LoyaltyCard | ItemsSubscriptionCard;
    switch (cardTemplate.cardType) {
        case CardType.LOYALTY:
            subCard = await LoyaltyCard.create({
                id: card.id,
                points: 0,
            });
            break;

        case CardType.ITEMS_SUBSCRIPTION:
            const isct = await ItemsSubscriptionCardTemplate.findOne({
                where: {
                    id: cardTemplate.id,
                },
            });
            subCard = await ItemsSubscriptionCard.create({
                id: card.id,
                nItems: isct.nItems,
                expirationDate: new Date(Date.now() + isct.subscriptionDurationDays * 24 * 60 * 60 * 1000),
            });
            break;
    }

    // combine the base card with the sub card in a single object
    return {
        ...card.toJSON(),
        ...subCard.toJSON(),
    };
};

// only select users who share a card with the logged in user
export const findAllCards = async ({
    limit = 10,
    offset = 0,
    businessId,
    req,
}: {
    limit: number;
    offset: number;
    businessId: number;
    req: RequestMod;
}) => {
    return (
        Card.findAndCountAll({
            where: {
                businessId,
            },
            include: FIND_INCLUDE_OPTIONS,
            limit,
            offset,
        })
            // remove null fields from each row
            .then((result) => {
                result.rows = result.rows.map(removeRowNullFields);
                return result;
            })
    );
};

export const findOneCardById = async (cardId: number, businessId: number): Promise<any> => {
    return Card.findOne({
        where: {
            id: cardId,
            businessId,
        },
        include: FIND_INCLUDE_OPTIONS,
    }).then((row) => {
        if (!row) throw new HttpError(404, 'Card not found');
        return removeRowNullFields(row);
    });
};

export const updateCardById = async (cardId: number, updateCardDto: UpdateCardDto): Promise<any> => {
    // const baseUpdateDto = updateCardDto.base;
    // const card = await Card.findOne({
    //     where: {
    //         id: cardId,
    //     },
    // });
    // if (!card) throw new HttpError(404, 'Card not found');
    // // update the base card
    // if (baseUpdateDto) await card.update(baseUpdateDto);
    // // update the sub card
    // switch (card.cardType) {
    //     case CardType.LOYALTY:
    //         break;
    //     case CardType.ITEMS_SUBSCRIPTION:
    //         const itemsSubscriptionDto = updateCardDto.itemsSubscription;
    //         if (!itemsSubscriptionDto) break;
    //         const subTemp = await ItemsSubscriptionCard.update(itemsSubscriptionDto, {
    //             where: {
    //                 id: cardId,
    //             },
    //         });
    //         if (!subTemp) throw new HttpError(404, 'Card not found');
    //         break;
    // }
    // return 'Card updated successfully';
};

export const deleteCardById = async (cardId: number) => {
    return Card.destroy({
        where: {
            id: cardId,
        },
    });
};

// Helpers

const FIND_INCLUDE_OPTIONS = [
    {
        model: LoyaltyCard,
        as: 'loyaltyCard',
        where: {
            '$Card.cardType$': CardType.LOYALTY,
        },
        required: false,
    },
    {
        model: ItemsSubscriptionCard,
        as: 'itemsSubscriptionCard',
        where: {
            '$Card.cardType$': CardType.ITEMS_SUBSCRIPTION,
        },
        required: false,
    },
];

const removeRowNullFields = (row) => {
    row = row.toJSON();
    for (const key in row) if (row[key] === null) delete row[key];
    return row;
};
