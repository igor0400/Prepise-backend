import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Question } from 'src/questions/models/question.model';
import { Block } from './block.model';

interface BlockQuestionCreationArgs {
  questionId: number;
  blockId: number;
}

@Table({ tableName: 'BLOCK_QUESTIONS', timestamps: false })
export class BlockQuestion extends Model<
  BlockQuestion,
  BlockQuestionCreationArgs
> {
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

  @ForeignKey(() => Block)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  blockId: number;
}
