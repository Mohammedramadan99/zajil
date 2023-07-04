import { plainToClassFromExist } from 'class-transformer';
import { ValidationError, validateSync } from 'class-validator';
import bcrypt from 'bcrypt';
import config from '../config';
import { HttpError } from '../common';
import { sign, verify } from 'jsonwebtoken';
import { User } from '../modules/users/models/user.model';
import { NextFunction } from 'express';
import { writeFileSync } from 'fs';
import { uploadFile } from '../modules/aws/s3';

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
        let { children } = error;

        if (constraints) {
            const out: any = {};
            out[property] = Object.values(constraints);
            return out;
        }

        if (children) {
            // return the index as part of the property name
            children = children.map((child) => {
                child.property = `${property}.${child.property}`;
                return child;
            });

            return formatDtoValidationErrors(children);
        }

        return null;
    });
};

export const hashPassword = (password: string) => {
    return bcrypt.hashSync(password, config.bcrypt.saltRounds);
};

export const comparePasswords = (password: string, hashedPassword: string) => {
    return bcrypt.compareSync(password, hashedPassword);
};

// sign JWT for user account activation
export const signUserAccountActivationToken = (userId: number) => {
    return sign(
        {
            userId,
            type: 'account-activation',
        },
        config.JWT.secret,
        {
            // expires in 10 days
            expiresIn: 864000,
        },
    );
};

// verify JWT for user account activation
export const verifyUserAccountActivationToken = (token: string) => {
    let payload: any;

    try {
        payload = verify(token, config.JWT.secret);
        if (payload.type !== 'account-activation') throw new Error('Invalid token');
    } catch (error) {
        throw new HttpError(400, error.message);
    }

    return payload.userId;
};

// send account activation email
export const sendAccountActivationEmail = async (user: User) => {
    const token = signUserAccountActivationToken(user.id);

    console.log(`To activate your account, please click on the following link: /activate-account/${token}`);

    // #TODO: send email
};

export const handleControllerServiceError = (next: NextFunction) => {
    return (error: any) => {
        if (error instanceof HttpError) {
            next(error);
        }

        next(new HttpError(500, error.message));
    };
};

export const downloadImageToFolder = async (imageURL: string, path: string) => {
    // check if the url is for an image
    const imageType = await fetch(imageURL, {
        method: 'HEAD',
    }).then((res) => res.headers.get('content-type'));
    // if (!imageType || !imageType.includes('image')) throw new HttpError(400, 'Invalid image URL');

    console.log(path.split('/').slice(0, -1).join('/'));

    // download the image
    return fetch(imageURL)
        .then((x) => x.arrayBuffer())
        .then((x) =>
            uploadFile(
                {
                    name: path.split('/').pop() || '',
                    data: Buffer.from(x),
                    contentType: imageType || undefined,
                },
                path.split('/').slice(0, -1).join('/'),
            ),
        );
};
