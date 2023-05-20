import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, ValidateNested } from 'class-validator';
import { UserRole } from '../../modules/users/models/user.model';

export class UpdateUserDto {
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    firstName?: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    lastName?: string;

    @IsNotEmpty()
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/, {
        message:
            'Password must be at least 8 characters long, contain at least one number, one uppercase letter, one lowercase letter and one special character',
    })
    @IsOptional()
    password?: string;

    @IsNotEmpty()
    @IsArray()
    @IsEnum(UserRole, { each: true })
    @IsOptional()
    roles?: UserRole[];
}
