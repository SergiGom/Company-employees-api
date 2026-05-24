import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { CompanyService } from '../../application/services/company.service';
import { CreateCompanyDto } from '../../application/dtos/create-company.dto';
import { UpdateCompanyDto } from '../../application/dtos/update-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  getAll() {
    return this.companyService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.companyService.getById(Number(id));
  }

  @Post()
  create(@Body() dto: CreateCompanyDto) {
    return this.companyService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.companyService.update(Number(id), dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.companyService.delete(Number(id));
  }
}