import { Model, DataTypes, Sequelize } from 'sequelize';
import { Card } from './card.model';
import { LoyaltyGift } from '../../card-templates/models/loyalty-gift.model';

export class LoyaltyCard extends Model {
    public declare id: number;
    public points!: number;
    card: Card;

    // redeemed loyalty gifts
    public redeemedLoyaltyGifts: {
        id: number;
        name: string;
        redeemedAt: Date;
    }[];

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const init = (sequelize: Sequelize) =>
    LoyaltyCard.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            points: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 0,
                },
            },
            redeemedLoyaltyGifts: {
                type: DataTypes.JSON,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: 'loyalty_cards',
        },
    );

export const associate = () => {
    LoyaltyCard.belongsTo(Card, {
        foreignKey: 'id',
        as: 'card',
    });
};
