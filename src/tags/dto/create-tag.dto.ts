import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateTagDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  readonly description: string;
  
  readonly authorId: number;
}
