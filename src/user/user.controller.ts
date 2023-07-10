import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() userDto: CreateUserDto) {
    return this.userService.createUser(userDto);
  }

  @Patch('/:id')
  async updateUser(@Param('id') userId, @Body() userDto: UpdateUserDto) {
    return this.userService.updateUser(userId, userDto);
  }
}
