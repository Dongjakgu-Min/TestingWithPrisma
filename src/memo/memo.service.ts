import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IUser } from '../auth/auth.dto';
import { CreateMemoDto, UpdateMemoDto } from './memo.dto';

@Injectable()
export class MemoService {
  constructor(private prismaService: PrismaService) {}

  async createMemo(userDto: IUser, memoDto: CreateMemoDto) {
    const data = await this.prismaService.memo.create({
      data: memoDto,
    });

    return { data };
  }

  async updateMemo(userDto: IUser, memoId: number, memoDto: UpdateMemoDto) {
    await this.findAllMemoNotDeleted(userDto.userId, memoId);

    const data = await this.prismaService.memo.update({
      where: {
        id: memoId,
      },
      data: memoDto,
    });

    return { data };
  }

  async deleteMemo(userDto: IUser, memoId: number) {
    await this.findAllMemoNotDeleted(userDto.userId, memoId);

    const data = await this.prismaService.memo.update({
      where: {
        id: memoId,
      },
      data: { deletedAt: new Date() },
    });

    return { data };
  }

  private async findAllMemoNotDeleted(userId: number, memoId: number) {
    const memo = await this.prismaService.memo.findFirst({
      where: {
        id: memoId,
        deletedAt: null,
      },
    });

    if (!memo) throw new NotFoundException();
    if (memo.userId !== userId) throw new UnauthorizedException();

    return memo;
  }
}
