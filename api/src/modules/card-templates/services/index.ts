import { HttpError } from '../../../common';
import { RequestMod } from '../../../common/interfaces/request.mod';
import { CardTemplate, CardType } from '../models/card-template.model';
import { ItemsSubscriptionCardTemplate } from '../models/items-subscription-card-template.model';
import { LoyaltyCardTemplate } from '../models/loyalty-card-template.model';
import { CardDesignType, CreateCardTemplateDto } from '../dto/create-card-template';
import { UpdateCardTemplateDto } from '../dto/update-card-template';
import path from 'path';
import fs from 'fs';
import { APPLE_PASS_PLACEHOLDER } from '../../apple-passes/consts';
import { downloadImageToFolder } from '../../../helpers';
import { LoyaltyGift } from '../models/loyalty-gift.model';
import { CreateLoyaltyGiftDto } from '../dto/create-loyalty-gift.dto';
import { BUCKET_NAME, deleteFolder, uploadFile } from '../../aws/s3';
import { EventTicketTemplate } from '../models/event-ticket-template.model';
import { Event } from '../../events/models/event.model';

export const createCardTemplate = async (
    createCardTemplateDto: CreateCardTemplateDto,
    businessId: number,
    req: RequestMod,
): Promise<any> => {
    // define variables to be used in the try catch block
    let subCardTemplate: LoyaltyCardTemplate | ItemsSubscriptionCardTemplate | EventTicketTemplate;
    let cardTemplate: CardTemplate;
    let applePassDesign;

    try {
        /*
         * create a base card template
         * then a sub card template based on the card type
         */

        const { cardType } = createCardTemplateDto;

        // validate Loyalty Card Template Stickers
        if (cardType === CardType.LOYALTY && createCardTemplateDto.stickers) {
            // loyalty cards can only have one sticker
            if (createCardTemplateDto.stickers.length > 1)
                throw new HttpError(400, 'Loyalty cards can only have one sticker');
            createCardTemplateDto.stickersCount = 1;
        }

        // Create a base card template
        cardTemplate = await CardTemplate.create({
            ...createCardTemplateDto,
            businessId,
        });

        // create a folder in the public folder to store the card template files
        [applePassDesign] = await generateDesignJson({
            cardTemplateId: cardTemplate.id,
            ...createCardTemplateDto,
        });

        cardTemplate.design = applePassDesign;
        cardTemplate.save();

        // Create a sub card template based on the card type
        switch (cardType) {
            case CardType.LOYALTY:
                subCardTemplate = await LoyaltyCardTemplate.create({
                    id: cardTemplate.id,
                    pointsPerVisit: createCardTemplateDto.pointsPerVisit,
                });

                // add gifts
                await LoyaltyGift.bulkCreate(
                    createCardTemplateDto.gifts.map((gift) => ({
                        ...gift,
                        loyaltyCardTemplateId: cardTemplate.id,
                    })),
                );
                ``;
                break;

            case CardType.ITEMS_SUBSCRIPTION:
                subCardTemplate = await ItemsSubscriptionCardTemplate.create({
                    id: cardTemplate.id,
                    maxDailyUsage: createCardTemplateDto.maxDailyUsage,
                    subscriptionDurationDays: createCardTemplateDto.subscriptionDurationDays,
                    nItems: createCardTemplateDto.nItems,
                });
                break;

            case CardType.EVENT_TICKET:
                // find event
                const event = await Event.findOne({
                    where: {
                        id: createCardTemplateDto.eventId,
                    },
                });
                if (!event) throw new HttpError(404, 'Event not found');

                // check if the event belongs to the business
                if (event.businessId !== businessId) throw new HttpError(403, 'Event does not belong to the business');

                subCardTemplate = await EventTicketTemplate.create({
                    id: cardTemplate.id,
                    eventId: createCardTemplateDto.eventId,
                    type: createCardTemplateDto.eventTicketType,
                });
                break;
        }

        // combine the base card template with the sub card template in a single object
        return {
            ...cardTemplate.toJSON(),
            ...subCardTemplate.toJSON(),
        };
    } catch (error) {
        console.error(error);

        /* rollback if any error occurs */
        // delete the sub card template
        if (subCardTemplate) await subCardTemplate.destroy();
        // delete the base card template
        if (cardTemplate) await cardTemplate.destroy();

        // continue throwing the error
        throw error;
    }
};

