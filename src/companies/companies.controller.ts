import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';

@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Get()
  getAllCompanies(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
    @Query('search') search: string,
  ) {
    return this.companiesService.getAllCompanies(+limit, +offset, search);
  }

  @Get(':id')
  async getCompanyById(@Param('id', ParseIntPipe) id: number) {
    const company = await this.companiesService.getCompanyById(id);

    if (company) {
      return company;
    } else {
      return `Компания с id: ${id} не найдена`;
    }
  }
}
