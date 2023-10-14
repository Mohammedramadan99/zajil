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
import { SubscriptionStatusEnum } from '../models/subscription.model';

export class createSubscribeDto {
    @IsNotEmpty()
    @IsNumber()
    planId: number;

    @IsNotEmpty()
    @IsEnum(SubscriptionStatusEnum, { message: 'status must be a valid enum value' })
    status: SubscriptionStatusEnum;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    numberOfMonths: number;
}
