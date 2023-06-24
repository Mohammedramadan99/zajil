import { Model, DataTypes, Sequelize } from 'sequelize';
import { Menu } from './menu.model';

export class MenuItem extends Model {
    public declare id: number;
    public itemName!: string;
    public itemDescription!: string;
    public itemPrice!: number;
    public declare menuId: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const init = (sequelize: Sequelize) =>
    MenuItem.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            itemName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            itemDescription: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            itemPrice: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            menuId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'menu_items',
        },
    );

export const associate = () => {
    MenuItem.belongsTo(Menu, {
        foreignKey: 'menuId',
        as: 'menu',
    });
};
