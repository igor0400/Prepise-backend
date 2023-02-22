import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ChangeTagDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  readonly name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  readonly description?: string;
}
