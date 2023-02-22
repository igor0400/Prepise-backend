import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Settings } from './models/settings.model';
import { NotifiSettings } from './models/notifi-settings.model';
import { CreateSettingsDto } from './dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Settings)
    private settingsRepository: typeof Settings,
    @InjectModel(NotifiSettings)
    private notifiSettingsRepository: typeof NotifiSettings,
  ) {}

  async changeSettings(dto: CreateSettingsDto) {
    const settings = await this.settingsRepository.findOne({
      where: { userId: dto.userId },
    });
    const notifiSettings = await this.notifiSettingsRepository.findOne({
      where: { settingsId: settings.id },
    });

    if (dto.notifications) {
      for (let key in dto.notifications) {
        if (key === 'all') {
          for (let notifiKey in notifiSettings.dataValues) {
            if (
              notifiSettings[notifiKey] !== undefined &&
              notifiKey !== 'settingsId'
            ) {
              notifiSettings[notifiKey] = dto.notifications.all;
            }
          }
          break;
        }

        if (notifiSettings[key] !== undefined && key !== 'settingsId') {
          notifiSettings[key] = dto.notifications[key];
        }
      }
    }

    notifiSettings.save();
    return settings;
  }
}
