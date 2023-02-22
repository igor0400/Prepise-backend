import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateNotifiSettingsDto {
  @IsNotEmpty()
  @IsNumber()
  readonly settingsId: number;

  @IsOptional()
  @IsBoolean()
  readonly all?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly messages?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly testReplies?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly newSubs?: boolean;
}
