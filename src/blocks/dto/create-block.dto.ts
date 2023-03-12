import {
   IsArray,
   IsEnum,
   IsNotEmpty,
   IsNumber,
   IsOptional,
   IsString,
   MaxLength,
} from 'class-validator';

export class CreateBlockDto {
   readonly authorId: number;
   readonly type: 'default' | 'test';

   @IsNotEmpty()
   @IsString()
   @MaxLength(100)
   readonly title: string;

   @IsNotEmpty()
   @IsString()
   @MaxLength(100)
   readonly description: string;

   @IsNotEmpty()
   @IsString()
   readonly content: string;

   @IsNotEmpty()
   @IsString()
   @MaxLength(100)
   readonly section: string;

   @IsNotEmpty()
   @IsArray()
   readonly tags: string[];

   @IsNotEmpty()
   @IsArray()
   readonly questions: string[];

   @IsOptional()
   @IsNumber()
   readonly maxProgress?: number;

   @IsOptional()
   @IsEnum(['true', 'false'], {
      message: 'Поле commented должно быть true или false',
   })
   readonly commented?: 'true' | 'false';
}
