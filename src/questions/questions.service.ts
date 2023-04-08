import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BanQuestion } from 'src/banned/models/banned-questions.model';
import { FileData, FilesService } from 'src/files/files.service';
import { ChangeQuestionDto } from './dto/change-question.dto';
import { CreateFileDto } from './dto/create-file.dto';
import { CreateQuestionCommentReplyDto } from './dto/create-question-comment-reply.dto';
import { CreateQuestionCommentDto } from './dto/create-question-comment.dto';
import { CreateQUUIDto } from './dto/create-question-used-user-info.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateTQRFDto } from './dto/create-test-question-reply-file.dto';
import { CreateTQRDto } from './dto/create-test-question-reply.dto';
import { DefaultQuestionInfo } from './models/default-question-info.model';
import { QuestionCommentReply } from './models/question-comment-reply.model';
import { QuestionComment } from './models/question-comment.model';
import { QuestionFile } from './models/question-file.model';
import { QuestionImg } from './models/question-img.model';
import { QuestionUsedUserInfo } from './models/question-used-user-info.model';
import { Question } from './models/question.model';
import { TestQuestionInfo } from './models/test-question-info.model';
import { TestQuestionReplyFile } from './models/test-question-reply-file.model';
import { TestQuestionReply } from './models/test-question-reply.model';
import { Files } from './questions.controller';
import { TagsService } from 'src/tags/tags.service';
import { User } from 'src/users/models/user.model';
import { Tag } from 'src/tags/models/tag.model';
import { Role } from 'src/roles/models/roles.model';
import { UserInfo } from 'src/users/models/users-info.model';
import { Block } from 'src/blocks/models/block.model';
import { Op } from 'sequelize';
import { DataService } from 'src/data/data.service';
import { CreateImgDto } from './dto/create-img.dto';

@Injectable()
export class QuestionsService {
   constructor(
      @InjectModel(Question)
      private questionRepository: typeof Question,
      @InjectModel(QuestionImg)
      private questionImgRepository: typeof QuestionImg,
      @InjectModel(QuestionFile)
      private questionFileRepository: typeof QuestionFile,
      @InjectModel(DefaultQuestionInfo)
      private defaultQuestionInfoRepository: typeof DefaultQuestionInfo,
      @InjectModel(QuestionUsedUserInfo)
      private questionUUIRepository: typeof QuestionUsedUserInfo,
      @InjectModel(TestQuestionInfo)
      private testQuestionInfoRepository: typeof TestQuestionInfo,
      @InjectModel(TestQuestionReply)
      private testQuestionReplyRepository: typeof TestQuestionReply,
      @InjectModel(TestQuestionReplyFile)
      private testQuestionReplyFileRepository: typeof TestQuestionReplyFile,
      @InjectModel(QuestionComment)
      private questionCommentRepository: typeof QuestionComment,
      @InjectModel(QuestionCommentReply)
      private questionCommentReplyRepository: typeof QuestionCommentReply,
      @InjectModel(BanQuestion)
      private banQuestionRepository: typeof BanQuestion,
      private filesService: FilesService,
      private tagsService: TagsService,
      private dataService: DataService,
   ) {}

   private readonly questionsInclude = [
      { model: DefaultQuestionInfo },
      { model: TestQuestionInfo, include: [TestQuestionReply] },
      { model: QuestionImg },
      { model: QuestionFile },
      { model: BanQuestion },
      { model: QuestionUsedUserInfo },
      { model: QuestionComment, include: [QuestionCommentReply] },
      { model: Tag },
      { model: Block },
      {
         model: User,
         include: [Role, UserInfo, { model: Question, as: 'questions' }],
      },
   ];

   async getAllQuestions(
      type: 'default' | 'test',
      limit: number,
      offset: number,
      search: string = '',
   ) {
      const questions = await this.questionRepository.findAll({
         offset: offset || 0,
         limit: limit || 100,
         include: this.questionsInclude,
         where: {
            title: {
               [Op.like]: `%${search}%`,
            },
            type,
         },
         order: ['id'],
      });
      return questions;
   }

   async getQuestionById(id: number) {
      const question = this.questionRepository.findOne({
         where: { id },
         include: this.questionsInclude,
      });
      return question;
   }

