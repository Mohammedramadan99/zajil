import { Model, DataTypes, Sequelize } from 'sequelize';

export class Menu extends Model {
    public declare id: number;
    public businessId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const init = (sequelize: Sequelize) =>
    Menu.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            businessId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'menus',
        },
    );
