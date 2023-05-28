import { IsNotEmpty, IsOptional, IsEmail, IsString } from 'class-validator';

export class LoginRequest {
   @IsNotEmpty({ message: 'Поле email обязательно' })
   @IsString()
   readonly email: string;

   @IsNotEmpty({ message: 'Поле password обязательно' })
   @IsString()
   readonly password: string;

   @IsNotEmpty({ message: 'Поле type обязательно' })
   @IsString()
   readonly type: 'company' | 'user';
}

export class RegisterRequest {
   @IsNotEmpty({ message: 'Поле name обязательно' })
   readonly name: string;

   @IsNotEmpty({ message: 'Поле email обязательно' })
   @IsEmail({}, { message: 'Введите корректный email' })
   readonly email: string;

   @IsNotEmpty({ message: 'Поле emailVerifyCode обязательно' })
   @IsString()
   readonly emailVerifyCode: string;

   @IsNotEmpty({ message: 'Поле password обязательно' })
   @IsString()
   readonly password: string;

   @IsNotEmpty({ message: 'Поле type обязательно' })
   @IsString()
   readonly type: 'company' | 'user';

   @IsOptional({ message: 'Поле gender обязательно' })
   @IsString()
   readonly gender?: 'male' | 'female';
}
