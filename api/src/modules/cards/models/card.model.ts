import { Model, DataTypes, Sequelize } from 'sequelize';
import { StickerDto } from '../../card-templates/dto/create-card-template';
import { CardTemplate } from '../../card-templates/models/card-template.model';
import { LoyaltyCard } from './loyalty-card.model';
import { ItemsSubscriptionCard } from './items-subscription-card.model';

export class Card extends Model {
    public declare id: number;
    public clientPhone!: string;
    public clientName!: string;
    public templateId!: number;
    public deviceLibraryIdentifier: string;
    public pushToken: string;

    // stickers
    public chosenStickers: StickerDto[];

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
            chosenStickers: {
                type: DataTypes.JSON,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: 'cards',
        },
    );

export const associate = () => {
    // Card Template | Card
    Card.belongsTo(CardTemplate, {
        foreignKey: 'templateId',
        as: 'cardTemplate',
    });

    // Card | Loyalty Card
    Card.hasOne(LoyaltyCard, {
        foreignKey: 'id',
        as: 'loyaltyCard',
        onDelete: 'CASCADE',
    });

    Card.hasOne(ItemsSubscriptionCard, {
        foreignKey: 'id',
        as: 'itemsSubscriptionCard',
        onDelete: 'CASCADE',
    });
};
