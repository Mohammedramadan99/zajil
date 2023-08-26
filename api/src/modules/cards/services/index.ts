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
import { LoyaltyCardTemplate } from '../../card-templates/models/loyalty-card-template.model';
import { LoyaltyGift } from '../../card-templates/models/loyalty-gift.model';
import { ItemsSubUseDto } from '../dto/items-sub-use';
import { Activity, ActivityType } from '../../businesses/models/activity.model';
import { User } from '../../users/models/user.model';
import { Request } from 'express';
import { getFile, uploadFile } from '../../aws/s3';
import { Op } from 'sequelize';
import { EventCard } from '../models/event-card.model';
import { Event, SeatType } from '../../events/models/event.model';
import { EventTicketTemplate, EventTicketType } from '../../card-templates/models/event-ticket-template.model';
import { sendUpdatePassNotification } from '../../notifications/services/apn.service';

export const createCard = async (createCardDto: CreateCardDto, req: Request): Promise<any> => {
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
        ...createCardDto,
        templateId: cardTemplate.id,
    });

    // Create a sub card based on the card type
    let subCard: LoyaltyCard | ItemsSubscriptionCard | EventCard;
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

        case CardType.EVENT_TICKET:
            // find event ticket template
            const eventTicketTemplate = await EventTicketTemplate.findOne({
                where: {
                    id: cardTemplate.id,
                },
                include: [
                    {
                        model: Event,
                        as: 'event',
                        required: true,
                    },
                ],
            });
            if (!eventTicketTemplate) throw new HttpError(404, 'Event ticket template not found');

            // check if the event has a limited amount
            if (eventTicketTemplate.event.limitedAmount) {
                const nTickets = await EventCard.count({
                    where: {
                        eventTicketTemplateId: eventTicketTemplate.id,
                    },
                });
                if (nTickets >= eventTicketTemplate.event.limitedAmount)
                    throw new HttpError(400, 'Event reached its limited amount');
            }

            // if it has seats, validate the seats
            if ((eventTicketTemplate.type = EventTicketType.SEAT)) {
                if (!createCardDto.seat) throw new HttpError(400, '`seat` is required');
                await validateAndChooseSeat(eventTicketTemplate.event, createCardDto.seat);
            }

            // create event card
            subCard = await EventCard.create({
                id: card.id,
                eventTicketTemplateId: eventTicketTemplate.id,
                seatId: createCardDto.seat,
            });
            break;
    }

    // generate the pass in the public folder
    const cardObj = await generatePassFromTemplate(card.id, cardTemplate.id);

    card.s3Key = cardObj.Key;
    card.s3Location = cardObj.Location;
    await card.save();

    // log activity
    await Activity.create({
        businessId: cardTemplate.businessId,
        message: `Card ${card.id} created of type ${cardTemplate.cardType}`,
        types: [ActivityType.CREATE_CARD],
        relatedId: card.id,
        relatedType: 'card',
    });

    // combine the base card with the sub card in a single object
    return {
        ...card.toJSON(),
        ...subCard.toJSON(),
    };
};

const generatePassFromTemplate = async (cardId: number, cardTemplateId: number) => {
    const pass: PKPass = await generatePass({
        cardTemplateId: cardTemplateId,
        serialNumber: cardId.toString(),
        cardId: cardId.toString(),
    });

    // create a folder in the public folder to store the card template files
    const cardPath = `cards/${cardId}.pkpass`;

    // write the pass to the public folder
    const passBuffer = pass.getAsBuffer();
    const obj = await uploadFile(
        {
            name: cardPath.split('/').pop(),
            data: passBuffer,
            contentType: 'application/vnd.apple.pkpass',
            ContentDisposition: `attachment; filename=${cardPath.split('/').pop()}`,
        },
        cardPath.split('/').slice(0, -1).join('/'),
    );

    // return the uri using the public folder as the root
    return obj;
};

export const findAllCards = async ({
    limit = 10,
    offset = 0,
    businessId,
    req,
    sort,
}: {
    limit: number;
    offset: number;
    businessId: number;
    req: RequestMod;
    sort: 'asc' | 'desc';
}) => {
    return (
        Card.findAndCountAll({
            include: FIND_INCLUDE_OPTIONS(businessId),
            limit,
            offset,
            order: [['id', sort]],
        })
            // remove null fields from each row
            .then((result) => {
                result.rows = result.rows.map(removeRowNullFields);
                return result;
            })
    );
};

