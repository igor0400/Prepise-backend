import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DataService } from './data.service';

@UseGuards(JwtAuthGuard)
@Controller('data')
export class DataController {
   constructor(private dataService: DataService) {}

   @Get('sections')
   getSections(
      @Query('limit') limit: string,
      @Query('offset') offset: string,
      @Query('search') search: string,
   ) {
      return this.dataService.getSections({
         limit: +limit,
         offset: +offset,
         search,
      });
   }

   @Get('positions')
   getPositions(
      @Query('limit') limit: string,
      @Query('offset') offset: string,
      @Query('search') search: string,
   ) {
      return this.dataService.getPositions({
         limit: +limit,
         offset: +offset,
         search,
      });
   }

   @Get('companies')
   getCompanies(
      @Query('limit') limit: string,
      @Query('offset') offset: string,
      @Query('search') search: string,
   ) {
      return this.dataService.getCompanies({
         limit: +limit,
         offset: +offset,
         search,
      });
   }
}
