import express from 'express';
import { setCRUDRoutes } from '../helpers';
import { BranchController } from '../controllers/Branches';

const branchesRouter = express.Router();
setCRUDRoutes(branchesRouter, BranchController)
export default branchesRouter;
