import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMessageDto {
   readonly authorId: number;
   @IsNotEmpty()
   @IsNumber()
   readonly chatId: number;

   @IsNotEmpty()
   @IsString()
   @MaxLength(1000)
   readonly value: string;

   @IsOptional()
   @IsString()
   readonly type?: 'default' | 'system';
}
