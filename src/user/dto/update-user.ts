import { PickType } from '@nestjs/swagger';
import { BaseUser } from './base-user';

export class UpdateUserDto extends PickType(BaseUser, ['name', 'birthday']) {}
