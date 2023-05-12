import { Router } from 'express';
import { CardTemplateController } from '../controllers/CardTemplate';
import { validateMiddleware } from '../middlewares/methods/validate.middleware';
import { CreateCardTemplateDto } from '../dto/card-template/create-card-template';
import { UpdateCardTemplateDto } from '../dto/card-template/update-card-template';

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
