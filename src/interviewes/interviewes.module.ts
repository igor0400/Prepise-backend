import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { InterviewesController } from './interviewes.controller';
import { InterviewesService } from './interviewes.service';
import { Interview } from './models/interview.model';

@Module({
  controllers: [InterviewesController],
  providers: [InterviewesService],
  imports: [
    SequelizeModule.forFeature([Interview]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
  ],
})
export class InterviewesModule {}
