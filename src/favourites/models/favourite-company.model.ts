import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';

interface FavouriteCompanyCreationArgs {
  userId: number;
  companyId: number;
}

@Table({
  tableName: 'FAVOURITE_COMPANIES',
  timestamps: false,
})
export class FavouriteCompany extends Model<
  FavouriteCompany,
  FavouriteCompanyCreationArgs
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

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  companyId: number;
}
