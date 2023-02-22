import { CreateNotifiSettingsDto } from './create-notifi-settings.dto';

export class CreateSettingsDto {
  readonly userId: number;
  readonly notifications?: CreateNotifiSettingsDto;
}

export class ChangeSettingsDto extends CreateSettingsDto {}
