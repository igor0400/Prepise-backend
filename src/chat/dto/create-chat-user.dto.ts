import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateChatUserDto {
   @IsNotEmpty()
   @IsNumber()
   readonly userId: number;

   readonly chatId: number;
}
