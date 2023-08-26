import { Model, DataTypes, Sequelize } from 'sequelize';
import { Business } from '../../businesses/models/business.model';
import { LoyaltyCardTemplate } from './loyalty-card-template.model';
import { ItemsSubscriptionCardTemplate } from './items-subscription-card-template.model';
import { Card } from '../../cards/models/card.model';
import { StickerDto } from '../dto/create-card-template';
import { EventTicketTemplate } from './event-ticket-template.model';

export enum CardType {
    LOYALTY = 'LOYALTY',
    ITEMS_SUBSCRIPTION = 'ITEMS_SUBSCRIPTION',
    EVENT_TICKET = 'EVENT_TICKET',
}

export class CardTemplate extends Model {
    public declare id: number;
    public name!: string;
    public cardType!: CardType;
    public businessId!: number;
    public design: any;

    // images
    public readonly logoUrl: string;
    public readonly iconUrl: string;
    public readonly thumbnailUrl: string;
    public readonly footerUrl: string;
    public readonly stripUrl: string;
    public readonly backgroundUrl: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // associations
    public readonly business?: Business;

    // stickers
    public stickers: StickerDto[];
    public stickersCount: number;
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
            logoUrl: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            iconUrl: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            thumbnailUrl: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            footerUrl: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            stripUrl: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            backgroundUrl: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            design: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            stickers: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            stickersCount: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: 'card_templates',
        },
    );

export const associate = () => {
    // Business | Card Template
    CardTemplate.belongsTo(Business, {
        foreignKey: 'businessId',
        as: 'business',
    });

    // Card Template | Loyalty Card Template
    CardTemplate.hasOne(LoyaltyCardTemplate, {
        foreignKey: 'id',
        as: 'loyaltyCardTemplate',
        onDelete: 'CASCADE',
    });

    // Card Template | Items Subscription Card Template
    CardTemplate.hasOne(ItemsSubscriptionCardTemplate, {
        foreignKey: 'id',
        as: 'itemsSubscriptionCardTemplate',
        onDelete: 'CASCADE',
    });

    CardTemplate.hasOne(EventTicketTemplate, {
        foreignKey: 'id',
        as: 'eventTicketTemplate',
        onDelete: 'CASCADE',
    });

    // Card Template | Card
    CardTemplate.hasMany(Card, {
        foreignKey: 'cardTemplateId',
        as: 'cards',
    });
};
