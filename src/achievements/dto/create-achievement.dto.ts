import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateAchievementDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  readonly title: string;
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  readonly description: string;
  @IsNotEmpty()
  @IsNumber()
  readonly maxProgress: number;
  @IsOptional()
  @IsString()
  @MaxLength(500)
  readonly link?: string;
}
