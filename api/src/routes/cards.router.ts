import { Router } from 'express';
import { validateMiddleware } from '../middlewares/methods/validate.middleware';
import { UpdateCardDto } from '../dto/card/update-card';
import { CreateCardDto } from '../dto/card/create-card';
import { CardController } from '../controllers/Card';
import { LoyaltyAddSubtractPoints } from '../dto/card/loyalty-add-subtract-points';

const cardsRouter = Router({ mergeParams: true });

// Create Card
cardsRouter.post('/', validateMiddleware(CreateCardDto), CardController.create);

// Get All Card
cardsRouter.get('/', CardController.getAll);

// Get One Card by ID
cardsRouter.get('/:id', CardController.getOne);

// Update Card by ID
cardsRouter.patch('/:id', validateMiddleware(UpdateCardDto), CardController.update);

// Delete Card by ID
cardsRouter.delete('/:id', CardController.delete);

// loyalty functions
cardsRouter.patch(
    '/:id/loyalty/add-points',
    validateMiddleware(LoyaltyAddSubtractPoints),
    CardController.loyaltyAddPoints,
);
cardsRouter.patch(
    '/:id/loyalty/subtract-points',
    validateMiddleware(LoyaltyAddSubtractPoints),
    CardController.loyaltySubtractPoints,
);

// // items subscription functions
// cardsRouter.post('/:id/items-subscription/use', CardController.itemsSubscriptionUse);

export default cardsRouter;
