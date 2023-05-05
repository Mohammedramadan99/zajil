import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBranchDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsNumber()
    businessId: Number;
}
