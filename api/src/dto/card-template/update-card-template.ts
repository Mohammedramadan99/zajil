import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

export class UpdateBaseCardTemplateDto {
    // name
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name?: string;
}

export class UpdateIemsSubscriptionCardTemplateDto {
    // maxDailyUsage
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    maxDailyUsage?: number;

    // subscriptionDurationDays
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    subscriptionDurationDays?: number;
}

export class UpdateCardTemplateDto {
    // base
    @IsOptional()
    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => UpdateBaseCardTemplateDto)
    base?: UpdateBaseCardTemplateDto;

    /*
     * Items Subscription Card Template Validation
     * */
    // itemsSubscription
    @IsOptional()
    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => UpdateIemsSubscriptionCardTemplateDto)
    itemsSubscription?: UpdateIemsSubscriptionCardTemplateDto;
}
