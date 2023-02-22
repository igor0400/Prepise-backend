import { IsOptional, IsString, MaxLength } from "class-validator";

export class ChangeUserDto {
  readonly userId: number;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly type?: 'company' | 'user';

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  readonly location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  readonly summary?: string;

  @IsOptional()
  readonly tags?: string[] | string;
}
