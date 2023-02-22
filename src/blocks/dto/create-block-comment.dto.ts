import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateBlockCommentDto {
  @IsNotEmpty()
  @IsNumber()
  readonly blockId: number;

  @IsNotEmpty()
  @IsNumber()
  readonly authorId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10000)
  readonly text: string;
}
