import {
   Body,
   Controller,
   Delete,
   Get,
   Param,
   ParseIntPipe,
   Patch,
   Post,
   Query,
   Req,
   UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CustomReq } from 'src/types/request-type';
import { BlocksService } from './blocks.service';
import { ChangeBlockDto } from './dto/change-block.dto';
import { CreateBlockCommentReplyDto } from './dto/create-block-comment-reply.dto';
import { CreateBlockCommentDto } from './dto/create-block-comment.dto';
import { CreateBlockDto } from './dto/create-block.dto';

@Controller('blocks')
export class BlocksController {
   constructor(private blocksService: BlocksService) {}

   @Get('default')
   getAllDefaultBlocks(
      @Query('limit') limit: string,
      @Query('offset') offset: string,
      @Query('search') search: string,
   ) {
      return this.blocksService.getAllBlocks(
         'default',
         +limit,
         +offset,
         search,
      );
   }

   @Get('test')
   getAllTestBlocks(
      @Query('limit') limit: string,
      @Query('offset') offset: string,
      @Query('search') search: string,
   ) {
      return this.blocksService.getAllBlocks('test', +limit, +offset, search);
   }

   @Get('default/:id')
   async getDefaultBlockById(@Param('id', ParseIntPipe) blockId: number) {
      const block = await this.blocksService.getBlockById(blockId, 'default');

      if (block) {
         return block;
      } else {
         return `Блок с id: ${blockId} не найден`;
      }
   }

   @Get('test/:id')
   async getTestBlockById(@Param('id', ParseIntPipe) blockId: number) {
      const block = await this.blocksService.getBlockById(blockId, 'test');

      if (block) {
         return block;
      } else {
         return `Блок с id: ${blockId} не найден`;
      }
   }

   @UseGuards(JwtAuthGuard)
   @Post('default-block')
   async createBlock(@Body() dto: CreateBlockDto, @Req() req: CustomReq) {
      return this.blocksService.createBlock({
         ...dto,
         authorId: +req.user.sub,
         type: 'default',
      });
   }

   @UseGuards(JwtAuthGuard)
   @Post('test-block')
   createTestBlock(@Body() dto: CreateBlockDto, @Req() req: CustomReq) {
      return this.blocksService.createBlock({
         ...dto,
         authorId: +req.user.sub,
         type: 'test',
      });
   }

   @UseGuards(JwtAuthGuard)
   @Patch(':id')
   changeBlockInfo(
      @Param('id', ParseIntPipe) blockId: number,
      @Body() dto: ChangeBlockDto,
      @Req() req: CustomReq,
   ) {
      return this.blocksService.changeBlockInfo(blockId, +req.user.sub, dto);
   }

   @UseGuards(JwtAuthGuard)
   @Delete(':id')
   deleteBlock(
      @Param('id', ParseIntPipe) blockId: number,
      @Req() req: CustomReq,
      @Body('deleteQuestions') deleteQuestions: boolean,
   ) {
      return this.blocksService.deleteBlock(
         blockId,
         +req.user.sub,
         deleteQuestions ?? true,
      );
   }

   @UseGuards(JwtAuthGuard)
   @Post('/comment/:id')
   commentBlock(
      @Body() dto: CreateBlockCommentDto,
      @Param('id', ParseIntPipe) blockId: number,
      @Req() req: CustomReq,
   ) {
      return this.blocksService.commentBlock({
         ...dto,
         authorId: +req.user.sub,
         blockId,
      });
   }

   @UseGuards(JwtAuthGuard)
   @Patch('comment/:id')
   changeCommentQuestion(
      @Param('id', ParseIntPipe) commentId: number,
      @Body('text') text: string,
      @Req() req: CustomReq,
   ) {
      return this.blocksService.changeCommentBlock(
         commentId,
         +req.user.sub,
         text,
      );
   }

   @UseGuards(JwtAuthGuard)
   @Post('/reply/comment/:id')
   replyCommentBlock(
      @Body() dto: CreateBlockCommentReplyDto,
      @Param('id', ParseIntPipe) blockCommentId: number,
      @Req() req: CustomReq,
   ) {
      return this.blocksService.replyCommentBlock({
         ...dto,
         authorId: +req.user.sub,
         blockCommentId,
      });
   }

   @UseGuards(JwtAuthGuard)
   @Patch('comment-reply/:id')
   changeCommentBlockReply(
      @Param('id', ParseIntPipe) commentId: number,
      @Body('text') text: string,
      @Req() req: CustomReq,
   ) {
      return this.blocksService.changeCommentBlockReply(
         commentId,
         +req.user.sub,
         text,
      );
   }

   @UseGuards(JwtAuthGuard)
   @Post('/view/:id')
   viewBlock(
      @Param('id', ParseIntPipe) blockId: number,
      @Req() req: CustomReq,
   ) {
      return this.blocksService.viewBlock({
         userId: +req.user.sub,
         blockId,
      });
   }

   @UseGuards(JwtAuthGuard)
   @Post('/done/:id')
   doneBlock(
      @Req() req: CustomReq,
      @Param('id', ParseIntPipe) blockId: number,
   ) {
      return this.blocksService.doneBlock({
         userId: +req.user.sub,
         blockId,
      });
   }

   @UseGuards(JwtAuthGuard)
   @Post('/like/:id')
   likeBlock(
      @Param('id', ParseIntPipe) blockId: number,
      @Req() req: CustomReq,
   ) {
      return this.blocksService.likeBlock({
         userId: +req.user.sub,
         blockId,
      });
   }

   @UseGuards(JwtAuthGuard)
   @Delete('/like/:id')
   deleteLikeBlock(
      @Param('id', ParseIntPipe) blockId: number,
      @Req() req: CustomReq,
   ) {
      return this.blocksService.deleteLikeBlock({
         userId: +req.user.sub,
         blockId,
      });
   }

   @UseGuards(JwtAuthGuard)
   @Post('/dislike/:id')
   dislikeBlock(
      @Param('id', ParseIntPipe) blockId: number,
      @Req() req: CustomReq,
   ) {
      return this.blocksService.dislikeBlock({
         userId: +req.user.sub,
         blockId,
      });
   }

   @UseGuards(JwtAuthGuard)
   @Delete('/dislike/:id')
   deleteDislikeBlock(
      @Param('id', ParseIntPipe) blockId: number,
      @Req() req: CustomReq,
   ) {
      return this.blocksService.deleteDislikeBlock({
         userId: +req.user.sub,
         blockId,
      });
   }
}
