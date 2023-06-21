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

export const createCardTemplate = async (
    createCardTemplateDto: CreateCardTemplateDto,
    businessId: number,
    req: RequestMod,
): Promise<any> => {
    // define variables to be used in the try catch block
    let subCardTemplate: LoyaltyCardTemplate | ItemsSubscriptionCardTemplate;
    let cardTemplate: CardTemplate;
    let cardTemplateFolderPath: string;

    try {
        /*
         * create a  base card template
         * then a sub card template based on the card type
         */

        const { cardType } = createCardTemplateDto;

        // Create a base card template
        cardTemplate = await CardTemplate.create({
            name: createCardTemplateDto.name,
            cardType: createCardTemplateDto.cardType,
            businessId,
        });

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
                        templateId: cardTemplate.id,
                    })),
                );
                break;

            case CardType.ITEMS_SUBSCRIPTION:
                subCardTemplate = await ItemsSubscriptionCardTemplate.create({
                    id: cardTemplate.id,
                    maxDailyUsage: createCardTemplateDto.maxDailyUsage,
                    subscriptionDurationDays: createCardTemplateDto.subscriptionDurationDays,
                    nItems: createCardTemplateDto.nItems,
                    stickers: createCardTemplateDto.stickers,
                    stickersCount: createCardTemplateDto.stickersCount,
                });
                break;
        }

        // create a folder in the public folder to store the card template files
        cardTemplateFolderPath = await createCardTemplateFolder({
            cardTemplateId: cardTemplate.id,
            ...createCardTemplateDto,
        });

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
        // delete the card template folder
        if (cardTemplateFolderPath) fs.rmdirSync(cardTemplateFolderPath);

        // continue throwing the error
        throw error;
    }
};

const createCardTemplateFolder = async (cardTemplateProps: CreateCardTemplateDto & { cardTemplateId: number }) => {
    const {
        cardTemplateId,
        designType,
        logoUrl,
        iconUrl,
        thumbnailUrl,
        footerUrl,
        stripUrl,
        backgroundUrl,
        qrCodeFormat,
        ...rest
    } = cardTemplateProps;

    // create a folder in the public folder to store the card template files
    const cardTemplateFolderPath = path.join(__dirname, `../../../../public/card-templates/${cardTemplateId}`);
    if (!fs.existsSync(cardTemplateFolderPath)) fs.mkdirSync(cardTemplateFolderPath);

    // create JSON files for apple and google passes
    const applePassJsonPath = path.join(cardTemplateFolderPath, 'applePass.json');
    const googlePassJsonPath = path.join(cardTemplateFolderPath, 'googlePass.json');

    // create the apple pass json file
    if (!fs.existsSync(applePassJsonPath))
        fs.writeFileSync(
            applePassJsonPath,
            JSON.stringify(
                {
                    ...rest.cardProps,
                    ...APPLE_PASS_PLACEHOLDER({
                        serialNumber: 'SERIAL_NUMBER',
                        description: 'Test Apple Wallet Card',
                        organizationName: `Test Organization`,
                        designType,
                        qrCodeMessage: 'QR_CODE_MESSAGE',
                        qrCodeFormat,
                    }),
                },
                null,
                4,
            ),
        );

    // create the google pass json file
    if (!fs.existsSync(googlePassJsonPath)) fs.writeFileSync(googlePassJsonPath, '{}');

    // Create sticker images folder
    if (!fs.existsSync(path.join(cardTemplateFolderPath, 'stickers')))
        fs.mkdirSync(path.join(cardTemplateFolderPath, 'stickers'));

    // download the logo and icon images
    const imagesToDownload = [
        { url: logoUrl, path: 'logo.png' },
        { url: iconUrl, path: 'icon.png' },
        { url: thumbnailUrl, path: 'thumbnail.png' },
        { url: footerUrl, path: 'footer.png' },
        { url: stripUrl, path: 'strip.png' },
        { url: backgroundUrl, path: 'background.png' },

        // stickers
        ...rest.stickers.map((stickerProps) => ({
            url: stickerProps.imageUrl,
            path: `stickers/${stickerProps.title}.${stickerProps.imageType}`,
        })),
    ]
        .filter(({ url }) => url)
        .map((image) => downloadImageToFolder(image.url, path.join(cardTemplateFolderPath, image.path)));

    await Promise.all(imagesToDownload);

    return cardTemplateFolderPath;
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

    return findOneCardTemplateById(cardTemplateId, cardTemplate.businessId);
};

export const deleteCardTemplateById = async (cardTemplateId: number) => {
    return CardTemplate.destroy({
        where: {
            id: cardTemplateId,
        },
    });
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

const removeRowNullFields = (row) => {
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
        templateId: loyaltyCardTemplate.id,
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
            templateId: loyaltyCardTemplate.id,
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
            templateId: loyaltyCardTemplate.id,
        },
    });
    if (!gift) throw new HttpError(404, 'Gift not found');

    // delete the gift
    await gift.destroy();

    return gift;
};
