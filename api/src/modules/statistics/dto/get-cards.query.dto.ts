import { Type } from "class-transformer";
import { IsIn, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class GetCardsQueryDto {
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    limit?: number;

    @IsOptional()
    @IsNotEmpty()
    @IsIn(["active", "new"])
    type?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    businessId?: number;
}