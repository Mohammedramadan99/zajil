import { Op } from 'sequelize';
import { HttpError } from '../../../common';
import { RequestMod } from '../../../common/interfaces/request.mod';
import { Branch } from '../models/branch.model';
import { CreateBranchDto } from '../dto/create-branch';
import { UpdateBranchDto } from '../dto/update-branch';

export const createBranch = (createbranchDto: CreateBranchDto, req: RequestMod): Promise<Branch> => {
    const { businessId } = createbranchDto;

    // check if the business exists in the user's businesses
    const business = req.user.businesses.find((business) => business.id === businessId);
    if (!business) throw new HttpError(403, 'You do not own this business');

    const user = new Branch({ ...createbranchDto, businessId });
    return user.save();
};

// only select users who share a branch with the logged in user
export const findAllBranches = async ({
    limit = 10,
    offset = 0,
    req,
}: {
    limit: number;
    offset: number;
    req: RequestMod;
}) => {
    return Branch.findAndCountAll({
        where: {
            businessId: {
                [Op.in]: req.user.businesses.map((business) => business.id),
            },
        },
        limit,
        offset,
    });
};

export const findOneBranchById = (branchId: number): Promise<Branch> => {
    return Branch.findOne({
        where: {
            id: branchId,
        },
    });
};

export const updateBranchById = async (branchId: number, updatebranchDto: UpdateBranchDto): Promise<Branch> => {
    const branch = await findOneBranchById(branchId);
    if (!branch) throw new HttpError(404, 'branch not found');

    return branch.update(updatebranchDto);
};

export const deleteBranchById = async (branchId: number) => {
    const branch = await findOneBranchById(branchId);
    if (!branch) throw new HttpError(404, 'branch not found');

    return branch.destroy().then(() => ({ message: 'branch deleted successfully' }));
};
