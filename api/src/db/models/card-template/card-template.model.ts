import { Model, DataTypes, Sequelize } from 'sequelize';

export enum CardType {
    LOYALTY = 'LOYALTY',
    ITEMS_SUBSCRIPTION = 'ITEMS_SUBSCRIPTION',
}

export class CardTemplate extends Model {
    public declare id: number;
    public name!: string;
    public cardType!: CardType;
    public businessId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const init = (sequelize: Sequelize) =>
    CardTemplate.init(
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
            tableName: 'card_templates',
        },
    );
