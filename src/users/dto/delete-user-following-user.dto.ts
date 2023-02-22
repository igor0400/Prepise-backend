import { IsNotEmpty, IsArray } from 'class-validator';

export class DeleteUserFollowingUsersDto {
  readonly userId: number;

  @IsNotEmpty()
  @IsArray()
  readonly followedUsers: string[];
}
