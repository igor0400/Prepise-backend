import {
   Column,
   Model,
   Table,
   DataType,
   HasMany,
   BelongsToMany,
   HasOne,
} from 'sequelize-typescript';
import { Achievement } from 'src/achievements/models/achievement.model';
import { UserAchievement } from 'src/achievements/models/user-achievement.model';
import { BanUser } from 'src/banned/models/banned-users.model';
import { Block } from 'src/blocks/models/block.model';
import { FavouriteBlock } from 'src/favourites/models/favourite-block.model';
import { FavouriteCompany } from 'src/favourites/models/favourite-company.model';
import { FavouriteQuestion } from 'src/favourites/models/favourite-question.model';
import { FavouriteTag } from 'src/favourites/models/favourite-tag.model';
import { FavouriteTestBlock } from 'src/favourites/models/favourite-test-block.model';
import { FavouriteTestQuestion } from 'src/favourites/models/favourite-test-question.model';
import { FavouriteUser } from 'src/favourites/models/favourite-user.model';
import { Interview } from 'src/interviewes/models/interview.model';
import { Notification } from 'src/notifications/model/notification.model';
import { UserPost } from 'src/posts/models/user-post.model';
import { Question } from 'src/questions/models/question.model';
import { Role } from 'src/roles/models/roles.model';
import { UserRoles } from 'src/roles/models/user-roles.model';
import { Settings } from 'src/settings/models/settings.model';
import { Tag } from 'src/tags/models/tag.model';
import { UserFollowingTag } from 'src/tags/models/user-following-tags.model';
import { UserIgnoredTag } from 'src/tags/models/user-ignored-tag.model';
import { UserTag } from 'src/tags/models/user-tag.model';
import { UserSession } from '../../sessions/models/user-session.model';
import { UserFollowingUser } from './user-following-user.model';
import { UserOnline } from './user-online.model';
import { UserInfo } from './users-info.model';

interface UserCreationArgs {
   name: string;
   password: string;
   email: string;
   emailVerify: boolean;
   type: 'company' | 'user';
   avatar: string;
}

@Table({ tableName: 'USERS' })
export class User extends Model<User, UserCreationArgs> {
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
   name: string;

   @Column({
      type: DataType.STRING,
      allowNull: false,
   })
   password: string;

   @Column({
      type: DataType.STRING,
      unique: true,
      allowNull: false,
   })
   email: string;

   @Column({
      type: DataType.BOOLEAN,
      defaultValue: false,
   })
   emailVerify: boolean;

   @Column({
      type: DataType.ENUM('company', 'user'),
      allowNull: false,
   })
   type: 'company' | 'user';

   @Column({
      type: DataType.TEXT,
   })
   description: string;

   @Column({
      type: DataType.STRING,
   })
   avatar: string;

   @Column({
      type: DataType.INTEGER,
      defaultValue: 0,
   })
   followers: number;

   @Column({
      type: DataType.INTEGER,
      defaultValue: 0,
   })
   likes: number;

   @Column({
      type: DataType.INTEGER,
      defaultValue: 0,
   })
   dislikes: number;

   @Column({
      type: DataType.STRING,
   })
   location: string;

   @Column({
      type: DataType.STRING,
   })
   birthday: string;

   @Column({
      type: DataType.STRING,
   })
   summary: string;

   @HasMany(() => UserSession)
   sessions: UserSession[];

   @BelongsToMany(() => Role, () => UserRoles)
   roles: Role[];

   @HasOne(() => BanUser)
   banned: BanUser;

   @HasOne(() => UserInfo)
   userInfo: UserInfo;

   @BelongsToMany(() => Tag, () => UserTag)
   tags: Tag[];

   @BelongsToMany(() => Tag, () => UserFollowingTag)
   followingTags: Tag[];

   @BelongsToMany(
      () => User,
      () => UserFollowingUser,
      'userId',
      'followedUserId',
   )
   followingUsers: User[];

   @BelongsToMany(() => Tag, () => UserIgnoredTag)
   ignoringTags: Tag[];

   @HasMany(() => Question)
   questions: Question[];

   @HasMany(() => Block)
   blocks: Block[];

   @BelongsToMany(() => Question, () => FavouriteQuestion)
   favouriteQuestions: Question[];

   @BelongsToMany(() => Question, () => FavouriteTestQuestion)
   favouriteTestQuestions: Question[];

   @BelongsToMany(() => Block, () => FavouriteBlock)
   favouriteBlocks: Block[];

   @BelongsToMany(() => Block, () => FavouriteTestBlock)
   favouriteTestBlocks: Block[];

   @BelongsToMany(() => User, () => FavouriteUser, 'userId', 'favouriteUserId')
   favouriteUsers: User[];

   @BelongsToMany(() => User, () => FavouriteCompany, 'userId', 'companyId')
   favouriteCompanies: User[];

   @BelongsToMany(() => Tag, () => FavouriteTag)
   favouriteTags: Tag[];

   @HasMany(() => Interview)
   interviewes: Interview[];

   @HasMany(() => Notification)
   notifications: Notification[];

   @HasOne(() => Settings)
   settings: Settings[];

   @HasMany(() => UserPost)
   posts: UserPost[];

   @BelongsToMany(() => Achievement, () => UserAchievement)
   achievements: Achievement[];

   @HasOne(() => UserOnline)
   connection: UserOnline;
}
