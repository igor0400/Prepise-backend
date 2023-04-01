import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { StartService } from './start.service';
import { SecretGuard } from './guards/secret.guard';
import { CreateInitialDataDto } from './dto/create-initial-data.dto';
import { Response, Request } from 'express';

@Controller('start')
export class StartController {
   constructor(private startService: StartService) {}

   @UseGuards(SecretGuard)
   @Post()
   createInitialData(
      @Body() dto: CreateInitialDataDto,
      @Res({ passthrough: true }) response: Response,
      @Req() request: Request,
   ) {
      return this.startService.createInitialData(dto, response, request);
   }
}
