import { HttpError } from '../../../common';
import { RequestMod } from '../../../common/interfaces/request.mod';
import { CreateCardDto } from '../dto/create-card';
import { Card } from '../models/card.model';
import { CardTemplate, CardType } from '../../card-templates/models/card-template.model';
import { UpdateCardDto } from '../dto/update-card';
import { ItemsSubscriptionCardTemplate } from '../../card-templates/models/items-subscription-card-template.model';
import { LoyaltyCard } from '../models/loyalty-card.model';
import { ItemsSubscriptionCard } from '../models/items-subscription-card.model';
import { generatePass } from '../../apple-passes/services';
import path from 'path';
import { PKPass } from 'passkit-generator';
import fs from 'fs';

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

    // generate the pass in the public folder
    const cardUri = await generatePassFromTemplate(card.id, cardTemplate.id);

    // combine the base card with the sub card in a single object
    return {
        ...card.toJSON(),
        ...subCard.toJSON(),
        cardUri,
    };
};

const generatePassFromTemplate = async (cardId: number, cardTemplateId: number): Promise<string> => {
    const pass: PKPass = await generatePass({
        cardTemplateId: cardTemplateId,
        serialNumber: cardId.toString(),
    });

    // create a folder in the public folder to store the card template files
    const cardPath = path.join(__dirname, `../../../../public/cards/${cardId}.pkpass`);

    // write the pass to the public folder
    const passBuffer = pass.getAsBuffer();
    fs.writeFileSync(cardPath, passBuffer);

    // return the uri using the public folder as the root
    return cardPath.replace(path.join(__dirname, '../../../../public'), '');
    
};

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
            include: FIND_INCLUDE_OPTIONS(businessId),
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
        },
        include: FIND_INCLUDE_OPTIONS(businessId),
    }).then((row) => {
        if (!row) throw new HttpError(404, 'Card not found');
        return removeRowNullFields(row);
    });
};

export const updateCardById = async (
    cardId: number,
    businessId: number,
    updateCardDto: UpdateCardDto,
): Promise<any> => {
    const baseUpdateDto = updateCardDto.base;
    const card = await Card.findOne({
        where: {
            id: cardId,
        },
        include: FIND_INCLUDE_OPTIONS(businessId),
    });
    if (!card) throw new HttpError(404, 'Card not found');

    // update the base card
    if (baseUpdateDto) await card.update(baseUpdateDto);

    const { cardTemplate } = card as Card & { cardTemplate: CardTemplate };

    // update the sub card
    switch (cardTemplate.cardType) {
        case CardType.LOYALTY:
            const loyaltyDto = updateCardDto.loyaltyCard;
            if (!loyaltyDto) break;
            const subCard = await LoyaltyCard.update(loyaltyDto, {
                where: {
                    id: cardId,
                },
            });
            if (!subCard) throw new HttpError(404, 'Card not found');
            break;

        case CardType.ITEMS_SUBSCRIPTION:
            const itemsSubscriptionDto = updateCardDto.itemsSubscriptionCard;
            if (!itemsSubscriptionDto) break;
            const subCard2 = await ItemsSubscriptionCard.update(itemsSubscriptionDto, {
                where: {
                    id: cardId,
                },
            });
            if (!subCard2) throw new HttpError(404, 'Card not found');
            break;
    }
    return findOneCardById(cardId, businessId);
};

export const deleteCardById = async (cardId: number) => {
    return Card.destroy({
        where: {
            id: cardId,
        },
    });
};

// loyalty add points
export const loyaltyAddPoints = async (cardId: number, value: number) => {
    // find the loyalty card
    const loyaltyCard = await LoyaltyCard.findOne({
        where: {
            id: cardId,
        },
    });
    if (!loyaltyCard) throw new HttpError(404, 'Card not found');

    // add points
    loyaltyCard.points += value;
    await loyaltyCard.save();

    return loyaltyCard;
};

// loyalty subtract points
export const loyaltySubtractPoints = async (cardId: number, value: number) => {
    // find the loyalty card
    const loyaltyCard = await LoyaltyCard.findOne({
        where: {
            id: cardId,
        },
    });
    if (!loyaltyCard) throw new HttpError(404, 'Card not found');

    // subtract points
    if (loyaltyCard.points < value) throw new HttpError(400, 'Not enough points');
    loyaltyCard.points -= value;
    await loyaltyCard.save();

    return loyaltyCard;
};

// items subscription use items
export const itemsSubscriptionUseItems = async (cardId: number, value: number) => {
    // find the items subscription card
    const itemsSubscriptionCard = await ItemsSubscriptionCard.findOne({
        where: {
            id: cardId,
        },
    });
    if (!itemsSubscriptionCard) throw new HttpError(404, 'Card not found');

    // use items
    if (itemsSubscriptionCard.nItems < value) throw new HttpError(400, 'Not enough items');
    itemsSubscriptionCard.nItems -= value;
    await itemsSubscriptionCard.save();

    return itemsSubscriptionCard;
};

// Helpers

const FIND_INCLUDE_OPTIONS = (businessId: number) => [
    {
        model: CardTemplate,
        as: 'cardTemplate',
        where: {
            businessId,
        },
        required: true,
    },
    {
        model: LoyaltyCard,
        as: 'loyaltyCard',
        required: false,
    },
    {
        model: ItemsSubscriptionCard,
        as: 'itemsSubscriptionCard',
        required: false,
    },
];

const removeRowNullFields = (row) => {
    row = row.toJSON();
    for (const key in row) if (row[key] === null) delete row[key];
    return row;
};
