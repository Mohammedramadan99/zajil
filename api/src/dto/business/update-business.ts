import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateBusinessDto {
    @IsNotEmpty()
    @IsString()
    name: string;
}
