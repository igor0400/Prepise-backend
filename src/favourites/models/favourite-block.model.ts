import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Block } from 'src/blocks/models/block.model';
import { User } from 'src/users/models/user.model';

interface FavouriteBlockCreationArgs {
  userId: number;
  blockId: number;
}

@Table({
  tableName: 'FAVOURITE_BLOCKS',
  timestamps: false,
})
export class FavouriteBlock extends Model<
  FavouriteBlock,
  FavouriteBlockCreationArgs
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

  @ForeignKey(() => Block)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  blockId: number;
}
