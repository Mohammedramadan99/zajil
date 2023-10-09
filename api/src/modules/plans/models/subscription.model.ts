import { Model, DataTypes, Sequelize } from 'sequelize';
import { User } from '../../users/models/user.model';

export enum SubscriptionStatus {
    TRIAL = 'trial',
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    CANCELLED = 'cancelled',
    UPGRADING = 'upgrading',
}

export class Subscription extends Model {
    public declare id: number;
    public declare userId: number;
    public declare planId: number;
    public declare status: SubscriptionStatus;
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
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            planId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM(
                    SubscriptionStatus.TRIAL,
                    SubscriptionStatus.ACTIVE,
                    SubscriptionStatus.INACTIVE,
                    SubscriptionStatus.CANCELLED,
                    SubscriptionStatus.UPGRADING,
                ),
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
    // Subscription | User
    Subscription.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
    });

    // Subscription | Plan
    
};
