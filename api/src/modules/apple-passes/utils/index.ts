import { promises as fs, writeFileSync } from 'fs';
import path from 'path';
import { Card } from '../../cards/models/card.model';
import { CardTemplate, CardType } from '../../card-templates/models/card-template.model';
import { LoyaltyCard } from '../../cards/models/loyalty-card.model';
import { PKPass } from 'passkit-generator';
import { ItemsSubscriptionCardTemplate } from '../../card-templates/models/items-subscription-card-template.model';
import sharp, { OverlayOptions, Sharp } from 'sharp';
import { BUCKET_NAME, getFile, s3LocationToKey } from '../../aws/s3';

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

    switch (cardType) {
        case CardType.LOYALTY:
            const loyaltyCard = await LoyaltyCard.findOne({
                where: { id: cardId },
            });

            // replace {{points}} with loyalty points
            str = str.replace(/{{points}}/g, loyaltyCard.points.toString());
    }

    return str;
};

export const generateStickersIfPossible = async (
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

    // get the items subscription card template
    const itemsSubscriptionCardTemplate = await ItemsSubscriptionCardTemplate.findOne({
        where: { id: cardTemplateId },
    });

    // check for stickers and stickersCount
    if (!itemsSubscriptionCardTemplate.stickers || !itemsSubscriptionCardTemplate.stickersCount) return;

    // get card
    const card = await Card.findOne({
        where: { id: cardId },
    });
    if (!card) throw new Error('Card not found');

    const chosenStickers = card.chosenStickers || [];

    const stickers = itemsSubscriptionCardTemplate.stickers;
    const stickersCount = itemsSubscriptionCardTemplate.stickersCount && 6;

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

    // render stickers on the strip
    await sharp(stripBuffer)
        .resize(Math.round(stripWidth), Math.round(stripHeight))
        .composite(compositeOperations)
        .toBuffer()
        .then((buffer) => {
            pass.addBuffer('strip.png', buffer);
            pass.addBuffer('strip@2x.png', buffer);

            // remove at the end
            writeFileSync('test.png', buffer);
        })
        .catch((err) => {
            console.error(err);
            throw err;
        });

    return true;
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
