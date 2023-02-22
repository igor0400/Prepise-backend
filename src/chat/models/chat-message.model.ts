import {
   Column,
   Model,
   Table,
   DataType,
   ForeignKey,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';
import { Chat } from './chat.model';

interface ChatMessageCreationArgs {
   chatId: number;
   authorId: number;
   value: string;
   type?: 'default' | 'system';
}

@Table({ tableName: 'CHAT_MESSAGES' })
export class ChatMessage extends Model<ChatMessage, ChatMessageCreationArgs> {
   @Column({
      type: DataType.INTEGER,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
   })
   id: number;

   @ForeignKey(() => Chat)
   @Column({
      type: DataType.INTEGER,
      allowNull: false,
   })
   chatId: number;

   @ForeignKey(() => User)
   @Column({
      type: DataType.INTEGER,
      allowNull: false,
   })
   authorId: number;

   @Column({
      type: DataType.STRING,
      allowNull: false,
   })
   value: string;

   @Column({
      type: DataType.ENUM('default', 'system'),
      defaultValue: 'default',
   })
   type: 'default' | 'system';
}
