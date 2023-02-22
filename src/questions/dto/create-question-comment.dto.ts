import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateQuestionCommentDto {
  readonly questionId: number;
  readonly authorId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10000)
  readonly text: string;
}
