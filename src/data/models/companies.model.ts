import { Column, Model, Table, DataType } from 'sequelize-typescript';

interface CompaniesCreationArgs {
   title: string;
}

@Table({ tableName: 'DATA_COMPANIES', updatedAt: false })
export class Companies extends Model<Companies, CompaniesCreationArgs> {
   @Column({
      type: DataType.INTEGER,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
   })
   id: number;

   @Column({
      type: DataType.STRING,
      allowNull: false,
   })
   title: string;
}
