import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateBUUIDto {
  @IsNotEmpty()
  @IsNumber()
  readonly blockId: number;

  @IsNotEmpty()
  @IsNumber()
  readonly userId: number;
}
