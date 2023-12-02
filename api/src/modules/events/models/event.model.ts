import { DataTypes, Model, Sequelize } from 'sequelize';
import { LoyaltyCardTemplate } from '../../card-templates/models/loyalty-card-template.model';
import { Activity } from '../../businesses/models/activity.model';
import { Business } from '../../businesses/models/business.model';
import { EventTicketTemplate } from '../../card-templates/models/event-ticket-template.model';

export enum SeatType {
    NONE = 0,
    THEATER = 1,
    AVAILABILE_SEAT = 2,
    UNAVAILABLE_SEAT = 3,
}

export class Event extends Model {
    public declare id: number;
    public title: string;
    public description: string;
    public startDate: Date;
    public endDate: Date;
    public limitedAmount?: number;
    public businessId!: number;
    public room?: SeatType[][];
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const init = (sequelize: Sequelize) =>
    Event.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            startDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            limitedAmount: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            businessId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            room: {
                type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.INTEGER)),
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: 'events',
        }, 
    );

export const associate = () => {
    // Event | Activity
    Event.hasMany(Activity, {
        foreignKey: 'relatedId',
        as: 'activities',
        constraints: false,
        scope: {
            relatedType: 'event',
        },
    });

    // Event | Business
    Event.belongsTo(Business, {
        foreignKey: 'businessId',
        as: 'business',
    });

    // Event | Event Ticket Template
    Event.hasMany(EventTicketTemplate, {
        foreignKey: 'eventId',
        as: 'eventTicketTemplates',
    });
};