const generateDesignJson = async (
    cardTemplateProps: CreateCardTemplateDto & { cardTemplateId: number },
): Promise<[any]> => {
    const { cardProps, designType, qrCodeFormat } = cardTemplateProps;

    // create JSON files for apple and google passes
    const applePassDesign = {
        ...cardProps,
        ...APPLE_PASS_PLACEHOLDER({
            serialNumber: 'SERIAL_NUMBER',
            description: 'Test Apple Wallet Card',
            organizationName: `Test Organization`,
            designType,
            qrCodeMessage: 'QR_CODE_MESSAGE',
            qrCodeFormat,
        }),
    };

    return [applePassDesign];
};

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
    return CardTemplate.findAndCountAll({
        where: {
            businessId,
        },
        include: FIND_INCLUDE_OPTIONS,
        limit,
        offset,
    }).then((result) => {
        // remove null fields from each row
        result.rows = result.rows.map(removeRowNullFields);

        // include card JSON design
        result.rows = result.rows.map(parseDesign);
        return result;
    });
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
        row = removeRowNullFields(row);
        row = parseDesign(row);
        return row;
    });
};

export const updateCardTemplateById = async (
    cardTemplateId: number,
    businessId: number,
    updateCardTemplateDto: CreateCardTemplateDto,
): Promise<any> => {
    // define variables to be used in the try catch block
    let subCardTemplate: LoyaltyCardTemplate | ItemsSubscriptionCardTemplate | EventTicketTemplate;
    let cardTemplate: CardTemplate;
    let applePassDesign: any;

    /*
     * create a  base card template
     * then a sub card template based on the card type
     */

    const { cardType } = updateCardTemplateDto;

    // Create a base card template
    await CardTemplate.update(
        {
            name: updateCardTemplateDto.name,
            cardType: updateCardTemplateDto.cardType,
            businessId,
            design: applePassDesign,

            // images
            logoUrl: updateCardTemplateDto.logoUrl || null,
            iconUrl: updateCardTemplateDto.iconUrl || null,
            thumbnailUrl: updateCardTemplateDto.thumbnailUrl || null,
            footerUrl: updateCardTemplateDto.footerUrl || null,
            stripUrl: updateCardTemplateDto.stripUrl || null,
            backgroundUrl: updateCardTemplateDto.backgroundUrl || null,
        },
        {
            where: {
                id: cardTemplateId,
            },
        },
    );
    cardTemplate = await CardTemplate.findOne({
        where: {
            id: cardTemplateId,
        },
    });

    // generate the design JSON
    [applePassDesign] = await generateDesignJson({
        cardTemplateId: cardTemplate.id,
        ...updateCardTemplateDto,
    });

    cardTemplate.design = applePassDesign;
    await cardTemplate.save();

    // Create a sub card template based on the card type
    switch (cardType) {
        case CardType.LOYALTY:
            await LoyaltyCardTemplate.update(
                {
                    pointsPerVisit: updateCardTemplateDto.pointsPerVisit,
                },
                {
                    where: {
                        id: cardTemplate.id,
                    },
                },
            );
            subCardTemplate = await LoyaltyCardTemplate.findOne({
                where: {
                    id: cardTemplate.id,
                },
            });
            break;

        case CardType.ITEMS_SUBSCRIPTION:
            // update the existing sub card template
            await ItemsSubscriptionCardTemplate.update(
                {
                    maxDailyUsage: updateCardTemplateDto.maxDailyUsage,
                    subscriptionDurationDays: updateCardTemplateDto.subscriptionDurationDays,
                    nItems: updateCardTemplateDto.nItems,
                    stickers: updateCardTemplateDto.stickers,
                    stickersCount: updateCardTemplateDto.stickersCount,
                },
                {
                    where: {
                        id: cardTemplate.id,
                    },
                },
            );
            subCardTemplate = await ItemsSubscriptionCardTemplate.findOne({
                where: {
                    id: cardTemplate.id,
                },
            });
            break;

        case CardType.EVENT_TICKET:
            // update the existing sub card template
            await EventTicketTemplate.update(
                {
                    eventId: updateCardTemplateDto.eventId,
                    type: updateCardTemplateDto.eventTicketType,
                },
                {
                    where: {
                        id: cardTemplate.id,
                    },
                },
            );
            subCardTemplate = await EventTicketTemplate.findOne({
                where: {
                    id: cardTemplate.id,
                },
            });
            break;
    }

    // combine the base card template with the sub card template in a single object
    return {
        ...cardTemplate.toJSON(),
        ...subCardTemplate.toJSON(),
    };
};

