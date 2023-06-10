import { Router } from 'express';
import { CardTemplateController } from '../modules/card-templates/controllers/CardTemplate';
import { validateMiddleware } from '../middlewares/methods/validate.middleware';
import { CreateCardTemplateDto } from '../modules/card-templates/dto/create-card-template';
import { UpdateCardTemplateDto } from '../modules/card-templates/dto/update-card-template';
import { CreateLoyaltyGiftDto } from '../modules/card-templates/dto/create-loyalty-gift.dto';

const cardTemplatesRouter = Router({ mergeParams: true });

// Create Card Template
cardTemplatesRouter.post('/', validateMiddleware(CreateCardTemplateDto), CardTemplateController.create);

// Get All Card Templates
cardTemplatesRouter.get('/', CardTemplateController.getAll);

// Get One Card Template by Template ID
cardTemplatesRouter.get('/:id', CardTemplateController.getOne);

// Update Card Template by Template ID
cardTemplatesRouter.patch('/:id', validateMiddleware(UpdateCardTemplateDto), CardTemplateController.update);

// Delete Card Template by Template ID
cardTemplatesRouter.delete('/:id', CardTemplateController.delete);

// Add Gift to Loyalty Card Template
cardTemplatesRouter.post(
    '/:id/gifts',
    validateMiddleware(CreateLoyaltyGiftDto),
    CardTemplateController.addGiftToLoyaltyCardTemplate,
);

// Update Gift in Loyalty Card Template
cardTemplatesRouter.patch(
    '/:id/gifts/:giftId',
    validateMiddleware(CreateLoyaltyGiftDto),
    CardTemplateController.updateGiftInLoyaltyCardTemplate,
);

// Delete Gift from Loyalty Card Template
cardTemplatesRouter.delete('/:id/gifts/:giftId', CardTemplateController.deleteGiftFromLoyaltyCardTemplate);

export default cardTemplatesRouter;
