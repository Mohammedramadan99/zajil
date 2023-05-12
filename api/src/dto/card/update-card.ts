import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

export class UpdateBaseCardDto {
    // name
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name?: string;
}

export class UpdateIemsSubscriptionCardDto {
    // nItems
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    nItems?: number;
}

export class UpdateLoyaltyCardDto {
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    points?: number;
}

export class UpdateCardDto {
    // base
    @IsOptional()
    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => UpdateBaseCardDto)
    base?: UpdateBaseCardDto;

    /*
     * Items Subscription Card Validation
     * */
    // itemsSubscription
    @IsOptional()
    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => UpdateIemsSubscriptionCardDto)
    itemsSubscription?: UpdateIemsSubscriptionCardDto;

    /*
     * Loyalty Card Validation
     * */
    // loyalty
    @IsOptional()
    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => UpdateLoyaltyCardDto)
    loyalty?: UpdateLoyaltyCardDto;
}