export const findOneCardById = async (cardId: number, req: RequestMod): Promise<any> => {
    const userBusinessIds = req.user.businesses.map((b) => b.id);
    const bussinessesUserWorksFor = req.user.employedAt.map((e) => e.businessId);
    return Card.findOne({
        where: {
            id: cardId,
        },
        include: [
            {
                model: CardTemplate,
                as: 'cardTemplate',
                required: true,
                include: [
                    {
                        model: ItemsSubscriptionCardTemplate,
                        as: 'itemsSubscriptionCardTemplate',
                        required: false,
                    },
                    {
                        model: LoyaltyCardTemplate,
                        as: 'loyaltyCardTemplate',
                        required: false,
                        include: [
                            {
                                model: LoyaltyGift,
                                as: 'loyaltyGifts',
                            },
                        ],
                    },
                ],
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
            {
                model: Activity,
                as: 'activities',
                required: false,
                limit: 10,
                order: [['id', 'DESC']],
            },
        ],
    }).then((row) => {
        if (!row) throw new HttpError(404, 'Card not found');

        // check if the card business belongs to the user
        if (
            ![...userBusinessIds, ...bussinessesUserWorksFor].includes(
                (row as Card & { cardTemplate: CardTemplate }).cardTemplate.businessId,
            )
        )
            throw new HttpError(403, 'Forbidden, card does not belong to any of your businesses');

        return removeRowNullFields(row);
    });
};

export const updateCardById = async (
    cardId: number,
    businessId: number,
    updateCardDto: UpdateCardDto,
    req: RequestMod,
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

    // log activity
    await Activity.create({
        businessId: cardTemplate.businessId,
        message: `Card ${card.id} updated`,
        type: [ActivityType.UPDATE_CARD],
        relatedId: card.id,
        relatedType: 'card',
    });

    return findOneCardById(cardId, req);
};

export const deleteCardById = async (cardId: number) => {
    return Card.destroy({
        where: {
            id: cardId,
        },
    });
};

// loyalty add points
export const loyaltyAddPoints = async (cardId: number, user: User) => {
    // find the loyalty card
    const card = (await Card.findOne({
        where: {
            id: cardId,
        },
        include: [
            {
                model: CardTemplate,
                as: 'cardTemplate',
            },
        ],
    })) as Card & { cardTemplate: CardTemplate };
    if (!card) throw new HttpError(404, 'Card not found');

    // Has to be a minimum of 10 minutes between scans
    if (!(await card.loyaltyCanScan()))
        throw new HttpError(400, 'You can only add points to a card once every 10 minutes');

    const template = await LoyaltyCardTemplate.findOne({
        where: {
            id: card.templateId,
        },
    });
    if (!template) throw new HttpError(404, 'Template not found');

    // find the loyalty card
    const loyaltyCard = await LoyaltyCard.findOne({
        where: {
            id: cardId,
        },
    });
    if (!loyaltyCard) throw new HttpError(404, 'Card not found');

    // add points
    loyaltyCard.points += template.pointsPerVisit;
    const newCard = await loyaltyCard.save();

    // log activity
    await Activity.create({
        businessId: card.cardTemplate.businessId,
        message: `Card ${card.id} scanned, ${template.pointsPerVisit} points added`,
        types: [ActivityType.SCAN_CARD],
        relatedId: card.id,
        relatedType: 'card',
        userId: user.id,
    });
    card.canScan = false;
    await card.save();

    // update the pass
    await generatePassFromTemplate(cardId, card.templateId);

    await sendUpdatePassNotification(card.pushToken);

    return newCard;
};

// loyalty subtract points
export const loyaltySubtractPoints = async (cardId: number, value: number, user: User) => {
    // find the loyalty card
    const loyaltyCard = (await LoyaltyCard.findOne({
        where: {
            id: cardId,
        },
        include: [
            {
                model: Card,
                as: 'card',
                include: [
                    {
                        model: CardTemplate,
                        as: 'cardTemplate',
                    },
                ],
            },
        ],
    })) as LoyaltyCard & { card: Card & { cardTemplate: CardTemplate } };
    if (!loyaltyCard) throw new HttpError(404, 'Card not found');

    // subtract points
    if (loyaltyCard.points < value) throw new HttpError(400, 'Not enough points');
    loyaltyCard.points -= value;
    await loyaltyCard.save();

    // log activity
    await Activity.create({
        businessId: loyaltyCard.card.cardTemplate.businessId,
        message: `Card ${loyaltyCard.id} scanned, ${value} points subtracted`,
        type: [ActivityType.SCAN_CARD],
        relatedId: loyaltyCard.id,
        relatedType: 'card',
        userId: user.id,
    });
    loyaltyCard.card.canScan = false;
    await loyaltyCard.card.save();

    // update the pass
    await generatePassFromTemplate(cardId, loyaltyCard.card.templateId);
    await sendUpdatePassNotification(loyaltyCard.card.pushToken);

    return loyaltyCard;
};

// items subscription use items
export const itemsSubscriptionUseItems = async (cardId: number, body: ItemsSubUseDto, user: User) => {
    // find the items subscription card
    const itemsSubscriptionCard = (await ItemsSubscriptionCard.findOne({
        where: {
            id: cardId,
        },
        include: [
            {
                model: Card,
                as: 'card',
                include: [
                    {
                        model: CardTemplate,
                        as: 'cardTemplate',
                    },
                ],
            },
        ],
    })) as ItemsSubscriptionCard & { card: Card & { cardTemplate: CardTemplate } };
    if (!itemsSubscriptionCard) throw new HttpError(404, 'Card not found');

    // use items

    // update nItems
    if (itemsSubscriptionCard.nItems < body.value) throw new HttpError(400, 'Not enough items');
    itemsSubscriptionCard.nItems -= body.value;

    // update stickers if provided
    if (body.stickers) {
        const oldChosenStickers = itemsSubscriptionCard.card.chosenStickers || [];
        itemsSubscriptionCard.card.chosenStickers = [...oldChosenStickers, ...body.stickers];
        await itemsSubscriptionCard.card.save();
    }
    await itemsSubscriptionCard.save();

    // update the pass
    await generatePassFromTemplate(cardId, itemsSubscriptionCard.card.templateId);
    await sendUpdatePassNotification(itemsSubscriptionCard.card.pushToken);

    // log activity
    await Activity.create({
        businessId: itemsSubscriptionCard.card.cardTemplate.businessId,
        message: `Card ${itemsSubscriptionCard.id} scanned, ${body.value} items used`,
        types: [ActivityType.SCAN_CARD],
        relatedId: itemsSubscriptionCard.id,
        relatedType: 'card',
        userId: user.id,
    });

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

export const loyaltyRedeemGift = async (cardId: number, giftId: number, user: User) => {
    // find the loyalty card
    const loyaltyCard = (await LoyaltyCard.findOne({
        where: {
            id: cardId,
        },
        include: [
            {
                model: Card,
                as: 'card',
                include: [
                    {
                        model: CardTemplate,
                        as: 'cardTemplate',
                    },
                ],
            },
        ],
    })) as LoyaltyCard & { card: Card & { cardTemplate: CardTemplate } };
    if (!loyaltyCard) throw new HttpError(404, 'Card not found');

    // find the gift
    const gift = await LoyaltyGift.findOne({
        where: {
            id: giftId,
        },
    });
    if (!gift) throw new HttpError(404, 'Gift not found');
    const isGiftLimited = gift.limitedAmount !== null;

    // check if the gift in stock
    if (isGiftLimited && gift.limitedAmount <= 0) throw new HttpError(400, 'Gift out of stock');

    // check if the user has enough points
    if (loyaltyCard.points < gift.priceNPoints) throw new HttpError(400, 'Not enough points');

    // subtract points
    loyaltyCard.points -= gift.priceNPoints;

    loyaltyCard.redeemedLoyaltyGifts = [
        ...(loyaltyCard.redeemedLoyaltyGifts || []),
        {
            id: gift.id,
            name: gift.name,
            redeemedAt: new Date(),
        },
    ];

    // subtract gift from stock if limited
    if (isGiftLimited) {
        gift.limitedAmount -= 1;
        await gift.save();
    }

    // log activity
    await Activity.create({
        businessId: loyaltyCard.card.cardTemplate.businessId,
        message: `Card ${loyaltyCard.id} scanned, gift ${gift.name} redeemed`,
        types: [ActivityType.SCAN_CARD, ActivityType.LOYALTY_GIFT_REDEEM],
        relatedId: loyaltyCard.id,
        relatedType: 'card',
        userId: user.id,
    });

    const savedLoayltyCard = await loyaltyCard.save();
    await generatePassFromTemplate(cardId, savedLoayltyCard.card.templateId);
    await sendUpdatePassNotification(savedLoayltyCard.card.pushToken);

    return savedLoayltyCard;
};

export const registerDevice = async ({
    serialNumber,
    pushToken,
    deviceLibraryIdentifier,
}: {
    serialNumber: number;
    pushToken: string;
    deviceLibraryIdentifier: string;
}) => {
    console.log('registerDevice');

    // find card
    const card = await Card.findOne({
        where: {
            id: serialNumber,
        },
    });
    if (!card) throw new HttpError(404, 'Card not found');

    // update deviceLibraryIdentifier
    card.deviceLibraryIdentifier = deviceLibraryIdentifier;

    // update pushToken
    card.pushToken = pushToken;

    await card.save();

    console.log('registerDevice Success');
    return true;
};

export const unregisterDevice = async (props: {
    deviceLibraryIdentifier: string;
    passTypeIdentifier: string;
    serialNumber: number;
}) => {
    console.log('unregisterDevice');

    // find card
    const card = await Card.findOne({
        where: {
            id: props.serialNumber,
        },
    });
    if (!card) throw new HttpError(404, 'Card not found');

    // update pushToken
    card.pushToken = null;
    await card.save();

    console.log('unregisterDevice Success');
    return true;
};

export const getSerialNumbers = async (props: { deviceLibraryIdentifier: string }) => {
    console.log('getSerialNumbers');

    // find cards
    const cards = await Card.findAll({
        where: {
            deviceLibraryIdentifier: props.deviceLibraryIdentifier,
        },
        attributes: ['id', 'updatedAt', 'createdAt'],
    });

    const ids = cards.map((card) => card.id.toString());
    const lastUpdated = cards.length > 0 ? cards[0].updatedAt || cards[0].createdAt : new Date();
    console.log(ids);
    console.log('getSerialNumbers Success');
    const out = {
        serialNumbers: ids,
        lastUpdated,
    };
    console.log(out);
    return out;
};
export const sendUpdatedPass = async (props: { passTypeIdentifier: string; serialNumber: number }) => {
    console.log('sendUpdatedPass');

    // find card
    const card = await Card.findOne({
        where: {
            id: props.serialNumber,
        },
        include: [
            {
                model: LoyaltyCard,
                as: 'loyaltyCard',
                required: false,
            },
        ],
    });
    if (!card) throw new HttpError(404, 'Card not found');

    // if it is a loyalty card, and changed from cann't scan to can scan based on the activities, generate a new pass
    if (card.loyaltyCanScan) {
        const oldCanScan = card.canScan;
        const canScanNow = await card.loyaltyCanScan();
        if (oldCanScan === false && canScanNow === true) {
            await generatePassFromTemplate(card.id, card.templateId);
        }
    }

    // load the pkpass file
    const pkpassBuffer = (await getFile(card.s3Key))?.Body as Buffer;

    // send the pkpass file
    console.log('sendUpdatedPass Success');
    return pkpassBuffer;
};

export function loyaltyUpdatePoints(cardId: number, points: number, user: User) {
    if (!Number.isInteger(points)) throw new HttpError(400, 'Points must be an integer');
    if (points < 0) throw new HttpError(400, 'Points cannot be negative');

    return LoyaltyCard.findOne({
        where: {
            id: cardId,
        },
        include: [
            {
                model: Card,
                as: 'card',
                required: true,
                include: [
                    {
                        model: CardTemplate,
                        as: 'cardTemplate',
                        where: {
                            businessId: user.businesses.map((b) => b.id),
                        },
                        required: true,
                    },
                ],
            },
        ],
    }).then(async (loyaltyCard) => {
        if (!loyaltyCard) throw new HttpError(404, 'Card not found');

        // update points
        loyaltyCard.points = points;

        // update the pass
        await generatePassFromTemplate(cardId, loyaltyCard.card.templateId);
        await sendUpdatePassNotification(loyaltyCard.card.pushToken);

        return loyaltyCard.save();
    });
}

async function validateAndChooseSeat(event: Event, seat: string) {
    // extrct the alhabets from the seat
    const seatColumn = seat.replace(/\d/g, '').toUpperCase();

    // extract the numbers from the seat
    const seatRow = parseInt(seat.replace(/\D/g, ''));

    // turn seat column into colum index (A=1) (AA=27)
    const seatColumnIndex = seatColumn
        .split('')
        .map((c) => c.charCodeAt(0) - 65)
        .reduce((acc, cur) => acc * 25 + cur, 0);

    // turn seat row into row index
    const seatRowIndex = seatRow - 1;

    const room = event.room
    // check if the seat is in the event
    if (
        seatColumnIndex < 0 ||
        seatColumnIndex >= room[0].length ||
        seatRowIndex < 0 ||
        seatRowIndex >= event.room.length
    )
        throw new HttpError(400, 'Seat not found');

    // check if the seat is taken
    if (room[seatRowIndex][seatColumnIndex] !== SeatType.AVAILABILE_SEAT)
        throw new HttpError(400, 'Seat unavailable');

    // update room
    room[seatRowIndex][seatColumnIndex] = SeatType.UNAVAILABLE_SEAT;
    event.room = room;
    await event.save();

    return true;
}
