import { Model, DataTypes, Sequelize } from 'sequelize';
import { Card } from './card.model';

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

export const associate = () => {
    // Card | Items Subscription Card
    ItemsSubscriptionCard.belongsTo(Card, {
        foreignKey: 'id',
        as: 'card',
    });
};
