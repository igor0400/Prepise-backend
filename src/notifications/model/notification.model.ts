import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';

interface NotificationCreationArgs {
  userId: number;
  text: string;
  link: string;
}

@Table({ tableName: 'NOTIFICATIONS' })
export class Notification extends Model<
  Notification,
  NotificationCreationArgs
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  text: string;

  @Column({
    type: DataType.STRING,
  })
  link: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  viewed: boolean;
}
