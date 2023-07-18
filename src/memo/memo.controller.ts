import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MemoService } from './memo.service';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../user/user.decorator';
import { IUser } from '../auth/auth.dto';
import { CreateMemoDto, UpdateMemoDto } from './memo.dto';

@Controller('memo')
export class MemoController {
  constructor(private memoService: MemoService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createMemo(@User() user: IUser, @Body() memoDto: CreateMemoDto) {
    return this.memoService.createMemo(user, memoDto);
  }

  @Delete('/:memoId')
  @UseGuards(AuthGuard)
  async deleteMemo(@User() user: IUser, @Param('memoId') memoId: number) {
    return this.memoService.deleteMemo(user, memoId);
  }

  @Patch('/:memoId')
  @UseGuards(AuthGuard)
  async patchMemo(
    @User() user: IUser,
    @Param('memoId') memoId: number,
    @Body() memoDto: UpdateMemoDto,
  ) {
    return this.memoService.patchMemo(user, memoId, memoDto);
  }
}
