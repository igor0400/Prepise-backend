import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/models/user.model';
import { usersInclude } from 'src/users/users.service';
import { Op } from 'sequelize';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(User)
    private userRepository: typeof User,
  ) {}

  async getAllCompanies(limit: number, offset: number, search: string = '') {
    const users = await this.userRepository.findAll({
      offset: offset || 0,
      limit: limit || 100,
      include: usersInclude,
      where: {
        type: 'company',
        name: {
          [Op.like]: `%${search}%`,
        },
      },
      order: ['id'],
    });

    return users;
  }

  async getCompanyById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, type: 'company' },
      include: usersInclude,
    });

    return user;
  }
}
