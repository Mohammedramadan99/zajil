import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCardNotificationDto {
    // card id
    @IsNotEmpty()
    @IsNumber()
    cardId: number;

    // alert
    @IsNotEmpty()
    @IsString()
    alert: string;
}
