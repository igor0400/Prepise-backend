import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Block } from './block.model';

interface TBICreationArgs {
  blockId: number;
  maxProgress: number;
}

@Table({ tableName: 'TEST_BLOCKS_INFO' })
export class TestBlockInfo extends Model<TestBlockInfo, TBICreationArgs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Block)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  blockId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  maxProgress: number;

  @BelongsTo(() => Block)
  block: Block;
}
