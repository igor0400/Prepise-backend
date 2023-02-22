import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Block } from 'src/blocks/models/block.model';
import { Question } from 'src/questions/models/question.model';
import { User } from 'src/users/models/user.model';
import { CreateFavouriteBlock } from './dto/create-favourite-block.dto';
import { CreateFavouriteCompany } from './dto/create-favourite-company.dto';
import { CreateFavouriteQuestion } from './dto/create-favourite-question.dto';
import { CreateFavouriteTag } from './dto/create-favourite-tag.dto';
import { CreateFavouriteTestBlock } from './dto/create-favourite-test-block.dto';
import { CreateFavouriteTestQuestion } from './dto/create-favourite-test-question.dto';
import { CreateFavouriteUser } from './dto/create-favourite-user.dto';
import { FavouriteBlock } from './models/favourite-block.model';
import { FavouriteCompany } from './models/favourite-company.model';
import { FavouriteQuestion } from './models/favourite-question.model';
import { FavouriteTag } from './models/favourite-tag.model';
import { FavouriteTestBlock } from './models/favourite-test-block.model';
import { FavouriteTestQuestion } from './models/favourite-test-question.model';
import { FavouriteUser } from './models/favourite-user.model';

@Injectable()
export class FavouritesService {
  constructor(
    @InjectModel(FavouriteQuestion)
    private favouriteQuestionRepository: typeof FavouriteQuestion,
    @InjectModel(FavouriteTestQuestion)
    private favouriteTestQuestionRepository: typeof FavouriteTestQuestion,
    @InjectModel(FavouriteBlock)
    private favouriteBlockRepository: typeof FavouriteBlock,
    @InjectModel(FavouriteTestBlock)
    private favouriteTestBlockRepository: typeof FavouriteTestBlock,
    @InjectModel(FavouriteUser)
    private favouriteUserRepository: typeof FavouriteUser,
    @InjectModel(FavouriteCompany)
    private favouriteCompanyRepository: typeof FavouriteCompany,
    @InjectModel(FavouriteTag)
    private favouriteTagRepository: typeof FavouriteTag,
    @InjectModel(Question)
    private questionRepository: typeof Question,
    @InjectModel(Block)
    private blockRepository: typeof Block,
    @InjectModel(User)
    private userRepository: typeof User,
  ) {}

  async createFavouriteQuestion(dto: CreateFavouriteQuestion) {
    await this.verifyType(this.questionRepository, dto.questionId, 'default');

    const question = await this.favouriteQuestionRepository.create(dto);
    return question;
  }

  async deleteFavouriteQuestion(id: number) {
    const question = await this.favouriteQuestionRepository.destroy({
      where: { questionId: id },
    });
    return question;
  }

  async createFavouriteTestQuestion(dto: CreateFavouriteTestQuestion) {
    await this.verifyType(this.questionRepository, dto.testQuestionId, 'test');

    const question = await this.favouriteTestQuestionRepository.create(dto);
    return question;
  }

  async deleteFavouriteTestQuestion(id: number) {
    const question = await this.favouriteTestQuestionRepository.destroy({
      where: { testQuestionId: id },
    });
    return question;
  }

  async createFavouriteBlock(dto: CreateFavouriteBlock) {
    await this.verifyType(this.blockRepository, dto.blockId, 'default');

    const block = await this.favouriteBlockRepository.create(dto);
    return block;
  }

  async deleteFavouriteBlock(id: number) {
    const block = await this.favouriteBlockRepository.destroy({
      where: { blockId: id },
    });
    return block;
  }

  async createFavouriteTestBlock(dto: CreateFavouriteTestBlock) {
    await this.verifyType(this.blockRepository, dto.testBlockId, 'test');

    const block = await this.favouriteTestBlockRepository.create(dto);
    return block;
  }

  async deleteFavouriteTestBlock(id: number) {
    const block = await this.favouriteTestBlockRepository.destroy({
      where: { testBlockId: id },
    });
    return block;
  }

  async createFavouriteUser(dto: CreateFavouriteUser) {
    await this.verifyUserType(dto.favouriteUserId, 'user');

    const user = await this.favouriteUserRepository.create(dto);
    return user;
  }

  async deleteFavouriteUser(id: number) {
    const user = await this.favouriteUserRepository.destroy({
      where: { userId: id },
    });
    return user;
  }

  async createFavouriteCompany(dto: CreateFavouriteCompany) {
    await this.verifyUserType(dto.companyId, 'company');

    const company = await this.favouriteCompanyRepository.create(dto);
    return company;
  }

  async deleteFavouriteCompany(id: number) {
    const company = await this.favouriteCompanyRepository.destroy({
      where: { companyId: id },
    });
    return company;
  }

  async createFavouriteTag(dto: CreateFavouriteTag) {
    const tag = await this.favouriteTagRepository.create(dto);
    return tag;
  }

  async deleteFavouriteTag(id: number) {
    const tag = await this.favouriteTagRepository.destroy({
      where: { tagId: id },
    });
    return tag;
  }

  private async verifyType(
    repository: any,
    id: number,
    type: 'default' | 'test',
  ) {
    const entity = await repository.findByPk(id);

    if (entity.type !== type) {
      throw new HttpException('Неверный тип', HttpStatus.BAD_REQUEST);
    }

    return true;
  }

  private async verifyUserType(id: number, type: 'user' | 'company') {
    const entity = await this.userRepository.findByPk(id);

    if (entity.type !== type) {
      throw new HttpException('Неверный тип', HttpStatus.BAD_REQUEST);
    }

    return true;
  }
}
