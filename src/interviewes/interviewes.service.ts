import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ChangeInterviewDto } from './dto/change-interview.dto';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { Interview } from './models/interview.model';

@Injectable()
export class InterviewesService {
  constructor(
    @InjectModel(Interview)
    private interviewRepository: typeof Interview,
  ) {}

  async getInterviewById(id: number) {
    const interview = await this.interviewRepository.findByPk(id);
    return interview;
  }

  async createInterview(dto: CreateInterviewDto) {
    const interview = await this.interviewRepository.create(dto);
    return interview;
  }

  async changeInterview(dto: ChangeInterviewDto) {
    const { id, userId } = dto;
    const interview = await this.interviewRepository.findOne({
      where: { id, userId },
    });

    for (let key in dto) {
      if (interview !== undefined) {
        interview[key] = dto[key];
      }
    }

    return interview.save();
  }

  async deleteInterview(id: number, userId: number) {
    const interview = await this.interviewRepository.destroy({
      where: { id, userId },
    });
    return interview;
  }
}
