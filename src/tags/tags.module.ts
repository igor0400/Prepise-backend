import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { Block } from 'src/blocks/models/block.model';
import { Question } from 'src/questions/models/question.model';
import { User } from 'src/users/models/user.model';
import { UsersModule } from 'src/users/users.module';
import { BlockTag } from './models/block-tag.model';
import { QuestionTag } from './models/question-tag.model';
import { Tag } from './models/tag.model';
import { UserFollowingTag } from './models/user-following-tags.model';
import { UserIgnoredTag } from './models/user-ignored-tag.model';
import { UserTag } from './models/user-tag.model';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  controllers: [TagsController],
  providers: [TagsService],
  imports: [
    SequelizeModule.forFeature([
      Tag,
      QuestionTag,
      UserTag,
      Question,
      User,
      UserFollowingTag,
      UserIgnoredTag,
      Block,
      BlockTag,
    ]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    forwardRef(() => UsersModule),
  ],
  exports: [TagsService],
})
export class TagsModule {}
