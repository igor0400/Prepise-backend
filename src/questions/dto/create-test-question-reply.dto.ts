import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTQRDto {
   readonly questionId: number;
   readonly authorId: number;

   @IsNotEmpty()
   @IsString()
   readonly text: string;
}
