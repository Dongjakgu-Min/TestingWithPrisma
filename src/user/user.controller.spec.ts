import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserController', () => {
  let controller: UserController;
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
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('Post User Information', async () => {
    const result = await controller.createUser({
      username: 'iamdjkoo',
      password: 'blabla',
    });

    expect(result).toHaveProperty('username');
    expect(result.username).toEqual('iamdjkoo');
  });

  it('Patch Username', async () => {
    prismaService.user.update = jest.fn().mockReturnValueOnce({
      username: 'jangnara',
      password: 'asdf',
    });
    const result = await controller.updateUser(1, { username: 'jangnara' });

    expect(result.username).toEqual('jangnara');
  });

  it('Patch Username', async () => {
    prismaService.user.update = jest.fn().mockReturnValueOnce({
      username: 'iamdjkoo',
      password: 'qwer',
    });

    const result = await controller.updateUser(1, { password: 'qwer' });

    expect(result.password).toEqual('qwer');
  });
});
