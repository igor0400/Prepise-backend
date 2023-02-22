import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CustomReq } from 'src/types/request-type';
import { ChangeInterviewDto } from './dto/change-interview.dto';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { InterviewesService } from './interviewes.service';

@Controller('interviewes')
export class InterviewesController {
  constructor(private interviewesService: InterviewesService) {}

  @Get(':id')
  async getInterviewById(@Param('id', ParseIntPipe) id: number) {
    const interview = await this.interviewesService.getInterviewById(id);

    if (!interview) {
      throw new HttpException(
        `Собеседование с id: ${id} не найдено`,
        HttpStatus.NOT_FOUND,
      );
    }

    return interview;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createInterview(@Body() dto: CreateInterviewDto, @Req() req: CustomReq) {
    return this.interviewesService.createInterview({
      ...dto,
      userId: +req.user.sub,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  changeInterview(
    @Body() dto: ChangeInterviewDto,
    @Req() req: CustomReq,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.interviewesService.changeInterview({
      ...dto,
      userId: +req.user.sub,
      id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteInterview(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: CustomReq,
  ) {
    return this.interviewesService.deleteInterview(id, +req.user.sub);
  }
}
