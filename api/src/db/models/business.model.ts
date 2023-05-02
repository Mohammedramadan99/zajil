import { Model, DataTypes, Sequelize } from 'sequelize';

export class Business extends Model {
    public declare id: number;
    public name!: string;
    public ownerId!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const init = (sequelize: Sequelize) =>
    Business.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            ownerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'businesses',
        },
    );
