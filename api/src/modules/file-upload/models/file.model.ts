import { Model, DataTypes, Sequelize } from 'sequelize';
import { User } from '../../users/models/user.model';

export class File extends Model {
    public declare id: number;
    public createdBy!: number;
    public name!: string;
    public url!: string;
    public mimeType!: string;
    public key!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const init = (sequelize: Sequelize) =>
    File.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            createdBy: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            mimeType: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            key: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'files',
        },
    );

export const associate = () => {
    // User | File
    File.belongsTo(User, {
        foreignKey: 'createdBy',
        as: 'creator',
    });
};
