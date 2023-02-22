import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { Block } from 'src/blocks/models/block.model';
import { Question } from 'src/questions/models/question.model';
import { User } from 'src/users/models/user.model';
import { FavouritesController } from './favourites.controller';
import { FavouritesService } from './favourites.service';
import { FavouriteBlock } from './models/favourite-block.model';
import { FavouriteCompany } from './models/favourite-company.model';
import { FavouriteQuestion } from './models/favourite-question.model';
import { FavouriteTag } from './models/favourite-tag.model';
import { FavouriteTestBlock } from './models/favourite-test-block.model';
import { FavouriteTestQuestion } from './models/favourite-test-question.model';
import { FavouriteUser } from './models/favourite-user.model';

@Module({
  controllers: [FavouritesController],
  providers: [FavouritesService],
  imports: [
    SequelizeModule.forFeature([
      FavouriteBlock,
      FavouriteCompany,
      FavouriteQuestion,
      FavouriteTag,
      FavouriteTestBlock,
      FavouriteTestQuestion,
      FavouriteUser,
      Question,
      Block,
      User,
    ]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
  ],
})
export class FavouritesModule {}
