import { User } from '../../db/models/user.model';
import { CreateUserDto } from '../../dto/users/create-user';
import { hashPassword } from '../../helpers';

export const createUser = (createUserDto: CreateUserDto): Promise<User> => {
    const user = new User();
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;
    user.password = hashPassword(createUserDto.password);
    console.log(user);

    return user.save();
};

export const findOneUserById = (userId: number): Promise<User> => {
    return User.findOne({
        where: {
            id: userId,
        },
    });
};
