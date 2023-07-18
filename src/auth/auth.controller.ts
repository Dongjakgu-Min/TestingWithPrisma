import { Body, Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IUser } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/token')
  async getToken(@Body() userDto: IUser) {
    return this.authService.createToken(userDto.username, userDto.password);
  }
}
