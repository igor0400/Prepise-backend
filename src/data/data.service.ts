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
      const sections = await this.sectionsRepository.findAll(
         this.getOptions(params),
      );

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
      const positions = await this.positionsRepository.findAll(
         this.getOptions(params),
      );

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
      const companies = await this.companiesRepository.findAll(
         this.getOptions(params),
      );

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

   private getOptions(params: Params) {
      const { limit, offset, search = '' } = params;

      const options: any = {
         include: { all: true },
         where: {
            title: {
               [Op.like]: `%${search}%`,
            },
         },
         order: ['id'],
      };

      if (limit) options.limit = limit;
      if (offset) options.offset = offset;

      return options;
   }
}
