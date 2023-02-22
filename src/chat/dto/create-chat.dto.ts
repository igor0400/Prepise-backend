import { IsOptional, IsArray } from 'class-validator';
import { CreateChatUserDto } from './create-chat-user.dto';

export class CreateChatDto {
   @IsOptional()
   @IsArray()
   readonly users: CreateChatUserDto[];
}
