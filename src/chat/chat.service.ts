import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/models/user.model';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChatUser } from './models/chat-users.model';
import { Chat } from './models/chat.model';
import { ChatMessage } from './models/chat-message.model';
import { DeleteChatDto } from './dto/delete-chat.dto';
import { ChangeMessageDto } from './dto/change-message.dto';

@Injectable()
export class ChatService {
   constructor(
      @InjectModel(Chat)
      private chatRepository: typeof Chat,
      @InjectModel(ChatMessage)
      private chatMessageRepository: typeof ChatMessage,
      @InjectModel(ChatUser)
      private chatUserRepository: typeof ChatUser,
      @InjectModel(User)
      private userRepository: typeof User,
   ) {}

   async getUserChats(userId: number) {
      const chats = [];
      const userChats = await this.chatUserRepository.findAll({
         where: { userId },
      });

      for (let uchat of userChats) {
         chats.push(
            await this.chatRepository.findByPk(uchat.chatId, {
               include: { all: true },
            }),
         );
      }

      return chats;
   }

   async createMessage(dto: CreateMessageDto) {
      const { authorId, chatId } = dto;
      const foundedUser = await this.isUserInChat(authorId, chatId);

      if (foundedUser) {
         const message = await this.chatMessageRepository.create(dto);
         return message;
      } else {
         throw new HttpException(
            `Пользователь с id: ${authorId} найден`,
            HttpStatus.NOT_FOUND,
         );
      }
   }

   async changeMessage(dto: ChangeMessageDto) {
      const { authorId, messageId, value } = dto;

      const message = await this.chatMessageRepository.findOne({
         where: { id: messageId, authorId },
      });

      if (!message) {
         throw new HttpException(
            `Сообщение с id ${messageId} не найдено`,
            HttpStatus.NOT_FOUND,
         );
      }

      message.value = value;

      return message.save();
   }

   async deleteMessage(messId: number, authorId: number) {
      await this.chatMessageRepository.destroy({
         where: { id: messId, authorId },
      });

      return `Сообщение с id ${messId} удалено`;
   }

   async createChat(dto: CreateChatDto, authorId: number) {
      const chat = await this.chatRepository.create();
      const users: ChatUser[] = [];

      await this.chatUserRepository.create({
         userId: authorId,
         chatId: chat.id,
      });

      if (dto.users) {
         for (let args of dto.users) {
            const user = await this.userRepository.findByPk(args.userId);
            if (user) {
               users.push(
                  await this.chatUserRepository.create({
                     ...args,
                     chatId: chat.id,
                  }),
               );
            } else {
               throw new HttpException(
                  `Пользователь с id: ${args.userId} найден`,
                  HttpStatus.NOT_FOUND,
               );
            }
         }
      }

      return await this.chatRepository.findOne({
         where: { id: chat.id },
         include: { all: true },
      });
   }

   async deleteChat(dto: DeleteChatDto) {
      const { chatId, authorId } = dto;

      const chat = await this.chatRepository.findByPk(chatId, {
         include: { all: true },
      });

      for (let key of chat.users) {
         if (key.id === authorId) {
            await this.chatUserRepository.destroy({
               where: { userId: key.id, chatId: chatId },
            });
            if (dto?.deleteMessages) {
               await this.chatMessageRepository.destroy({
                  where: { chatId, authorId: key.id },
               });
            }
         }
      }

      return `Пользователь ${authorId} удален из чата ${chatId}`;
   }

   private async isUserInChat(userId: number, chatId: number) {
      const chat = await this.chatRepository.findByPk(chatId, {
         include: { all: true },
      });

      let foundedUser = false;

      for (let user of chat?.users) {
         if (user?.id === userId) {
            foundedUser = true;
         }
      }

      return foundedUser;
   }
}
