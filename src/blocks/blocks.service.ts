import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { BanBlock } from 'src/banned/models/banned-blocks.model';
import { BanQuestion } from 'src/banned/models/banned-questions.model';
import { DefaultQuestionInfo } from 'src/questions/models/default-question-info.model';
import { QuestionCommentReply } from 'src/questions/models/question-comment-reply.model';
import { QuestionComment } from 'src/questions/models/question-comment.model';
import { QuestionFile } from 'src/questions/models/question-file.model';
import { QuestionImg } from 'src/questions/models/question-img.model';
import { QuestionUsedUserInfo } from 'src/questions/models/question-used-user-info.model';
import { Question } from 'src/questions/models/question.model';
import { TestQuestionInfo } from 'src/questions/models/test-question-info.model';
import { QuestionsService } from 'src/questions/questions.service';
import { Role } from 'src/roles/models/roles.model';
import { Tag } from 'src/tags/models/tag.model';
import { TagsService } from 'src/tags/tags.service';
import { User } from 'src/users/models/user.model';
import { UserInfo } from 'src/users/models/users-info.model';
import { ChangeBlockDto } from './dto/change-block.dto';
import { CreateBlockCommentReplyDto } from './dto/create-block-comment-reply.dto';
import { CreateBlockCommentDto } from './dto/create-block-comment.dto';
import { CreateBUUIDto } from './dto/create-block-used-user-info.dto';
import { CreateBlockDto } from './dto/create-block.dto';
import { BlockCommentReply } from './models/block-comment-reply.model';
import { BlockComment } from './models/block-comment.model';
import { BlockQuestion } from './models/block-question.model';
import { BlockUsedUserInfo } from './models/block-used-user-info.model';
import { Block } from './models/block.model';
import { TestBlockInfo } from './models/test-block-info.model';
import { Op } from 'sequelize';

@Injectable()
export class BlocksService {
   constructor(
      @InjectModel(Block)
      private blockRepository: typeof Block,
      @InjectModel(TestBlockInfo)
      private testBlockInfoRepository: typeof TestBlockInfo,
      @InjectModel(BlockQuestion)
      private blockQuestionRepository: typeof BlockQuestion,
      @InjectModel(BlockComment)
      private blockCommentRepository: typeof BlockComment,
      @InjectModel(BlockCommentReply)
      private blockCommentReplyRepository: typeof BlockCommentReply,
      @InjectModel(BlockUsedUserInfo)
      private blockUUIRepository: typeof BlockUsedUserInfo,
      @InjectModel(BanBlock)
      private banBlockRepository: typeof BanBlock,
      @InjectModel(Question)
      private questionRepository: typeof Question,
      private tagsService: TagsService,
      private questionsService: QuestionsService,
   ) {}

   private readonly blocksInclude = [
      { model: TestBlockInfo },
      { model: BanBlock },
      { model: BlockUsedUserInfo },
      { model: BlockComment, include: [BlockCommentReply] },
      { model: Tag },
      {
         model: Question,
         include: [
            DefaultQuestionInfo,
            TestQuestionInfo,
            QuestionImg,
            QuestionFile,
            BanQuestion,
            QuestionUsedUserInfo,
            Tag,
            { model: QuestionComment, include: [QuestionCommentReply] },
         ],
      },
      {
         model: User,
         include: [
            Role,
            UserInfo,
            { model: Question, as: 'questions' },
            { model: Block, as: 'blocks' },
         ],
      },
   ];

   async getAllBlocks(
      type: 'default' | 'test',
      limit: number,
      offset: number,
      search: string = '',
   ) {
      const blocks = await this.blockRepository.findAll({
         offset: offset || 0,
         limit: limit || 100,
         include: this.blocksInclude,
         where: {
            title: {
               [Op.like]: `%${search}%`,
            },
            type,
         },
         order: ['id'],
      });
      return blocks;
   }

   async getBlockById(id: number) {
      const block = this.blockRepository.findOne({
         where: { id },
         include: this.blocksInclude,
      });
      return block;
   }

