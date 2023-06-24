import { Branch } from '../modules/branches/models/branch.model';
import { Business } from '../modules/businesses/models/business.model';
import { CardTemplate } from '../modules/card-templates/models/card-template.model';
import { ItemsSubscriptionCardTemplate } from '../modules/card-templates/models/items-subscription-card-template.model';
import { LoyaltyCardTemplate } from '../modules/card-templates/models/loyalty-card-template.model';
import { Card } from '../modules/cards/models/card.model';
import { MenuItem } from '../modules/businesses/models/menu/menu-item.model';
import { Menu } from '../modules/businesses/models/menu/menu.model';
import { User } from '../modules/users/models/user.model';
import { LoyaltyCard } from '../modules/cards/models/loyalty-card.model';
import { ItemsSubscriptionCard } from '../modules/cards/models/items-subscription-card.model';
import { LoyaltyGift } from '../modules/card-templates/models/loyalty-gift.model';
import { File } from '../modules/file-upload/models/file.model';

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

    // Loyal Card Template | Loyalty Gift
    LoyaltyCardTemplate.hasMany(LoyaltyGift, {
        foreignKey: 'templateId',
        as: 'loyaltyGifts',
        onDelete: 'CASCADE',
    });
    LoyaltyGift.belongsTo(LoyaltyCardTemplate, {
        foreignKey: 'templateId',
        as: 'loyaltyCardTemplate',
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

    // Business | Menu
    Business.hasOne(Menu, {
        foreignKey: 'businessId',
        as: 'menu',
        onDelete: 'CASCADE',
    });
    Menu.belongsTo(Business, {
        foreignKey: 'businessId',
        as: 'business',
    });

    // Menu | Menu Item
    Menu.hasMany(MenuItem, {
        foreignKey: 'menuId',
        as: 'menuItems',
        onDelete: 'CASCADE',
    });
    MenuItem.belongsTo(Menu, {
        foreignKey: 'menuId',
        as: 'menu',
    });

    // User | File
    User.hasMany(File, {
        foreignKey: 'createdBy',
        as: 'files',
    });
    File.belongsTo(User, {
        foreignKey: 'createdBy',
        as: 'creator',
    });
};
