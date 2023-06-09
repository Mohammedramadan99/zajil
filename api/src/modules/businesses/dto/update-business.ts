import { PartialType } from '@nestjs/mapped-types';
import { CreateBusinessDto } from './create-business';

export class UpdateBusinessDto extends PartialType(CreateBusinessDto) {}