   async createBlock(dto: CreateBlockDto) {
      const { questions } = dto;
      const arrQuestions =
         typeof questions === 'string' ? [questions] : questions;

      await this.isQuestionsCreated(arrQuestions, dto.type === 'test');

      const commented = dto?.commented ? JSON.parse(dto.commented) : true;
      const block = await this.blockRepository.create({ ...dto, commented });

      if (dto.type === 'test') {
         await this.testBlockInfoRepository.create({
            blockId: block.id,
            maxProgress: arrQuestions.length,
         });
      }

      if (dto.tags.length) {
         await this.tagsService.createBlockTags(
            {
               blockId: block.id.toString(),
               tags: dto.tags,
            },
            dto.authorId,
         );
      }

      this.createQuestions(arrQuestions, block.id);

      return block;
   }

   async changeBlockInfo(
      blockId: number,
      authorId: number,
      dto: ChangeBlockDto,
   ) {
      const block = await this.blockRepository.findOne({
         where: { id: blockId, authorId },
         include: { all: true },
      });

      if (!block) {
         throw new HttpException(
            'У вас недостаточно прав для изменения этого блока',
            HttpStatus.FORBIDDEN,
         );
      }

      for (let key in dto) {
         if (key === 'tags') {
            this.tagsService.changeBlockTags(
               { tags: dto.tags, blockId: block.id.toString() },
               authorId,
            );
         }
         const { questions } = dto;
         const arrQuestions =
            typeof questions === 'string' ? [questions] : questions;

         if (key === 'questions') {
            await this.changeBlockQuestions(block.id, arrQuestions);
         }

         if (block[key] !== undefined) {
            if (key === 'commented') {
               block.commented = JSON.parse(dto.commented);
            } else {
               block[key] = dto[key];
            }
         }
      }

      return block.save();
   }

   async deleteBlock(
      blockId: number,
      authorId: number,
      deleteQuestions: boolean = true,
   ) {
      const block = await this.blockRepository.findOne({
         where: { id: blockId, authorId },
      });

      if (!block) {
         throw new HttpException('Блок не найден', HttpStatus.NOT_FOUND);
      }

      const comment = await this.blockCommentRepository.findOne({
         where: { blockId },
      });

      await this.blockRepository.destroy({ where: { id: blockId } });
      await this.testBlockInfoRepository.destroy({ where: { blockId } });
      await this.blockUUIRepository.destroy({ where: { blockId } });
      await this.banBlockRepository.destroy({ where: { blockId } });
      await this.blockCommentRepository.destroy({ where: { blockId } });

      if (comment) {
         await this.blockCommentReplyRepository.destroy({
            where: { blockCommentId: comment.id },
         });
      }

      if (block.questions && deleteQuestions) {
         block.questions.forEach((question) => {
            this.questionsService.deleteQuestion(
               question.id,
               question.authorId,
            );
         });
      }

      return `Блок с id: ${blockId} удален`;
   }

   async changeBlockQuestions(blockId: number, questions: string[]) {
      await this.deleteQuestions(blockId);
      await this.createQuestions(questions, blockId);
   }

   async commentBlock(dto: CreateBlockCommentDto) {
      const comment = await this.blockCommentRepository.create(dto);
      return comment;
   }

   async changeCommentBlock(commentId: number, authorId: number, text: string) {
      const comment = await this.blockCommentRepository.findOne({
         where: { id: commentId, authorId },
      });

      if (!comment) {
         throw new HttpException(
            'Не найден комментарий',
            HttpStatus.BAD_REQUEST,
         );
      }

      comment.text = text;
      return comment.save();
   }

   async replyCommentBlock(dto: CreateBlockCommentReplyDto) {
      const reply = await this.blockCommentReplyRepository.create(dto);
      return reply;
   }

