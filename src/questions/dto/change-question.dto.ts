import { IsArray, IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString, MaxLength } from "class-validator";

export class ChangeQuestionDto {
  @IsNotEmpty()
  @IsString()
  readonly type: 'default' | 'test';
  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly title?: string;
  @IsOptional()
  @IsString()
  readonly description?: string;
  @IsOptional()
  @IsBoolean()
  readonly commented?: boolean;
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
