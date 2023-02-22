import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Block } from 'src/blocks/models/block.model';
import { User } from 'src/users/models/user.model';

interface FavouriteTestBlockCreationArgs {
  userId: number;
  testBlockId: number;
}

@Table({
  tableName: 'FAVOURITE_TEST_BLOCKS',
  timestamps: false,
})
export class FavouriteTestBlock extends Model<
  FavouriteTestBlock,
  FavouriteTestBlockCreationArgs
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
  testBlockId: number;
}
