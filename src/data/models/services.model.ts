import { Column, Model, Table, DataType } from 'sequelize-typescript';

interface SectionsCreationArgs {
   title: string;
}

@Table({ tableName: 'DATA_SECTIONS', updatedAt: false })
export class Sections extends Model<Sections, SectionsCreationArgs> {
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
