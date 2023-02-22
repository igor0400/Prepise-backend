import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CustomReq } from 'src/types/request-type';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private statsService: StatsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getUserStats(@Req() req: CustomReq) {
    return this.statsService.getUserStats(+req.user.sub);
  }
}
