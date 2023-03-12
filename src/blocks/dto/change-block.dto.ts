import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class ChangeBlockDto {
   @IsNotEmpty()
   @IsString()
   readonly type: 'default' | 'test';

   @IsNotEmpty()
   @IsNumber()
   readonly authorId: number;

   @IsOptional()
   @IsString()
   @MaxLength(100)
   readonly title?: string;

   @IsOptional()
   @IsString()
   readonly description?: string;

   @IsOptional()
   @IsString()
   @MaxLength(100)
   readonly section?: string;

   @IsOptional()
   @IsArray()
   readonly tags?: string[];

   @IsOptional()
   @IsEnum(['true', 'false'], {
      message: 'Поле commented должно быть true или false',
   })
   readonly commented?: 'true' | 'false';

   @IsOptional()
   @IsString()
   @MaxLength(100)
   readonly interviewPosition?: string;

   @IsOptional()
   @IsNumber()
   readonly maxProgress?: number;

   @IsOptional()
   @IsArray()
   readonly questions?: string[];

   @IsOptional()
   @IsObject()
   readonly defaultBlockInfo?: { interviewCompany: string };
}
