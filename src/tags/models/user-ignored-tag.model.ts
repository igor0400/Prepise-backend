import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';
import { Tag } from './tag.model';

interface UserIgnoredTagCreationArgs {
  userId: number;
  tagId: number;
}

@Table({ tableName: 'USER_IGNORED_TAGS', timestamps: false })
export class UserIgnoredTag extends Model<
  UserIgnoredTag,
  UserIgnoredTagCreationArgs
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
