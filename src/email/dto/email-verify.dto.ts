import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class EmailVerifyDto {
   @IsNotEmpty()
   @IsEmail({}, { message: 'Введите корректный email' })
   @MaxLength(100)
   readonly email: string;
}
