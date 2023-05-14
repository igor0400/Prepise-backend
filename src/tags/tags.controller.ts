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
import { ChangeTagDto } from './dto/change-tag.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagsService } from './tags.service';
import { Roles } from 'src/roles/roles-auth.decorator';
import { RolesGuard } from 'src/roles/guards/roles.guard';

@Controller('tags')
export class TagsController {
   constructor(private tagsService: TagsService) {}

   @Get('following')
   getUserFollowingTags(
      @Query('limit') limit: string,
      @Query('offset') offset: string,
      @Query('userId') userId: string,
   ) {
      return this.tagsService.getUserFollowingTags(+limit, +offset, +userId);
   }

   @Get('ignored')
   getUserIgnoredTags(
      @Query('limit') limit: string,
      @Query('offset') offset: string,
      @Query('userId') userId: string,
   ) {
      return this.tagsService.getUserIgnoredTags(+limit, +offset, +userId);
   }

   @UseGuards(JwtAuthGuard)
   @Post()
   createTag(@Body() dto: CreateTagDto, @Req() req: CustomReq) {
      return this.tagsService.createTag({ ...dto, authorId: +req.user.sub });
   }

   @Get(':id')
   getTagById(@Param('id', ParseIntPipe) tagId: number) {
      const tag = this.tagsService.getTagById(tagId);

      if (tag) {
         return tag;
      } else {
         return `Вопрос с id: ${tagId} не найден`;
      }
   }

   @Patch(':id')
   changeTagInfo(
      @Param('id', ParseIntPipe) tagId: number,
      @Body() dto: ChangeTagDto,
      @Req() req: CustomReq,
   ) {
      return this.tagsService.changeTagInfo(tagId, +req.user.sub, dto);
   }

   @Roles('ADMIN')
   @UseGuards(RolesGuard)
   @Delete(':id')
   deleteTag(@Param('id', ParseIntPipe) tagId: number) {
      return this.tagsService.deleteTag(tagId);
   }
   
   @Get()
   getAllTags(
      @Query('limit') limit: string,
      @Query('offset') offset: string,
      @Query('search') search: string,
   ) {
      return this.tagsService.getAllTags(+limit, +offset, search);
   }
}
