import { Column, Model, Table, DataType } from 'sequelize-typescript';

interface AchievementCreationArgs {
  title: string;
  description: string;
  link?: string;
  maxProgress: number;
}

@Table({ tableName: 'ACHIEVEMENTS' })
export class Achievement extends Model<Achievement, AchievementCreationArgs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING,
  })
  link: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  maxProgress: number;
}
