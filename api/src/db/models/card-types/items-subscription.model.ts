import { Model, DataTypes, Sequelize } from 'sequelize';

export class ItemsSubscriptionCard extends Model {
    public declare id: number;

    public nItems!: number;
    public maxDailyUsage!: number;
    public expiresAt!: Date;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const init = (sequelize: Sequelize) =>
    ItemsSubscriptionCard.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            nItems: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            maxDailyUsage: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            expiresAt: {
                type: DataTypes.DATE,
                allowNull: false,
                // default: 30 days from now
                defaultValue: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        },
        {
            sequelize,
            tableName: 'items_subscription_cards',
        },
    );
