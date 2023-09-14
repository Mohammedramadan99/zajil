import { DataTypes, Model, Sequelize, Op } from 'sequelize';
import { CardTemplate } from './card-template.model';
import moment from 'moment';
import { CouponCard } from '../../cards/models/coupon-card.model';
export class CouponCardTemplate extends Model {
    public declare id: number;
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

    // Coupon Card Template | Coupon Card
    CouponCardTemplate.hasMany(CouponCard, {
        foreignKey: 'couponCardTemplateId',
        as: 'couponCards',
    });
};
