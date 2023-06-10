import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

export class MenuItemDto {
    // name
    @IsNotEmpty()
    @IsString()
    itemName: string;

    // description
    @IsString()
    itemDescription: string;

    // price
    @IsNotEmpty()
    @IsNumber()
    itemPrice: string;
}

export class CreateMenuDto {
    // menu items
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MenuItemDto)
    menuItems: MenuItemDto[];
}
