import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Tag } from 'src/tags/models/tag.model';
import { User } from 'src/users/models/user.model';

interface FavouriteTagCreationArgs {
   userId: number;
   itemId: number;
}

@Table({
   tableName: 'FAVOURITE_TAGS',
   timestamps: false,
})
export class FavouriteTag extends Model<
   FavouriteTag,
   FavouriteTagCreationArgs
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
   itemId: number;
}
