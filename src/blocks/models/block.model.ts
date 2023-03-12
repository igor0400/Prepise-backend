import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  HasOne,
  BelongsToMany,
} from 'sequelize-typescript';
import { BanBlock } from 'src/banned/models/banned-blocks.model';
import { Question } from 'src/questions/models/question.model';
import { BlockTag } from 'src/tags/models/block-tag.model';
import { Tag } from 'src/tags/models/tag.model';
import { User } from 'src/users/models/user.model';
import { BlockComment } from './block-comment.model';
import { BlockQuestion } from './block-question.model';
import { BlockUsedUserInfo } from './block-used-user-info.model';
import { TestBlockInfo } from './test-block-info.model';

interface BlockCreationArgs {
  authorId: number;
  title: string;
  description: string;
  section: string;
  commented?: boolean;
  interviewPosition?: string;
}

@Table({ tableName: 'BLOCKS' })
export class Block extends Model<Block, BlockCreationArgs> {
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
  authorId: number;

  @Column({
    type: DataType.STRING,
  })
  title: string;

  @Column({
    type: DataType.ENUM('default', 'test'),
    allowNull: false,
  })
  type: 'default' | 'test';

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  commented: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  interviewPosition: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  section: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  likes: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  dislikes: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  viewes: number;

  @HasOne(() => TestBlockInfo)
  testBlockInfo: TestBlockInfo;

  @BelongsToMany(() => Question, () => BlockQuestion)
  questions: Question[];

  @HasOne(() => BanBlock)
  banned: BanBlock;

  @HasMany(() => BlockUsedUserInfo)
  usedUsersInfo: BlockUsedUserInfo[];

  @HasMany(() => BlockComment)
  comments: BlockComment[];

  @BelongsToMany(() => Tag, () => BlockTag)
  tags: Tag[];

  @BelongsTo(() => User)
  user: User;
}
