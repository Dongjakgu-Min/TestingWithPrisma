import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async verifyToken(token: string) {
    const information = this.jwtService.decode(token);
    return this.userService.findUser(information['username']);
  }

  async createToken(username: string, password: string) {
    const user = await this.userService.findUser(username);

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException();
    }

    return this.jwtService.sign({ id: user.id, username: user.username });
  }
}
