import { DataTypes, Model, Sequelize } from 'sequelize';
import { CardTemplate } from './card-template.model';

export class CouponCardTemplate extends Model {
    public declare id: number;
    public discountValue: number;
    public discountType: string; // 'percentage' or 'fixed amount'
    public maxUsage: number;
    // public maxUsagePerUser: number;
    public startDate: Date;
    public endDate: Date;
    public status: string; // 'active' or 'inactive'
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const init = (sequelize: Sequelize) =>
    CouponCardTemplate.init(
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
            },
            maxUsage: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                },
            },
            // maxUsagePerUser: {
            //     type: DataTypes.INTEGER,
            //     allowNull: false,
            //     validate: {
            //         min: 1,
            //     },
            // },
            startDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'coupon_card_templates',
        },
    );

export const associate = () => {
    // Card Template | Coupon Card Template
    CouponCardTemplate.belongsTo(CardTemplate, {
        foreignKey: 'id',
        as: 'cardTemplate',
    });
};
