import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class EmailVerifyDto {
   @IsNotEmpty()
   @IsEmail()
   @MaxLength(100)
   readonly email: string;
}
