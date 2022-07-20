import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePassUserDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  oldPass: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  newPass: string;
}
