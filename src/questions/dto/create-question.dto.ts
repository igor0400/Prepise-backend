import {
   IsBoolean,
   IsNotEmpty,
   IsOptional,
   IsString,
   MaxLength,
} from 'class-validator';

export class CreateQuestionDto {
   readonly authorId: number;
   readonly type?: 'default' | 'test';

   @IsString()
   @IsNotEmpty()
   @MaxLength(100)
   readonly title: string;

   @IsString()
   @IsNotEmpty()
   readonly description: string;

   @IsNotEmpty()
   readonly tags: string | string[];

   @IsOptional()
   @IsBoolean()
   readonly commented?: boolean;

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
