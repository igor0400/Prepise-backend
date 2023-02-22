import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddRoleDto {
  @IsNotEmpty()
  @IsString()
  readonly value: string;

  @IsNotEmpty()
  @IsNumber()
  readonly userId: number;
}
