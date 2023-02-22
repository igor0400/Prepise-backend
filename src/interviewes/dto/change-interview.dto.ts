import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ChangeInterviewDto {
  readonly id: number;
  readonly userId: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  readonly title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  readonly date?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  readonly remindDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly position?: string;
}
