import {
   IsEnum,
   IsNotEmpty,
   IsOptional,
   IsString,
   MaxLength,
} from 'class-validator';

export class CreateQuestionDto {
   readonly authorId: number;
   readonly type?: 'default' | 'test';

   @IsNotEmpty()
   @IsString()
   @MaxLength(100, { message: 'поле title должно быть короче 100 символов' })
   readonly title: string;

   @IsOptional()
   @IsString()
   @MaxLength(100)
   readonly description?: string;

   @IsNotEmpty()
   @IsString()
   readonly content: string;

   @IsNotEmpty()
   readonly tags: string | string[];

   @IsOptional()
   @IsEnum(['true', 'false'], {
      message: 'Поле commented должно быть строкой true или false',
   })
   readonly commented?: 'true' | 'false';

   @IsNotEmpty()
   @IsString()
   @MaxLength(100)
   readonly section: string;

   @IsOptional()
   @IsString()
   @MaxLength(100)
   readonly interviewPosition?: string;

   @IsOptional()
   @IsString()
   @MaxLength(100)
   readonly interviewCompany?: string;
}
