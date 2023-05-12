import { Branch } from './models/branch.model';
import { Business } from './models/business.model';
import { CardTemplate } from './models/card-template/card-template.model';
import { ItemsSubscriptionCardTemplate } from './models/card-template/items-subscription-card-template.model';
import { LoyaltyCardTemplate } from './models/card-template/loyalty-card-template.model';
import { Card } from './models/card/card.model';
import { ItemsSubscriptionCard } from './models/card/items-subscription-card.model';
import { LoyaltyCard } from './models/card/loyalty-card.model';
import { User } from './models/user.model';

export const setAssociations = () => {
    // User | Business
    User.hasMany(Business, {
        foreignKey: 'ownerId',
        as: 'businesses',
    });
    Business.belongsTo(User, {
        foreignKey: 'ownerId',
        as: 'owner',
    });

    // Business | Branch
    Business.hasMany(Branch, {
        foreignKey: 'businessId',
        as: 'branches',
    });
    Branch.belongsTo(Business, {
        foreignKey: 'businessId',
        as: 'business',
    });

    // User | Branch
    User.belongsToMany(Branch, {
        through: 'UserBranch',
        as: 'employedAt',
        foreignKey: 'userId',
    });
    Branch.belongsToMany(User, {
        through: 'UserBranch',
        as: 'employees',
        foreignKey: 'branchId',
    });

    // Business | Card Template
    Business.hasMany(CardTemplate, {
        foreignKey: 'businessId',
        as: 'cardTemplates',
    });
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
    LoyaltyCardTemplate.belongsTo(CardTemplate, {
        foreignKey: 'id',
        as: 'cardTemplate',
    });

    // Card Template | Items Subscription Card Template
    CardTemplate.hasOne(ItemsSubscriptionCardTemplate, {
        foreignKey: 'id',
        as: 'itemsSubscriptionCardTemplate',
        onDelete: 'CASCADE',
    });
    ItemsSubscriptionCardTemplate.belongsTo(CardTemplate, {
        foreignKey: 'id',
        as: 'cardTemplate',
    });

    // Card Template | Card
    CardTemplate.hasMany(Card, {
        foreignKey: 'templateId',
        as: 'cards',
    });
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
    LoyaltyCard.belongsTo(Card, {
        foreignKey: 'id',
        as: 'card',
    });

    // Card | Items Subscription Card
    Card.hasOne(ItemsSubscriptionCard, {
        foreignKey: 'id',
        as: 'itemsSubscriptionCard',
        onDelete: 'CASCADE',
    });
    ItemsSubscriptionCard.belongsTo(Card, {
        foreignKey: 'id',
        as: 'card',
    });
};
