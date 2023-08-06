import { DataTypes, Model, Sequelize } from 'sequelize';
import { LoyaltyCardTemplate } from './loyalty-card-template.model';
import { Activity } from '../../businesses/models/activity.model';

export class LoyaltyGift extends Model {
    public declare id: number;
    public name: string;
    public loyaltyCardTemplateId: number;
    public limitedAmount?: number;
    public priceNPoints: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const init = (sequelize: Sequelize) =>
    LoyaltyGift.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            limitedAmount: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            priceNPoints: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            loyaltyCardTemplateId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'loyalty_gifts',
        },
    );

export const associate = () => {
    // Loyal Card Template | Loyalty Gift
    LoyaltyGift.belongsTo(LoyaltyCardTemplate, {
        foreignKey: 'loyaltyCardTemplateId',
        as: 'loyaltyCardTemplate',
    });

    // Loyalty Gift | Activity
    LoyaltyGift.hasMany(Activity, {
        foreignKey: 'relatedId',
        as: 'activities',
        constraints: false,
        scope: {
            relatedType: 'loyaltyGift',
        },
    });
};
