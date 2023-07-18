import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

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
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
      imports: [UserModule, JwtModule],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('Verify Token', async () => {
    const result = await service.verifyToken('Test Token');
    expect(result.username).toEqual('orange');
  });

  it('Create Token', async () => {
    const result = await service.createToken('orange', 'pineapple');
    expect(result).toEqual('Test Token');
  });

  it('Create Token With Incorrect Password', () => {
    expect(async () => {
      await service.createToken('orange', 'banana');
    }).rejects.toThrowError(new UnauthorizedException());
  });
});
