import { HttpError } from '../../../common';
import { CreateMenuDto, MenuItemDto } from '../dto/create-menu';
import { MenuItem } from '../models/menu/menu-item.model';
import { Menu } from '../models/menu/menu.model';

// create menu
export const createMenu = async (businessId: number, createMenuDto: CreateMenuDto) => {
    // check if menu exists
    const menuExists = await Menu.findOne({
        where: {
            businessId,
        },
    });
    if (menuExists) throw new HttpError(400, 'A menu already exists');

    // create menu
    const menu = await new Menu({
        businessId,
    }).save();

    // create menu items
    const menu_items = await MenuItem.bulkCreate(
        createMenuDto.menuItems.map((item: MenuItemDto) => ({
            ...item,
            menuId: menu.id,
        })),
    );

    // return menu
    return {
        ...menu.toJSON(),
        menu_items: menu_items.map((item) => item.toJSON()),
    };
};

// get menu
export const getMenu = async (businessId: number) => {
    // get menu
    const menu = await Menu.findOne({
        where: {
            businessId,
        },
        include: [
            {
                model: MenuItem,
                as: 'menuItems',
            },
        ],
    });

    // return menu
    return menu;
};

// update menu item
export const updateMenuItem = async (menuItemId: number, updateMenuItemDto: MenuItemDto) => {
    // update menu item
    const menuItem = await MenuItem.update(
        {
            ...updateMenuItemDto,
        },
        {
            where: {
                id: menuItemId,
            },
        },
    );

    // return menu item
    return menuItem;
};

// delete menu item
export const deleteMenuItem = async (menuItemId: number) => {
    // delete menu item
    return await MenuItem.destroy({
        where: {
            id: menuItemId,
        },
    });
};

// delete menu
export const deleteMenu = async (businessId: number) => {
    // delete menu
    return await Menu.destroy({
        where: {
            businessId,
        },
    });
};

// add menu items
export const addMenuItems = async (businessId: number, menuItems: MenuItemDto[]) => {
    // get menu
    const menu = await Menu.findOne({
        where: {
            businessId,
        },
    });

    // create menu items
    const menu_items = await MenuItem.bulkCreate(
        menuItems.map((item: MenuItemDto) => ({
            ...item,
            menuId: menu.id,
        })),
    );

    // return menu items
    return menu_items;
};
