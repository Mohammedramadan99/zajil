import { Model, DataTypes, Sequelize } from 'sequelize';
import { Card } from './card.model';
import { LoyaltyGift } from '../../card-templates/models/loyalty-gift.model';
import { EventTicketTemplate } from '../../card-templates/models/event-ticket-template.model';
import { Event } from '../../card-templates/models/event.model';

export class EventCard extends Model {
    public declare id: number;
    public eventTicketTemplateId!: number;
    public seatId?: string; // ex: 'A1'

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public async isExpired(): Promise<boolean> {
        const eventTicketTemplate = await EventTicketTemplate.findOne({
            where: {
                id: this.eventTicketTemplateId,
            },
            include: [
                {
                    model: Event,
                    as: 'event',
                },
            ],
        });

        return eventTicketTemplate.event.endDate < new Date();
    }
}

export const init = (sequelize: Sequelize) =>
    EventCard.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            eventTicketTemplateId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            seatId: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: 'event_cards',
        },
    );

export const associate = () => {
    EventCard.belongsTo(EventTicketTemplate, {
        foreignKey: 'eventTicketTemplateId',
        as: 'eventTicketTemplate',
    });
};
