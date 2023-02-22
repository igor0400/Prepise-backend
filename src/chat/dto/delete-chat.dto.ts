import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class DeleteChatDto {
   readonly authorId: number;
   @IsNotEmpty()
   @IsNumber()
   readonly chatId: number;

   @IsOptional()
   @IsBoolean()
   readonly deleteMessages?: boolean;
}
