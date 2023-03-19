import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/models/user.model';
import { UsersModule } from './users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { UserSession } from './sessions/models/user-session.model';
import { RolesModule } from './roles/roles.module';
import { UserRoles } from './roles/models/user-roles.model';
import { Role } from './roles/models/roles.model';
import { SessionsModule } from './sessions/sessions.module';
import { BannedModule } from './banned/banned.module';
import { BanUser } from './banned/models/banned-users.model';
import { AuthModule } from './auth/auth.module';
import { UserInfo } from './users/models/users-info.model';
import { EmailModule } from './email/email.module';
import { QuestionsModule } from './questions/questions.module';
import { Question } from './questions/models/question.model';
import { QuestionImg } from './questions/models/question-img.model';
import { QuestionFile } from './questions/models/question-file.model';
import { DefaultQuestionInfo } from './questions/models/default-question-info.model';
import { BanQuestion } from './banned/models/banned-questions.model';
import { QuestionUsedUserInfo } from './questions/models/question-used-user-info.model';
import { TestQuestionInfo } from './questions/models/test-question-info.model';
import { TestQuestionReplyFile } from './questions/models/test-question-reply-file.model';
import { TestQuestionReply } from './questions/models/test-question-reply.model';
import { QuestionComment } from './questions/models/question-comment.model';
import { QuestionCommentReply } from './questions/models/question-comment-reply.model';
import { FilesModule } from './files/files.module';
import { TagsModule } from './tags/tags.module';
import { Tag } from './tags/models/tag.model';
import { QuestionTag } from './tags/models/question-tag.model';
import { UserTag } from './tags/models/user-tag.model';
import { UserFollowingTag } from './tags/models/user-following-tags.model';
import { UserIgnoredTag } from './tags/models/user-ignored-tag.model';
import { BlocksModule } from './blocks/blocks.module';
import { Block } from './blocks/models/block.model';
import { TestBlockInfo } from './blocks/models/test-block-info.model';
import { TestBlockUserProgress } from './blocks/models/test-block-user-progress.model';
import { BlockTag } from './tags/models/block-tag.model';
import { BlockQuestion } from './blocks/models/block-question.model';
import { BanBlock } from './banned/models/banned-blocks.model';
import { BlockUsedUserInfo } from './blocks/models/block-used-user-info.model';
import { BlockComment } from './blocks/models/block-comment.model';
import { BlockCommentReply } from './blocks/models/block-comment-reply.model';
import { UserFollowingUser } from './users/models/user-following-user.model';
import { CompaniesModule } from './companies/companies.module';
import { FavouritesModule } from './favourites/favourites.module';
import { FavouriteBlock } from './favourites/models/favourite-block.model';
import { FavouriteCompany } from './favourites/models/favourite-company.model';
import { FavouriteQuestion } from './favourites/models/favourite-question.model';
import { FavouriteTag } from './favourites/models/favourite-tag.model';
import { FavouriteTestBlock } from './favourites/models/favourite-test-block.model';
import { FavouriteTestQuestion } from './favourites/models/favourite-test-question.model';
import { FavouriteUser } from './favourites/models/favourite-user.model';
import { StatsModule } from './stats/stats.module';
import { InterviewesModule } from './interviewes/interviewes.module';
import { Interview } from './interviewes/models/interview.model';
import { NotificationsModule } from './notifications/notifications.module';
import { Notification } from './notifications/model/notification.model';
import { SettingsModule } from './settings/settings.module';
import { Settings } from './settings/models/settings.model';
import { NotifiSettings } from './settings/models/notifi-settings.model';
import { PostsModule } from './posts/posts.module';
import { UserPost } from './posts/models/user-post.model';
import { UserPostImage } from './posts/models/user-post-images.model';
import { AchievementsModule } from './achievements/achievements.module';
import { Achievement } from './achievements/models/achievement.model';
import { UserAchievement } from './achievements/models/user-achievement.model';
import { ChatModule } from './chat/chat.module';
import { ChatMessage } from './chat/models/chat-message.model';
import { Chat } from './chat/models/chat.model';
import { ChatUser } from './chat/models/chat-users.model';
import { UserOnline } from './users/models/user-online.model';
import { DataModule } from './data/data.module';
import { Sections } from './data/models/services.model';
import { Positions } from './data/models/positions.model';
import { Companies } from './data/models/companies.model';

@Module({
   imports: [
      ConfigModule.forRoot({
         envFilePath: `.${process.env.NODE_ENV}.env`,
         isGlobal: true,
      }),
      ServeStaticModule.forRoot({
         rootPath: path.resolve(__dirname, '../static'),
      }),
      SequelizeModule.forRoot({
         dialect: 'mysql',
         host: process.env.MYSQL_HOST,
         port: Number(process.env.MYSQL_PORT),
         username: process.env.MYSQL_USERNAME,
         password: process.env.MYSQL_PASSWORD,
         database: process.env.MYSQL_DBNAME,
         pool: {
            max: 10,
            min: 0,
            idle: 10000,
         },
         models: [
            User,
            UserSession,
            UserRoles,
            Role,
            BanUser,
            UserInfo,
            Question,
            QuestionImg,
            QuestionFile,
            DefaultQuestionInfo,
            BanQuestion,
            QuestionUsedUserInfo,
            TestQuestionInfo,
            TestQuestionReply,
            TestQuestionReplyFile,
            QuestionComment,
            QuestionCommentReply,
            Tag,
            QuestionTag,
            UserTag,
            UserFollowingTag,
            UserIgnoredTag,
            Block,
            BlockTag,
            TestBlockInfo,
            TestBlockUserProgress,
            BlockQuestion,
            BanBlock,
            BlockUsedUserInfo,
            BlockComment,
            BlockCommentReply,
            UserFollowingUser,
            FavouriteBlock,
            FavouriteCompany,
            FavouriteQuestion,
            FavouriteTag,
            FavouriteTestBlock,
            FavouriteTestQuestion,
            FavouriteUser,
            Interview,
            Notification,
            Settings,
            NotifiSettings,
            UserPost,
            UserPostImage,
            Achievement,
            UserAchievement,
            Chat,
            ChatMessage,
            ChatUser,
            UserOnline,
            Sections,
            Positions,
            Companies,
         ],
      }),
      UsersModule,
      RolesModule,
      SessionsModule,
      BannedModule,
      AuthModule,
      EmailModule,
      QuestionsModule,
      FilesModule,
      TagsModule,
      BlocksModule,
      CompaniesModule,
      FavouritesModule,
      StatsModule,
      InterviewesModule,
      NotificationsModule,
      SettingsModule,
      PostsModule,
      AchievementsModule,
      ChatModule,
      DataModule,
   ],
})
export class AppModule {}
