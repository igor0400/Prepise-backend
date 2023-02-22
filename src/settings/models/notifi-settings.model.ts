import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Settings } from './settings.model';

interface NotifiSettingsCreationArgs {
  settingsId: number;
  all: boolean;
  messages: boolean;
  testReplies: boolean;
  newSubs: boolean;
}

@Table({ tableName: 'NOTIFI_SETTINGS' })
export class NotifiSettings extends Model<
  NotifiSettings,
  NotifiSettingsCreationArgs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Settings)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  settingsId: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  all: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  messages: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  testReplies: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  newSubs: boolean;
}
