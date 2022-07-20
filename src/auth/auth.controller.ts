import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @ApiOkResponse({ description: 'Signin successfully.' })
  @ApiBadRequestResponse({ description: 'Your account has been blocked.' })
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
}
