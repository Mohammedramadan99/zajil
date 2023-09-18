import { promises as fs, writeFileSync } from 'fs';
import path from 'path';
import { Card } from '../../cards/models/card.model';
import { CardTemplate, CardType } from '../../card-templates/models/card-template.model';
import { LoyaltyCard } from '../../cards/models/loyalty-card.model';
import { PKPass } from 'passkit-generator';
import { ItemsSubscriptionCardTemplate } from '../../card-templates/models/items-subscription-card-template.model';
import sharp, { OverlayOptions, Sharp } from 'sharp';
import { BUCKET_NAME, getFile, s3LocationToKey } from '../../aws/s3';
import { ItemsSubscriptionCard } from '../../cards/models/items-subscription-card.model';
import { CouponCard } from '../../cards/models/coupon-card.model';
import { CouponCardTemplate } from '../../card-templates/models/coupon-card-template.model';

interface Cache {
    certificates:
        | {
              signerCert: Buffer | string;
              signerKey: Buffer | string;
              wwdr: Buffer | string;
          }
        | undefined;
}

const cache: Cache = {
    certificates: undefined,
};

export async function getCertificates(): Promise<Exclude<Cache['certificates'], undefined>> {
    if (cache.certificates) {
        return cache.certificates;
    }

    const [signerCert, signerKey, wwdr] = await Promise.all([
        fs.readFile(path.resolve(__dirname, '../../../certs/signerCert.pem')),
        fs.readFile(path.resolve(__dirname, '../../../certs/signerKey.key')),
        fs.readFile(path.resolve(__dirname, '../../../certs/wwdr.pem')),
    ]);

    cache.certificates = {
        signerCert,
        signerKey,
        wwdr,
    };

    return cache.certificates;
}

/**
 * Variables
 * ---------
 * {{clientName}} - client name
 * {{points}} - loyalty points
 * {{itemsUsed}} - items used
 * {{itemsLeft}} - items left
 **/
export const populateVariables = async (str: string, cardId: number) => {
    // get card
    const card = (await Card.findOne({
        where: { id: cardId },
        include: [
            {
                model: CardTemplate,
                as: 'cardTemplate',
            },
        ],
    })) as Card & { cardTemplate: CardTemplate };

    const cardType = card.cardTemplate.cardType;

    // client name
    str = str.replace(/{{clientName}}/g, card.clientName);

    switch (cardType) {
        case CardType.LOYALTY:
            const loyaltyCard = await LoyaltyCard.findOne({
                where: { id: cardId },
            });

            // replace {{points}} with loyalty points
            str = str.replace(/{{points}}/g, loyaltyCard.points.toString());
            break;

        case CardType.ITEMS_SUBSCRIPTION:
            const itemsSubscriptionCard = await ItemsSubscriptionCard.findOne({
                where: { id: cardId },
            });
            const itemsSubscriptionCardTemplate = await ItemsSubscriptionCardTemplate.findOne({
                where: { id: card.cardTemplate.id },
            });

            // items used
            str = str.replace(
                /{{itemsUsed}}/g,
                (itemsSubscriptionCardTemplate.nItems - itemsSubscriptionCard.nItems).toString(),
            );

            // items left
            str = str.replace(/{{itemsLeft}}/g, itemsSubscriptionCard.nItems.toString());
            break;

        case CardType.COUPON:
            const couponCard = await CouponCard.findOne({
                where: { id: cardId },
            });
            const couponCardTemplate = await CouponCardTemplate.findOne({
                where: { id: card.cardTemplate.id },
            });

            // {{ discount }} discountType == "percentage" ? "discountValue%" : "$discountValue"
            str = str.replace(
                /{{discount}}/g,
                couponCard.discountType === 'percentage'
                    ? `${couponCard.discountValue}%`
                    : `$${couponCard.discountValue}`,
            );
            // {{ cardName }} couponCardTemplate.occasionName
            str = str.replace(/{{cardName}}/g, couponCardTemplate.occasionName);

            // {{ availableUses }} couponCard.maxUsage - couponCard.usageCount
            str = str.replace(/{{availableUses}}/g, (couponCard.maxUsage - couponCard.usageCount).toString());

            // {{ endDate }} couponCardTemplate.endDate
            str = str.replace(/{{endDate}}/g, couponCardTemplate.endDate.toDateString());

            break;
    }

    return str;
};

