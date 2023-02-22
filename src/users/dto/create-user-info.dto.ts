import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserInfoDto {
  readonly userId: number;

  @IsNotEmpty()
  @IsString()
  readonly gender: 'male' | 'female';
}
