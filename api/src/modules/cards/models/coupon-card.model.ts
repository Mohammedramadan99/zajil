import { DataTypes, Model, Sequelize, Op } from 'sequelize';
import { Card } from './card.model';

export class CouponCard extends Model {
    public declare id: number;
    public discountValue: number;
    public discountType: string; // 'percentage' or 'fixed_amount'
    public maxUsage: number;
    public usageCount: number;
}

export const init = (sequelize: Sequelize) =>
    CouponCard.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            discountValue: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                },
            },
            discountType: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [['percentage', 'fixed_amount']],
                },
            },
            usageCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 0,
                },
                defaultValue: 0,
            },
            maxUsage: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                },
            },
        },
        {
            sequelize,
            tableName: 'coupon_cards',
        },
    );

export const associate = () => {
    // Card | Coupon Card
    CouponCard.belongsTo(Card, {
        foreignKey: 'id',
        as: 'card',
    });
};
