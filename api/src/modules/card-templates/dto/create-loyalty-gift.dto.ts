import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class CreateLoyaltyGiftDto {
    // name
    @IsNotEmpty()
    @IsString()
    name: string;

    // limitedAmount
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    limitedAmount: number;
}