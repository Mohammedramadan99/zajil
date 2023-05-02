import { Model, DataTypes, Sequelize } from 'sequelize';

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

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
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
        },
        {
            sequelize,
            tableName: 'users',
        },
    );
