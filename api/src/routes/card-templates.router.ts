import { Router } from 'express';
import { CardTemplateController } from '../modules/card-templates/controllers/CardTemplate';
import { validateMiddleware } from '../middlewares/methods/validate.middleware';
import { CreateCardTemplateDto } from '../modules/card-templates/dto/create-card-template';
import { UpdateCardTemplateDto } from '../modules/card-templates/dto/update-card-template';

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

export default cardTemplatesRouter;
