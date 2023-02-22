import { IsNotEmpty, IsString } from "class-validator";

export class CreateTQRDto {
  readonly questionId: string;
  readonly authorId: number;
  
  @IsNotEmpty()
  @IsString()
  readonly text: string;
}
