import { Model, DataTypes, Sequelize } from 'sequelize';
import { Business } from '../../businesses/models/business.model';
import { EventPlan } from './eventPlan.model';

/**
 * number of total cards
 * number basics event card
 * price of basic event card
 * number vip event card
 * price of vip event card
 * number vvip event card
 * price of vvip event card
 *
 * planId
 * businessId
 *
 * total Price
 */

export class EventSubscription extends Model {
    public declare id: number;
    public planId: number;
    public businessId: number;
    public totalCards: number;
    public basicCards: number;
    public basicPrice: number;
    public vipCards: number;
    public vipPrice: number;
    public vvipCards: number;
    public vvipPrice: number;
    public totalPrice: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const init = (sequelize: Sequelize) =>
    EventSubscription.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            planId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            businessId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            totalCards: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            basicCards: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            basicPrice: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            vipCards: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            vipPrice: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            vvipCards: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            vvipPrice: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            totalPrice: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'event_subscriptions',
        },
    );

export const associate = () => {
    // EventSubscription | Business
    EventSubscription.belongsTo(Business, {
        foreignKey: 'businessId',
        as: 'business',
    });

    // EventSubscription | EventPlan
    EventSubscription.belongsTo(EventPlan, {
        foreignKey: 'planId',
        as: 'plan',
    });
};
