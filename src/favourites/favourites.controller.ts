import {
   Controller,
   Delete,
   Get,
   Param,
   ParseIntPipe,
   Post,
   Query,
   Req,
   UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CustomReq } from 'src/types/request-type';
import { FavouritesService } from './favourites.service';

@UseGuards(JwtAuthGuard)
@Controller('favourites')
export class FavouritesController {
   constructor(private favouritesService: FavouritesService) {}

   @Get([
      'questions',
      'tests',
      'blocks',
      'testBlocks',
      'users',
      'companies',
      'tags',
   ])
   getFavouriteItems(
      @Query('limit') limit: string,
      @Query('offset') offset: string,
      @Req() req: CustomReq,
   ) {
      const url: any = req.originalUrl.split('/')[2].split('?')[0];

      return this.favouritesService.getAllFavouriteItems(
         url,
         +limit,
         +offset,
         +req.user.sub,
      );
   }

   @Post('questions/:id')
   createFavouriteQuestion(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.favouritesService.createFavouriteQuestion({
         itemId: id,
         userId: +req.user.sub,
      });
   }

   @Delete('questions/:id')
   deleteFavouriteQuestion(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.favouritesService.deleteFavouriteQuestion(id, +req.user.sub);
   }

   @Post('test-questions/:id')
   createFavouriteTestQuestion(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.favouritesService.createFavouriteTestQuestion({
         itemId: id,
         userId: +req.user.sub,
      });
   }

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

   @Post('blocks/:id')
   createFavouriteBlock(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.favouritesService.createFavouriteBlock({
         itemId: id,
         userId: +req.user.sub,
      });
   }

   @Delete('blocks/:id')
   deleteFavouriteBlock(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.favouritesService.deleteFavouriteBlock(id, +req.user.sub);
   }

   @Post('test-blocks/:id')
   createFavouriteTestBlock(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.favouritesService.createFavouriteTestBlock({
         itemId: id,
         userId: +req.user.sub,
      });
   }

   @Delete('test-blocks/:id')
   deleteFavouriteTestBlock(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.favouritesService.deleteFavouriteTestBlock(id, +req.user.sub);
   }

   @Post('users/:id')
   createFavouriteUser(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.favouritesService.createFavouriteUser({
         itemId: id,
         userId: +req.user.sub,
      });
   }

   @Delete('users/:id')
   deleteFavouriteUser(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.favouritesService.deleteFavouriteUser(id, +req.user.sub);
   }

   @Post('companies/:id')
   createFavouriteCompany(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.favouritesService.createFavouriteCompany({
         itemId: id,
         userId: +req.user.sub,
      });
   }

   @Post('companies/:id')
   deleteFavouriteCompany(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.favouritesService.deleteFavouriteCompany(id, +req.user.sub);
   }

   @Post('tags/:id')
   createFavouriteTag(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.favouritesService.createFavouriteTag({
         itemId: id,
         userId: +req.user.sub,
      });
   }

   @Delete('tags/:id')
   deleteFavouriteTag(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.favouritesService.deleteFavouriteTag(id, +req.user.sub);
   }
}
