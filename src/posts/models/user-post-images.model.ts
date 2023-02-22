import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { UserPost } from './user-post.model';

interface UserPostImageCreationArgs {
  postId: number;
  url: string;
}

@Table({ tableName: 'USER_POST_IMAGES', timestamps: false })
export class UserPostImage extends Model<
  UserPostImage,
  UserPostImageCreationArgs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => UserPost)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  postId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  url: string;
}
