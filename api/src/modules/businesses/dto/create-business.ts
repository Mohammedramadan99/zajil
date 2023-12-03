import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBusinessDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    type: string;
}
