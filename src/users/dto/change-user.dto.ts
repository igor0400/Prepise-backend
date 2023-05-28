import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class ChangeUserDto {
   readonly userId: number;

   @IsNotEmpty()
   @IsString()
   @MaxLength(30)
   readonly verifyCode: string;

   @IsOptional()
   @IsString()
   @MaxLength(30)
   readonly name?: string;

   @IsOptional()
   @IsString()
   @MaxLength(100)
   readonly email?: string;

   @IsOptional()
   @IsString()
   readonly description?: string;

   @IsOptional()
   @IsString()
   @MaxLength(300)
   readonly location?: string;

   @IsOptional()
   readonly tags?: string[] | string;
}
