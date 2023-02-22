import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  readonly value: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  readonly description: string;
}
