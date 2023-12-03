import { Model, DataTypes, Sequelize } from 'sequelize';
import { User } from '../../users/models/user.model';
import { EventSubscription } from './eventSubscription.model';

export class EventPlan extends Model {
    public declare id: number;
    public name!: string;
    public description!: string;
    public maxEventCardTemplates: number;
    public minCards: number;
    public maxCards: number;
    public basicPresintage: number;
    public vipPresintage: number;
    public vvipPresintage: number;
    public active!: boolean;
    public creatorId: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const init = (sequelize: Sequelize) =>
    EventPlan.init(
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
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            minCards: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            maxCards: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            basicPresintage: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            vipPresintage: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            vvipPresintage: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'eventPlans',
        },
    );

export const associate = () => {
    // EventPlan | User
    EventPlan.belongsTo(User, {
        foreignKey: 'creatorId',
        as: 'creator',
    });

    // EventPlan | EventSubscription
    EventPlan.hasMany(EventSubscription, {
        foreignKey: 'eventPlanId',
        as: 'eventSubscriptions',
    });
};
