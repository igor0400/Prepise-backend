import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class ChangeAchievementDto {
  readonly achievementId: number;
  
  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly title?: string;
  @IsOptional()
  @IsString()
  @MaxLength(500)
  readonly description?: string;
  @IsOptional()
  @IsNumber()
  readonly maxProgress?: number;
  @IsOptional()
  @IsString()
  @MaxLength(500)
  readonly link?: string;
}
