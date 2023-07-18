import { Module } from '@nestjs/common';
import { MemoController } from './memo.controller';
import { MemoService } from './memo.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [MemoController],
  providers: [MemoService, PrismaService],
  imports: [AuthModule],
})
export class MemoModule {}
