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

export class UpdatePlanDto {
    // name
    @IsOptional()
    @IsString()
    name: string;

    // description
    @IsOptional()
    @IsString()
    description: string;

    // price
    @IsOptional()
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

    // branches
    @IsOptional()
    @IsArray()
    branches: number[];

    // couponTemplates
    @IsOptional()
    @IsArray()
    couponTemplates: number[];

    // loyaltyTemplates
    @IsOptional()
    @IsArray()
    loyaltyTemplates: number[];

    // charts : is Opject
    @IsOptional()
    @IsObject()
    charts: object;
}