export const loyaltyGenerateStickersIfPossible = async (
    pass: PKPass,
    cardTemplateId: number,
    cardId: number,
    stripBuffer: Buffer,
) => {
    // get card template
    const cardTemplate = await CardTemplate.findOne({
        where: { id: cardTemplateId },
    });
    // return if not an items subscription card template
    if (cardTemplate.cardType !== CardType.LOYALTY) return;

    // check for stickers and stickersCount
    if (!cardTemplate.stickers || cardTemplate.stickers?.length === 0) return;

    // get card
    const card = await Card.findOne({
        where: { id: cardId },
    });
    if (!card) throw new Error('Card not found');

    const stickersCount = cardTemplate.stickersCount;

    const stripWidth = 1125;
    const stripHeight = 432;
    const margin = 0.1;
    const innerStripWidth = stripWidth * (1 - margin * 2);
    const innerStripHeight = stripHeight * (1 - margin * 2);

    const MAX_STICKERS_PER_ROW = Math.max(Math.ceil(Math.sqrt(stickersCount)), 5);

    const stickersPerRow = Math.min(stickersCount, MAX_STICKERS_PER_ROW);
    const numberOfRows = Math.ceil(stickersCount / stickersPerRow);

    const stickerSize = Math.min(innerStripWidth / stickersPerRow, innerStripHeight / numberOfRows);
    const stickerCellWidth = innerStripWidth / stickersPerRow;
    const stickerVerticalMargin = 5;

    // get sticker buffer
    const stickerBuffer = await getFile(
        cardTemplate.stickers[0].imageUrl.includes(`https://${BUCKET_NAME}.s3`)
            ? s3LocationToKey(cardTemplate.stickers[0].imageUrl)
            : `card-templates/${cardTemplateId}/stickers/${cardTemplate.stickers[0].title}.${cardTemplate.stickers[0].imageType}`,
    )
        .then((out) => out.Body)
        .catch((err) => {
            console.error(err);
        });

    const highlightedSticker = await handleStickerSharpToBuffer(sharp(stickerBuffer), stickerSize);
    const bwSticker = await handleStickerSharpToBuffer(sharp(stickerBuffer).grayscale(), stickerSize);

    let stickerToUse: Buffer = (await card.loyaltyCanScan()) ? bwSticker : highlightedSticker;

    // composite stickers on the strip
    const compositeOperations: OverlayOptions[] = await compositeStickersOnStrip(
        numberOfRows,
        stickersPerRow,
        stickersCount,
        [stickerToUse],
        stickerToUse,
        stripHeight,
        stickerSize,
        stickerVerticalMargin,
        margin,
        stickerCellWidth,
        stripWidth,
    );

    // render stickers on the strip
    await rednerSticckersOnStrip(pass, stripBuffer, stripWidth, stripHeight, compositeOperations);

    return true;
};

