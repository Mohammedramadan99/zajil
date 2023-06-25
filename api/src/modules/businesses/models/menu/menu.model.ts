import { Model, DataTypes, Sequelize } from 'sequelize';
import { Business } from '../business.model';
import { MenuItem } from './menu-item.model';

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

export const associate = () => {
    // Business | Menu
    Menu.belongsTo(Business, {
        foreignKey: 'businessId',
        as: 'business',
    });

    // Menu | Menu Item
    Menu.hasMany(MenuItem, {
        foreignKey: 'menuId',
        as: 'menuItems',
        onDelete: 'CASCADE',
    });
};
