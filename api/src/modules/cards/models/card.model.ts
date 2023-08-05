import { Model, DataTypes, Sequelize } from 'sequelize';
import { StickerDto } from '../../card-templates/dto/create-card-template';
import { CardTemplate } from '../../card-templates/models/card-template.model';
import { LoyaltyCard } from './loyalty-card.model';
import { ItemsSubscriptionCard } from './items-subscription-card.model';
import { Activity, ActivityType } from '../../businesses/models/activity.model';

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
}
export class Card extends Model {
    public declare id: number;
    public clientPhone!: string;
    public clientName!: string;
    public gender?: string;
    public dob?: Date;
    public templateId!: number;
    public deviceLibraryIdentifier: string;
    public pushToken: string;
    public s3Key: string;
    public s3Location: string;

    // choosen tickers
    public chosenStickers: StickerDto[];

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // associations
    public readonly cardTemplate?: CardTemplate;

    public canScan: boolean;

    // methods
    // for loyalty card, it has a 10 minutes cooldown
    public loyaltyCanScan = async (): Promise<boolean> => {
        let scannable: boolean = true;
        const lastActivity = await Activity.findOne({
            where: {
                relatedId: this.id,
                relatedType: 'card',
                types: [ActivityType.SCAN_CARD],
            },
            order: [['createdAt', 'DESC']],
        });
        if (!lastActivity) {
            scannable = true;
        }else{
            const now = new Date();
            const lastActivityDate = new Date(lastActivity.createdAt);
            const diff = now.getTime() - lastActivityDate.getTime();
            const diffMinutes = Math.ceil(diff / (1000 * 60));
            scannable = diffMinutes >= 10
        }

        if (scannable != this.canScan) {
            this.canScan = scannable;
            await this.save();
        }

        return scannable
    };
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
            gender: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            dob: {
                type: DataTypes.DATE,
                allowNull: true,
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
            s3Key: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            s3Location: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            canScan: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: true,
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

    // Card | Activity
    Card.hasMany(Activity, {
        foreignKey: 'relatedId',
        as: 'activities',
        onDelete: 'CASCADE',
        constraints: false,
        scope: {
            relatedType: 'card',
        },
    });
};
