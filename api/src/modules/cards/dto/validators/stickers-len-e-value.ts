import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsStickersLengthEqualToValue(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string): void {
        registerDecorator({
            name: 'isStickersLengthEqualToValue',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const stickers = args.object['stickers'] as any[];
                    const valueProp = args.object['value'] as number;

                    if (!stickers || !Array.isArray(stickers)) {
                        return false;
                    }

                    return stickers.length === valueProp;
                },
                defaultMessage(args: ValidationArguments) {
                    return `The length of stickers must be equal to the value of "value"`;
                },
            },
        });
    };
}
