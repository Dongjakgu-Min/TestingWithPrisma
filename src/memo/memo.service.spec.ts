import { Test, TestingModule } from '@nestjs/testing';
import { MemoService } from './memo.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('MemoService', () => {
  let service: MemoService;
  let prisma: PrismaService;

  const mockPrisma = {
    user: {
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest
        .fn()
        .mockResolvedValue({ username: 'iamdjkoo', password: 'asdf' }),
      findFirstOrThrow: jest
        .fn()
        .mockResolvedValue({ username: 'iamdjkoo', password: 'asdf' }),
    },
    memo: {
      create: jest.fn().mockResolvedValue({
        id: 1,
        userId: 1,
        title: 'blabla',
        text: 'blablabla',
      }),
      findFirst: jest.fn().mockResolvedValue({
        id: 1,
        userId: 1,
        title: 'blabla',
        text: 'blablabla',
      }),
      update: jest.fn().mockResolvedValue({
        id: 1,
        userId: 1,
        title: 'abcdef',
        text: 'blablabla',
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemoService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<MemoService>(MemoService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('Create Memo', async () => {
    const result = await service.createMemo(
      {
        userId: 1,
        username: 'orange',
        password: 'pineapple',
      },
      {
        title: 'blabla',
        text: 'blablabla',
      },
    );

    expect(result).toEqual({
      data: { id: 1, title: 'blabla', text: 'blablabla', userId: 1 },
    });
  });

  it('Update Memo Title', async () => {
    const result = await service.patchMemo(
      {
        userId: 1,
        username: 'orange',
        password: 'pineapple',
      },
      1,
      {
        title: 'abcdef',
      },
    );

    expect(result).toEqual({
      data: {
        id: 1,
        title: 'abcdef',
        text: 'blablabla',
        userId: 1,
      },
    });
  });

  it('Update Memo Text', async () => {
    prisma.memo.update = jest.fn().mockReturnValueOnce({
      id: 1,
      title: 'blabla',
      text: 'abcdef',
      userId: 1,
    });

    const result = await service.patchMemo(
      {
        userId: 1,
        username: 'orange',
        password: 'pineapple',
      },
      1,
      {
        text: 'abcdef',
      },
    );

    expect(result).toEqual({
      data: {
        id: 1,
        title: 'blabla',
        text: 'abcdef',
        userId: 1,
      },
    });
  });

  it('Update Memo Error - Not Found', () => {
    prisma.memo.findFirst = jest.fn().mockReturnValueOnce(null);

    expect(async () => {
      return service.patchMemo(
        {
          userId: 1,
          username: 'orange',
          password: 'pineapple',
        },
        2,
        {
          title: 'abcdef',
        },
      );
    }).rejects.toThrowError(new NotFoundException());
  });

  it('Update Memo Error - Unauthorized', () => {
    expect(async () => {
      return service.patchMemo(
        {
          userId: 2,
          username: 'apple',
          password: 'tuna_pepper',
        },
        1,
        {
          title: 'abcdef',
        },
      );
    }).rejects.toThrowError(new NotFoundException());
  });

  it('Delete Memo', async () => {
    const date = Date.now();

    prisma.memo.findFirst = jest.fn().mockReturnValue({
      id: 1,
      title: 'blabla',
      text: 'blablabla',
      userId: 1,
      deletedAt: null,
    });

    prisma.memo.update = jest.fn().mockReturnValueOnce({
      id: 1,
      title: 'blabla',
      text: 'blablabla',
      deletedAt: date,
    });

    const result = await service.deleteMemo(
      {
        userId: 1,
        username: 'orange',
        password: 'pineapple',
      },
      1,
    );

    expect(result.data.deletedAt).toEqual(date);
  });

  it('Delete Memo Error - Not Found', () => {
    prisma.memo.findFirst = jest.fn().mockReturnValueOnce(null);

    expect(async () => {
      return service.deleteMemo(
        {
          userId: 1,
          username: 'orange',
          password: 'pineapple',
        },
        1,
      );
    }).rejects.toThrowError(new NotFoundException());
  });
});
