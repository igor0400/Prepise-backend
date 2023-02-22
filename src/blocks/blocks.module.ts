import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { BanBlock } from 'src/banned/models/banned-blocks.model';
import { Question } from 'src/questions/models/question.model';
import { QuestionsModule } from 'src/questions/questions.module';
import { TagsModule } from 'src/tags/tags.module';
import { BlocksController } from './blocks.controller';
import { BlocksService } from './blocks.service';
import { BlockCommentReply } from './models/block-comment-reply.model';
import { BlockComment } from './models/block-comment.model';
import { BlockQuestion } from './models/block-question.model';
import { BlockUsedUserInfo } from './models/block-used-user-info.model';
import { Block } from './models/block.model';
import { DefaultBlockInfo } from './models/default-block-info.model';
import { TestBlockInfo } from './models/test-block-info.model';
import { TestBlockUserProgress } from './models/test-block-user-progress.model';

@Module({
  controllers: [BlocksController],
  providers: [BlocksService],
  imports: [
    SequelizeModule.forFeature([
      Block,
      DefaultBlockInfo,
      TestBlockInfo,
      TestBlockUserProgress,
      BlockQuestion,
      BlockUsedUserInfo,
      BlockComment,
      BlockCommentReply,
      BanBlock,
      Question,
    ]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    TagsModule,
    QuestionsModule,
  ],
})
export class BlocksModule {}
