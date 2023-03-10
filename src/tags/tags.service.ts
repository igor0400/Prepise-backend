import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Block } from 'src/blocks/models/block.model';
import { Question } from 'src/questions/models/question.model';
import { User } from 'src/users/models/user.model';
import { ChangeTagDto } from './dto/change-tag.dto';
import { CreateBlockTagsDto } from './dto/create-block-tags.dto';
import { CreateQuestionTagsDto } from './dto/create-question-tags.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { CreateUserTagsDto } from './dto/create-user-tags.dto';
import { DeleteUserTagsDto } from './dto/delete-user-tags.dto';
import { BlockTag } from './models/block-tag.model';
import { QuestionTag } from './models/question-tag.model';
import { Tag } from './models/tag.model';
import { UserFollowingTag } from './models/user-following-tags.model';
import { UserIgnoredTag } from './models/user-ignored-tag.model';
import { UserTag } from './models/user-tag.model';
import { Op } from 'sequelize';

@Injectable()
export class TagsService {
   constructor(
      @InjectModel(Tag)
      private tagRepository: typeof Tag,
      @InjectModel(Question)
      private questionRepository: typeof Question,
      @InjectModel(QuestionTag)
      private questionTagRepository: typeof QuestionTag,
      @InjectModel(User)
      private userRepository: typeof User,
      @InjectModel(UserTag)
      private userTagRepository: typeof UserTag,
      @InjectModel(UserFollowingTag)
      private userFollowingTagRepository: typeof UserFollowingTag,
      @InjectModel(UserIgnoredTag)
      private userIgnoredTagRepository: typeof UserIgnoredTag,
      @InjectModel(Block)
      private blockRepository: typeof Block,
      @InjectModel(BlockTag)
      private blockTagRepository: typeof BlockTag,
   ) {}

   async getAllTags(limit: number, offset: number, search: string = '') {
      const tags = await this.tagRepository.findAll({
         offset: offset || 0,
         limit: limit || 100,
         include: { all: true },
         where: {
            name: {
               [Op.like]: `%${search}%`,
            },
         },
         order: ['id'],
      });

      return tags;
   }

   async getTagById(id: number) {
      const tag = await this.tagRepository.findOne({
         where: { id },
         include: { all: true },
      });
      return tag;
   }

   async createTag(dto: CreateTagDto) {
      const tag = await this.tagRepository.create(dto);
      return tag;
   }

   async changeTagInfo(tagId: number, authorId: number, dto: ChangeTagDto) {
      const tag = await this.tagRepository.findOne({
         where: { id: tagId, authorId },
         include: { all: true },
      });

      if (!tag) {
         throw new HttpException(
            'У вас недостаточно прав для изменения этого тега',
            HttpStatus.FORBIDDEN,
         );
      }

      for (let key in dto) {
         if (tag[key] !== undefined) {
            tag[key] = dto[key];
         }
      }

      return tag.save();
   }

   async deleteTag(tagId: number) {
      const tag = this.tagRepository.findOne({ where: { id: tagId } });

      if (!tag) {
         throw new HttpException('Тег не найден', HttpStatus.NOT_FOUND);
      }

      await this.tagRepository.destroy({ where: { id: tagId } });
      await this.questionTagRepository.destroy({ where: { tagId: tagId } });
      await this.userTagRepository.destroy({ where: { tagId: tagId } });
      await this.userFollowingTagRepository.destroy({
         where: { tagId: tagId },
      });
      await this.userIgnoredTagRepository.destroy({ where: { tagId: tagId } });

      return `Тег с id: ${tagId} удален`;
   }

   async createQuestionTags(dto: CreateQuestionTagsDto, authorId: number) {
      const createdTags = [];
      const { tags, questionId } = dto;

      const question = await this.questionRepository.findOne({
         where: {
            id: +questionId,
            authorId,
         },
         include: { all: true },
      });

      if (!question) {
         throw new HttpException('Вопрос не найден', HttpStatus.NOT_FOUND);
      }

      await this.changeTagFields('inc', dto.tags, 'used');

      if (typeof tags === 'object') {
         tags.forEach(async (tagId) => {
            createdTags.push(
               await this.questionTagRepository.create({
                  questionId: +questionId,
                  tagId: +tagId,
               }),
            );
         });
      } else if (typeof tags === 'string') {
         createdTags.push(
            await this.questionTagRepository.create({
               questionId: +questionId,
               tagId: +tags,
            }),
         );
      }

      return createdTags;
   }

   async deleteQuestionTags(questionId: string, authorId: number) {
      const question = await this.questionRepository.findOne({
         where: {
            id: +questionId,
            authorId,
         },
      });

      if (!question) {
         throw new HttpException('Вопрос не найден', HttpStatus.NOT_FOUND);
      }

      const tags = await this.questionTagRepository.findAll({
         where: { questionId: +questionId },
      });

      const deletedTags = tags.map((item) => item.id.toString());

      await this.changeTagFields('dec', deletedTags, 'used');

      await this.questionTagRepository.destroy({
         where: { questionId: +questionId },
      });

      return deletedTags;
   }

