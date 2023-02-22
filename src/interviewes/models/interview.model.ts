import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';

interface InterviewCreationArgs {
  userId: number;
  title: string;
  date: string;
  remindDate: string;
  position: string;
}

@Table({ tableName: 'INTERVIEWES' })
export class Interview extends Model<Interview, InterviewCreationArgs> {
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
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  date: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  remindDate: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  position: string;
}
