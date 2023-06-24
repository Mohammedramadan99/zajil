import { Model, DataTypes, Sequelize } from 'sequelize';
import { User } from '../../users/models/user.model';
import { Branch } from '../../branches/models/branch.model';
import { CardTemplate } from '../../card-templates/models/card-template.model';

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

export const associate = () => {
    // User | Business
    Business.belongsTo(User, {
        foreignKey: 'ownerId',
        as: 'owner',
    });

    // Business | Branch
    Business.hasMany(Branch, {
        foreignKey: 'businessId',
        as: 'branches',
    });

    // Business | Card Template
    Business.hasMany(CardTemplate, {
        foreignKey: 'businessId',
        as: 'cardTemplates',
    });

    // Business | Menu
    Business.hasMany(CardTemplate, {
        foreignKey: 'businessId',
        as: 'menu',
        onDelete: 'CASCADE',
    });
};
