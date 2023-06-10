import { DataTypes, Model, Sequelize } from 'sequelize';

export class LoyaltyGift extends Model {
    public declare id: number;
    public name: string;
    public loyaltyCardTemplateId: number;
    public limitedAmount?: number;
    public templateId: number;
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
            templateId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'loyalty_gifts',
        },
    );
