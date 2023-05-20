import { NextFunction, Response } from 'express';
import * as menuServices from '../services/menu.services';
import { RequestMod } from '../../../common/interfaces/request.mod';
import { MenuItemDto } from '../dto/create-menu';
import { handleControllerServiceError } from '../../../helpers';

export const MenuController = {
    createMenu: async (req: RequestMod, res: Response, next: NextFunction) => {
        const businessId = Number(req.params.businessId);
        menuServices
            .createMenu(businessId, req.body)
            .then((business) => res.status(201).json(business))
            .catch(handleControllerServiceError(next));
    },

    getMenu: async (req: RequestMod, res: Response, next: NextFunction) => {
        const businessId = Number(req.params.businessId);
        menuServices
            .getMenu(businessId)
            .then((menu) => res.status(200).json(menu))
            .catch(handleControllerServiceError(next));
    },

    updateMenuItem: async (req: RequestMod, res: Response, next: NextFunction) => {
        const menuItemId = Number(req.params.menuItemId);
        const menuItemDto: MenuItemDto = req.body;
        menuServices
            .updateMenuItem(menuItemId, menuItemDto)
            .then((menu) => res.status(200).json(menu))
            .catch(handleControllerServiceError(next));
    },

    deleteMenuItem: async (req: RequestMod, res: Response, next: NextFunction) => {
        const menuItemId = Number(req.params.menuItemId);
        menuServices
            .deleteMenuItem(menuItemId)
            .then((menu) => res.status(200).json(menu))
            .catch(handleControllerServiceError(next));
    },

    deleteMenu: async (req: RequestMod, res: Response, next: NextFunction) => {
        const businessId = Number(req.params.businessId);
        menuServices
            .deleteMenu(businessId)
            .then((menu) => res.status(200).json(menu))
            .catch(handleControllerServiceError(next));
    },

    addMenuItems: async (req: RequestMod, res: Response, next: NextFunction) => {
        const businessId = Number(req.params.businessId);
        const { menuItems } = req.body;
        menuServices
            .addMenuItems(businessId, menuItems)
            .then((menu) => res.status(201).json(menu))
            .catch(handleControllerServiceError(next));
    },
};
