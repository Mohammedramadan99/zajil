import { IsArray, IsDateString, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { SeatType } from '../models/event.model';

export class CreateEventDto {
    // title
    @IsNotEmpty()
    @IsString()
    title: string;

    // description
    @IsOptional()
    @IsString()
    description?: string;

    // startDate
    @IsNotEmpty()
    @IsDateString()
    startDate: string;

    // endDate
    @IsNotEmpty()
    @IsDateString()
    endDate: string;

    // limitedAmount
    @IsOptional()
    @IsNumber()
    @Min(1)
    limitedAmount?: number;

    // room
    @IsOptional()
    @IsArray()
    @IsIn([[SeatType.NONE, SeatType.THEATER, SeatType.AVAILABILE_SEAT]], { each: true }) // Validate each element of the array against the SeatType enum
    room?: SeatType[][];
}
