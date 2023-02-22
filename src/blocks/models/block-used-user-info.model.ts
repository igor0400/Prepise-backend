import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';
import { Block } from './block.model';

interface BUUICreationArgs {
  blockId: number;
  userId: number;
  view?: boolean;
  done?: boolean;
  isLike?: boolean;
  isDislike?: boolean;
}

@Table({ tableName: 'BLOCK_USED_USER_INFO' })
export class BlockUsedUserInfo extends Model<
  BlockUsedUserInfo,
  BUUICreationArgs
> {
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

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  view: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  done: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  isLike: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  isDislike: boolean;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Block)
  block: Block;
}
