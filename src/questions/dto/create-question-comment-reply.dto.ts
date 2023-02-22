import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateQuestionCommentReplyDto {
  readonly questionCommentId: number;
  readonly authorId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10000)
  readonly text: string;
}
