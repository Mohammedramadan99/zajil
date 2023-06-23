import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, Min, ValidateNested } from 'class-validator';
import { StickerDto } from '../../card-templates/dto/create-card-template';
import { IsStickersLengthEqualToValue } from './validators/stickers-len-e-value';

export class ItemsSubUseDto {
    // value
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    value: number;

    // stickers
    @IsOptional()
    @IsNotEmpty()
    @IsArray()
    @IsStickersLengthEqualToValue()
    @ValidateNested({ each: true })
    @Type(() => StickerDto)
    stickers: StickerDto[];
}
