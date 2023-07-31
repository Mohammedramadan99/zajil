import { Router } from 'express';
import { validateMiddleware } from '../middlewares/methods/validate.middleware';
import { UpdateCardDto } from '../modules/cards/dto/update-card';
import { CreateCardDto } from '../modules/cards/dto/create-card';
import { CardController } from '../modules/cards/controllers/Card';
import { LoyaltyAddSubtractPoints } from '../modules/cards/dto/loyalty-add-subtract-points';
import { ItemsSubUseDto } from '../modules/cards/dto/items-sub-use';
import { canUseBusinessId } from '../middlewares/methods/canUseBusinessId.middleware';

const cardsRouter = Router({ mergeParams: true });

// Create Card
cardsRouter.post('/', validateMiddleware(CreateCardDto), CardController.create);

// Get All Card
cardsRouter.get('/', canUseBusinessId, CardController.getAll);

// Get One Card by ID
cardsRouter.get('/:id', canUseBusinessId, CardController.getOne);

// Update Card by ID
cardsRouter.patch('/:id', canUseBusinessId, validateMiddleware(UpdateCardDto), CardController.update);

// Delete Card by ID
cardsRouter.delete('/:id', canUseBusinessId, CardController.delete);

// loyalty functions
cardsRouter.patch('/:id/loyalty/add-points', canUseBusinessId, CardController.loyaltyAddPoints);
cardsRouter.patch('/:id/loyalty/update-points', canUseBusinessId, CardController.loyaltyUpdatePoints);

// redeem loyalty gift
cardsRouter.patch('/:id/loyalty/redeem-gift', canUseBusinessId, CardController.loyaltyRedeemGift);

// items subscription functions
cardsRouter.patch(
    '/:id/items-subscription/use',
    canUseBusinessId,
    validateMiddleware(ItemsSubUseDto),
    CardController.itemSubscriptionUse,
);

export default cardsRouter;
