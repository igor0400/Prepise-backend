import {
   Column,
   Model,
   Table,
   DataType,
   HasMany,
   BelongsToMany,
} from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';
import { ChatUser } from './chat-users.model';
import { ChatMessage } from './chat-message.model';

@Table({ tableName: 'CHATS' })
export class Chat extends Model<Chat> {
   @Column({
      type: DataType.INTEGER,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
   })
   id: number;

   @HasMany(() => ChatMessage)
   messages: ChatMessage[];

   @BelongsToMany(() => User, () => ChatUser)
   users: User[];
}
