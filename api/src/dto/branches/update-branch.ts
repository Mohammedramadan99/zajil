import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateBranchDto {
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    name?: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    address?: string;
}
