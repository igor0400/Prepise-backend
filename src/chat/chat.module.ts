import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChatMessage } from './models/chat-message.model';
import { User } from 'src/users/models/user.model';
import { ChatUser } from './models/chat-users.model';
import { Chat } from './models/chat.model';

@Module({
   providers: [ChatService, ChatGateway],
   imports: [
      SequelizeModule.forFeature([Chat, ChatMessage, ChatUser, User]),
      JwtModule.register({
         secret: process.env.PRIVATE_KEY,
         signOptions: {
            expiresIn: process.env.JWT_EXPIRES_IN,
         },
      }),
   ],
})
export class ChatModule {}
