import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class BanBlockDto {
  readonly blockId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  readonly banReason: string;
}
