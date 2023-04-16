import {
   IsArray,
   IsEnum,
   IsObject,
   IsOptional,
   IsString,
   MaxLength,
} from 'class-validator';

export class ChangeQuestionDto {
   readonly type: 'default' | 'test';

   @IsOptional()
   @IsString()
   @MaxLength(50, { message: 'Поле title должно быть длиннее 50 символов' })
   readonly title?: string;

   @IsOptional()
   @IsString()
   @MaxLength(100)
   readonly description?: string;

   @IsOptional()
   @IsString()
   readonly content?: string;

   @IsOptional()
   @IsEnum(['true', 'false'], {
      message: 'Поле commented должно быть true или false',
   })
   readonly commented?: 'true' | 'false';

   @IsOptional()
   @IsString()
   @MaxLength(50)
   readonly section?: string;

   @IsOptional()
   @IsString()
   @MaxLength(100)
   readonly interviewPosition?: string;

   @IsOptional()
   @IsArray()
   readonly tags?: string[];

   @IsOptional()
   @IsObject()
   readonly defaultQuestionInfo?: { interviewCompany: string };
}
