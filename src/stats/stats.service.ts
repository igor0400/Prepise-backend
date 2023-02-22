import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserFollowingUser } from 'src/users/models/user-following-user.model';
import { User } from 'src/users/models/user.model';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(User)
    private userRepository: typeof User,
    @InjectModel(UserFollowingUser)
    private follofingUserRepository: typeof UserFollowingUser,
  ) {}

  async getUserStats(userId: number) {
    const stats = { viewes: 0, likes: 0, subs: 0 };

    const user = await this.userRepository.findOne({
      where: { id: userId },
      include: { all: true },
    });
    const subs = await this.follofingUserRepository.findAll({
      where: { followedUserId: userId },
    });

    stats.subs = subs.length;

    user.questions.forEach((item) => {
      stats.viewes += item.viewes;
      stats.likes += item.likes;
    });
    user.blocks.forEach((item) => {
      stats.viewes += item.viewes;
      stats.likes += item.likes;
    });

    return stats;
  }
}
