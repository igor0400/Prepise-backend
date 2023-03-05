import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sections } from './models/services.model';
import { Op } from 'sequelize';
import { Positions } from './models/positions.model';
import { Companies } from './models/companies.model';

interface Params {
   limit?: number;
   offset?: number;
   search?: string;
}

@Injectable()
export class DataService {
   constructor(
      @InjectModel(Sections)
      private sectionsRepository: typeof Sections,
      @InjectModel(Positions)
      private positionsRepository: typeof Positions,
      @InjectModel(Companies)
      private companiesRepository: typeof Companies,
   ) {}

   async getSections(params: Params) {
      const { limit = 50, offset = 0, search = '' } = params;
      const sections = await this.sectionsRepository.findAll({
         offset: offset || 0,
         limit: limit || 100,
         include: { all: true },
         where: {
            title: {
               [Op.like]: `%${search}%`,
            },
         },
         order: ['id'],
      });

      return sections;
   }

   async createSection(title: string) {
      const section = await this.sectionsRepository.findOne({
         where: { title },
      });

      if (section) {
         throw new HttpException(
            'Раздел с таким назнанием уже существует',
            HttpStatus.BAD_REQUEST,
         );
      }

      return this.sectionsRepository.create({ title });
   }

   async getPositions(params: Params) {
      const { limit = 50, offset = 0, search = '' } = params;
      const positions = await this.positionsRepository.findAll({
         offset: offset || 0,
         limit: limit || 100,
         include: { all: true },
         where: {
            title: {
               [Op.like]: `%${search}%`,
            },
         },
         order: ['id'],
      });

      return positions;
   }

   async createPositions(title: string) {
      const position = await this.positionsRepository.findOne({
         where: { title },
      });

      if (position) {
         throw new HttpException(
            'Должность с таким назнанием уже существует',
            HttpStatus.BAD_REQUEST,
         );
      }

      return this.positionsRepository.create({ title });
   }

   async getCompanies(params: Params) {
      const { limit = 50, offset = 0, search = '' } = params;
      const companies = await this.companiesRepository.findAll({
         offset: offset || 0,
         limit: limit || 100,
         include: { all: true },
         where: {
            title: {
               [Op.like]: `%${search}%`,
            },
         },
         order: ['id'],
      });

      return companies;
   }

   async createCompany(title: string) {
      const company = await this.companiesRepository.findOne({
         where: { title },
      });

      if (company) {
         throw new HttpException(
            'Компания с таким назнанием уже существует',
            HttpStatus.BAD_REQUEST,
         );
      }

      return this.companiesRepository.create({ title });
   }

   async createAllData(opts: {
      section?: string;
      position?: string;
      company?: string;
   }) {
      const { section, position, company } = opts;

      if (section) {
         await this.sectionsRepository.findOrCreate({
            where: { title: section },
         });
      }

      if (position) {
         await this.positionsRepository.findOrCreate({
            where: { title: position },
         });
      }

      if (company) {
         await this.companiesRepository.findOrCreate({
            where: { title: company },
         });
      }
   }
}
