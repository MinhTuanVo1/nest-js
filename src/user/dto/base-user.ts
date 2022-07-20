import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class BaseUser {
  @ApiProperty({ type: Number })
  @AutoMap()
  id: number;

  @ApiProperty({ type: String, default: 'nguyen van a' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(3)
  @AutoMap()
  name: string;

  @ApiProperty({ type: String, default: 'abcd@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  @AutoMap()
  email: string;

  @ApiProperty({ type: String, default: 'nguyena' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(8)
  @MinLength(3)
  @Matches(/^[A-Za-z][A-Za-z0-9]{0,39}$/, {
    message:
      'Username must contains only alphanum chars, only start with alphabet char',
  })
  @AutoMap()
  username: string;

  @ApiProperty({ type: String, format: 'date-time', default: '04/03/2018' })
  @IsNotEmpty()
  @AutoMap()
  birthday: Date;

  @ApiProperty({ type: String, default: 'admin' })
  @IsString()
  @IsNotEmpty()
  @AutoMap()
  role: string;

  @ApiProperty({
    type: String,
    default:
      'https://i.pinimg.com/564x/b3/48/ac/b348acfeb9a26afe01022ec26550bda3.jpg',
  })
  @AutoMap()
  avatar: string;

  @ApiProperty({ type: Boolean, default: false })
  @IsNotEmpty()
  @AutoMap()
  @Type(() => Boolean)
  isBlocked: boolean;

  @ApiProperty({ type: String, default: 'b1234567' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
