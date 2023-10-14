import { Model, DataTypes, Sequelize } from 'sequelize';
import { Business } from '../../businesses/models/business.model';
import { Branch } from '../../branches/models/branch.model';
import { File } from '../../file-upload/models/file.model';
import { Activity } from '../../businesses/models/activity.model';
import { Plan } from '../../plans/models/plan.model';

export enum UserRole {
    ADMIN = 'admin',
    BUSINESS_OWNER = 'business_owner',
    EMPLOYEE = 'employee',
}

export class User extends Model {
    public declare id: number;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public password!: string;
    public roles!: UserRole[];
    public active!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    declare businesses: Business[];
    declare employedAt: Branch[];
}

export const init = (sequelize: Sequelize) =>
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            roles: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                defaultValue: [],
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            active: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'users',
        },
    );

export const associate = () => {
    // User | Business
    User.hasMany(Business, {
        foreignKey: 'ownerId',
        as: 'businesses',
    });

    // User | Branch
    User.belongsToMany(Branch, {
        through: 'UserBranch',
        as: 'employedAt',
        foreignKey: 'userId',
    });

    // User | File
    User.hasMany(File, {
        foreignKey: 'userId',
        as: 'files',
    });

    // User | Activity
    User.hasMany(Activity, {
        foreignKey: 'userId',
        as: 'activities',
    });

    // User | Plan
    User.hasMany(Plan, {
        foreignKey: 'creatorId',
        as: 'plans',
    });
};
