import { Op } from 'sequelize';
import { HttpError } from '../../common';
import { RequestMod } from '../../common/interfaces/request.mod';
import { CardTemplate, CardType } from '../../db/models/card-template/card-template.model';
import { ItemsSubscriptionCardTemplate } from '../../db/models/card-template/items-subscription-card-template.model';
import { LoyaltyCardTemplate } from '../../db/models/card-template/loyalty-card-template.model';
import { CreateCardTemplateDto } from '../../dto/card-template/create-card-template';
import { UpdateCardTemplateDto } from '../../dto/card-template/update-card-template';

export const createCardTemplate = async (
    createCardTemplateDto: CreateCardTemplateDto,
    businessId: number,
    req: RequestMod,
): Promise<any> => {
    /*
     * create a card template then create a loyalty card template or items subscription card template based on the card type
     */

    const { cardType } = createCardTemplateDto;

    // Create a base card template
    const cardTemplate = await CardTemplate.create({
        name: createCardTemplateDto.name,
        cardType: createCardTemplateDto.cardType,
        businessId,
    });

    // Create a card template based on the card type
    let subCardTemplate: LoyaltyCardTemplate | ItemsSubscriptionCardTemplate;
    switch (cardType) {
        case CardType.LOYALTY:
            subCardTemplate = await LoyaltyCardTemplate.create({
                id: cardTemplate.id,
            });
            break;

        case CardType.ITEMS_SUBSCRIPTION:
            subCardTemplate = await ItemsSubscriptionCardTemplate.create({
                id: cardTemplate.id,
                maxDailyUsage: createCardTemplateDto.maxDailyUsage,
                subscriptionDurationDays: createCardTemplateDto.subscriptionDurationDays,
            });
            break;
    }

    // combine the base card template with the sub card template in a single object
    return {
        ...cardTemplate.toJSON(),
        ...subCardTemplate.toJSON(),
    };
};

// only select users who share a card template with the logged in user
export const findAllCardTemplates = async ({
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
        CardTemplate.findAndCountAll({
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

export const findOneCardTemplateById = async (cardTemplateId: number, businessId: number): Promise<any> => {
    return CardTemplate.findOne({
        where: {
            id: cardTemplateId,
            businessId,
        },
        include: FIND_INCLUDE_OPTIONS,
    }).then((row) => {
        if (!row) throw new HttpError(404, 'Card template not found');
        return removeRowNullFields(row);
    });
};

export const updateCardTemplateById = async (
    cardTemplateId: number,
    updateCardTemplateDto: UpdateCardTemplateDto,
): Promise<any> => {
    const baseUpdateDto = updateCardTemplateDto.base;

    const cardTemplate = await CardTemplate.findOne({
        where: {
            id: cardTemplateId,
        },
    });
    if (!cardTemplate) throw new HttpError(404, 'Card template not found');

    // update the base card template
    if (baseUpdateDto) await cardTemplate.update(baseUpdateDto);

    // update the sub card template
    switch (cardTemplate.cardType) {
        case CardType.LOYALTY:
            break;

        case CardType.ITEMS_SUBSCRIPTION:
            const itemsSubscriptionDto = updateCardTemplateDto.itemsSubscription;
            if (!itemsSubscriptionDto) break;
            const subTemp = await ItemsSubscriptionCardTemplate.update(itemsSubscriptionDto, {
                where: {
                    id: cardTemplateId,
                },
            });
            if (!subTemp) throw new HttpError(404, 'Card template not found');
            break;
    }

    return 'Card template updated successfully';
};

export const deleteCardTemplateById = async (cardTemplateId: number) => {};

// Helpers

const FIND_INCLUDE_OPTIONS = [
    {
        model: LoyaltyCardTemplate,
        as: 'loyaltyCardTemplate',
        where: {
            '$CardTemplate.cardType$': CardType.LOYALTY,
        },
        required: false,
    },
    {
        model: ItemsSubscriptionCardTemplate,
        as: 'itemsSubscriptionCardTemplate',
        where: {
            '$CardTemplate.cardType$': CardType.ITEMS_SUBSCRIPTION,
        },
        required: false,
    },
];

const removeRowNullFields = (row) => {
    row = row.toJSON();
    for (const key in row) if (row[key] === null) delete row[key];
    return row;
};
