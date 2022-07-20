import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty({ type: String, default: 'nguyena' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ type: String, default: 'b1234567' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
