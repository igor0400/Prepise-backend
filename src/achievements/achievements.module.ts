import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from 'src/users/users.module';
import { AchievementsController } from './achievements.controller';
import { AchievementsService } from './achievements.service';
import { Achievement } from './models/achievement.model';
import { UserAchievement } from './models/user-achievement.model';

@Module({
  controllers: [AchievementsController],
  providers: [AchievementsService],
  imports: [
    SequelizeModule.forFeature([Achievement, UserAchievement]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    UsersModule,
  ],
})
export class AchievementsModule {}
