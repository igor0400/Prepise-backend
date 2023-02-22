import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from 'src/users/users.module';
import { BannedController } from './banned.controller';
import { BannedService } from './banned.service';
import { BanBlock } from './models/banned-blocks.model';
import { BanQuestion } from './models/banned-questions.model';
import { BanUser } from './models/banned-users.model';

@Module({
  controllers: [BannedController],
  providers: [BannedService],
  imports: [
    SequelizeModule.forFeature([
      BanUser,
      BanQuestion,
      BanBlock,
    ]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    UsersModule,
  ],
})
export class BannedModule {}
