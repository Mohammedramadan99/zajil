import { Model, DataTypes, Sequelize } from 'sequelize';
import { Business } from '../../businesses/models/business.model';
import { Card } from '../../cards/models/card.model';
import { User } from '../../users/models/user.model';

export class Branch extends Model {
    public declare id: number;
    public name!: string;
    public address!: string;
    public businessId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const init = (sequelize: Sequelize) =>
    Branch.init(
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
            address: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            googleMapsLocation: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            businessId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'branches',
        },
    );

export const associate = () => {
    // Branch | Business
    Branch.belongsTo(Business, {
        foreignKey: 'businessId',
        as: 'business',
    });

    // User | Branch
    Branch.belongsToMany(User, {
        through: 'userBranches',
        as: 'employees',
        foreignKey: 'branchId',
    });
};
