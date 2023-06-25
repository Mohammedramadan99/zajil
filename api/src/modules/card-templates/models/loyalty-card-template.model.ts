import { Model, DataTypes, Sequelize } from 'sequelize';
import { CardTemplate } from './card-template.model';
import { LoyaltyGift } from './loyalty-gift.model';

export class LoyaltyCardTemplate extends Model {
    public declare id: number;
    public pointsPerVisit: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const init = (sequelize: Sequelize) =>
    LoyaltyCardTemplate.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            pointsPerVisit: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'loyalty_card_templates',
        },
    );

export const associate = () => {
    // Card Template | Loyalty Card Template
    LoyaltyCardTemplate.belongsTo(CardTemplate, {
        foreignKey: 'id',
        as: 'cardTemplate',
    });

    // Loyalty Card Template | Loyalty Gift
    LoyaltyCardTemplate.hasMany(LoyaltyGift, {
        foreignKey: 'templateId',
        as: 'loyaltyGifts',
        onDelete: 'CASCADE',
    });
};
