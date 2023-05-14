import {
   Body,
   Controller,
   Delete,
   Param,
   ParseIntPipe,
   Patch,
   Post,
   Req,
   UploadedFiles,
   UseGuards,
   UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CustomReq } from 'src/types/request-type';
import { ChangeUserPostDto } from './dto/change-user-post.dto';
import { CreateUserPostDto } from './dto/create-user-post.dto';
import { PostsService } from './posts.service';
import { Multer } from 'multer';
import { Get, Query } from '@nestjs/common';

@Controller('posts')
export class PostsController {
   constructor(private postsService: PostsService) {}

   @Get('users')
   getAllUserPosts(
      @Query('limit') limit: string,
      @Query('offset') offset: string,
      @Query('authorId') userId: string,
   ) {
      return this.postsService.getAllUserPosts(+limit, +offset, +userId);
   }

   @UseGuards(JwtAuthGuard)
   @Post('users')
   @UseInterceptors(FilesInterceptor('image', 4))
   createUserPost(
      @Body() dto: CreateUserPostDto,
      @Req() req: CustomReq,
      @UploadedFiles() files: Express.Multer.File[],
   ) {
      return this.postsService.createUserPost(
         { ...dto, userId: +req.user.sub },
         files,
      );
   }

   @UseGuards(JwtAuthGuard)
   @Patch('users/:id')
   changeUserPost(
      @Body() dto: ChangeUserPostDto,
      @Req() req: CustomReq,
      @Param('id', ParseIntPipe) postId: number,
   ) {
      return this.postsService.changeUserPost({
         ...dto,
         userId: +req.user.sub,
         userPostId: postId,
      });
   }

   @UseGuards(JwtAuthGuard)
   @Delete('users/:id')
   deleteUserPost(
      @Req() req: CustomReq,
      @Param('id', ParseIntPipe) postId: number,
   ) {
      return this.postsService.deleteUserPost(postId, +req.user.sub);
   }
}