   async changeQuestionTags(dto: CreateQuestionTagsDto, authorId: number) {
      await this.deleteQuestionTags(dto.questionId, authorId);
      return this.createQuestionTags(dto, authorId);
   }

   async createBlockTags(dto: CreateBlockTagsDto, authorId: number) {
      const createdTags = [];
      const { tags, blockId } = dto;

      const block = await this.blockRepository.findOne({
         where: {
            id: +blockId,
            authorId,
         },
         include: { all: true },
      });

      if (!block) {
         throw new HttpException('Блок не найден', HttpStatus.NOT_FOUND);
      }

      await this.changeTagFields('inc', dto.tags, 'used');

      tags.forEach(async (tagId) => {
         createdTags.push(
            await this.blockTagRepository.create({
               blockId: +blockId,
               tagId: +tagId,
            }),
         );
      });

      return createdTags;
   }

   async deleteBlockTags(blockId: string, authorId: number) {
      const block = await this.blockRepository.findOne({
         where: {
            id: +blockId,
            authorId,
         },
      });

      if (!block) {
         throw new HttpException('Блок не найден', HttpStatus.NOT_FOUND);
      }

      const tags = await this.blockTagRepository.findAll({
         where: { blockId: +blockId },
      });

      const deletedTags = tags.map((item) => item.id.toString());

      await this.changeTagFields('dec', deletedTags, 'used');

      await this.blockTagRepository.destroy({
         where: { blockId: +blockId },
      });

      return deletedTags;
   }

   async changeBlockTags(dto: CreateBlockTagsDto, authorId: number) {
      await this.deleteBlockTags(dto.blockId, authorId);
      return this.createBlockTags(dto, authorId);
   }

   async createUserTags(dto: CreateUserTagsDto) {
      await this.changeTagFields('inc', dto.tags, 'used');

      return this.createUTags({
         repository: this.userTagRepository,
         dto,
      });
   }

   async deleteUserTags(dto: DeleteUserTagsDto) {
      await this.changeTagFields('dec', dto.tags, 'used');

      return this.deleteUTags({
         repository: this.userTagRepository,
         dto,
      });
   }

   async changeUserTags(dto: CreateUserTagsDto) {
      await this.deleteUserTags(dto);
      return this.createUserTags(dto);
   }

   async createUserFollowingTags(dto: CreateUserTagsDto) {
      await this.changeTagFields('inc', dto.tags, 'followers');

      return this.createUTags({
         repository: this.userFollowingTagRepository,
         dto,
      });
   }

   async deleteUserFollowingTags(dto: DeleteUserTagsDto) {
      await this.changeTagFields('dec', dto.tags, 'followers');

      return this.deleteUTags({
         repository: this.userFollowingTagRepository,
         dto,
      });
   }

   async createUserIgnoredTags(dto: CreateUserTagsDto) {
      return this.createUTags({
         repository: this.userIgnoredTagRepository,
         dto,
      });
   }

   async deleteUserIgnoredTags(dto: DeleteUserTagsDto) {
      return this.deleteUTags({
         repository: this.userIgnoredTagRepository,
         dto,
      });
   }

   private async createUTags(args: {
      repository: any;
      dto: CreateUserTagsDto;
   }) {
      const { userId, tags } = args.dto;
      const createdTags = [];

      if (typeof tags === 'object') {
         tags.forEach(async (tagId) => {
            createdTags.push(
               await args.repository.create({
                  userId,
                  tagId: +tagId,
               }),
            );
         });
      } else if (typeof tags === 'string') {
         createdTags.push(
            await args.repository.create({
               userId,
               tagId: +tags,
            }),
         );
      }

      return createdTags;
   }

   private async deleteUTags(args: {
      repository: any;
      dto: CreateUserTagsDto;
   }) {
      const deletedTags = [];
      const { tags, userId } = args.dto;

      const user = await this.userRepository.findByPk(userId);

      if (!user) {
         throw new HttpException(
            'Пользователь не найден',
            HttpStatus.NOT_FOUND,
         );
      }

      if (typeof tags === 'object') {
         tags.forEach(async (tagId) => {
            deletedTags.push({
               [tagId]: await args.repository.destroy({
                  where: {
                     userId,
                     tagId: +tagId,
                  },
               }),
            });
         });
      } else if (typeof tags === 'string') {
         deletedTags.push({
            [tags]: await args.repository.destroy({
               where: {
                  userId,
                  tagId: +tags,
               },
            }),
         });
      }

      return deletedTags;
   }

   private async changeTagFields(
      type: 'inc' | 'dec',
      tags: string | string[],
      field: 'followers' | 'used',
   ) {
      if (typeof tags === 'object') {
         tags.forEach(async (item) => {
            return this.changeTag(item, type, field);
         });
      } else if (typeof tags === 'string') {
         return this.changeTag(tags, type, field);
      }
   }

   private async changeTag(
      tagId: string,
      type: 'inc' | 'dec',
      field: 'followers' | 'used',
   ) {
      const tag = await this.tagRepository.findByPk(+tagId);
      if (tag) {
         const value = type === 'inc' ? tag[field] + 1 : tag[field] - 1;
         tag[field] = value;
         return tag.save();
      }
   }
}
