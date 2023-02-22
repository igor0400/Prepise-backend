import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ChangeAchievementDto } from './dto/change-achievement.dto';
import { ChangeUserAchievementDto } from './dto/change-user-achievement.dto';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { CreateUserAchievementDto } from './dto/create-user-achievement.dto';
import { Achievement } from './models/achievement.model';
import { UserAchievement } from './models/user-achievement.model';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectModel(Achievement)
    private achievementRepository: typeof Achievement,
    @InjectModel(UserAchievement)
    private userAchievementRepository: typeof UserAchievement,
  ) {}

  async getAllAchievements() {
    const achievements = await this.achievementRepository.findAll();
    return achievements;
  }

  async createAchievement(dto: CreateAchievementDto) {
    const achievement = await this.achievementRepository.create(dto);
    return achievement;
  }

  async deleteAchievement(id: number) {
    const achievement = await this.achievementRepository.destroy({
      where: { id },
    });
    return achievement;
  }

  async changeAchievement(dto: ChangeAchievementDto) {
    const achievement = await this.achievementRepository.findOne({
      where: { id: dto.achievementId },
    });

    for (let key in dto) {
      if (achievement[key] !== undefined) {
        achievement[key] = dto[key];
      }
    }

    return achievement.save();
  }

  async createUserAchievement(dto: CreateUserAchievementDto) {
    const achievement = await this.userAchievementRepository.create(dto);
    return achievement;
  }

  async changeUserAchievement(dto: ChangeUserAchievementDto) {
    const achievement = await this.userAchievementRepository.findOne({
      where: { id: dto.userAchievementId },
    });

    for (let key in dto) {
      if (achievement[key] !== undefined) {
        achievement[key] = dto[key];
      }
    }

    return achievement.save();
  }

  async deleteUserAchievement(userId: number, achievementId: number) {
    const achievement = await this.userAchievementRepository.destroy({
      where: { userId, achievementId },
    });
    return achievement;
  }
}
