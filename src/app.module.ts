import { Module } from '@nestjs/common';

import { PrismaService } from './infrastructure/prisma/prisma.service';

import { CompanyRepository } from './infrastructure/repositories/company.repository';
import { EmployeeRepository } from './infrastructure/repositories/employee.repository';

import { PrismaUnitOfWork } from './infrastructure/unit-of-work/prisma-unit-of-work';

import { CompanyService } from './application/services/company.service';
import { EmployeeService } from './application/services/employee.service';

import { CompaniesController } from './presentation/controllers/companies.controller';
import { EmployeesController } from './presentation/controllers/employees.controller';

import { LoggerService } from './infrastructure/logging/logger.service';

@Module({
  imports: [],

  controllers: [
    CompaniesController,
    EmployeesController,
  ],

  providers: [
    PrismaService,

    CompanyRepository,
    EmployeeRepository,

    PrismaUnitOfWork,

    CompanyService,
    EmployeeService,

    LoggerService,
  ],
})
export class AppModule {}