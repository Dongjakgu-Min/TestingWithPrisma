import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = await context.switchToHttp().getRequest();
    const token = req.headers['access-token'];

    if (!token) throw new UnauthorizedException();

    const user = await this.authService.verifyToken(token);

    req.user = user;

    return !!user;
  }
}
