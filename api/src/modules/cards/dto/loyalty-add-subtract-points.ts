import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class LoyaltyAddSubtractPoints {
    // value
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    value: number;
}
