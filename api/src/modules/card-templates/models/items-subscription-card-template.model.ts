import { Model, DataTypes, Sequelize } from 'sequelize';
import { StickerDto } from '../dto/create-card-template';
import { CardTemplate } from './card-template.model';

export class ItemsSubscriptionCardTemplate extends Model {
    public declare id: number;
    public maxDailyUsage!: number;
    public subscriptionDurationDays!: number;
    public nItems!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const init = (sequelize: Sequelize) =>
    ItemsSubscriptionCardTemplate.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            maxDailyUsage: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                },
            },
            subscriptionDurationDays: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                },
            },
            nItems: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                },
            },
        },
        {
            sequelize,
            tableName: 'items_subscription_card_templates',
        },
    );

export const associate = () => {
    // Card Template | Items Subscription Card Template
    ItemsSubscriptionCardTemplate.belongsTo(CardTemplate, {
        foreignKey: 'id',
        as: 'cardTemplate',
    });
};
