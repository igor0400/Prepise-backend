import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Block } from 'src/blocks/models/block.model';
import { Question } from 'src/questions/models/question.model';
import { Tag } from 'src/tags/models/tag.model';
import { User } from 'src/users/models/user.model';
import { CreateFavouriteBlock } from './dto/create-favourite-block.dto';
import { CreateFavouriteCompany } from './dto/create-favourite-company.dto';
import { CreateFavouriteQuestion } from './dto/create-favourite-question.dto';
import { CreateFavouriteTag } from './dto/create-favourite-tag.dto';
import { CreateFavouriteTestBlock } from './dto/create-favourite-test-block.dto';
import { CreateFavouriteTestQuestion } from './dto/create-favourite-test-question.dto';
import { CreateFavouriteUser } from './dto/create-favourite-user.dto';
import { FavouriteBlock } from './models/favourite-block.model';
import { FavouriteCompany } from './models/favourite-company.model';
import { FavouriteQuestion } from './models/favourite-question.model';
import { FavouriteTag } from './models/favourite-tag.model';
import { FavouriteTestBlock } from './models/favourite-test-block.model';
import { FavouriteTestQuestion } from './models/favourite-test-question.model';
import { FavouriteUser } from './models/favourite-user.model';

@Injectable()
export class FavouritesService {
   constructor(
      @InjectModel(FavouriteQuestion)
      private favouriteQuestionRepository: typeof FavouriteQuestion,
      @InjectModel(FavouriteTestQuestion)
      private favouriteTestQuestionRepository: typeof FavouriteTestQuestion,
      @InjectModel(FavouriteBlock)
      private favouriteBlockRepository: typeof FavouriteBlock,
      @InjectModel(FavouriteTestBlock)
      private favouriteTestBlockRepository: typeof FavouriteTestBlock,
      @InjectModel(FavouriteUser)
      private favouriteUserRepository: typeof FavouriteUser,
      @InjectModel(FavouriteCompany)
      private favouriteCompanyRepository: typeof FavouriteCompany,
      @InjectModel(FavouriteTag)
      private favouriteTagRepository: typeof FavouriteTag,
      @InjectModel(Question)
      private questionRepository: typeof Question,
      @InjectModel(Block)
      private blockRepository: typeof Block,
      @InjectModel(User)
      private userRepository: typeof User,
      @InjectModel(Tag)
      private tagRepository: typeof Tag,
   ) {}

   favouriteItemsRepositories = {
      questions: this.favouriteQuestionRepository,
      tests: this.favouriteTestQuestionRepository,
      blocks: this.favouriteBlockRepository,
      testBlocks: this.favouriteTestBlockRepository,
      users: this.favouriteUserRepository,
      companies: this.favouriteCompanyRepository,
      tags: this.favouriteTagRepository,
   };

   itemsRepositories = {
      questions: this.questionRepository,
      tests: this.questionRepository,
      blocks: this.blockRepository,
      testBlocks: this.blockRepository,
      users: this.userRepository,
      companies: this.userRepository,
      tags: this.tagRepository,
   };

   async getAllFavouriteItems(
      type:
         | 'questions'
         | 'tests'
         | 'blocks'
         | 'testBlocks'
         | 'users'
         | 'companies'
         | 'tags',
      limit: number,
      offset: number,
      userId: number,
   ) {
      const repository: any = this.favouriteItemsRepositories[type];
      const items = [];

      const clearItems = await repository.findAll({
         offset: offset || 0,
         limit: limit || 100000000000000,
         where: { userId },
         order: ['id'],
      });

      const itemRepository: any = this.itemsRepositories[type];

      for (let item of clearItems) {
         items.push({
            ...item.dataValues,
            item: await itemRepository.findByPk(item.itemId),
         });
      }

      return items;
   }

   async createFavouriteQuestion(dto: CreateFavouriteQuestion) {
      await this.verifyType(this.questionRepository, dto.itemId, 'default');

      const question = await this.favouriteQuestionRepository.findOrCreate({
         where: { ...dto },
      });
      return question;
   }

   async deleteFavouriteQuestion(itemId: number, userId: number) {
      const question = await this.favouriteQuestionRepository.destroy({
         where: { itemId, userId },
      });
      return question;
   }

   async createFavouriteTestQuestion(dto: CreateFavouriteTestQuestion) {
      await this.verifyType(this.questionRepository, dto.itemId, 'test');

      const question = await this.favouriteTestQuestionRepository.findOrCreate({
         where: { ...dto },
      });
      return question;
   }

   async deleteFavouriteTestQuestion(itemId: number, userId: number) {
      const question = await this.favouriteTestQuestionRepository.destroy({
         where: { itemId, userId },
      });
      return question;
   }

   async createFavouriteBlock(dto: CreateFavouriteBlock) {
      await this.verifyType(this.blockRepository, dto.itemId, 'default');

      const block = await this.favouriteBlockRepository.findOrCreate({
         where: { ...dto },
      });
      return block;
   }

   async deleteFavouriteBlock(itemId: number, userId: number) {
      const block = await this.favouriteBlockRepository.destroy({
         where: { itemId, userId },
      });
      return block;
   }

   async createFavouriteTestBlock(dto: CreateFavouriteTestBlock) {
      await this.verifyType(this.blockRepository, dto.itemId, 'test');

      const block = await this.favouriteTestBlockRepository.findOrCreate({
         where: { ...dto },
      });
      return block;
   }

   async deleteFavouriteTestBlock(itemId: number, userId: number) {
      const block = await this.favouriteTestBlockRepository.destroy({
         where: { itemId, userId },
      });
      return block;
   }

   async createFavouriteUser(dto: CreateFavouriteUser) {
      await this.verifyUserType(dto.itemId, 'user');

      const user = await this.favouriteUserRepository.findOrCreate({
         where: { ...dto },
      });
      return user;
   }

   async deleteFavouriteUser(itemId: number, userId: number) {
      const user = await this.favouriteUserRepository.destroy({
         where: { itemId, userId },
      });
      return user;
   }

   async createFavouriteCompany(dto: CreateFavouriteCompany) {
      await this.verifyUserType(dto.itemId, 'company');

      const company = await this.favouriteCompanyRepository.findOrCreate({
         where: { ...dto },
      });
      return company;
   }

   async deleteFavouriteCompany(itemId: number, userId: number) {
      const company = await this.favouriteCompanyRepository.destroy({
         where: { itemId, userId },
      });
      return company;
   }

   async createFavouriteTag(dto: CreateFavouriteTag) {
      const tag = await this.favouriteTagRepository.findOrCreate({
         where: { ...dto },
      });
      return tag;
   }

   async deleteFavouriteTag(itemId: number, userId: number) {
      const tag = await this.favouriteTagRepository.destroy({
         where: { itemId, userId },
      });
      return tag;
   }

   private async verifyType(
      repository: any,
      id: number,
      type: 'default' | 'test',
   ) {
      const entity = await repository.findByPk(id);

      if (entity.type !== type) {
         throw new HttpException('Неверный тип', HttpStatus.BAD_REQUEST);
      }

      return true;
   }

   private async verifyUserType(id: number, type: 'user' | 'company') {
      const entity = await this.userRepository.findByPk(id);

      if (entity.type !== type) {
         throw new HttpException('Неверный тип', HttpStatus.BAD_REQUEST);
      }

      return true;
   }
}
