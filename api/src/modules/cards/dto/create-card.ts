import { IsDateString, IsEnum, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, Min } from 'class-validator';
import { Gender } from '../models/card.model';

export class CreateCardDto {
    // clientPhone
    @IsNotEmpty()
    @IsString()
    clientPhone: string;

    // clientName
    @IsNotEmpty()
    @IsString()
    clientName: string;

    // gender
    @IsOptional()
    @IsString()
    @IsEnum(Gender)
    gender: string;

    // dob
    @IsOptional()
    @IsDateString()
    dob: string;

    // templateId
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    templateId: number;

    // seat
    @IsOptional()
    @IsString()
    @Matches(/^[A-Z]\d+$/) // ex: 'A1'
    seat?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    discountValue?: number;

    // discount type | 'percentage' or 'fixed_amount'
    @IsOptional()
    @IsString()
    @IsIn(['percentage', 'fixed_amount'])
    discountType?: string;

    // max usage | on coupon card type
    @IsOptional()
    @IsNumber()
    @Min(1)
    maxUsage?: number;
}
