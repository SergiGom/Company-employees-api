import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

import { CompanyService } from '../../application/services/company.service';

import { CreateCompanyDto } from '../../application/dtos/create-company.dto';
import { UpdateCompanyDto } from '../../application/dtos/update-company.dto';
import { PaginationQueryDto } from '../../application/dtos/pagination-query.dto';
import { CreateCompanyWithEmployeesDto } from '../../application/dtos/create-company-with-employees.dto';

@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
@ApiBearerAuth()
@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly companyService: CompanyService,
  ) {}

  @Get()
getAll(
  @Query()
  query: PaginationQueryDto,
) {
  return this.companyService.getPaged(
    query,
  );
}

  @Get(':id')
  getById(
    @Param('id') id: string,
  ) {
    return this.companyService.getById(
      Number(id),
    );
  }

  @Get(':id/employees')
  getEmployees(
    @Param('id') id: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.companyService.getEmployees(
      Number(id),
      query,
    );
  }

  @Post('with-employees')
@Roles('ADMIN')
createWithEmployees(
  @Body()
  dto: CreateCompanyWithEmployeesDto,
) {
  return this.companyService.createWithEmployees(
    dto,
  );
}

  @Post()
  @Roles('ADMIN', 'USER')
  create(
    @Body() dto: CreateCompanyDto,
  ) {
    return this.companyService.create(
      dto,
    );
  }

  @Put(':id')
  @Roles('ADMIN', 'USER')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.companyService.update(
      Number(id),
      dto,
    );
  }

  @Delete(':id')
  @Roles('ADMIN')
  delete(
    @Param('id') id: string,
  ) {
    return this.companyService.delete(
      Number(id),
    );
  }
}