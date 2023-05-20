import {
   Body,
   Controller,
   Delete,
   Post,
   UseGuards,
   Param,
   Req,
   Patch,
   ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CustomReq } from 'src/types/request-type';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
   constructor(private notificationsService: NotificationsService) {}

   @UseGuards(JwtAuthGuard)
   @Post()
   createNotification(
      @Body() dto: CreateNotificationDto,
      @Req() req: CustomReq,
   ) {
      return this.notificationsService.createNotification({
         ...dto,
         userId: +req.user.sub,
      });
   }

   @UseGuards(JwtAuthGuard)
   @Patch(':id/view')
   viewNotification(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.notificationsService.viewNotification(id, +req.user.sub);
   }

   @UseGuards(JwtAuthGuard)
   @Delete(':id')
   deleteNotification(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: CustomReq,
   ) {
      return this.notificationsService.deleteNotification(id, +req.user.sub);
   }
}
