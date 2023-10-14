import { Model, DataTypes, Sequelize } from 'sequelize';
import { Business } from '../../businesses/models/business.model';
import { Plan } from './plan.model';

export enum SubscriptionStatusEnum {
    TRIAL = 'trial',
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    CANCELLED = 'cancelled',
    UPGRADING = 'upgrading',
}

export class Subscription extends Model {
    public declare id: number;
    public declare businessId: number;
    public declare planId: number;
    public declare status: SubscriptionStatusEnum;
    public declare startDate: Date;
    public declare endDate: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const init = (sequelize: Sequelize) =>
    Subscription.init(
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
            planId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM(
                    SubscriptionStatusEnum.TRIAL,
                    SubscriptionStatusEnum.ACTIVE,
                    SubscriptionStatusEnum.INACTIVE,
                    SubscriptionStatusEnum.CANCELLED,
                    SubscriptionStatusEnum.UPGRADING,
                ),
                defaultValue: SubscriptionStatusEnum.ACTIVE,
                allowNull: false,
            },
            startDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'subscriptions',
        },
    );

export const associate = () => {
    // Subscription | Business
    Subscription.belongsTo(Business, {
        foreignKey: 'businessId',
        as: 'business',
    });

    // Subscription | Plan
    Subscription.belongsTo(Plan, {
        foreignKey: 'planId',
        as: 'plan',
    });
};
