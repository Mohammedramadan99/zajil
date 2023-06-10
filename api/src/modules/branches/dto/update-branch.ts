import { CreateBranchDto } from './create-branch';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateBranchDto extends PartialType(CreateBranchDto) {}
