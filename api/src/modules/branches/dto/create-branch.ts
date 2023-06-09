import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBranchDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsOptional()
    @IsString()
    googleMapsLocation?: string;

    @IsNotEmpty()
    @IsNumber()
    businessId: Number;
}
