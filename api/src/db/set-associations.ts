import { Branch } from './models/branch.model';
import { Business } from './models/business.model';
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
};
