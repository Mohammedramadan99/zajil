import { Type } from 'class-transformer';
import { IsDateString, IsIn, IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class GetCardsChartQueryDto {
    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;

    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    nPoints: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Type(() => Number)
    businessId?: number;
}
