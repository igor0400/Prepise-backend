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
import { BanQuestion } from 'src/banned/models/banned-questions.model';
import { BlockQuestion } from 'src/blocks/models/block-question.model';
import { Block } from 'src/blocks/models/block.model';
import { QuestionTag } from 'src/tags/models/question-tag.model';
import { Tag } from 'src/tags/models/tag.model';
import { User } from 'src/users/models/user.model';
import { DefaultQuestionInfo } from './default-question-info.model';
import { QuestionComment } from './question-comment.model';
import { QuestionFile } from './question-file.model';
import { QuestionImg } from './question-img.model';
import { QuestionUsedUserInfo } from './question-used-user-info.model';
import { TestQuestionInfo } from './test-question-info.model';

interface QuestionCreationArgs {
   authorId: number;
   title: string;
   description: string;
   content: string;
   section: string;
   commented?: boolean;
   interviewPosition?: string;
}

@Table({ tableName: 'QUESTIONS' })
export class Question extends Model<Question, QuestionCreationArgs> {
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
    type: DataType.STRING,
  })
  description: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content: string;

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

  @HasOne(() => DefaultQuestionInfo)
  defaultQuestionInfo: DefaultQuestionInfo;

  @HasOne(() => TestQuestionInfo)
  testQuestionInfo: TestQuestionInfo;

  @HasMany(() => QuestionImg)
  imgs: QuestionImg[];

  @HasMany(() => QuestionFile)
  files: QuestionFile[];

  @HasOne(() => BanQuestion)
  banned: BanQuestion;

  @HasMany(() => QuestionUsedUserInfo)
  usedUsersInfo: QuestionUsedUserInfo[];

  @HasMany(() => QuestionComment)
  comments: QuestionComment[];

  @BelongsToMany(() => Tag, () => QuestionTag)
  tags: Tag[];

  @BelongsToMany(() => Block, () => BlockQuestion)
  block: Block[];

  @BelongsTo(() => User)
  user: User;
}
