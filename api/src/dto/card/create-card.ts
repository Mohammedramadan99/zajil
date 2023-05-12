import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateCardDto {
    // clientPhone
    @IsNotEmpty()
    @IsString()
    clientPhone: string;

    // clientName
    @IsNotEmpty()
    @IsString()
    clientName: string;

    // templateId
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    templateId: number;
}
