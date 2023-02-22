import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Question } from 'src/questions/models/question.model';
import { User } from 'src/users/models/user.model';

interface FavouriteTestQuestionCreationArgs {
  userId: number;
  testQuestionId: number;
}

@Table({
  tableName: 'FAVOURITE_TEST_QUESTIONS',
  timestamps: false,
})
export class FavouriteTestQuestion extends Model<
  FavouriteTestQuestion,
  FavouriteTestQuestionCreationArgs
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

  @ForeignKey(() => Question)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  testQuestionId: number;
}
