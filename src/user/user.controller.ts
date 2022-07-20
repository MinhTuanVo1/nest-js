import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto, OutputUserDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { ChangePassUserDto } from './dto/change-pass';
import { GetUser } from 'src/auth/decorator';
import { Roles } from './decorator';
import { RolesGuard } from './guard';
import { PaginateDto, PaginateResultDto } from 'src/common/dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Helper } from 'src/common/helper/helper';
import { of } from 'rxjs';
import { join } from 'path';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userServie: UserService) {}

  @Put('avatar/change')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: Helper.destinationPath,
        filename: Helper.customFileName,
      }),
    }),
  )
  async updateAvatar(
    @UploadedFile() file: Express.Multer.File,
    @GetUser('id') id: number,
  ) {
    const result = await this.userServie.updateAvatar(file, id);
    if (result) {
      return 'Update avatar successfully.';
    }

    return 'Update avatar fail.';
  }

  @Get('avatar/:imgpath')
  seeUploadedFile(@Param('imgpath') image: string, @Res() res) {
    return of(res.sendFile(join(process.cwd(), 'files/' + image)));
  }

  @Get('paginate')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ description: 'Users retrieved successfully.' })
  paginate(
    @Query() query: PaginateDto,
  ): Promise<PaginateResultDto<OutputUserDto>> {
    return this.userServie.paginate(query);
  }

  @Get()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('access-token')
  @ApiForbiddenResponse({
    description: 'You do not have permission to access that.',
  })
  @ApiOkResponse({ description: 'Users retrieved successfully.' })
  findAll(): Promise<OutputUserDto[]> {
    return this.userServie.findAll();
  }

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: Helper.destinationPath,
        filename: Helper.customFileName,
      }),
    }),
  )
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ description: 'User created successfully.' })
  @ApiConflictResponse({ description: 'Username already exists.' })
  create(
    @Body() user: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<OutputUserDto> {
    user.avatar = `http://localhost:3000/avatar/${file.filename}`;
    return this.userServie.create(user);
  }

  @Put()
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ description: 'User updated successfully.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiUnprocessableEntityResponse({ description: 'Can not edit user.' })
  async update(
    @Body() user: UpdateUserDto,
    @GetUser('id') id: number,
  ): Promise<UpdateUserDto> {
    return await this.userServie.update(id, user);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ description: 'User deleted successfully.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  delete(@Param('id') id: number): Promise<boolean> {
    return this.userServie.delete(id);
  }

  @Post('change-pass')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ description: 'Change password successfully.' })
  @ApiBadRequestResponse({ description: 'Old pass not match' })
  changePass(
    @Body() dto: ChangePassUserDto,
    @GetUser('id') id: number,
  ): Promise<string> {
    return this.userServie.changPassword(id, dto);
  }

  @Put(':id/block')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ description: 'Block user created successfully.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  async block(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.userServie.block(id);
  }
}
