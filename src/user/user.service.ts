import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private Prisma: PrismaService) {}

  async createUser(userDto: CreateUserDto): Promise<User> {
    const check = await this.Prisma.user.findFirst({
      where: {
        username: userDto.username,
      },
    });

    if (check) throw new ConflictException();

    return this.Prisma.user.create({
      data: {
        username: userDto.username,
        password: await bcrypt.hash(userDto.password, 12),
      },
    });
  }

  async findUser(username: string) {
    const user = await this.Prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) throw new NotFoundException();

    return user;
  }

  async updateUser(userId: number, userDto: UpdateUserDto) {
    await this.Prisma.user.findFirstOrThrow({
      where: {
        username: userDto.username,
      },
    });

    if (userDto.password) return this.changePassword(userId, userDto);
    if (userDto.username) return this.changeUsername(userId, userDto);

    throw new BadRequestException();
  }

  private async changePassword(userId, userDto: UpdateUserDto) {
    return this.Prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: await bcrypt.hash(userDto.password, 12),
      },
    });
  }

  private async changeUsername(userId, userDto: UpdateUserDto) {
    return this.Prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username: userDto.username,
      },
    });
  }
}
