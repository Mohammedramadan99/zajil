import {
    IsArray,
    IsDateString,
    IsEnum,
    IsIn,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    Matches,
    Min,
} from 'class-validator';

export class CreatePlanDto {
    // name
    @IsNotEmpty()
    @IsString()
    name: string;

    // description
    @IsNotEmpty()
    @IsString()
    description: string;

    // price
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    price: number;

    // active
    @IsOptional()
    @IsString()
    @IsIn(['true', 'false'])
    active: string;

    // maxBranches
    @IsOptional()
    @IsNumber()
    @Min(-1)
    maxBranches: number;

    // maxCouponTemplates
    @IsOptional()
    @IsNumber()
    @Min(-1)
    maxCouponTemplates: number;

    // maxCouponCards
    @IsOptional()
    @IsNumber()
    @Min(-1)
    maxCouponCards: number;

    // maxLoyaltyTemplates
    @IsOptional()
    @IsNumber()
    @Min(-1)
    maxLoyaltyTemplates: number;

    // maxLoyaltyCards
    @IsOptional()
    @IsNumber()
    @Min(-1)
    maxLoyaltyCards: number;

    // maxEventsTemplates
    @IsOptional()
    @IsNumber()
    @Min(-1)
    maxEventsTemplates: number;

    // maxEventsCards
    @IsOptional()
    @IsNumber()
    @Min(-1)
    maxEventsCards: number;

    // maxItemSubscriptionTemplates
    @IsOptional()
    @IsNumber()
    @Min(-1)
    maxItemSubscriptionTemplates: number;

    // maxItemSubscriptionCards
    @IsOptional()
    @IsNumber()
    @Min(-1)
    maxItemSubscriptionCards: number;

    // charts : is Opject
    @IsOptional()
    @IsObject()
    charts: object;

    @IsOptional()
    @IsNumber()
    @Min(1)
    supPlanId: number;
}
