import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserPostDto {
  readonly userId: number;

  @IsNotEmpty()
  @IsString()
  readonly text: string;
}
