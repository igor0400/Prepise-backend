import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Block } from 'src/blocks/models/block.model';

interface BanBlockCreationArgs {
  blockId: number;
  banReason: string;
}

@Table({ tableName: 'BANNED_BLOCKS' })
export class BanBlock extends Model<BanBlock, BanBlockCreationArgs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Block)
  @Column({ type: DataType.INTEGER, allowNull: false })
  blockId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  banReason: string;

  @BelongsTo(() => Block)
  block: Block;
}
