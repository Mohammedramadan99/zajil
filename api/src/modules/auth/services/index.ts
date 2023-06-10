import { LoginDto } from '../dto/login';
import bcrypt from 'bcrypt';
import { signJWT } from './jwt';
import { User } from '../../users/models/user.model';
import { Business } from '../../businesses/models/business.model';
import { Branch } from '../../branches/models/branch.model';

export const login = async (loginDto: LoginDto) => {
    const { email, password } = loginDto;

    const user = await User.findOne({
        where: {
            email,
        },
        include: [
            {
                model: Business,
                as: 'businesses',
            },
            {
                model: Branch,
                as: 'employedAt',
            },
        ],
    });
    if (!user) throw new Error('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Invalid credentials');

    return {
        ...user.toJSON(),
        token: signJWT(user as User & { businesses: Business[]; employedAt: Branch[] }),
    };
};
