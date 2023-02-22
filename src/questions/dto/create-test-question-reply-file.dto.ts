import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateTQRFDto {
  readonly testQuestionReplyId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  readonly url: string;
}
