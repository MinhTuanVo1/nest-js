import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, OutputUserDto, UpdateUserDto } from './dto';
import { ChangePassUserDto } from './dto/change-pass';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { PaginateDto, PaginateResultDto } from 'src/common/dto';
import * as fs from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  async create(user: CreateUserDto) {
    const hash = bcrypt.hashSync(user.password, 5);

    const usernameExist = await this.userRepository.count({
      where: {
        username: user.username,
      },
    });

    if (usernameExist) {
      throw new HttpException('Username already exists', HttpStatus.CONFLICT);
    }

    const newUser = await this.userRepository.save({ ...user, password: hash });

    return this.mapper.map(newUser, UserEntity, OutputUserDto);
  }

  async findAll(): Promise<OutputUserDto[]> {
    const users = await this.userRepository.find();
    const outUsers: OutputUserDto[] = this.mapper.mapArray(
      users,
      UserEntity,
      OutputUserDto,
    );

    return outUsers;
  }

  async update(id: number, user: UpdateUserDto) {
    const oldUser = await this.userRepository.findOne({ where: { id: id } });

    if (!oldUser) {
      throw new NotFoundException('User not found.');
    }

    const { affected } = await this.userRepository.update(id, { ...user });

    if (affected > 0) {
      return user;
    } else {
      throw new HttpException('Can not edit user', HttpStatus.FORBIDDEN);
    }
  }

  async delete(id: number): Promise<boolean> {
    const user = this.userRepository.findOne({ where: { id: id } });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    await this.userRepository.softDelete(id);

    return true;
  }

  async changPassword(id: number, dto: ChangePassUserDto): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new HttpException('User not found.', 401);
    }

    const passMatches = bcrypt.compareSync(dto.oldPass, user.password);
    if (passMatches) {
      const newHash = bcrypt.hashSync(dto.newPass, 5);
      await this.userRepository.update(id, { password: newHash });
    } else {
      throw new HttpException(
        'Old password not match.',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    return 'Change pass success.';
  }

  async paginate(
    query: PaginateDto,
  ): Promise<PaginateResultDto<OutputUserDto>> {
    const skippedItem = (query.page - 1) * query.limit;

    const totalCount = await this.userRepository.count();
    const users = await this.userRepository
      .createQueryBuilder()
      .andWhere(
        `name like '%${query.search || ''}%' or username like '%${
          query.search || ''
        }%' or email like '%${query.search || ''}%' `,
      )
      .offset(skippedItem)
      .limit(query.limit)
      .getMany();
    const outUsers: OutputUserDto[] = this.mapper.mapArray(
      users,
      UserEntity,
      OutputUserDto,
    );

    return {
      data: outUsers,
      page: query.page,
      limit: query.limit,
      totalCount: totalCount,
    };
  }

  async block(id: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.update(id, { isBlocked: true });

    return true;
  }

  async updateAvatar(file: Express.Multer.File, id: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    const words = user.avatar.split('/');

    const oldAvatar = words[words.length - 1];

    const filePath = join(process.cwd(), 'files/' + oldAvatar);

    fs.unlinkSync(filePath);

    const config = new ConfigService();

    const avatar = `${config.get('DOMAIN')}/avatar/${file.filename}`;

    await this.userRepository.update(id, { avatar: avatar });

    return true;
  }
}
