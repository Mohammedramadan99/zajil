import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCardNotificationDto {
    // card id
    @IsNotEmpty()
    @IsNumber()
    cardId: number;

    // notification topic
    @IsNotEmpty()
    @IsString()
    topic: string;
}
