import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateCardTemplateDto {
    // name
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name?: string;

    /*
     * Items Subscription Card Template Validation
     * */

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
