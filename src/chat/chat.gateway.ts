import { Req, UseGuards } from '@nestjs/common';
import {
   MessageBody,
   SubscribeMessage,
   WebSocketGateway,
   WebSocketServer,
} from '@nestjs/websockets';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CustomReq } from 'src/types/request-type';
import { ChatService } from './chat.service';
import { ChangeMessageDto } from './dto/change-message.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { DeleteChatDto } from './dto/delete-chat.dto';
import { Server } from 'socket.io';

@WebSocketGateway(9090, { namespace: 'chat', cors: '*' })
export class ChatGateway {
   constructor(private chatService: ChatService) {}

   @WebSocketServer()
   server: Server;

   @UseGuards(JwtAuthGuard)
   @SubscribeMessage('start')
   async handleStart(@Req() req: CustomReq): Promise<void> {
      const response = await this.chatService.getUserChats(+req.user.sub);
      this.server.emit('start', response);
   }

   @UseGuards(JwtAuthGuard)
   @SubscribeMessage('new-message')
   async handleNewMessage(
      @MessageBody() dto: CreateMessageDto,
      @Req() req: CustomReq,
   ): Promise<void> {
      const response = await this.chatService.createMessage({
         ...dto,
         authorId: +req.user.sub,
      });
      this.server.emit('new-message', response);
   }

   @UseGuards(JwtAuthGuard)
   @SubscribeMessage('change-message')
   async handleChangeMessage(
      @MessageBody() dto: ChangeMessageDto,
      @Req() req: CustomReq,
   ): Promise<void> {
      const response = await this.chatService.changeMessage({
         ...dto,
         authorId: +req.user.sub,
      });
      this.server.emit('change-message', response);
   }

   @UseGuards(JwtAuthGuard)
   @SubscribeMessage('delete-message')
   async handleDeleteMessage(
      @MessageBody() messageId: number,
      @Req() req: CustomReq,
   ): Promise<void> {
      const response = await this.chatService.deleteMessage(
         messageId,
         +req.user.sub,
      );
      this.server.emit('delete-message', response);
   }

   @UseGuards(JwtAuthGuard)
   @SubscribeMessage('new-chat')
   async handleNewChat(
      @MessageBody() dto: CreateChatDto,
      @Req() req: CustomReq,
   ): Promise<void> {
      const response = await this.chatService.createChat(
         {
            ...dto,
         },
         +req.user.sub,
      );
      this.server.emit('new-chat', response);
   }

   @UseGuards(JwtAuthGuard)
   @SubscribeMessage('delete-chat')
   async handleDeleteChat(
      @MessageBody() dto: DeleteChatDto,
      @Req() req: CustomReq,
   ): Promise<void> {
      const response = await this.chatService.deleteChat({
         ...dto,
         authorId: +req.user.sub,
      });
      this.server.emit('delete-chat', response);
   }
}
