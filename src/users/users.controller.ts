import {
   Param,
   Controller,
   Delete,
   Get,
   UseGuards,
   Post,
   Body,
   Query,
   Patch,
   UseInterceptors,
   UploadedFile,
   Req,
   ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { Roles } from 'src/roles/roles-auth.decorator';
import { CreateUserTagsDto } from 'src/tags/dto/create-user-tags.dto';
import { DeleteUserTagsDto } from 'src/tags/dto/delete-user-tags.dto';
import { TagsService } from 'src/tags/tags.service';
import { CustomReq } from 'src/types/request-type';
import { AddRoleDto } from './dto/add-role.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeUserDto } from './dto/change-user.dto';
import { CreateUserFollowingUsersDto } from './dto/create-user-following-user.dto';
import { DeleteUserFollowingUsersDto } from './dto/delete-user-following-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
   constructor(
      private usersService: UsersService,
      private tagsService: TagsService,
   ) {}

   @Get()
   getAllUsers(
      @Query('limit') limit: string,
      @Query('offset') offset: string,
      @Query('search') search: string,
   ) {
      return this.usersService.getAllUsers(+limit, +offset, search);
   }

   @UseGuards(JwtAuthGuard)
   @Patch()
   @UseInterceptors(FileInterceptor('summary'))
   changeUser(
      @Body() dto: ChangeUserDto,
      @Req() req: CustomReq,
      @UploadedFile() summary: Express.Multer.File,
   ) {
      return this.usersService.changeUser(
         { ...dto, userId: +req.user.sub },
         summary,
      );
   }

   @UseGuards(JwtAuthGuard)
   @Get('personal')
   async getUserPersonal(@Req() req: CustomReq) {
      const id = +req.user.sub;
      const user = await this.usersService.getUserById(id);

      if (user) {
         return user;
      } else {
         return `Пользователь с id: ${id} не найден`;
      }
   }

   @Roles('ADMIN')
   @UseGuards(RolesGuard)
   @Post('add-role')
   addRole(@Body() dto: AddRoleDto) {
      return this.usersService.addRole(dto);
   }

   @UseGuards(JwtAuthGuard)
   @Patch('avatar')
   @UseInterceptors(FileInterceptor('avatar'))
   changeAvatar(
      @Req() req: CustomReq,
      @UploadedFile() avatar: Express.Multer.File,
   ) {
      return this.usersService.changeAvatar(avatar, +req.user.sub);
   }

   @UseGuards(JwtAuthGuard)
   @Post('following-tags')
   createUserFollowingTags(
      @Body() dto: CreateUserTagsDto,
      @Req() req: CustomReq,
   ) {
      return this.tagsService.createUserFollowingTags({
         ...dto,
         userId: +req.user.sub,
      });
   }

   @UseGuards(JwtAuthGuard)
   @Delete('following-tags')
   deleteUserFollowingTags(
      @Body() dto: DeleteUserTagsDto,
      @Req() req: CustomReq,
   ) {
      return this.tagsService.deleteUserFollowingTags({
         ...dto,
         userId: +req.user.sub,
      });
   }

   @UseGuards(JwtAuthGuard)
   @Post('ignored-tags')
   createUserIgnoredTags(
      @Body() dto: CreateUserTagsDto,
      @Req() req: CustomReq,
   ) {
      return this.tagsService.createUserIgnoredTags({
         ...dto,
         userId: +req.user.sub,
      });
   }

   @UseGuards(JwtAuthGuard)
   @Delete('ignored-tags')
   deleteUserIgnoredTags(
      @Body() dto: DeleteUserTagsDto,
      @Req() req: CustomReq,
   ) {
      return this.tagsService.deleteUserIgnoredTags({
         ...dto,
         userId: +req.user.sub,
      });
   }

   @Get('following-users')
   getAllFollowingUsers(
      @Query('limit') limit: string,
      @Query('offset') offset: string,
      @Query('authorId') userId: string,
   ) {
      return this.usersService.getAllFollowingUsers(+limit, +offset, +userId);
   }

   @UseGuards(JwtAuthGuard)
   @Post('following-users')
   createUserFollowingUsers(
      @Body() dto: CreateUserFollowingUsersDto,
      @Req() req: CustomReq,
   ) {
      return this.usersService.createUserFollowingUsers({
         ...dto,
         followedUserId: +req.user.sub,
      });
   }

   @UseGuards(JwtAuthGuard)
   @Delete('following-users')
   deleteUserFollowingUsers(
      @Body() dto: DeleteUserFollowingUsersDto,
      @Req() req: CustomReq,
   ) {
      return this.usersService.deleteUserFollowingUsers({
         ...dto,
         followedUserId: +req.user.sub,
      });
   }

   @UseGuards(JwtAuthGuard)
   @Patch('change-pass')
   changePassword(@Body() dto: ChangePasswordDto, @Req() req: CustomReq) {
      return this.usersService.changePassword({
         ...dto,
         userId: +req.user.sub,
      });
   }

   @Get(':id')
   async getReducedUserById(@Param('id', ParseIntPipe) id: number) {
      const user = await this.usersService.getReducedUserById(id, false);

      if (user) {
         return user;
      } else {
         return `Пользователь с id: ${id} не найден`;
      }
   }

   @Get('full/:id')
   async getReducedAllItemsById(@Param('id', ParseIntPipe) id: number) {
      const user = await this.usersService.getReducedUserById(id);

      if (user) {
         return user;
      } else {
         return `Пользователь с id: ${id} не найден`;
      }
   }

   @Roles('ADMIN')
   @UseGuards(RolesGuard)
   @Delete(':id')
   deleteUserById(@Param('id', ParseIntPipe) id: number) {
      return this.usersService.deleteUserById(id);
   }
}
