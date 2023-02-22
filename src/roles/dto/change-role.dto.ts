import { IsOptional, IsString, MaxLength } from "class-validator";

export class ChangeRoleDto {
  readonly roleId: number;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  readonly value?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  readonly description?: string;
}
