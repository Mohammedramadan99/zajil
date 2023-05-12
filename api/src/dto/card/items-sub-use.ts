import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class ItemsSubUseDto {
    // value
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    value: number;
}
