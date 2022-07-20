import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class OutputUserDto {
  @ApiProperty({ type: Number })
  @AutoMap()
  id: number;

  @ApiProperty({ type: String })
  @AutoMap()
  name: string;

  @ApiProperty({ type: String })
  @AutoMap()
  email: string;

  @ApiProperty({ type: String })
  @AutoMap()
  username: string;

  @ApiProperty({ type: String })
  @AutoMap()
  role: string;

  @ApiProperty({ type: String })
  @AutoMap()
  avatar: string;

  @ApiProperty({ type: String, format: 'date-time' })
  @AutoMap()
  birthday: Date;
}
