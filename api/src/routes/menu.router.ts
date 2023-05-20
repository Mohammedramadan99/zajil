import { Router } from 'express';
import { validateMiddleware } from '../middlewares/methods/validate.middleware';
import { CreateMenuDto, MenuItemDto } from '../modules/businesses/dto/create-menu';
import { MenuController } from '../modules/businesses/controllers/menu';

const menuRouter = Router({ mergeParams: true });

// Create Menu
menuRouter.post('/', validateMiddleware(CreateMenuDto), MenuController.createMenu);

// Get menu
menuRouter.get('/', MenuController.getMenu);

// Update menu item
menuRouter.patch('/:menuItemId', validateMiddleware(MenuItemDto), MenuController.updateMenuItem);

// Delete menu item
menuRouter.delete('/:menuItemId', MenuController.deleteMenuItem);

// Delete menu
menuRouter.delete('/', MenuController.deleteMenu);

// Add menu items
menuRouter.post('/add', validateMiddleware(CreateMenuDto), MenuController.addMenuItems);

export default menuRouter;
