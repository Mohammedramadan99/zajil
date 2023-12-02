import { HttpError } from '../../../common';
import { RequestMod } from '../../../common/interfaces/request.mod';
import { Branch } from '../../branches/models/branch.model';
import { Business } from '../models/business.model';
import { CreateBusinessDto } from '../dto/create-business';
import { UpdateBusinessDto } from '../dto/update-business';

export const createBusiness = (createBusinessDto: CreateBusinessDto, req: RequestMod): Promise<Business> => {
    console.log('createBusinessDto', createBusinessDto);

    const user = new Business({ ...createBusinessDto, ownerId: req.user.id });
    return user.save();
};

// only select users who share a business with the logged in user
export const findAllBusinesses = async ({
    limit = 10,
    offset = 0,
    req,
}: {
    limit: number;
    offset: number;
    req: RequestMod;
}) => {
    return Business.findAndCountAll({
        where: {
            ownerId: req.user.id,
        },
        include: {
            model: Branch,
            as: 'branches',
        },
        limit,
        offset,
    });
};

export const findOneBusinessById = (businessId: number): Promise<Business> => {
    return Business.findOne({
        where: {
            id: businessId,
        },
        include: [
            {
                model: Branch,
                as: 'branches',
            },
        ],
    });
};

export const updateBusinessById = async (
    businessId: number,
    updateBusinessDto: UpdateBusinessDto,
): Promise<Business> => {
    const business = await findOneBusinessById(businessId);
    if (!business) throw new HttpError(404, 'Business not found');

    return business.update(updateBusinessDto);
};

export const deleteBusinessById = async (businessId: number) => {
    const business = await findOneBusinessById(businessId);
    if (!business) throw new HttpError(404, 'Business not found');

    return business.destroy().then(() => ({ message: 'Business deleted successfully' }));
};
