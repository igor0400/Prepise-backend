import {
   IsArray,
   IsEnum,
   IsNumber,
   IsObject,
   IsOptional,
   IsString,
   MaxLength,
} from 'class-validator';

export class ChangeBlockDto {
   readonly authorId: number;

   @IsOptional()
   @IsString()
   @MaxLength(100)
   readonly title?: string;

   @IsOptional()
   @IsString()
   @MaxLength(100)
   readonly description?: string;

   @IsOptional()
   @IsString()
   readonly content?: string;

   @IsOptional()
   @IsString()
   @MaxLength(100)
   readonly section?: string;

   @IsOptional()
   readonly tags?: string[] | string;

   @IsOptional()
   @IsEnum(['true', 'false'], {
      message: 'Поле commented должно быть true или false',
   })
   readonly commented?: 'true' | 'false';

   @IsOptional()
   readonly questions?: string[] | string;
}
