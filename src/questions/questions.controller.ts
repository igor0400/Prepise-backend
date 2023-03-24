import {
   Body,
   Controller,
   Get,
   Post,
   UseGuards,
   Req,
   Param,
   UploadedFiles,
   UseInterceptors,
   Delete,
   Query,
   Patch,
   ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionsService } from './questions.service';
import { CustomReq } from 'src/types/request-type';
import { CreateTQRDto } from './dto/create-test-question-reply.dto';
import { CreateQuestionCommentDto } from './dto/create-question-comment.dto';
import { CreateQuestionCommentReplyDto } from './dto/create-question-comment-reply.dto';
import {
   FileFieldsInterceptor,
   FilesInterceptor,
} from '@nestjs/platform-express';
import { ChangeQuestionDto } from './dto/change-question.dto';

export interface Files {
   image?: Express.Multer.File[];
   file?: Express.Multer.File[];
}

@Controller('questions')
export class QuestionsController {
   constructor(private questionsService: QuestionsService) {}

   @Get('default')
   getAllQuestions(
      @Query('limit') limit: string,
      @Query('offset') offset: string,
      @Query('search') search: string,
   ) {
      return this.questionsService.getAllQuestions(
         'default',
         +limit,
         +offset,
         search,
      );
   }

   @Get('test')
   getAllTests(
      @Query('limit') limit: string,
      @Query('offset') offset: string,
      @Query('search') search: string,
   ) {
      return this.questionsService.getAllQuestions(
         'test',
         +limit,
         +offset,
         search,
      );
   }

   @Get(':id')
   async getQuestionById(@Param('id', ParseIntPipe) questionId: number) {
      const question = await this.questionsService.getQuestionById(questionId);

      if (question) {
         return question;
      } else {
         return `Вопрос с id: ${questionId} не найден`;
      }
   }

   @UseGuards(JwtAuthGuard)
   @Post('default-question')
   @UseInterceptors(
      FileFieldsInterceptor([
         { name: 'image', maxCount: 10 },
         { name: 'file', maxCount: 10 },
      ]),
   )
   async createQuestion(
      @Body() dto: CreateQuestionDto,
      @Req() req: CustomReq,
      @UploadedFiles() files: Files,
   ) {
      return this.questionsService.createQuestion(
         {
            ...dto,
            authorId: +req.user.sub,
            type: 'default',
         },
         files,
      );
   }

   @UseGuards(JwtAuthGuard)
   @Post('test-question')
   @UseInterceptors(
      FileFieldsInterceptor([
         { name: 'image', maxCount: 10 },
         { name: 'file', maxCount: 10 },
      ]),
   )
   createTestQuestion(
      @Body() dto: CreateQuestionDto,
      @Req() req: CustomReq,
      @UploadedFiles() files: Files,
   ) {
      return this.questionsService.createQuestion(
         {
            ...dto,
            authorId: +req.user.sub,
            type: 'test',
         },
         files,
      );
   }

   @UseGuards(JwtAuthGuard)
   @Patch(':id')
   changeQuestionInfo(
      @Param('id', ParseIntPipe) questionId: number,
      @Body() dto: ChangeQuestionDto,
      @Req() req: CustomReq,
   ) {
      return this.questionsService.changeQuestionInfo(
         questionId,
         +req.user.sub,
         dto,
      );
   }

   @UseGuards(JwtAuthGuard)
   @Delete(':id')
   deleteQuestion(
      @Param('id', ParseIntPipe) questionId: number,
      @Req() req: CustomReq,
   ) {
      return this.questionsService.deleteQuestion(questionId, +req.user.sub);
   }

   @UseGuards(JwtAuthGuard)
   @Post('files/:id')
   @UseInterceptors(
      FileFieldsInterceptor([
         { name: 'image', maxCount: 10 },
         { name: 'file', maxCount: 10 },
      ]),
   )
   createQuestionFiles(
      @Param('id', ParseIntPipe) questionId: number,
      @Req() req: CustomReq,
      @UploadedFiles() files: Files,
   ) {
      return this.questionsService.createQuestionFiles(
         questionId,
         +req.user.sub,
         files,
      );
   }

   @UseGuards(JwtAuthGuard)
   @Delete('/file/:id')
   deleteFile(
      @Param('id', ParseIntPipe) fileId: number,
      @Req() req: CustomReq,
   ) {
      return this.questionsService.deleteFile(fileId, +req.user.sub);
   }

