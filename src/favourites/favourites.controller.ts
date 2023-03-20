import {
   Controller,
   Delete,
   Param,
   ParseIntPipe,
   Post,
   Req,
   UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CustomReq } from 'src/types/request-type';
import { FavouritesService } from './favourites.service';

@Controller('favourites')
export class FavouritesController {
   constructor(private favouritesService: FavouritesService) {}

   @UseGuards(JwtAuthGuard)
   @Post('questions/:id')
   createFavouriteQuestion(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.favouritesService.createFavouriteQuestion({
         questionId: id,
         userId: +req.user.sub,
      });
   }

   @UseGuards(JwtAuthGuard)
   @Delete('questions/:id')
   deleteFavouriteQuestion(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.favouritesService.deleteFavouriteQuestion(id, +req.user.sub);
   }

   @UseGuards(JwtAuthGuard)
   @Post('test-questions/:id')
   createFavouriteTestQuestion(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.favouritesService.createFavouriteTestQuestion({
         testQuestionId: id,
         userId: +req.user.sub,
      });
   }

   @UseGuards(JwtAuthGuard)
   @Delete('test-questions/:id')
   deleteFavouriteTestQuestion(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.favouritesService.deleteFavouriteTestQuestion(
         id,
         +req.user.sub,
      );
   }

   @UseGuards(JwtAuthGuard)
   @Post('blocks/:id')
   createFavouriteBlock(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.favouritesService.createFavouriteBlock({
         blockId: id,
         userId: +req.user.sub,
      });
   }

   @UseGuards(JwtAuthGuard)
   @Delete('blocks/:id')
   deleteFavouriteBlock(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.favouritesService.deleteFavouriteBlock(id, +req.user.sub);
   }

   @UseGuards(JwtAuthGuard)
   @Post('test-blocks/:id')
   createFavouriteTestBlock(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.favouritesService.createFavouriteTestBlock({
         testBlockId: id,
         userId: +req.user.sub,
      });
   }

   @UseGuards(JwtAuthGuard)
   @Delete('test-blocks/:id')
   deleteFavouriteTestBlock(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.favouritesService.deleteFavouriteTestBlock(id, +req.user.sub);
   }

   @UseGuards(JwtAuthGuard)
   @Post('users/:id')
   createFavouriteUser(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.favouritesService.createFavouriteUser({
         favouriteUserId: id,
         userId: +req.user.sub,
      });
   }

   @UseGuards(JwtAuthGuard)
   @Delete('users/:id')
   deleteFavouriteUser(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.favouritesService.deleteFavouriteUser(id, +req.user.sub);
   }

   @UseGuards(JwtAuthGuard)
   @Post('companies/:id')
   createFavouriteCompany(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.favouritesService.createFavouriteCompany({
         companyId: id,
         userId: +req.user.sub,
      });
   }

   @UseGuards(JwtAuthGuard)
   @Post('companies/:id')
   deleteFavouriteCompany(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.favouritesService.deleteFavouriteCompany(id, +req.user.sub);
   }

   @UseGuards(JwtAuthGuard)
   @Post('tags/:id')
   createFavouriteTag(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.favouritesService.createFavouriteTag({
         tagId: id,
         userId: +req.user.sub,
      });
   }

   @UseGuards(JwtAuthGuard)
   @Delete('tags/:id')
   deleteFavouriteTag(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.favouritesService.deleteFavouriteTag(id, +req.user.sub);
   }
}