   async createQuestion(dto: CreateQuestionDto, takenFiles: Files) {
      const commented = dto?.commented ? JSON.parse(dto.commented) : true;
      const question = await this.questionRepository.create({
         ...dto,
         commented,
      });
      const {
         interviewCompany,
         interviewPosition,
         section,
         tags,
         type,
         authorId,
      } = dto;

      if (takenFiles) {
         try {
            const { files, images } = this.filesService.createImgsAndFiles(
               takenFiles,
               `questions/${question.id}`,
            );
            if (images.length) this.createQImgs(images, question.id);
            if (files.length) this.createQFiles(files, question.id);
         } catch (e: any) {
            await this.questionRepository.destroy({
               where: { id: question.id },
            });
            throw new HttpException(e.message, e.status);
         }
      }

      if (type === 'test') {
         await this.testQuestionInfoRepository.create({
            questionId: question.id,
         });
      } else {
         await this.defaultQuestionInfoRepository.create({
            questionId: question.id,
            interviewCompany: interviewCompany ?? null,
         });
      }

      if (tags) {
         await this.tagsService.createQuestionTags(
            {
               questionId: question.id.toString(),
               tags: tags,
            },
            authorId,
         );
      }

      await this.dataService.createAllData({
         section,
         position: interviewPosition,
         company: interviewCompany,
      });

      return question;
   }

   async createQuestionFiles(
      questionId: number,
      authorId: number,
      takenFiles: Files,
   ) {
      const question = await this.questionRepository.findOne({
         where: { id: questionId, authorId },
      });

      if (!question) {
         throw new HttpException('Вопрос не найден', HttpStatus.NOT_FOUND);
      }

      const { files, images } = this.filesService.createImgsAndFiles(
         takenFiles,
         `questions/${question.id}`,
      );

      if (images.length) this.createQImgs(images, question.id);
      if (files.length) this.createQFiles(files, question.id);

      return question;
   }

   async deleteFile(fileId: number, authorId: number) {
      const file = await this.questionFileRepository.findByPk(fileId);
      const question = await this.questionRepository.findOne({
         where: { id: file.questionId, authorId },
      });

      if (!question) {
         throw new HttpException(
            'Ошибка удаления',
            HttpStatus.INTERNAL_SERVER_ERROR,
         );
      }

      await this.filesService.deleteFile(file.url);
      await this.questionFileRepository.destroy({ where: { id: fileId } });

      return true;
   }

   async deleteImage(imageId: number, authorId: number) {
      const file = await this.questionImgRepository.findByPk(imageId);
      const question = await this.questionRepository.findOne({
         where: { id: file.questionId, authorId },
      });

      if (!question) {
         throw new HttpException(
            'Ошибка удаления',
            HttpStatus.INTERNAL_SERVER_ERROR,
         );
      }

      await this.filesService.deleteFile(file.url);
      await this.questionImgRepository.destroy({ where: { id: imageId } });

      return true;
   }

   async changeQuestionInfo(
      questionId: number,
      authorId: number,
      dto: ChangeQuestionDto,
   ) {
      const question = await this.questionRepository.findOne({
         where: { id: questionId, authorId },
         include: { all: true },
      });

      if (!question) {
         throw new HttpException(
            'У вас недостаточно прав для изменения этого вопроса',
            HttpStatus.FORBIDDEN,
         );
      }

      for (let key in dto) {
         if (key === 'defaultQuestionInfo') {
            this.changeDefaultQuestionInfo(
               question.id,
               dto.defaultQuestionInfo?.interviewCompany,
            );
         }

         if (key === 'tags') {
            this.tagsService.changeQuestionTags(
               { tags: dto.tags, questionId: question.id.toString() },
               authorId,
            );
         }

         if (question[key] !== undefined) {
            if (key === 'commented') {
               question.commented = JSON.parse(dto.commented);
            } else {
               question[key] = dto[key];
            }
         }
      }

      return question.save();
   }

   async changeDefaultQuestionInfo(
      questionId: number,
      interviewCompany: string = null,
   ) {
      const questionInfo =
         await this.defaultQuestionInfoRepository.findOrCreate({
            where: { questionId },
         });

      questionInfo[0].interviewCompany = interviewCompany;
      return questionInfo[0].save();
   }

