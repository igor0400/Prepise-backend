import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Question } from 'src/questions/models/question.model';
import { Tag } from './tag.model';

interface QuestionTagCreationArgs {
  questionId: number;
  tagId: number;
}

@Table({ tableName: 'QUESTION_TAGS', timestamps: false })
export class QuestionTag extends Model<QuestionTag, QuestionTagCreationArgs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Question)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  questionId: number;

  @ForeignKey(() => Tag)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  tagId: number;
}
