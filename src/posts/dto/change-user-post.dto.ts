import { IsNotEmpty, IsString } from "class-validator";

export class ChangeUserPostDto {
  readonly userId: number;
  readonly userPostId: number;

  @IsNotEmpty()
  @IsString()
  readonly text?: string;
}
