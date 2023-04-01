import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateInitialDataDto {
   @IsNotEmpty({ message: 'Поле name обязательно' })
   readonly name: string;

   @IsNotEmpty({ message: 'Поле email обязательно' })
   @IsEmail({}, { message: 'Введите корректный email' })
   readonly email: string;

   @IsNotEmpty({ message: 'Поле password обязательно' })
   @IsString()
   readonly password: string;

   @IsNotEmpty({ message: 'Поле secret обязательно' })
   @IsString()
   readonly secret: string;
}
