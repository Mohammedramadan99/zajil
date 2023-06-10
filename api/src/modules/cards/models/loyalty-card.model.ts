import { Model, DataTypes, Sequelize } from 'sequelize';

export class LoyaltyCard extends Model {
    public declare id: number;
    public points!: number;

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
        },
        {
            sequelize,
            tableName: 'loyalty_cards',
        },
    );
