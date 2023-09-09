import { IsDateString, IsEnum, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, Min } from 'class-validator';

export class CreateCardDto {
    // discount value
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    discountValue: number;

    // discount type | 'percentage' or 'fixed_amount'
    @IsNotEmpty()
    @IsString()
    @IsIn(['percentage', 'fixed_amount'])
    discountType: string;

    // max usage | on coupon card type
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    maxUsage: number;

    // usage count | on coupon card type
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    usageCount: number;
}
