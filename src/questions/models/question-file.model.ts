import {
   Column,
   Model,
   Table,
   DataType,
   ForeignKey,
   BelongsTo,
} from 'sequelize-typescript';
import { Question } from './question.model';

interface QuestionFileCreationArgs {
   questionId: number;
   url: string;
   name: string;
   size: number;
}

@Table({ tableName: 'QUESTIONS_FILES', timestamps: false })
export class QuestionFile extends Model<
   QuestionFile,
   QuestionFileCreationArgs
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

   @Column({
      type: DataType.STRING,
      allowNull: false,
   })
   url: string;

   @Column({
      type: DataType.STRING,
      allowNull: false,
   })
   name: string;

   @Column({
      type: DataType.INTEGER,
      allowNull: false,
   })
   size: number;

   @BelongsTo(() => Question)
   question: Question;
}
