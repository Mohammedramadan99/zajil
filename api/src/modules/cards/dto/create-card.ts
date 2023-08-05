import { IsDateString, IsEnum, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
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
}
