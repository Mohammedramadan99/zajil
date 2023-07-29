import { Type } from "class-transformer";
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsPositive } from "class-validator";

export class GetActivitiesQueryDto {
    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    limit?: number = 10;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    businessId?: number;
}