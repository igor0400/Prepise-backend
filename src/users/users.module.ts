import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { BanUser } from 'src/banned/models/banned-users.model';
import { EmailModule } from 'src/email/email.module';
import { FilesModule } from 'src/files/files.module';
import { Role } from 'src/roles/models/roles.model';
import { UserRoles } from 'src/roles/models/user-roles.model';
import { RolesModule } from 'src/roles/roles.module';
import { UserSession } from 'src/sessions/models/user-session.model';
import { NotifiSettings } from 'src/settings/models/notifi-settings.model';
import { Settings } from 'src/settings/models/settings.model';
import { TagsModule } from 'src/tags/tags.module';
import { UserFollowingUser } from './models/user-following-user.model';
import { User } from './models/user.model';
import { UserInfo } from './models/users-info.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersGateway } from './users.gateway';
import { UserOnline } from './models/user-online.model';

@Module({
   controllers: [UsersController],
   providers: [UsersService, UsersGateway],
   imports: [
      SequelizeModule.forFeature([
         User,
         Role,
         UserRoles,
         BanUser,
         UserInfo,
         UserFollowingUser,
         Settings,
         NotifiSettings,
         UserSession,
         UserOnline,
      ]),
      RolesModule,
      forwardRef(() => AuthModule),
      forwardRef(() => TagsModule),
      FilesModule,
      TagsModule,
      EmailModule,
   ],
   exports: [UsersService],
})
export class UsersModule {}
