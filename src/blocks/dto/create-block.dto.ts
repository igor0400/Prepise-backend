import {
   IsEnum,
   IsNotEmpty,
   IsOptional,
   IsString,
   MaxLength,
} from 'class-validator';

export class CreateBlockDto {
   readonly authorId: number;
   readonly type: 'default' | 'test';

   @IsNotEmpty()
   @IsString()
   @MaxLength(50, { message: 'Поле title должно быть длиннее 50 символов' })
   readonly title: string;

   @IsNotEmpty()
   @IsString()
   readonly content: string;

   @IsNotEmpty()
   @IsString()
   @MaxLength(100)
   readonly section: string;

   @IsNotEmpty()
   readonly tags: string[] | string;

   @IsNotEmpty()
   readonly questions: string[] | string;

   @IsOptional()
   @IsString()
   @MaxLength(300)
   readonly description?: string;

   @IsOptional()
   @IsEnum(['true', 'false'], {
      message: 'Поле commented должно быть true или false',
   })
   readonly commented?: 'true' | 'false';
}
