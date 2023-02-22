import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  HasOne,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';
import { NotifiSettings } from './notifi-settings.model';

interface SettingsCreationArgs {
  userId: number;
}

@Table({ tableName: 'SETTINGS' })
export class Settings extends Model<Settings, SettingsCreationArgs> {
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

  @HasOne(() => NotifiSettings)
  notifications: NotifiSettings;
}
