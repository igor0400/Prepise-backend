import { IsOptional, IsString, MaxLength } from "class-validator";

export class ChangeUserDto {
  readonly userId: number;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  readonly location?: string;

  @IsOptional()
  readonly tags?: string[] | string;
}
