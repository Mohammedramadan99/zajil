import { Router } from 'express';
import ICRUDController from '../controllers/interfaces/crud.controller';
import { plainToClassFromExist } from 'class-transformer';
import { ValidationError, validateSync } from 'class-validator';
import bcrypt from 'bcrypt';
import config from '../config';
import { HttpError } from '../common';

// validate DTO
export const validateDto = (DtoClass: any, body: any) => {
    let createItemDto = plainToClassFromExist(new DtoClass(), body);
    let errors = validateSync(createItemDto, { whitelist: true });

    if (errors.length > 0) {
        errors = formatDtoValidationErrors(errors);

        throw new HttpError(400, {
            errors: errors,
        });
    }

    return createItemDto;
};

const formatDtoValidationErrors = (errors: ValidationError[]) => {
    return errors.map((error) => {
        const { property, constraints } = error;

        const out: any = {};
        out[property] = Object.values(constraints);
        return out;
    });
};

export const hashPassword = (password: string) => {
    return bcrypt.hashSync(password, config.bcrypt.saltRounds);
};

export const comparePasswords = (password: string, hashedPassword: string) => {
    return bcrypt.compareSync(password, hashedPassword);
};
