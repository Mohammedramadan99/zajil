import { Model, DataTypes, Sequelize } from 'sequelize';

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
