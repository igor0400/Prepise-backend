import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';

interface FavouriteUserCreationArgs {
   userId: number;
   itemId: number;
}

@Table({
   tableName: 'FAVOURITE_USERS',
   timestamps: false,
})
export class FavouriteUser extends Model<
   FavouriteUser,
   FavouriteUserCreationArgs
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

   @ForeignKey(() => User)
   @Column({
      type: DataType.INTEGER,
      allowNull: false,
   })
   itemId: number;
}
