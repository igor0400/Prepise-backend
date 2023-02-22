import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';
import { TestBlockInfo } from './test-block-info.model';

interface TBUPCreationArgs {
  testBlockInfoId: number;
  userId: number;
}

@Table({ tableName: 'TEST_BLOCKS_USER_PROGRESS' })
export class TestBlockUserProgress extends Model<
  TestBlockUserProgress,
  TBUPCreationArgs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => TestBlockInfo)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  testBlockInfoId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  currentProgress: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  accepted: number;

  @BelongsTo(() => TestBlockInfo)
  testBlockInfo: TestBlockInfo;
}
