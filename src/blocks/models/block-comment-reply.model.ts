import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';
import { BlockComment } from './block-comment.model';

interface BlockCommentReplyCreationArgs {
  blockCommentId: number;
  authorId: number;
  text: string;
}

@Table({ tableName: 'BLOCKS_COMMENTS_REPLIES' })
export class BlockCommentReply extends Model<
  BlockCommentReply,
  BlockCommentReplyCreationArgs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => BlockComment)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  blockCommentId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  authorId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  text: string;

  @BelongsTo(() => BlockComment)
  blockComment: BlockComment;

  @BelongsTo(() => User)
  user: User;
}
