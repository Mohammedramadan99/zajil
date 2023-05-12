import { Router } from 'express';
import { validateMiddleware } from '../middlewares/methods/validate.middleware';
import { UpdateCardDto } from '../dto/card/update-card';
import { CreateCardDto } from '../dto/card/create-card';
import { CardController } from '../controllers/Card';

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

export default cardsRouter;
