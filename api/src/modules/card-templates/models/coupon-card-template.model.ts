import { DataTypes, Model, Sequelize, Op } from 'sequelize';
import { CardTemplate } from './card-template.model';
import moment from 'moment';

export class CouponCardTemplate extends Model {
    public declare id: number;
    public discountValue: number;
    public discountType: string; // 'percentage' or 'fixed_amount'
    public maxUsage: number;
    // public maxUsagePerUser: number;
    public startDate: Date;
    public endDate: Date;
    public occasionName: string;
    public status: string; // 'active' or 'inactive'
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public async updateStatusBasedOnEndDate(): Promise<void> {
        // Get the current date and the endDate
        const currentDate = moment();
        const endDate = moment(this.endDate);

        // Check if the current date is after the endDate
        if (currentDate.isAfter(endDate)) {
            this.status = 'inactive'; // Update the status to 'inactive'
            await this.save(); // Save the updated status to the database
        }
    }
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
                validate: {
                    isIn: [['percentage', 'fixed_amount']],
                },
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
                defaultValue: DataTypes.NOW,
            },
            endDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            occasionName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [['active', 'inactive']],
                },
                defaultValue: 'active',
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
