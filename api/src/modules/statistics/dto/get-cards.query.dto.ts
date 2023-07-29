import { Type } from "class-transformer";
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsPositive } from "class-validator";

export class GetCardsQueryDto {
    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    limit?: number = 10;

    @IsOptional()
    @IsNotEmpty()
    @IsIn(["active", "new"])
    type?: string = "new";

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    businessId?: number;
}