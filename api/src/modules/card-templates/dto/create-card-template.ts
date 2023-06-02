import { IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUrl, Min, ValidateIf } from 'class-validator';
import { CardType } from '../models/card-template.model';

export class CreateCardTemplateDto {
    // name
    @IsNotEmpty()
    @IsString()
    name: string;

    // cardType
    @IsNotEmpty()
    @IsString()
    @IsEnum(CardType)
    cardType: CardType;

    // logoUrl
    @IsNotEmpty()
    @IsString()
    @IsUrl()
    logoUrl: string;

    // logoText
    @IsNotEmpty()
    @IsString()
    logoText: string;

    // iconUrl
    @IsNotEmpty()
    @IsString()
    @IsUrl()
    iconUrl: string;

    // thumbnailUrl
    @IsNotEmpty()
    @IsString()
    @IsUrl()
    @IsOptional()
    thumbnailUrl?: string;

    // cardProps
    @IsNotEmpty()
    @IsObject()
    cardProps: object;

    /*
     * Items Subscription Card Template Validation
     * */

    // maxDailyUsage
    @ValidateIf((o) => o.cardType === CardType.ITEMS_SUBSCRIPTION)
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    maxDailyUsage: number;

    // subscriptionDurationDays
    @ValidateIf((o) => o.cardType === CardType.ITEMS_SUBSCRIPTION)
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    subscriptionDurationDays: number;

    // nItems
    @ValidateIf((o) => o.cardType === CardType.ITEMS_SUBSCRIPTION)
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    nItems: number;
}
