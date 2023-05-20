import { Sequelize } from 'sequelize';

import { init as initUser } from '../modules/users/models/user.model';
import { init as initBusiness } from '../modules/businesses/models/business.model';
import { init as initBranch } from '../modules/branches/models/branch.model';

// card templates
import { init as initCardTemplate } from '../modules/card-templates/models/card-template.model';
import { init as initLoyaltyCardTemplate } from '../modules/card-templates/models/loyalty-card-template.model';
import { init as initItemsSubscriptionCardTemplate } from '../modules/card-templates/models/items-subscription-card-template.model';

// cards
import { init as initCard } from '../modules/cards/models/card.model';
import { init as initLoyaltyCard } from '../modules/cards/models/loyalty-card.model';
import { init as initItemsSubscriptionCard } from '../modules/cards/models/items-subscription-card.model';

// menu
import { init as initMenu } from '../modules/businesses/models/menu/menu.model';
import { init as initMenuItem } from '../modules/businesses/models/menu/menu-item.model';

export const initModels = (sequelize: Sequelize) => {
    // array of model init functions
    const modelInits = [
        initUser,
        initBusiness,
        initBranch,

        // card templates
        initCardTemplate,
        initLoyaltyCardTemplate,
        initItemsSubscriptionCardTemplate,

        // cards
        initCard,
        initLoyaltyCard,
        initItemsSubscriptionCard,

        // menu
        initMenu,
        initMenuItem,
    ];

    // call each model's init function
    for (const init of modelInits) init(sequelize);
};
