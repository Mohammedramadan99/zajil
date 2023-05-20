import { Op } from 'sequelize';
import { HttpError } from '../../common';
import { RequestMod } from '../../common/interfaces/request.mod';
import { Branch } from '../../db/models/branch.model';
import { Business } from '../../db/models/business.model';
import { User } from '../../db/models/user.model';
import { CreateUserDto } from '../../dto/users/create-user';
import { UpdateUserDto } from '../../dto/users/update-user';
import { hashPassword, sendAccountActivationEmail, verifyUserAccountActivationToken } from '../../helpers';

export const createUser = (createUserDto: CreateUserDto): Promise<User> => {
    createUserDto.password = hashPassword(createUserDto.password);
    const user = new User({ ...createUserDto });
    return user.save().then(async (user) => {
        // send account activation email
        await sendAccountActivationEmail(user);

        return user;
    });
};

// only select users who share a business with the logged in user
export const findAllUsers = async ({
    limit = 10,
    offset = 0,
    req,
}: {
    limit: number;
    offset: number;
    req: RequestMod;
}) => {
    const { businessId, branchId } = req.query;

    if (!businessId && !branchId) throw new HttpError(400, 'businessId or branchId is required');
    if (businessId && branchId) throw new HttpError(400, 'businessId and branchId cannot be used together');

    if (branchId) return getUsersByBranchId(Number(branchId), limit, offset);
    return getUsersByBusinessId(Number(businessId), limit, offset);
};

export const findOneUserById = (userId: number): Promise<User> => {
    return User.findOne({
        where: {
            id: userId,
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
};

export const updateUserById = async (userId: number, updateUserDto: UpdateUserDto): Promise<User> => {
    const user = await findOneUserById(userId);
    if (!user) throw new HttpError(404, 'User not found');

    if (updateUserDto.password) updateUserDto.password = hashPassword(updateUserDto.password);
    return user.update(updateUserDto);
};

export const deleteUserById = async (userId: number) => {
    const user = await findOneUserById(userId);
    if (!user) throw new HttpError(404, 'User not found');

    return user.destroy().then(() => ({ message: 'User deleted successfully' }));
};

function getUsersByBranchId(branchId: number, limit: number, offset: number) {
    return User.findAndCountAll({
        include: [
            {
                model: Business,
                as: 'businesses',
            },
            {
                model: Branch,
                where: {
                    id: branchId,
                },
                required: true,
                as: 'employedAt',
            },
        ],
        limit,
        offset,
    });
}

function getUsersByBusinessId(businessId: number, limit: number, offset: number) {
    return User.findAndCountAll({
        include: [
            {
                model: Business,
                where: {
                    id: businessId,
                },
                as: 'businesses',
            },
            {
                model: Branch,
                as: 'employedAt',
            },
        ],
        limit,
        offset,
    });
}

export const activateAccount = async (token: string) => {
    // validate token
    const userId: string = verifyUserAccountActivationToken(token);

    // find user
    const user = await User.findOne({
        where: {
            id: userId,
        },
    });
    if (!user) throw new HttpError(404, 'User not found');

    // activate user
    user.active = true;

    return user.save().then(() => ({ message: 'Account activated successfully' }));
};