export const deleteCardTemplateById = async (cardTemplateId: number) => {
    const res = await CardTemplate.destroy({
        where: {
            id: cardTemplateId,
        },
    });

    await deleteFolder(`card-templates/${cardTemplateId}`);

    return res;
};

// Helpers

const FIND_INCLUDE_OPTIONS = [
    {
        model: LoyaltyCardTemplate,
        as: 'loyaltyCardTemplate',
        where: {
            '$CardTemplate.cardType$': CardType.LOYALTY,
        },
        required: false,
        include: [
            {
                model: LoyaltyGift,
                as: 'loyaltyGifts',
                required: false,
            },
        ],
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

const removeRowNullFields = (row: CardTemplate) => {
    row = row.toJSON();
    for (const key in row) if (row[key] === null) delete row[key];
    return row;
};

export const addGiftToLoyaltyCardTemplate = async (cardTemplateId: number, body: CreateLoyaltyGiftDto) => {
    // find the loyalty card template
    const loyaltyCardTemplate = await LoyaltyCardTemplate.findOne({
        where: {
            id: cardTemplateId,
        },
    });
    if (!loyaltyCardTemplate) throw new HttpError(404, 'Card template not found');

    // create the gift
    const gift = await LoyaltyGift.create({
        ...body,
        loyaltyCardTemplateId: loyaltyCardTemplate.id,
    });

    return gift;
};
export const updateGiftInLoyaltyCardTemplate = async (
    cardTemplateId: number,
    giftId: number,
    body: CreateLoyaltyGiftDto,
) => {
    // find the loyalty card template
    const loyaltyCardTemplate = await LoyaltyCardTemplate.findOne({
        where: {
            id: cardTemplateId,
        },
    });
    if (!loyaltyCardTemplate) throw new HttpError(404, 'Card template not found');

    // find the gift
    const gift = await LoyaltyGift.findOne({
        where: {
            id: giftId,
            loyaltyCardTemplateId: loyaltyCardTemplate.id,
        },
    });
    if (!gift) throw new HttpError(404, 'Gift not found');

    // update the gift
    await gift.update(body);

    return gift;
};
export const deleteGiftFromLoyaltyCardTemplate = async (cardTemplateId: number, giftId: number) => {
    // find the loyalty card template
    const loyaltyCardTemplate = await LoyaltyCardTemplate.findOne({
        where: {
            id: cardTemplateId,
        },
    });
    if (!loyaltyCardTemplate) throw new HttpError(404, 'Card template not found');

    // find the gift
    const gift = await LoyaltyGift.findOne({
        where: {
            id: giftId,
            loyaltyCardTemplateId: loyaltyCardTemplate.id,
        },
    });
    if (!gift) throw new HttpError(404, 'Gift not found');

    // delete the gift
    await gift.destroy();

    return gift;
};

function parseDesign(row: any) {
    const cardJSONObj = row.design;

    // filter out some fields
    delete cardJSONObj.formatVersion;
    delete cardJSONObj.passTypeIdentifier;
    delete cardJSONObj.teamIdentifier;
    delete cardJSONObj.serialNumber;
    delete cardJSONObj.description;
    delete cardJSONObj.organizationName;
    delete cardJSONObj.barcode.message;

    row.design = cardJSONObj;
    return row;
}
