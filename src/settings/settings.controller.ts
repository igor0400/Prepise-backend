import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CustomReq } from 'src/types/request-type';
import { CreateSettingsDto } from './dto/settings.dto';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @UseGuards(JwtAuthGuard)
  @Patch()
  changeSettings(@Body() dto: CreateSettingsDto, @Req() req: CustomReq) {
    return this.settingsService.changeSettings({
      ...dto,
      userId: +req.user.sub,
    });
  }
}
