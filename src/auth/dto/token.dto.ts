import { IsOptional, IsString } from "class-validator";

export class TokenDto {
  @IsOptional()
  @IsString()
  readonly authorization?: string;
}