   async deleteQuestion(id: number, authorId: number) {
      const question = await this.questionRepository.findOne({
         where: { id, authorId },
      });

      if (!question) {
         throw new HttpException(
            `Вопрос с id: ${id} не найден`,
            HttpStatus.NOT_FOUND,
         );
      }

      const comment = await this.questionCommentRepository.findOne({
         where: { questionId: id },
      });
      const testInfo = await this.testQuestionInfoRepository.findOne({
         where: { questionId: id },
      });
      const imgs = await this.questionImgRepository.findAll({
         where: { questionId: id },
         include: { all: true },
      });
      const files = await this.questionFileRepository.findAll({
         where: { questionId: id },
         include: { all: true },
      });

      if (imgs.length || files.length) {
         this.filesService.deleteQuestionFiles(id);
      }

      await this.questionRepository.destroy({ where: { id } });
      await this.questionImgRepository.destroy({ where: { questionId: id } });
      await this.questionFileRepository.destroy({ where: { questionId: id } });
      await this.defaultQuestionInfoRepository.destroy({
         where: { questionId: id },
      });
      await this.questionUUIRepository.destroy({ where: { questionId: id } });
      await this.banQuestionRepository.destroy({ where: { questionId: id } });
      await this.testQuestionInfoRepository.destroy({
         where: { questionId: id },
      });
      await this.questionCommentRepository.destroy({
         where: { questionId: id },
      });

      if (comment) {
         await this.questionCommentReplyRepository.destroy({
            where: { questionCommentId: comment.id },
         });
      }

      if (testInfo) {
         await this.testQuestionReplyRepository.destroy({
            where: { testQuestionInfoId: testInfo.id },
         });
         const testReply = await this.testQuestionReplyRepository.findOne({
            where: { testQuestionInfoId: testInfo.id },
         });
         if (testReply) {
            await this.testQuestionReplyFileRepository.destroy({
               where: { testQuestionReplyId: testReply.id },
            });
         }
      }

      return `Вопрос с id: ${id} удален`;
   }

   async commentQuestion(dto: CreateQuestionCommentDto) {
      const comment = await this.questionCommentRepository.create(dto);
      return comment;
   }

   async changeCommentQuestion(
      commentId: number,
      authorId: number,
      text: string,
   ) {
      const comment = await this.questionCommentRepository.findOne({
         where: { id: commentId, authorId },
      });

      if (!comment) {
         throw new HttpException('Не найден комментарий', HttpStatus.NOT_FOUND);
      }

      comment.text = text;
      return comment.save();
   }

   async replyCommentQuestion(dto: CreateQuestionCommentReplyDto) {
      const comment = await this.questionCommentReplyRepository.create(dto);
      return comment;
   }

   async createTestQuestionReplyFiles(
      replyId: number,
      authorId: number,
      takenFiles: Express.Multer.File[],
   ) {
      const testQuestionReply = await this.testQuestionReplyRepository.findOne({
         where: { id: replyId, authorId },
      });

      if (!testQuestionReply) {
         throw new HttpException(
            'Ответ на тест не найден',
            HttpStatus.NOT_FOUND,
         );
      }

      if (takenFiles) {
         const files = this.filesService.createFiles(
            takenFiles,
            `test-question-replies/${testQuestionReply.id}`,
         );

         if (files.length) this.createTQRFiles(files, testQuestionReply.id);
      }
   }

   async deleteTestQuestionReplyFile(fileId: number, authorId: number) {
      const testQuestionReplyFile =
         await this.testQuestionReplyFileRepository.findByPk(fileId);
      const testQuestionReply = await this.testQuestionReplyRepository.findOne({
         where: { id: testQuestionReplyFile.testQuestionReplyId, authorId },
      });

      if (!testQuestionReply) {
         throw new HttpException(
            'Ошибка удаления файла',
            HttpStatus.INTERNAL_SERVER_ERROR,
         );
      }

      await this.testQuestionReplyFileRepository.destroy({
         where: { id: fileId },
      });
      this.filesService.deleteFile(testQuestionReplyFile.url);

      return testQuestionReplyFile;
   }

   async changeCommentQuestionReply(
      replyId: number,
      authorId: number,
      text: string,
   ) {
      const reply = await this.questionCommentReplyRepository.findOne({
         where: { id: replyId, authorId },
      });

      if (!reply) {
         throw new HttpException(
            'Не найден ответ на комментарий',
            HttpStatus.NOT_FOUND,
         );
      }

      reply.text = text;
      return reply.save();
   }

   async replyTestQuestion(
      dto: CreateTQRDto,
      takenFiles: Express.Multer.File[],
   ) {
      const question = await this.questionRepository.findOne({
         where: { id: +dto.questionId },
         include: { all: true },
      });

      if (!question) {
         throw new HttpException('Вопрос не найден', HttpStatus.NOT_FOUND);
      }

      const testQuestionReply = await this.testQuestionReplyRepository.create({
         ...dto,
         testQuestionInfoId: question?.testQuestionInfo?.id,
      });

      if (takenFiles) {
         try {
            const files = this.filesService.createFiles(
               takenFiles,
               `test-question-replies/${testQuestionReply.id}`,
            );

            if (files.length) this.createTQRFiles(files, testQuestionReply.id);
         } catch (e) {
            await this.testQuestionReplyRepository.destroy({
               where: { id: testQuestionReply.id },
            });
            throw new HttpException(e.message, e.status);
         }
      }

      await this.doneQuestion({
         userId: question.authorId,
         questionId: question.id,
      });

      return testQuestionReply;
   }

