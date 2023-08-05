import { Model, DataTypes, Sequelize } from 'sequelize';
import { Business } from './business.model';
import { Card } from '../../cards/models/card.model';
import { User } from '../../users/models/user.model';
import { LoyaltyGift } from '../../card-templates/models/loyalty-gift.model';

export enum ActivityType {
    CREATE_CARD = 'create_card',
    UPDATE_CARD = 'update_card',
    SCAN_CARD = 'scan_card',
}

export class Activity extends Model {
    public declare id: number;
    public businessId!: number;
    public message?: string;
    public type!: ActivityType;
    public userId?: number;
    public relatedId?: number;
    public relatedType?: 'card' | 'loyaltyGift';

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const init = (sequelize: Sequelize) =>
    Activity.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            businessId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            message: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            relatedId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            relatedType: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: 'activities',
        },
    );

export const associate = () => {
    Activity.belongsTo(Business, {
        foreignKey: 'businessId',
        as: 'business',
    });

    Activity.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
    });

    // polymorphic association
    Activity.belongsTo(Card, {
        foreignKey: 'relatedId',
        constraints: false,
        as: 'card',
    });

    Activity.belongsTo(LoyaltyGift, {
        foreignKey: 'relatedId',
        constraints: false,
        as: 'loyaltyGift',
    });
};
