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
    req,
}: {
    limit: number;
    offset: number;
    req: RequestMod;
}) => {};

export const findOneCardTemplateById = async (cardTemplateId: number): Promise<any> => {};

export const updateCardTemplateById = async (
    cardTemplateId: number,
    updateCardTemplateDto: UpdateCardTemplateDto,
): Promise<any> => {};

export const deleteCardTemplateById = async (cardTemplateId: number) => {};
