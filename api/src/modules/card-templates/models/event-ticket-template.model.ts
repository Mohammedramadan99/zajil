import { DataTypes, Model, Sequelize } from 'sequelize';
import { Event } from '../../events/models/event.model';
import { CardTemplate } from './card-template.model';

export enum EventTicketType {
    SEAT = 'seat',
    ENTRY = 'entry',
}

export class EventTicketTemplate extends Model {
    public declare id: number;
    public eventId!: number;
    public event?: Event;
    public type: EventTicketType;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const init = (sequelize: Sequelize) =>
    EventTicketTemplate.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            eventId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'event_ticket_templates',
        },
    );

export const associate = () => {
    // Event | Event Ticket Template
    EventTicketTemplate.belongsTo(Event, {
        foreignKey: 'eventId',
        as: 'event',
    });

    // Event Ticket Template | Card Template
    EventTicketTemplate.belongsTo(CardTemplate, {
        foreignKey: 'id',
        as: 'cardTemplate',
    });
};
