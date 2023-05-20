import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsString, Matches, ValidateNested } from 'class-validator';
import { UserRole } from '../models/user.model';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/, {
        message:
            'Password must be at least 8 characters long, contain at least one number, one uppercase letter, one lowercase letter and one special character',
    })
    password: string;

    @IsNotEmpty()
    @IsArray()
    @IsEnum(UserRole, { each: true })
    roles: UserRole[];
}
