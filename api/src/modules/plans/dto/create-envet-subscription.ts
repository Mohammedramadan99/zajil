import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
} from 'class-validator';

export class CreateEventSubscriptionDto {
    @IsNumber()
    @IsNotEmpty()
    planId: number;

    @IsNumber()
    @IsNotEmpty()
    businessId: number;

    @IsNumber()
    @IsNotEmpty()
    basicCards: number;

    @IsNumber()
    @IsNotEmpty()
    basicPrice: number;

    @IsNumber()
    @IsNotEmpty()
    vipCards: number;

    @IsNumber()
    @IsNotEmpty()
    vipPrice: number;

    @IsNumber()
    @IsNotEmpty()
    vvipCards: number;

    @IsNumber()
    @IsNotEmpty()
    vvipPrice: number;

    @IsNumber()
    @IsOptional()
    totalCards: number;

    @IsNumber()
    @IsOptional()
    totalPrice: number;
}
