import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class BanUserDto {
  readonly userId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  readonly banReason: string;
}
