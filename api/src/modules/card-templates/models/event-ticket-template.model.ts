import { DataTypes, Model, Sequelize } from 'sequelize';
import { Event } from './event.model';

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
};
