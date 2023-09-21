import { DataTypes, Model, Sequelize, Op } from 'sequelize';
import { Card } from './card.model';
import { CouponCardTemplate } from '../../card-templates/models/coupon-card-template.model';
export class CouponCard extends Model {
    public declare id: number;
    public discountValue: number;
    public discountType: string; // 'percentage' or 'fixed_amount'
    public maxUsage: number;
    public usageCount: number;
    public couponCardTemplateId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Is Expired : this.usageCount >= this.maxUsage and CouponCardTemplate.endDate < currentDate
    public async isExpired(): Promise<boolean> {
        const couponCardTemplate = await CouponCardTemplate.findOne({
            where: {
                id: this.couponCardTemplateId,
            },
        });
        const currentDate = new Date();
        return couponCardTemplate.endDate <= currentDate;
    }

    public async isUsed(): Promise<boolean> {
        return this.usageCount >= this.maxUsage;
    }
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
            couponCardTemplateId: {
                type: DataTypes.INTEGER,
                allowNull: true,
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

    // Coupon Card | Coupon Card Template
    CouponCard.belongsTo(CouponCardTemplate, {
        foreignKey: 'couponCardTemplateId',
        as: 'couponCardTemplate',
    });
};
