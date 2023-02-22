import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './model/notification.model';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification)
    private notificationRepository: typeof Notification,
  ) {}

  async createNotification(dto: CreateNotificationDto) {
    const notification = await this.notificationRepository.create(dto);
    return notification;
  }

  async viewNotification(id: number, userId: number) {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId },
    });

    if (notification) {
      notification.viewed = true;
    }

    return notification.save();
  }

  async deleteNotification(id: number, userId: number) {
    const notification = await this.notificationRepository.destroy({
      where: { id, userId },
    });
    return notification;
  }
}
