import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';

interface UserFollowingUserCreationArgs {
  userId: number;
  followedUserId: number;
}

@Table({
  tableName: 'USER_FOLLOWING_USERS',
  timestamps: false,
})
export class UserFollowingUser extends Model<
  UserFollowingUser,
  UserFollowingUserCreationArgs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  followedUserId: number;
}