   @UseGuards(JwtAuthGuard)
   @Delete('/image/:id')
   deleteImage(
      @Param('id', ParseIntPipe) imageId: number,
      @Req() req: CustomReq,
   ) {
      return this.questionsService.deleteImage(imageId, +req.user.sub);
   }

   @UseGuards(JwtAuthGuard)
   @Post('/reply/test-question/:id')
   @UseInterceptors(FilesInterceptor('file'))
   replyTestQuestion(
      @Body() dto: CreateTQRDto,
      @Req() req: CustomReq,
      @UploadedFiles() files: Express.Multer.File[],
      @Param('id', ParseIntPipe) replyId: number,
   ) {
      return this.questionsService.replyTestQuestion(
         {
            ...dto,
            questionId: replyId,
            authorId: +req.user.sub,
         },
         files,
      );
   }

   @UseGuards(JwtAuthGuard)
   @Patch('test-question-reply/:id')
   changeReplyTestQuestion(
      @Param('id', ParseIntPipe) replyId: number,
      @Body('text') text: string,
      @Req() req: CustomReq,
   ) {
      return this.questionsService.changeReplyTestQuestion(
         replyId,
         +req.user.sub,
         text,
      );
   }

   @UseGuards(JwtAuthGuard)
   @Post('files/test-question-reply/:id')
   @UseInterceptors(FilesInterceptor('file'))
   createTestQuestionReplyFiles(
      @Param('id', ParseIntPipe) replyId: number,
      @Req() req: CustomReq,
      @UploadedFiles() files: Express.Multer.File[],
   ) {
      return this.questionsService.createTestQuestionReplyFiles(
         replyId,
         +req.user.sub,
         files,
      );
   }

   @UseGuards(JwtAuthGuard)
   @Delete('test-question-reply/file/:id')
   deleteTestQuestionReplyFile(
      @Param('id', ParseIntPipe) fileId: number,
      @Req() req: CustomReq,
   ) {
      return this.questionsService.deleteTestQuestionReplyFile(
         fileId,
         +req.user.sub,
      );
   }

   @UseGuards(JwtAuthGuard)
   @Post('/comment/:id')
   commentQuestion(
      @Body() dto: CreateQuestionCommentDto,
      @Param('id', ParseIntPipe) questionId: number,
      @Req() req: CustomReq,
   ) {
      return this.questionsService.commentQuestion({
         ...dto,
         authorId: +req.user.sub,
         questionId,
      });
   }

   @UseGuards(JwtAuthGuard)
   @Patch('comment/:id')
   changeCommentQuestion(
      @Param('id', ParseIntPipe) commentId: number,
      @Body('text') text: string,
      @Req() req: CustomReq,
   ) {
      return this.questionsService.changeCommentQuestion(
         commentId,
         +req.user.sub,
         text,
      );
   }

   @UseGuards(JwtAuthGuard)
   @Post('/reply/comment/:id')
   replyCommentQuestion(
      @Body() dto: CreateQuestionCommentReplyDto,
      @Param('id', ParseIntPipe) questionCommentId: number,
      @Req() req: CustomReq,
   ) {
      return this.questionsService.replyCommentQuestion({
         ...dto,
         authorId: +req.user.sub,
         questionCommentId,
      });
   }

   @UseGuards(JwtAuthGuard)
   @Patch('comment-reply/:id')
   changeCommentQuestionReply(
      @Param('id', ParseIntPipe) commentId: number,
      @Body('text') text: string,
      @Req() req: CustomReq,
   ) {
      return this.questionsService.changeCommentQuestionReply(
         commentId,
         +req.user.sub,
         text,
      );
   }

   @UseGuards(JwtAuthGuard)
   @Post('/view/:id')
   viewQuestion(
      @Param('id', ParseIntPipe) questionId: number,
      @Req() req: CustomReq,
   ) {
      return this.questionsService.viewQuestion({
         userId: +req.user.sub,
         questionId,
      });
   }

   @UseGuards(JwtAuthGuard)
   @Post('/like/:id')
   likeQuestion(
      @Param('id', ParseIntPipe) questionId: number,
      @Req() req: CustomReq,
   ) {
      return this.questionsService.likeQuestion({
         userId: +req.user.sub,
         questionId,
      });
   }

   @UseGuards(JwtAuthGuard)
   @Post('/dislike/:id')
   dislikeQuestion(
      @Param('id', ParseIntPipe) questionId: number,
      @Req() req: CustomReq,
   ) {
      return this.questionsService.dislikeQuestion({
         userId: +req.user.sub,
         questionId,
      });
   }
}
