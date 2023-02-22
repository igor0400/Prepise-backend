import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';
import { UserPostImage } from './user-post-images.model';

interface UserPostCreationArgs {
  userId: number;
  text: string;
}

@Table({ tableName: 'USER_POSTS' })
export class UserPost extends Model<UserPost, UserPostCreationArgs> {
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

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  text: string;

  @HasMany(() => UserPostImage)
  images: UserPostImage[];
}
