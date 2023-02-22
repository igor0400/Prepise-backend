import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto {
  readonly userId: number;

  @IsNotEmpty()
  @IsString()
  readonly verifyCode: string;

  @IsNotEmpty()
  @IsString()
  readonly newPassword: string;
}