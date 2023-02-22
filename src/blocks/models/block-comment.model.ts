import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';
import { BlockCommentReply } from './block-comment-reply.model';
import { Block } from './block.model';

interface BlockCommentCreationArgs {
  blockId: number;
  authorId: number;
  text: string;
}

@Table({ tableName: 'BLOCKS_COMMENTS' })
export class BlockComment extends Model<
  BlockComment,
  BlockCommentCreationArgs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Block)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  blockId: number;

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

  @HasMany(() => BlockCommentReply)
  replies: BlockCommentReply[];

  @BelongsTo(() => Block)
  block: Block;

  @BelongsTo(() => User)
  user: User;
}
