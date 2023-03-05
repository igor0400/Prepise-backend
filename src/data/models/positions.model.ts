import { Column, Model, Table, DataType } from 'sequelize-typescript';

interface PositionsCreationArgs {
   title: string;
}

@Table({ tableName: 'DATA_POSITIONS', updatedAt: false })
export class Positions extends Model<Positions, PositionsCreationArgs> {
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
