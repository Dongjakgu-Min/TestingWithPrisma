import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

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
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('Create User', async () => {
    const result = await service.createUser({
      username: 'iamdjkoo',
      password: 'blabla',
    });

    expect(result).toHaveProperty('username');
    expect(result).toHaveProperty('password');
    expect(result.username).toEqual('iamdjkoo');
  });

  it('Patch Username', async () => {
    prismaService.user.update = jest.fn().mockReturnValueOnce({
      username: 'jangnara',
      password: 'asdf',
    });

    const result = await service.updateUser(1, {
      username: 'jangnara',
    });

    expect(result.username).toEqual('jangnara');
  });

  it('Patch Password', async () => {
    prismaService.user.update = jest.fn().mockReturnValueOnce({
      username: 'jangnara',
      password: 'asdf',
    });

    const result = await service.updateUser(1, {
      password: 'aaaa',
    });

    expect(result).toHaveProperty('password');
  });
});
