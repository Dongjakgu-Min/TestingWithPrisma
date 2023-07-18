import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { concatMapTo } from 'rxjs';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockUserService = {
    findUser: jest.fn().mockResolvedValue({
      id: 1,
      username: 'orange',
      password: bcrypt.hashSync('pineapple', 12),
    }),
  };
  const mockJwtService = {
    decode: jest.fn().mockResolvedValue({ username: 'orange' }),
    sign: jest.fn().mockResolvedValue('Test Token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        AuthService,
      ],
      imports: [UserModule, JwtModule],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('Create Token', async () => {
    const result = await controller.getToken({
      id: 1,
      username: 'orange',
      password: 'pineapple',
    });

    expect(result).toEqual('Test Token');
  });
});
