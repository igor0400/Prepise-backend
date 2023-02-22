import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateBlockCommentReplyDto {
  @IsNotEmpty()
  @IsNumber()
  readonly blockCommentId: number;

  @IsNotEmpty()
  @IsNumber()
  readonly authorId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10000)
  readonly text: string;
}
