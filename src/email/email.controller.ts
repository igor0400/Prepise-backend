import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CustomReq } from 'src/types/request-type';
import { EmailVerifyDto } from './dto/email-verify.dto';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
   constructor(private emailService: EmailService) {}

   @Post('verify')
   verifyEmail(@Body() dto: EmailVerifyDto) {
      return this.emailService.sendVerifyCode(dto.email);
   }

   @UseGuards(JwtAuthGuard)
   @Post('change-pass')
   changePass(@Req() req: CustomReq) {
      return this.emailService.sendChangePassCode(+req.user.sub);
   }

   @UseGuards(JwtAuthGuard)
   @Post('default')
   default(@Req() req: CustomReq) {
      return this.emailService.sendDefaultCode(+req.user.sub);
   }
}
