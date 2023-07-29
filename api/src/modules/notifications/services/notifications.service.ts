import { HttpError } from '../../../common';
import { Business } from '../../businesses/models/business.model';
import { CardTemplate } from '../../card-templates/models/card-template.model';
import { Card } from '../../cards/models/card.model';
import { User } from '../../users/models/user.model';
import { CreateCardNotificationDto } from '../dto/create-notification';
import { sendNotification } from './apn.service';

export const sendCardNotification = async (CreateCardNotificationDto: CreateCardNotificationDto, user: User) => {
    // find the card
    const card = (await Card.findOne({
        where: {
            id: CreateCardNotificationDto.cardId,
        },
        include: [
            {
                model: CardTemplate,
                as: 'cardTemplate',
                include: [
                    {
                        model: Business,
                        as: 'business',
                    },
                ],
            },
        ],
    })) as Card & { cardTemplate: CardTemplate & { business: Business } };
    if (!card) {
        throw new HttpError(404, 'Card not found');
    }

    // check if the user is an owner of the business issuing the card
    const bussinessUserOwns = user.businesses.map((business) => business.id);
    const businessUserEmployeeOf = user.employedAt.map((business) => business.id);
    if (![...bussinessUserOwns, ...businessUserEmployeeOf].includes(card.cardTemplate.business.id))
        throw new HttpError(403, 'User is not authorized to send notifications for this card');

    // check if the card is registered
    if (!card.deviceLibraryIdentifier) throw new HttpError(400, 'Card is not registered for notifications');

    // send notification
    await sendNotification(
        {
            topic: CreateCardNotificationDto.topic,
        },
        card.deviceLibraryIdentifier,
    ).catch((err) => {
        console.error(err);
        throw new HttpError(500, err);
    });

    return {
        message: 'Notification sent',
    };
};
