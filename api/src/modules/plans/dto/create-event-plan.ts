import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateEventPlanDto {
    // name
    @IsNotEmpty()
    @IsString()
    name: string;

    // description
    @IsOptional()
    @IsString()
    description?: string;

    // maxEventCardTemplates
    @IsNumber()
    maxEventCardTemplates: number;

    // minCards
    @IsNumber()
    minCards: number;

    // maxCards
    @IsNumber()
    maxCards: number;

    // basicPresintage
    @IsNumber()
    basicPresintage: number;

    // vipPresintage
    @IsNumber()
    vipPresintage: number;

    // vvipPresintage
    @IsNumber()
    vvipPresintage: number;

    // active
    @IsNotEmpty()
    @IsBoolean()
    active: boolean;
}