   async changeCommentBlockReply(
      replyId: number,
      authorId: number,
      text: string,
   ) {
      const reply = await this.blockCommentReplyRepository.findOne({
         where: { id: replyId, authorId },
      });

      if (!reply) {
         throw new HttpException(
            'Не найден ответ на комментарий',
            HttpStatus.BAD_REQUEST,
         );
      }

      reply.text = text;
      return reply.save();
   }

   async viewBlock(dto: CreateBUUIDto) {
      const info = await this.blockUUIRepository.findOne({
         where: { ...dto },
         include: { all: true },
      });

      if (!info) {
         await this.incBlockParams(dto.blockId, 'viewes');
         await this.blockUUIRepository.create({ ...dto, view: true });
      }

      return true;
   }

   async doneBlock(dto: CreateBUUIDto) {
      const info = await this.blockUUIRepository.findOne({
         where: { ...dto },
         include: { all: true },
      });

      if (!info) {
         await this.blockUUIRepository.create({
            ...dto,
            view: true,
            done: true,
         });

         return true;
      }

      info.done = true;
      return info.save();
   }

   async likeBlock(dto: CreateBUUIDto) {
      const info = await this.blockUUIRepository.findOne({
         where: { ...dto },
         include: { all: true },
      });

      if (!info?.isLike) {
         await this.incBlockParams(dto.blockId, 'likes');
      }

      if (info?.isDislike) {
         await this.decBlockParams(dto.blockId, 'dislikes');
      }

      if (!info) {
         await this.blockUUIRepository.create({
            ...dto,
            view: true,
            isLike: true,
         });
         await this.incBlockParams(dto.blockId, 'viewes');

         return true;
      }

      info.isLike = true;
      info.isDislike = false;
      return info.save();
   }

   async dislikeBlock(dto: CreateBUUIDto) {
      const info = await this.blockUUIRepository.findOne({
         where: { ...dto },
         include: { all: true },
      });

      if (!info?.isDislike) {
         await this.incBlockParams(dto.blockId, 'dislikes');
      }

      if (info?.isLike) {
         await this.decBlockParams(dto.blockId, 'likes');
      }

      if (!info) {
         await this.blockUUIRepository.create({
            ...dto,
            view: true,
            isDislike: true,
         });
         await this.incBlockParams(dto.blockId, 'viewes');

         return true;
      }

      info.isDislike = true;
      info.isLike = false;
      return info.save();
   }

   private async createQuestions(questions: string[], blockId: number) {
      questions.forEach(async (item) => {
         await this.blockQuestionRepository.create({
            blockId,
            questionId: +item,
         });
      });
   }

   private async deleteQuestions(blockId: number) {
      const questions = await this.blockQuestionRepository.destroy({
         where: { blockId },
      });

      return questions;
   }

   private async incBlockParams(
      blockId: number,
      param: 'likes' | 'dislikes' | 'viewes',
   ) {
      const block = await this.blockRepository.findOne({
         where: { id: blockId },
         include: { all: true },
      });

      block[param] = block[param] + 1;
      return block.save();
   }

   private async decBlockParams(
      blockId: number,
      param: 'likes' | 'dislikes' | 'viewes',
   ) {
      const block = await this.blockRepository.findOne({
         where: { id: blockId },
         include: { all: true },
      });

      block[param] = block[param] - 1;
      return block.save();
   }

   private async isQuestionsCreated(
      questions: string[],
      isTest: boolean = false,
   ) {
      if (!questions.length) {
         throw new HttpException('Вопросы не найдены', HttpStatus.NOT_FOUND);
      }

      for (let item of questions) {
         const question = await this.questionRepository.findOne({
            where: { id: +item },
            include: { all: true },
         });

         if (!question) {
            throw new HttpException(
               `Вопрос с id: ${item} не найден`,
               HttpStatus.NOT_FOUND,
            );
         }

         if (isTest && !question.testQuestionInfo) {
            throw new HttpException(
               `Вопрос с id: ${item} не является тестовым`,
               HttpStatus.BAD_REQUEST,
            );
         }
      }

      return true;
   }
}
