import express from 'express';
import { BranchController } from '../modules/branches/controllers/Branches';
import { validateMiddleware } from '../middlewares/methods/validate.middleware';
import { CreateBranchDto } from '../modules/branches/dto/create-branch';
import { UpdateBranchDto } from '../modules/branches/dto/update-branch';

const branchesRouter = express.Router();
branchesRouter.post('/', validateMiddleware(CreateBranchDto), BranchController.create);
branchesRouter.get('/', BranchController.getAll);
branchesRouter.get('/' + ':id', BranchController.getOne);
branchesRouter.patch('/' + ':id', validateMiddleware(UpdateBranchDto), BranchController.update);
branchesRouter.delete('/' + ':id', BranchController.delete);
export default branchesRouter;
