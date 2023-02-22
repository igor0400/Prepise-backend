import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class ChangeMessageDto {
   readonly authorId: number;

   @IsNotEmpty()
   @IsNumber()
   readonly messageId: number;

   @IsNotEmpty()
   @IsString()
   @MaxLength(1000)
   readonly value: string;
}
