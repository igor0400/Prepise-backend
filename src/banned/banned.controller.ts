import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { Roles } from 'src/roles/roles-auth.decorator';
import { BannedService } from './banned.service';
import { BanBlockDto } from './dto/ban-block.dto';
import { BanQuestionDto } from './dto/ban-question.dto';
import { BanUserDto } from './dto/ban-user.dto';

@Roles('ADMIN')
@UseGuards(RolesGuard)
@Controller('ban')
export class BannedController {
  constructor(private bannedService: BannedService) {}

  @Post('user/:id')
  banUser(
    @Body() banUserDto: BanUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.bannedService.banUser({ ...banUserDto, userId: id });
  }

  @Post('question/:id')
  banQuestion(
    @Body() banQuestionDto: BanQuestionDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.bannedService.banQuestion({
      ...banQuestionDto,
      questionId: id,
    });
  }

  @Post('block/:id')
  banBlock(
    @Body() banBlockDto: BanBlockDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.bannedService.banBlock({ ...banBlockDto, blockId: id });
  }
}
