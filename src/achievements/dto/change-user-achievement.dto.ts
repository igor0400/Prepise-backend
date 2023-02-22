import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class ChangeUserAchievementDto {
  readonly userId: number;
  readonly userAchievementId: number;
  
  @IsOptional()
  @IsNumber()
  readonly userProggres?: number;
}
