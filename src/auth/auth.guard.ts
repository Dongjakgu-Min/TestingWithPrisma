import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = await this.authService.verifyToken(req['access_token']);

    req.user = user;

    return !!user;
  }
}
