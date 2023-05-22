import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserFollowingUsersDto {
   readonly followedUserId: number;

   @IsNotEmpty()
   @IsNumber()
   readonly userId: number;
}
