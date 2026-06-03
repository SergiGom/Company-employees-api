import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';

import { PrismaService } from './infrastructure/prisma/prisma.service';

import { CompanyRepository } from './infrastructure/repositories/company.repository';

import { EmployeeRepository } from './infrastructure/repositories/employee.repository';

import { UserRepository } from './infrastructure/repositories/user.repository';

import { PrismaUnitOfWork } from './infrastructure/unit-of-work/prisma-unit-of-work';

import { CompanyService } from './application/services/company.service';

import { EmployeeService } from './application/services/employee.service';

import { CompaniesController } from './presentation/controllers/companies.controller';

import { EmployeesController } from './presentation/controllers/employees.controller';

import { LoggerService } from './infrastructure/logging/logger.service';

import { EmployeePolicyService } from './auth/policies/employee-policy.service';

import {
  COMPANY_REPOSITORY,
  EMPLOYEE_REPOSITORY,
  USER_REPOSITORY,
} from './shared/constants/injection-tokens';

@Module({
  imports: [AuthModule],

  controllers: [
    CompaniesController,
    EmployeesController,
  ],

  providers: [
  PrismaService,

  {
    provide: COMPANY_REPOSITORY,
    useClass: CompanyRepository,
  },

  {
    provide: EMPLOYEE_REPOSITORY,
    useClass: EmployeeRepository,
  },

  {
    provide: USER_REPOSITORY,
    useClass: UserRepository,
  },

  PrismaUnitOfWork,

  CompanyService,
  EmployeeService,

  EmployeePolicyService,

  LoggerService,
],
})
export class AppModule {}


