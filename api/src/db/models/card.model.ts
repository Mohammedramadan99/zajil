import { Model, DataTypes, Sequelize } from 'sequelize';

enum CardType {
    LOYALTY = 'LOYALTY',
    ITEMS_SUBSCRIPTION = 'ITEMS_SUBSCRIPTION',
}

export class Card extends Model {
    public declare id: number;
    public name!: string;
    public clientName: string;
    public clientPhone: string;
    public cardType: CardType;
    public businessId!: number;

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
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            clientName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            clientPhone: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    is: /^(\+7|7|8)?9\d{9}$/i,
                },
            },
            cardType: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [Object.values(CardType)],
                },
            },
            businessId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'cards',
        },
    );
