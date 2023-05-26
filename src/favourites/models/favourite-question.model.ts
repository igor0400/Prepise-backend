import {
   Column,
   Model,
   Table,
   DataType,
   ForeignKey,
} from 'sequelize-typescript';
import { Question } from 'src/questions/models/question.model';
import { User } from 'src/users/models/user.model';

interface FavouriteQuestionCreationArgs {
   userId: number;
   itemId: number;
}

@Table({
   tableName: 'FAVOURITE_QUESTIONS',
   timestamps: false,
})
export class FavouriteQuestion extends Model<
   FavouriteQuestion,
   FavouriteQuestionCreationArgs
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
   itemId: number;
}
