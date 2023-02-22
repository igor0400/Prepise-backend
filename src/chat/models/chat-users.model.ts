import {
   Column,
   Model,
   Table,
   DataType,
   ForeignKey,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';
import { Chat } from './chat.model';

interface ChatUserCreationArgs {
   userId: number;
   chatId: number;
}

@Table({ tableName: 'CHAT_USERS', updatedAt: false })
export class ChatUser extends Model<ChatUser, ChatUserCreationArgs> {
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

   @ForeignKey(() => Chat)
   @Column({
      type: DataType.INTEGER,
      allowNull: false,
   })
   chatId: number;
}
