import { Branch } from './models/branch.model';
import { Business } from './models/business.model';
import { ItemsSubscriptionCard } from './models/card-types/items-subscription.model';
import { LoyaltyCard } from './models/card-types/loyalty.model';
import { Card } from './models/card.model';
import { User } from './models/user.model';

export const setAssociations = () => {
    // user owning a business
    User.hasMany(Business, {
        foreignKey: 'ownerId',
        as: 'businesses',
    });
    Business.belongsTo(User, {
        foreignKey: 'ownerId',
        as: 'owner',
    });

    // business having many branches
    Business.hasMany(Branch, {
        foreignKey: 'businessId',
        as: 'branches',
    });
    Branch.belongsTo(Business, {
        foreignKey: 'businessId',
        as: 'business',
    });

    // user working at a branch
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

    // Cards | Businesses
    Card.belongsTo(Business, {
        foreignKey: 'businessId',
        as: 'business',
    });
    Business.hasMany(Card, {
        foreignKey: 'businessId',
        as: 'cards',
    });

    // Cards | Loyalty | 1:1
    Card.hasOne(LoyaltyCard, {
        foreignKey: 'id',
        as: 'loyalty',
    });
    LoyaltyCard.belongsTo(Card, {
        foreignKey: 'id',
        as: 'card',
    });

    // Cards | ItemsSubscription | 1:1
    Card.hasOne(ItemsSubscriptionCard, {
        foreignKey: 'id',
        as: 'itemsSubscription',
    });
    ItemsSubscriptionCard.belongsTo(Card, {
        foreignKey: 'id',
        as: 'card',
    });
};
