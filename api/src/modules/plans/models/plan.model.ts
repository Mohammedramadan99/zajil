import { Model, DataTypes, Sequelize } from 'sequelize';
import { Business } from '../../businesses/models/business.model';

export class Plan extends Model {
    public declare id: number;
    public name!: string;
    public description!: string;
    public price!: number;
    public active!: boolean;
    public maxBranches: number;
    public maxCouponTemplates: number;
    public maxCouponCards: number;
    public maxLoyaltyTemplates: number;
    public maxLoyaltyCards: number;
    public maxEventsTemplates: number;
    public maxEventsCards: number;
    public maxItemSubscriptionTemplates: number;
    public maxItemSubscriptionCards: number;
    public charts: {
        getCardStatistics: boolean;
        getCardsTotal: boolean;
        getCardsChart: boolean;
        getCardsRewardsRedeemedChart: boolean;
        getActivities: boolean;
        getActivitiesChart: boolean;
    };

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const init = (sequelize: Sequelize) =>
    Plan.init(
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
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            active: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            maxBranches: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            maxCouponTemplates: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            maxCouponCards: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            maxLoyaltyTemplates: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            maxLoyaltyCards: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            maxEventsTemplates: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            maxEventsCards: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            maxItemSubscriptionTemplates: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            maxItemSubscriptionCards: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            charts: {
                type: DataTypes.JSONB,
                defaultValue: {
                    getCardStatistics: false,
                    getCardsTotal: false,
                    getCardsChart: false,
                    getCardsRewardsRedeemedChart: false,
                    getActivities: false,
                    getActivitiesChart: false,
                },
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'plans',
        },
    );

export const associate = () => {
    // Plan | Business
    Plan.hasMany(Business, {
        foreignKey: 'planId',
        as: 'businesses',
    });

    // Plan | Subscription
};
