import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteUserFollowingUsersDto {
   readonly followedUserId: number;

   @IsNotEmpty()
   @IsNumber()
   readonly userId: number;
}
