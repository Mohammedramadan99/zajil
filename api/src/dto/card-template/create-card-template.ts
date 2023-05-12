import { IsEnum, IsNotEmpty, IsNumber, IsString, Min, ValidateIf } from 'class-validator';
import { CardType } from '../../db/models/card-template/card-template.model';

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
