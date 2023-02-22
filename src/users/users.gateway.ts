import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UnauthorizedException } from '@nestjs/common';
import { TokensService } from 'src/auth/tokens.service';
import { UsersService } from './users.service';
import { Server } from 'socket.io';

@WebSocketGateway(9090, { namespace: 'users', cors: '*' })
export class UsersGateway {
   constructor(
      private tokensService: TokensService,
      private usersService: UsersService,
   ) {}

   @WebSocketServer()
   server: Server;

   async handleConnection(socket: Socket) {
      const data = await this.connectionGuard(socket);

      if (data) {
         this.server.emit('user-connect', data?.user?.id);
         return this.usersService.changeUserOnline(data?.user?.id, true);
      } else {
         socket.disconnect(true);
      }
   }

   async handleDisconnect(socket: Socket) {
      const data = await this.connectionGuard(socket);

      if (data) {
         this.server.emit('user-disconnect', data?.user?.id);
         return this.usersService.changeUserOnline(data?.user?.id, false);
      }
   }

   private async connectionGuard(socket: Socket) {
      const authHeader = socket?.handshake?.headers?.authorization;
      const bearer = authHeader?.split(' ')[0];
      const token = authHeader?.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
         throw new UnauthorizedException({
            message: 'Пользователь не авторизован',
         });
      }

      const data = await this.tokensService.resolveUserFromAccessToken(token);
      return data;
   }
}
