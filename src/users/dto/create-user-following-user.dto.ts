import { IsNotEmpty, IsArray } from 'class-validator';

export class CreateUserFollowingUsersDto {
  readonly userId: number;

  @IsNotEmpty()
  @IsArray()
  readonly followedUsers: string[];
}
