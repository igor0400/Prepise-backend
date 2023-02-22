import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateImgAndFileDto {
  readonly questionId: number;
  
  @IsNotEmpty()
  @IsString()
  readonly url: string;
}
