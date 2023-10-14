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

export class UpdateSubscribeDto {
  @IsOptional()
  @IsNumber()
  planId?: number;

  @IsOptional()
  @IsNumber()
  businessId?: number;

  @IsOptional()
  @IsEnum(SubscriptionStatusEnum, { message: 'status must be a valid enum value' })
  status?: SubscriptionStatusEnum;

  @IsOptional()
  @IsNumber()
  @Min(1)
  numberOfMonths?: number;
}