   async changeReplyTestQuestion(
      replyId: number,
      authorId: number,
      text: string,
   ) {
      const testQuestionReply = await this.testQuestionReplyRepository.findOne({
         where: { id: replyId, authorId },
      });

      if (!testQuestionReply) {
         throw new HttpException(
            'Не найден ответ на вопрос',
            HttpStatus.NOT_FOUND,
         );
      }

      testQuestionReply.text = text;

      return testQuestionReply.save();
   }

   async viewQuestion(dto: CreateQUUIDto) {
      const info = await this.questionUUIRepository.findOne({
         where: { ...dto },
         include: { all: true },
      });

      if (!info) {
         await this.incQuestionParams(dto.questionId, 'viewes');
         await this.questionUUIRepository.create({ ...dto, view: true });
      }

      return info;
   }

   async doneQuestion(dto: CreateQUUIDto) {
      const info = await this.questionUUIRepository.findOne({
         where: { ...dto },
         include: { all: true },
      });

      if (!info) {
         await this.questionUUIRepository.create({
            ...dto,
            view: true,
            done: true,
         });

         return true;
      }

      info.done = true;
      return info.save();
   }

   async likeQuestion(dto: CreateQUUIDto) {
      const info = await this.questionUUIRepository.findOne({
         where: { ...dto },
         include: { all: true },
      });

      if (!info?.isLike) {
         await this.incQuestionParams(dto.questionId, 'likes');
      }

      if (info?.isDislike) {
         await this.decQuestionParams(dto.questionId, 'dislikes');
      }

      if (!info) {
         await this.questionUUIRepository.create({
            ...dto,
            view: true,
            isLike: true,
         });
         await this.incQuestionParams(dto.questionId, 'viewes');

         return true;
      }

      info.isLike = true;
      info.isDislike = false;
      return info.save();
   }

   async dislikeQuestion(dto: CreateQUUIDto) {
      const info = await this.questionUUIRepository.findOne({
         where: { ...dto },
         include: { all: true },
      });

      if (!info?.isDislike) {
         await this.incQuestionParams(dto.questionId, 'dislikes');
      }

      if (info?.isLike) {
         await this.decQuestionParams(dto.questionId, 'likes');
      }

      if (!info) {
         await this.questionUUIRepository.create({
            ...dto,
            view: true,
            isDislike: true,
         });
         await this.incQuestionParams(dto.questionId, 'viewes');

         return true;
      }

      info.isDislike = true;
      info.isLike = false;
      return info.save();
   }

   private createQImgs(imgs: string[], questionId: number) {
      const imgsArr: CreateImgDto[] = imgs.map((img) => ({
         url: img,
         questionId,
      }));

      imgsArr.forEach(async (img: CreateImgDto) => {
         await this.questionImgRepository.create(img);
      });

      return imgsArr;
   }

   private createQFiles(files: FileData[], questionId: number) {
      const filesArr: CreateFileDto[] = files.map((file) => ({
         ...file,
         questionId,
      }));

      filesArr.forEach(async (file: CreateFileDto) => {
         await this.questionFileRepository.create(file);
      });

      return filesArr;
   }

   private createTQRFiles(files: FileData[], testQuestionReplyId: number) {
      const filesArr: CreateTQRFDto[] = files.map((file) => ({
         ...file,
         testQuestionReplyId,
      }));

      filesArr.forEach(async (file: CreateTQRFDto) => {
         await this.testQuestionReplyFileRepository.create(file);
      });

      return filesArr;
   }

   private async incQuestionParams(
      questionId: number,
      param: 'likes' | 'dislikes' | 'viewes',
   ) {
      const question = await this.questionRepository.findOne({
         where: { id: questionId },
         include: { all: true },
      });

      question[param] = question[param] + 1;
      return question.save();
   }

   private async decQuestionParams(
      questionId: number,
      param: 'likes' | 'dislikes' | 'viewes',
   ) {
      const question = await this.questionRepository.findOne({
         where: { id: questionId },
         include: { all: true },
      });

      question[param] = question[param] - 1;
      return question.save();
   }
}
