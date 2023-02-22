import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';
import { Achievement } from './achievement.model';

interface UserAchievementCreationArgs {
  userId: number;
  achievementId: number;
  userProggres?: number;
}

@Table({ tableName: 'USER_ACHIEVEMENTS', timestamps: false })
export class UserAchievement extends Model<
  UserAchievement,
  UserAchievementCreationArgs
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

  @ForeignKey(() => Achievement)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  achievementId: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  userProggres: number;
}
