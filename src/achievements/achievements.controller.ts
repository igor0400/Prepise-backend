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
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { Roles } from 'src/roles/roles-auth.decorator';
import { CustomReq } from 'src/types/request-type';
import { AchievementsService } from './achievements.service';
import { ChangeAchievementDto } from './dto/change-achievement.dto';
import { ChangeUserAchievementDto } from './dto/change-user-achievement.dto';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { CreateUserAchievementDto } from './dto/create-user-achievement.dto';

@Controller('achievements')
export class AchievementsController {
  constructor(private achievementsService: AchievementsService) {}
  @Get()
  delAllAchievements() {
    return this.achievementsService.getAllAchievements();
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Post()
  createAchievement(@Body() dto: CreateAchievementDto) {
    return this.achievementsService.createAchievement(dto);
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Patch(':id')
  async changeAchievement(
    @Body() dto: ChangeAchievementDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const achievement = await this.achievementsService.changeAchievement({
      ...dto,
      achievementId: id,
    });

    if (!achievement) {
      throw new HttpException(
        `Достижение с id: ${id} не найдено`,
        HttpStatus.NOT_FOUND,
      );
    }

    return achievement;
  }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Delete(':id')
  async deleteAchievement(@Param('id', ParseIntPipe) id: number) {
    const achievement = await this.achievementsService.deleteAchievement(id);

    if (!achievement) {
      throw new HttpException(
        `Достижение с id: ${id} не найдено`,
        HttpStatus.NOT_FOUND,
      );
    }

    return achievement;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/user')
  createUserAchievement(
    @Body() dto: CreateUserAchievementDto,
    @Req() req: CustomReq,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.achievementsService.createUserAchievement({
      ...dto,
      userId: +req.user.sub,
      userAchievementId: id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('user/:id')
  async changeUserAchievement(
    @Body() dto: ChangeUserAchievementDto,
    @Req() req: CustomReq,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const achievement = await this.achievementsService.changeUserAchievement({
      ...dto,
      userId: +req.user.sub,
      userAchievementId: id,
    });

    if (!achievement) {
      throw new HttpException(
        `Достижение с id: ${id} не найдено`,
        HttpStatus.NOT_FOUND,
      );
    }

    return achievement;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('user/:id')
  async deleteUserAchievement(
    @Req() req: CustomReq,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const achievement = await this.achievementsService.deleteUserAchievement(
      +req.user.sub,
      id,
    );

    if (!achievement) {
      throw new HttpException(
        `Достижение с id: ${id} не найдено`,
        HttpStatus.NOT_FOUND,
      );
    }

    return achievement;
  }
}
