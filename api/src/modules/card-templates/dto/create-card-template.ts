import {
    ArrayMinSize,
    IsArray,
    IsEnum,
    IsIn,
    IsNotEmpty,
    IsNotEmptyObject,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    IsUrl,
    Length,
    Min,
    MinLength,
    ValidateIf,
    ValidateNested,
} from 'class-validator';
import { CardType } from '../models/card-template.model';
import { CreateLoyaltyGiftDto } from './create-loyalty-gift.dto';
import { Type } from 'class-transformer';

export enum CardDesignType {
    BoardingPass = 'boardingPass',
    Coupon = 'coupon',
    EventTicket = 'eventTicket',
    Generic = 'generic',
    StoreCard = 'storeCard',
}

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

    // logoText
    @IsNotEmpty()
    @IsString()
    logoText: string;

    // designType
    @IsNotEmpty()
    @IsString()
    @IsEnum(CardDesignType)
    designType: CardDesignType;

    // logoUrl | on all card types
    @IsNotEmpty()
    @IsString()
    @IsUrl()
    logoUrl: string;

    // iconUrl | on all card types
    @IsNotEmpty()
    @IsString()
    @IsUrl()
    iconUrl: string;

    // thumbnailUrl | on generic and event ticket card types
    @ValidateIf((o) => [CardDesignType.Generic, CardDesignType.EventTicket].includes(o.designType))
    @IsNotEmpty()
    @IsString()
    @IsUrl()
    @IsOptional()
    thumbnailUrl?: string;

    // footerUrl | on boarding pass card type
    @ValidateIf((o) => o.cardType === CardDesignType.BoardingPass)
    @IsNotEmpty()
    @IsString()
    @IsUrl()
    footerUrl: string;

    // stripUrl | on coupon, event ticket and store card card types
    @ValidateIf((o) =>
        [CardDesignType.Coupon, CardDesignType.EventTicket, CardDesignType.StoreCard].includes(o.designType),
    )
    @IsNotEmpty()
    @IsString()
    @IsUrl()
    stripUrl: string;

    // backgroundUrl | on event ticket card type
    @ValidateIf((o) => o.cardType === CardDesignType.EventTicket)
    @IsNotEmpty()
    @IsString()
    @IsUrl()
    backgroundUrl: string;

    // cardProps
    @IsNotEmpty()
    @IsObject()
    cardProps: object;

    // qrCodeFormat
    @IsOptional()
    @IsString()
    @IsIn(['PKBarcodeFormatQR', 'PKBarcodeFormatPDF417', 'PKBarcodeFormatAztec', 'PKBarcodeFormatCode128'])
    qrCodeFormat?: string;

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

    /*
     * Loyalty Card Template Validation
     * */

    // pointsPerVisit
    @ValidateIf((o) => o.cardType === CardType.LOYALTY)
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    pointsPerVisit: number;

    // gifts
    @ValidateIf((o) => o.cardType === CardType.LOYALTY)
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreateLoyaltyGiftDto)
    gifts: CreateLoyaltyGiftDto[];
}
