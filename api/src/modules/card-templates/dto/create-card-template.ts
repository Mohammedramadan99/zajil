import {
    ArrayMinSize,
    ArrayNotEmpty,
    IsArray,
    IsDateString,
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
    Matches,
    Min,
    MinLength,
    ValidateIf,
    ValidateNested,
} from 'class-validator';
import { CardType } from '../models/card-template.model';
import { CreateLoyaltyGiftDto } from './create-loyalty-gift.dto';
import { Type } from 'class-transformer';
import { SeatType } from '../../events/models/event.model';
import { EventTicketType } from '../models/event-ticket-template.model';

export enum CardDesignType {
    BoardingPass = 'boardingPass',
    Coupon = 'coupon',
    EventTicket = 'eventTicket',
    Generic = 'generic',
    StoreCard = 'storeCard',
}

export enum StickerImageType {
    PNG = 'png',
    JPG = 'jpg',
}

export class StickerDto {
    // imageUrl
    @IsNotEmpty()
    @IsString()
    @IsUrl()
    // @Matches(/https:\/\/zajil-bucket.s3.me-south-1.amazonaws.com/)
    imageUrl: string;

    // title
    @IsNotEmpty()
    @IsString()
    title: string;

    // imageType
    @IsNotEmpty()
    @IsString()
    @IsEnum(StickerImageType)
    imageType: StickerImageType;
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
    // @Matches(/https:\/\/zajil-bucket.s3.me-south-1.amazonaws.com/)
    logoUrl: string;

    // iconUrl | on all card types
    @IsNotEmpty()
    @IsString()
    @IsUrl()
    // @Matches(/https:\/\/zajil-bucket.s3.me-south-1.amazonaws.com/)
    iconUrl: string;

    // thumbnailUrl | on generic and event ticket card types
    @ValidateIf((o) => [CardDesignType.Generic, CardDesignType.EventTicket].includes(o.designType))
    @IsNotEmpty()
    @IsString()
    @IsUrl()
    // @Matches(/https:\/\/zajil-bucket.s3.me-south-1.amazonaws.com/)
    @IsOptional()
    thumbnailUrl?: string;

    // footerUrl | on boarding pass card type
    @ValidateIf((o) => o.cardType === CardDesignType.BoardingPass)
    @IsNotEmpty()
    @IsString()
    @IsUrl()
    // @Matches(/https:\/\/zajil-bucket.s3.me-south-1.amazonaws.com/)
    footerUrl: string;

    // stripUrl | on coupon, event ticket and store card card types
    @ValidateIf((o) =>
        [CardDesignType.Coupon, CardDesignType.EventTicket, CardDesignType.StoreCard].includes(o.designType),
    )
    @IsNotEmpty()
    @IsString()
    @IsUrl()
    // @Matches(/https:\/\/zajil-bucket.s3.me-south-1.amazonaws.com/)
    stripUrl: string;

    // backgroundUrl | on event ticket card type
    @ValidateIf((o) => o.cardType === CardDesignType.EventTicket)
    @IsNotEmpty()
    @IsString()
    @IsUrl()
    // @Matches(/https:\/\/zajil-bucket.s3.me-south-1.amazonaws.com/)
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

    // stickers | on items subscription card type if there is a stripe image and there is noStickers
    @ValidateIf(
        (o) => [CardType.ITEMS_SUBSCRIPTION, CardType.LOYALTY].includes(o.cardType) && o.stripUrl && o.stickersCount,
    )
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => StickerDto)
    stickers: StickerDto[];

    // noStickers | on items subscription card type if there is a stripe image
    @ValidateIf((o) => [CardType.ITEMS_SUBSCRIPTION].includes(o.cardType) && o.stripUrl)
    @IsOptional()
    @IsNumber()
    @Min(1)
    stickersCount: number;

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

    /* Event Ticket Card Template Validation */

    // event id
    @ValidateIf((o) => o.cardType === CardType.EVENT_TICKET)
    @IsNotEmpty()
    @IsNumber()
    eventId: number;

    // event ticket type
    @ValidateIf((o) => o.cardType === CardType.EVENT_TICKET)
    @IsNotEmpty()
    @IsString()
    @IsEnum(EventTicketType)
    eventTicketType: EventTicketType;

    // Coupon Card Template Validation

    // ? public maxUsagePerUser: number;

    // start date
    @ValidateIf((o) => o.cardType === CardType.COUPON)
    @IsNotEmpty()
    @IsDateString()
    startDate: Date;

    // end date
    @ValidateIf((o) => o.cardType === CardType.COUPON)
    @IsNotEmpty()
    @IsDateString()
    endDate: Date;

    // occasion name
    @ValidateIf((o) => o.cardType === CardType.COUPON)
    @IsNotEmpty()
    @IsString()
    occasionName: string;
}
