import { Sequelize } from 'sequelize';

import { init as initUser } from './models/user.model';
import { init as initBusiness } from './models/business.model';
import { init as initBranch } from './models/branch.model';

// card templates
import { init as initCardTemplate } from './models/card-template/card-template.model';
import { init as initLoyaltyCardTemplate } from './models/card-template/loyalty-card-template.model';
import { init as initItemsSubscriptionCardTemplate } from './models/card-template/items-subscription-card-template.model';

// cards
import { init as initCard } from './models/card/card.model';
import { init as initLoyaltyCard } from './models/card/loyalty-card.model';
import { init as initItemsSubscriptionCard } from './models/card/items-subscription-card.model';

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
    ];

    // call each model's init function
    for (const init of modelInits) init(sequelize);
};
