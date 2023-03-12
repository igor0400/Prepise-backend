import {
   IsArray,
   IsBoolean,
   IsEnum,
   IsNotEmpty,
   IsNumber,
   IsOptional,
   IsString,
   MaxLength,
} from 'class-validator';

export class CreateBlockDto {
   @IsNotEmpty()
   @IsString()
   @MaxLength(100)
   readonly title: string;

   @IsNotEmpty()
   @IsString()
   readonly description: string;

   @IsNotEmpty()
   @IsString()
   readonly type: 'default' | 'test';

   @IsNotEmpty()
   @IsNumber()
   readonly authorId: number;

   @IsNotEmpty()
   @IsString()
   @MaxLength(100)
   readonly section: string;

   @IsNotEmpty()
   @IsArray()
   readonly tags: string[];

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
   @IsString()
   @MaxLength(100)
   readonly interviewCompany?: string;

   @IsOptional()
   @IsNumber()
   readonly maxProgress?: number;

   @IsOptional()
   @IsArray()
   readonly questions?: string[];
}
