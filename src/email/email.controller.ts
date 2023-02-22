import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CustomReq } from 'src/types/request-type';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('verify')
  verifyEmail(@Body('email') email: string) {
    return this.emailService.sendVerifyCode(email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('change-pass')
  changePass(@Req() req: CustomReq) {
    return this.emailService.sendChangePassCode(+req.user.sub);
  }
}
