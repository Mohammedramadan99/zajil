import { Model, DataTypes, Sequelize } from 'sequelize';
import { User } from '../../users/models/user.model';
import { Branch } from '../../branches/models/branch.model';
import { CardTemplate } from '../../card-templates/models/card-template.model';
import { Activity } from './activity.model';
import { Event } from '../../events/models/event.model';
import { Subscription } from '../../plans/models/subscription.model';

const enum BusinessType {
    EVENT = 'EVENT',
    CARD = 'CARD',
}

export class Business extends Model {
    public declare id: number;
    public name!: string;
    public ownerId!: number;
    public type!: BusinessType;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const init = (sequelize: Sequelize) =>
    Business.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            ownerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM(BusinessType.EVENT, BusinessType.CARD),
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'businesses',
        },
    );

export const associate = () => {
    // User | Business
    Business.belongsTo(User, {
        foreignKey: 'ownerId',
        as: 'owner',
    });

    // Business | Branch
    Business.hasMany(Branch, {
        foreignKey: 'businessId',
        as: 'branches',
    });

    // Business | Card Template
    Business.hasMany(CardTemplate, {
        foreignKey: 'businessId',
        as: 'cardTemplates',
    });

    // Business | Menu
    Business.hasMany(CardTemplate, {
        foreignKey: 'businessId',
        as: 'menu',
        onDelete: 'CASCADE',
    });

    // Business | Activity
    Business.hasMany(Activity, {
        foreignKey: 'businessId',
        as: 'activities',
    });

    // Business | Event
    Business.hasMany(Event, {
        foreignKey: 'businessId',
        as: 'events',
    });

    // Business | Subscription
    Business.hasMany(Subscription, {
        foreignKey: 'businessId',
        as: 'subscription',
    });
};
