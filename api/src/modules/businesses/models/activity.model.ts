import { Model, DataTypes, Sequelize } from 'sequelize';
import { Business } from './business.model';
import { Card } from '../../cards/models/card.model';
import { User } from '../../users/models/user.model';

export enum ActivityType {
    CREATE_CARD = 'create_card',
    UPDATE_CARD = 'update_card',
    SCAN_CARD = 'scan_card',
}

export class Activity extends Model {
    public declare id: number;
    public businessId!: number;
    public message?: string;
    public type!: ActivityType;
    public cardId?: number;
    public userId?: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const init = (sequelize: Sequelize) =>
    Activity.init(
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
            message: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            cardId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: 'activities',
        },
    );

export const associate = () => {
    Activity.belongsTo(Business, {
        foreignKey: 'businessId',
        as: 'business',
    });

    Activity.belongsTo(Card, {
        foreignKey: 'cardId',
        as: 'card',
    });

    Activity.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
    });
};