export const itemsSubGenerateStickersIfPossible = async (
    pass: PKPass,
    cardTemplateId: number,
    cardId: number,
    stripBuffer: Buffer,
) => {
    // get card template
    const cardTemplate = await CardTemplate.findOne({
        where: { id: cardTemplateId },
    });
    // return if not an items subscription card template
    if (cardTemplate.cardType !== CardType.ITEMS_SUBSCRIPTION) return;

    // check for stickers and stickersCount
    if (!cardTemplate.stickers || !cardTemplate.stickersCount) return;

    // get card
    const card = await Card.findOne({
        where: { id: cardId },
    });
    if (!card) throw new Error('Card not found');

    const chosenStickers = card.chosenStickers || [];

    const stickersCount = cardTemplate.stickersCount;

    const stripWidth = 1125;
    const stripHeight = 432;
    const margin = 0.1;
    const innerStripWidth = stripWidth * (1 - margin * 2);
    const innerStripHeight = stripHeight * (1 - margin * 2);

    // formula to calculate the MAX_STICKERS_PER_ROW relative to the number of stickers in the strip
    const MAX_STICKERS_PER_ROW = Math.max(Math.ceil(Math.sqrt(stickersCount)), 5);

    const stickersPerRow = Math.min(stickersCount, MAX_STICKERS_PER_ROW);
    const numberOfRows = Math.ceil(stickersCount / stickersPerRow);

    const stickerSize = Math.min(innerStripWidth / stickersPerRow, innerStripHeight / numberOfRows);
    const stickerCellWidth = innerStripWidth / stickersPerRow;
    const stickerVerticalMargin = 5;

    // find choosen stickers
    const choosenStickerBuffers = await Promise.all(
        chosenStickers.map(
            async (sticker) =>
                await handleStickerSharpToBuffer(
                    sharp(
                        await getFile(
                            sticker.imageUrl.includes(`https://${BUCKET_NAME}.s3`)
                                ? s3LocationToKey(sticker.imageUrl)
                                : `card-templates/${cardTemplateId}/stickers/${sticker.title}.${sticker.imageType}`,
                        )
                            .then((out) => out.Body)
                            .catch((err) => {
                                console.error(err);
                            }),
                    ),
                    stickerSize,
                ),
        ),
    );

    // generate placeholder sticker
    const stickerPlaceholderBuffer = await handleStickerSharpToBuffer(
        sharp({
            create: {
                width: Math.round(stickerSize),
                height: Math.round(stickerSize),
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0.5 },
            },
        }),
        stickerSize,
    );

    // composite stickers on the strip
    const compositeOperations: OverlayOptions[] = await compositeStickersOnStrip(
        numberOfRows,
        stickersPerRow,
        stickersCount,
        choosenStickerBuffers,
        stickerPlaceholderBuffer,
        stripHeight,
        stickerSize,
        stickerVerticalMargin,
        margin,
        stickerCellWidth,
        stripWidth,
    );

    // render stickers on the strip
    await rednerSticckersOnStrip(pass, stripBuffer, stripWidth, stripHeight, compositeOperations);

    return true;
};

export const compositeStickersOnStrip = async (
    numberOfRows: number,
    stickersPerRow: number,
    stickersCount: number,
    choosenStickerBuffers: Buffer[],
    stickerPlaceholderBuffer: Buffer,
    stripHeight: number,
    stickerSize: number,
    stickerVerticalMargin: number,
    margin: number,
    stickerCellWidth: number,
    stripWidth: number,
) => {
    // composite stickers on the strip
    const compositeOperations: OverlayOptions[] = [];
    for (let row = 0; row < numberOfRows; row++) {
        for (let column = 0; column < stickersPerRow; column++) {
            const index = row * stickersPerRow + column;

            if (index >= stickersCount) break;

            compositeOperations.push({
                input: choosenStickerBuffers[index] || stickerPlaceholderBuffer,
                top:
                    numberOfRows === 1
                        ? Math.round((stripHeight - stickerSize) / 2)
                        : Math.round(
                              row * (stickerSize + (row !== 0 ? stickerVerticalMargin : 0)) +
                                  stripHeight * margin -
                                  stickerVerticalMargin * (numberOfRows - 2),
                          ),
                left: Math.round(
                    column * stickerCellWidth + stripWidth * margin + stickerCellWidth / 2 - stickerSize / 2,
                ),
            });
        }
    }

    return compositeOperations;
};

const rednerSticckersOnStrip = (
    pass: PKPass,
    stripBuffer: Buffer,
    stripWidth: number,
    stripHeight: number,
    compositeOperations: OverlayOptions[],
) => {
    // render stickers on the strip
    return sharp(stripBuffer)
        .resize(Math.round(stripWidth), Math.round(stripHeight))
        .composite(compositeOperations)
        .toBuffer()
        .then((buffer) => {
            pass.addBuffer('strip.png', buffer);
            pass.addBuffer('strip@2x.png', buffer);

            // write to file
            // writeFileSync('strip.png', buffer);
        })
        .catch((err) => {
            console.error(err);
            throw err;
        });
};

const handleStickerSharpToBuffer = async (x: Sharp, stickerSize: number) => {
    return x
        .resize(Math.round(stickerSize), Math.round(stickerSize))
        .png()
        .composite([
            {
                input: Buffer.from(
                    `<svg><rect x="0" y="0" width="${stickerSize}" height="${stickerSize}" rx="${
                        stickerSize / 2
                    }" ry="${stickerSize / 2}" /></svg>`,
                ),
                blend: 'dest-in',
            },
        ])
        .toBuffer();
};
