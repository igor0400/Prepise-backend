import {
   CanActivate,
   ExecutionContext,
   Injectable,
   UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SecretGuard implements CanActivate {
   canActivate(
      context: ExecutionContext,
   ): boolean | Promise<boolean> | Observable<boolean> {
      try {
         const req = context.switchToHttp().getRequest();
         const secret = req?.body?.secret;

         if (secret !== process.env.SECRET_KEY) {
            throw new UnauthorizedException({
               message: 'Неверный секретный ключ',
            });
         }

         return true;
      } catch (e) {
         throw new UnauthorizedException({
            message: 'Неверный секретный ключ',
         });
      }
   }
}
