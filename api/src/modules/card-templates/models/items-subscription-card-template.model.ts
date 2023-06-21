import { Model, DataTypes, Sequelize } from 'sequelize';
import { StickerDto } from '../dto/create-card-template';

export class ItemsSubscriptionCardTemplate extends Model {
    public declare id: number;
    public maxDailyUsage!: number;
    public subscriptionDurationDays!: number;
    public nItems!: number;

    // stickers
    public stickers: StickerDto[];
    public stickersCount: number;

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
            stickers: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            stickersCount: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: 'items_subscription_card_templates',
        },
    );
