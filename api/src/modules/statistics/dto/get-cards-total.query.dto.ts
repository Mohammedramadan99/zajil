import { Type } from "class-transformer";
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsPositive } from "class-validator";

export class GetCardsTotalQueryDto {
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    businessId?: number;
}