import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import type { ICompanyRepository } from '../../domain/repositories/company.repository.interface';
import type { IEmployeeRepository } from '../../domain/repositories/employee.repository.interface';

import {
  COMPANY_REPOSITORY,
  EMPLOYEE_REPOSITORY,
} from '../../shared/constants/injection-tokens';

import { CreateCompanyDto } from '../dtos/create-company.dto';
import { UpdateCompanyDto } from '../dtos/update-company.dto';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';

import { PrismaUnitOfWork } from '../../infrastructure/unit-of-work/prisma-unit-of-work';

import { CreateCompanyWithEmployeesDto } from '../dtos/create-company-with-employees.dto';

@Injectable()
export class CompanyService {
  constructor(
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,

    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,

    private readonly unitOfWork: PrismaUnitOfWork,
  ) {}

  async getAll() {
    return this.companyRepository.findAll();
  }

  async getPaged(
  query: PaginationQueryDto,
) {
  const result =
    await this.companyRepository.getPaged(
      query.page || 1,
      query.size || 10,
      query.search,
      query.orderBy,
      query.direction,
    );

  return {
    data: result.data,
    page: query.page || 1,
    size: query.size || 10,
    total: result.total,
    totalPages: Math.ceil(
      result.total /
        (query.size || 10),
    ),
  };
}

  async getById(id: number) {
    const company =
      await this.companyRepository.findById(id);

    if (!company) {
      throw new NotFoundException(
        'Compañía no encontrada',
      );
    }

    return company;
  }

  async create(dto: CreateCompanyDto) {
    return this.companyRepository.create(dto);
  }

  async update(
    id: number,
    dto: UpdateCompanyDto,
  ) {
    return this.companyRepository.update(id, dto);
  }

  async delete(id: number) {
    return this.companyRepository.delete(id);
  }

  async getEmployees(
    companyId: number,
    query: PaginationQueryDto,
  ) {
    const company =
      await this.companyRepository.findById(
        companyId,
      );

    if (!company) {
      throw new NotFoundException(
        'Compañía no encontrada',
      );
    }

    return this.employeeRepository.getByCompanyPaged(
      companyId,
      query.page || 1,
      query.size || 10,
    );
  }

  async validateUpdatePermission(
  user: any,
) {
  if (
    user.role === 'ADMIN' &&
    user.ciudad === 'MEDELLIN'
  ) {
    throw new ForbiddenException(
      'Los administradores de Medellín no pueden editar compañías',
    );
  }
}

async validateDeletePermission(
  user: any,
) {
  if (
    user.role === 'ADMIN' &&
    user.ciudad === 'BOGOTA'
  ) {
    throw new ForbiddenException(
      'Los administradores de Bogotá no pueden eliminar compañías',
    );
  }
}

  async createWithEmployees(
    dto: CreateCompanyWithEmployeesDto,
  ) {
    return this.unitOfWork.execute(
      async () => {
        const company =
          await this.companyRepository.create({
            nombre: dto.company.nombre,
            direccion:
              dto.company.direccion,
            telefono:
              dto.company.telefono,
          });

        const employees =
          dto.employees.map(
            (employee) => ({
              ...employee,
              companiaId:
                company.id,
            }),
          );

        await this.employeeRepository.createRange(
          employees,
        );

        return company;
      },
    );
  }
}