import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateUserAchievementDto {
  readonly userId: number;
  readonly userAchievementId: number;
  
  @IsOptional()
  @IsNumber()
  readonly userProggres?: number;
}
