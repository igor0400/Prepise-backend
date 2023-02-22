import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class BanQuestionDto {
  readonly questionId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  readonly banReason: string;
}
