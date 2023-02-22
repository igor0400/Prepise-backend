import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Block } from 'src/blocks/models/block.model';
import { Tag } from './tag.model';

interface BlockTagCreationArgs {
  blockId: number;
  tagId: number;
}

@Table({ tableName: 'BLOCK_TAGS', timestamps: false })
export class BlockTag extends Model<BlockTag, BlockTagCreationArgs> {
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

  @ForeignKey(() => Tag)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  tagId: number;
}
