import { AutoMap } from '@automapper/classes';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'users', synchronize: true })
@Unique('username', ['username'])
export class UserEntity {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column('text')
  @AutoMap()
  name: string;

  @Column()
  @AutoMap()
  username: string;

  @Column()
  @AutoMap()
  email: string;

  @Column('date')
  @AutoMap()
  birthday: Date;

  @Column({
    default:
      'https://i.pinimg.com/564x/b3/48/ac/b348acfeb9a26afe01022ec26550bda3.jpg',
  })
  @AutoMap()
  avatar: string;

  @Column()
  @AutoMap()
  role: string;

  @Column({ default: false })
  @AutoMap()
  isBlocked: boolean;

  @Column()
  @AutoMap()
  password: string;
}
