import {
   Column,
   Model,
   Table,
   DataType,
   ForeignKey,
} from 'sequelize-typescript';
import { User } from './user.model';

interface UserOnlineCreationArgs {
   userId: number;
   online: boolean;
}

@Table({ tableName: 'USER_ONLINE' })
export class UserOnline extends Model<UserOnline, UserOnlineCreationArgs> {
   @Column({
      type: DataType.INTEGER,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
   })
   id: number;

   @ForeignKey(() => User)
   @Column({
      type: DataType.INTEGER,
      allowNull: false,
   })
   userId: number;

   @Column({
      type: DataType.BOOLEAN,
      defaultValue: false,
   })
   online: boolean;
}
