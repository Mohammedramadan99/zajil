import { LoginDto } from '../../dto/auth/login';
import bcrypt from 'bcrypt';
import { signJWT } from './jwt';
import { User } from '../../db/models/user.model';

export const login = async (loginDto: LoginDto) => {
    const { email, password } = loginDto;

    const user = await User.findOne({
        where: {
            email,
        },
    });
    if (!user) throw new Error('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Invalid credentials');

    return {
        ...user.toJSON(),
        token: signJWT(user),
    };
};
