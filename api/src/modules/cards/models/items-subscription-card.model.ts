import { Model, DataTypes, Sequelize } from 'sequelize';

export class ItemsSubscriptionCard extends Model {
    public declare id: number;
    public nItems!: number;
    public expirationDate!: Date;

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
                validate: {
                    min: 0,
                },
            },
            expirationDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'items_subscription_cards',
        },
    );
