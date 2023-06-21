import { Model, DataTypes, Sequelize } from 'sequelize';

export class Card extends Model {
    public declare id: number;
    public clientPhone!: string;
    public clientName!: string;
    public templateId!: number;
    public deviceLibraryIdentifier: string;
    public pushToken: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const init = (sequelize: Sequelize) =>
    Card.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            clientPhone: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            clientName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            templateId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            deviceLibraryIdentifier: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            pushToken: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: 'cards',
        },
    );
