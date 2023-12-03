import { IsNumber, IsOptional } from 'class-validator';

export class CreateEventSubscriptionDto {
    @IsNumber()
    @IsOptional()
    planId: number;

    @IsNumber()
    @IsOptional()
    businessId: number;

    @IsNumber()
    @IsOptional()
    basicCards: number;

    @IsNumber()
    @IsOptional()
    basicPrice: number;

    @IsNumber()
    @IsOptional()
    vipCards: number;

    @IsNumber()
    @IsOptional()
    vipPrice: number;

    @IsNumber()
    @IsOptional()
    vvipCards: number;

    @IsNumber()
    @IsOptional()
    vvipPrice: number;

    @IsNumber()
    @IsOptional()
    totalCards: number;

    @IsNumber()
    @IsOptional()
    totalPrice: number;
}
