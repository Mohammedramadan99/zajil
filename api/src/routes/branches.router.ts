import express from 'express';
import { BranchController } from '../modules/branches/controllers/Branches';
import { validateMiddleware } from '../middlewares/methods/validate.middleware';
import { CreateBranchDto } from '../dto/branches/create-branch';
import { UpdateBranchDto } from '../dto/branches/update-branch';

const branchesRouter = express.Router();
branchesRouter.post('/', validateMiddleware(CreateBranchDto), BranchController.create);
branchesRouter.get('/', BranchController.getAll);
branchesRouter.get('/' + ':id', BranchController.getOne);
branchesRouter.patch('/' + ':id', validateMiddleware(UpdateBranchDto), BranchController.update);
branchesRouter.delete('/' + ':id', BranchController.delete);
export default branchesRouter;
