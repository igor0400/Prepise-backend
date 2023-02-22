import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateNotificationDto {
  readonly userId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  readonly text: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  readonly link?: string;
}
