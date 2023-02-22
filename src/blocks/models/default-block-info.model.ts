import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Block } from './block.model';

interface DBICreationArgs {
  blockId: number;
  interviewCompany?: string;
}

@Table({ tableName: 'DEFAULT_BLOCKS_INFO' })
export class DefaultBlockInfo extends Model<DefaultBlockInfo, DBICreationArgs> {
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
    type: DataType.STRING,
    allowNull: true,
  })
  interviewCompany: string;

  @BelongsTo(() => Block)
  block: Block;
}
