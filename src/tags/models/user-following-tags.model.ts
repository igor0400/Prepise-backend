import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';
import { Tag } from './tag.model';

interface UserFollowingTagCreationArgs {
  userId: number;
  tagId: number;
}

@Table({ tableName: 'USER_FOLLOWING_TAGS', timestamps: false })
export class UserFollowingTag extends Model<
  UserFollowingTag,
  UserFollowingTagCreationArgs
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

  @ForeignKey(() => Tag)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  tagId: number;
}
