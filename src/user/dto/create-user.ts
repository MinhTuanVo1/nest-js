import { OmitType } from '@nestjs/swagger';
import { BaseUser } from './base-user';

export class CreateUserDto extends OmitType(BaseUser, ['id']) {}
