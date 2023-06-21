import { promises as fs } from 'fs';
import path from 'path';
import { Card } from '../../cards/models/card.model';
import { CardTemplate, CardType } from '../../card-templates/models/card-template.model';
import { LoyaltyCard } from '../../cards/models/loyalty-card.model';
import { PKPass } from 'passkit-generator';
import { ItemsSubscriptionCardTemplate } from '../../card-templates/models/items-subscription-card-template.model';
import sharp, { OverlayOptions } from 'sharp';

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

export const generateStickersIfPossible = async (pass: PKPass, cardTemplateId: number, stripBuffer: Buffer) => {
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

    const stickers = itemsSubscriptionCardTemplate.stickers;
    const stickersCount = itemsSubscriptionCardTemplate.stickersCount;

    const stripWidth = 1125;
    const stripHeight = 432;
    const margin = 0.1;
    const innerStripWidth = stripWidth * (1 - margin * 2);
    const innerStripHeight = stripHeight * (1 - margin * 2);

    // formula to calculate the MAX_STICKERS_PER_ROW relative to the number of stickers in the strip
    const MAX_STICKERS_PER_ROW = Math.max(Math.ceil(Math.sqrt(stickersCount)), 5);

    const stickersPerRow = Math.min(stickersCount, MAX_STICKERS_PER_ROW);
    const numberOfRows = Math.ceil(stickersCount / stickersPerRow);

    const stickerSize = innerStripHeight / numberOfRows;
    const stickerCellWidth = innerStripWidth / stickersPerRow;
    const stickerVerticalMargin = 5;

    // render stickers on the strip
    await sharp(stripBuffer)
        .resize(Math.round(stripWidth), Math.round(stripHeight))
        .toBuffer()
        .then((stripResizedBuffer) => {
            return (
                sharp(
                    path.resolve(
                        __dirname,
                        `../../../../public/card-templates/${cardTemplateId}/stickers/${stickers[0].title}.${stickers[0].imageType}`,
                    ),
                )
                    .resize(Math.round(stickerSize), Math.round(stickerSize))
                    .png()

                    // blue rectangle
                    // sharp({
                    //     create: {
                    //         width: Math.round(stickerSize),
                    //         height: Math.round(stickerSize),
                    //         channels: 4,
                    //         background: { r: 0, g: 0, b: 255, alpha: 1 },
                    //     },
                    // })
                    //     .png()
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
                    .toBuffer()
                    .then((stickerImageBuffer) => {
                        const compositeOperations: OverlayOptions[] = [];

                        for (let row = 0; row < numberOfRows; row++) {
                            for (let column = 0; column < stickersPerRow; column++) {
                                const index = row * stickersPerRow + column;

                                if (index >= stickersCount) break;

                                compositeOperations.push({
                                    input: stickerImageBuffer,
                                    top: Math.round(
                                        row * (stickerSize + (row !== 0 ? stickerVerticalMargin : 0)) +
                                            stripHeight * margin -
                                            stickerVerticalMargin * (numberOfRows - 2),
                                    ),
                                    left: Math.round(
                                        column * stickerCellWidth +
                                            stripWidth * margin +
                                            stickerCellWidth / 2 -
                                            stickerSize / 2,
                                    ),
                                });
                            }
                        }

                        return sharp(stripResizedBuffer)
                            .composite(compositeOperations)
                            .toBuffer()
                            .then((buffer) => {
                                pass.addBuffer('strip.png', buffer);
                                pass.addBuffer('strip@2x.png', buffer);
                            });
                    })
            );
        })
        .catch((err) => {
            console.error(err);
            throw err;
        });

    return true;
};
