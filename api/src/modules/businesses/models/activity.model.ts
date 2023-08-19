import { Model, DataTypes, Sequelize } from 'sequelize';
import { Business } from './business.model';
import { Card } from '../../cards/models/card.model';
import { User } from '../../users/models/user.model';
import { LoyaltyGift } from '../../card-templates/models/loyalty-gift.model';
import { Event } from '../../card-templates/models/event.model';

export enum ActivityType {
    CREATE_CARD = 'CreateCard',
    UPDATE_CARD = 'UpdateCard',
    SCAN_CARD = 'ScanCard',

    // Loyalty
    LOYALTY_ADD_POINTS = 'LoyaltyAddPoints',
    LOYALTY_UPDATE_POINTS = 'LoyaltyUpdatePoints',

    // Loyalty Gift
    LOYALTY_GIFT_CREATE = 'LoyaltyGiftCreate',
    LOYALTY_GIFT_UPDATE = 'LoyaltyGiftUpdate',
    LOYALTY_GIFT_DELETE = 'LoyaltyGiftDelete',
    LOYALTY_GIFT_REDEEM = 'LoyaltyGiftRedeem',

    // Items Subscriptions
    ITEM_SUBSCRIPTION_USE = 'ItemSubscriptionUse',
}

export class Activity extends Model {
    public declare id: number;
    public businessId!: number;
    public message?: string;
    public types!: [ActivityType];
    public userId?: number;
    public relatedId?: number;
    public relatedType?: 'card' | 'loyaltyGift' | 'event';

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
            types: {
                type: DataTypes.ARRAY(DataTypes.STRING),
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
    
    Activity.belongsTo(Event, {
        foreignKey: 'relatedId',
        constraints: false,
        as: 'event',
    });
};
