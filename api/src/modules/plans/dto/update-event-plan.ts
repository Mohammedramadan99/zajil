import {
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class UpdateEventPlanDto {
    // name
    @IsOptional()
    @IsString()
    name?: string;

    // description
    @IsOptional()
    @IsString()
    description?: string;

    // maxEventCardTemplates
    @IsOptional()
    @IsNumber()
    maxEventCardTemplates?: number;

    // minCards
    @IsOptional()
    @IsNumber()
    minCards?: number;

    // maxCards
    @IsOptional()
    @IsNumber()
    maxCards?: number;

    // basicPresintage
    @IsOptional()
    @IsNumber()
    basicPresintage?: number;

    // vipPresintage
    @IsOptional()
    @IsNumber()
    vipPresintage?: number;

    // vvipPresintage
    @IsOptional()
    @IsNumber()
    vvipPresintage?: number;

    // active
    @IsOptional()
    @IsBoolean()
    active?: boolean;
}
