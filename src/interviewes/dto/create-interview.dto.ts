import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateInterviewDto {
   readonly userId: number;

   @IsNotEmpty()
   @IsString()
   @MaxLength(50)
   readonly title: string;

   @IsNotEmpty()
   @IsString()
   @MaxLength(50)
   readonly date: string;

   @IsNotEmpty()
   @IsString()
   @MaxLength(50)
   readonly remindDate: string;

   @IsNotEmpty()
   @IsString()
   @MaxLength(100)
   readonly position: string;
}
