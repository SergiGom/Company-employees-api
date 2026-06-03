import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

import {
  EMPLOYEE_REPOSITORY,
  COMPANY_REPOSITORY,
} from '../../shared/constants/injection-tokens';

import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { UpdateEmployeeDto } from '../dtos/update-employee.dto';
import { PatchEmployeeDto } from '../dtos/patch-employee.dto';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { PrismaUnitOfWork } from '../../infrastructure/unit-of-work/prisma-unit-of-work';

import type { IEmployeeRepository } from '../../domain/repositories/employee.repository.interface';
import type { ICompanyRepository } from '../../domain/repositories/company.repository.interface';

import { EmployeePolicyService } from '../../auth/policies/employee-policy.service';

@Injectable()
export class EmployeeService {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,

    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,

    private readonly employeePolicyService: EmployeePolicyService,
    private readonly unitOfWork: PrismaUnitOfWork,
  ) {}

  async getAll() {
    return this.employeeRepository.findAll();
  }

  async findAll() {
    return this.employeeRepository.findAll();
  }

  async findById(id: number) {
    const employee =
      await this.employeeRepository.findById(id);

    if (!employee) {
      throw new NotFoundException(
        'Employee not found',
      );
    }

    return employee;
  }

async validateOwnership(
  user: any,
  employeeId: number,
) {
  const employee =
    await this.employeeRepository.findById(
      employeeId,
    );

  if (!employee) {
    throw new NotFoundException(
      'Employee not found',
    );
  }

  const allowed =
    this.employeePolicyService.canEditEmployee(
      user,
      employee,
    );

  if (!allowed) {
    throw new ForbiddenException(
      'No autorizado',
    );
  }

  return employee;
}

async validatePatchPermission(
  user: any,
) {
  const allowed =
    this.employeePolicyService.canPatch(
      user,
    );

  if (!allowed) {
    throw new ForbiddenException(
      'Los administradores de Medellín no pueden editar empleados',
    );
  }
}

async validateDeletePermission(
  user: any,
) {
  const allowed =
    this.employeePolicyService.canDelete(
      user,
    );

  if (!allowed) {
    throw new ForbiddenException(
      'Los administradores de Bogotá no pueden eliminar empleados',
    );
  }
}

  async create(dto: CreateEmployeeDto) {
    const company =
      await this.companyRepository.findById(
        dto.companiaId,
      );

    if (!company) {
      throw new BadRequestException(
        'La compañía no existe',
      );
    }

    const emailExists =
      await this.employeeRepository.findByEmail(
        dto.correo,
      );

    if (emailExists) {
      throw new BadRequestException(
        'Correo ya registrado',
      );
    }

    return this.employeeRepository.create(dto);
  }

 async update(
  id: number,
  dto: UpdateEmployeeDto,
) {
  if (dto.companiaId !== undefined) {
    const company =
      await this.companyRepository.findById(
        dto.companiaId,
      );

    if (!company) {
      throw new BadRequestException(
        'La compañía no existe',
      );
    }
  }

  if (dto.correo) {
    const emailExists =
      await this.employeeRepository.findByEmail(
        dto.correo,
      );

    if (
      emailExists &&
      emailExists.id !== id
    ) {
      throw new BadRequestException(
        'Correo ya registrado',
      );
    }
  }

  return this.employeeRepository.update(
    id,
    dto,
  );
}

  async patch(
  id: number,
  dto: PatchEmployeeDto,
) {
  if (dto.companiaId) {
    const company =
      await this.companyRepository.findById(
        dto.companiaId,
      );

    if (!company) {
      throw new BadRequestException(
        'La compañía no existe',
      );
    }
  }

  return this.employeeRepository.patchPartial(
    id,
    dto,
  );
}

  async delete(id: number) {
    return this.employeeRepository.delete(id);
  }

  async createRange(
    employees: CreateEmployeeDto[],
  ) {
    for (const employee of employees) {
      const company =
        await this.companyRepository.findById(
          employee.companiaId,
        );

      if (!company) {
        throw new BadRequestException(
          `La compañía ${employee.companiaId} no existe`,
        );
      }

      const emailExists =
        await this.employeeRepository.findByEmail(
          employee.correo,
        );

      if (emailExists) {
        throw new BadRequestException(
          `El correo ${employee.correo} ya está registrado`,
        );
      }
    }

   return this.unitOfWork.execute(
  async () => {
    return this.employeeRepository.createRange(
      employees,
    );
  },
);
  }

  async deleteRange(ids: number[]) {
  return this.unitOfWork.execute(
    async () => {
      return this.employeeRepository.deleteRange(
        ids,
      );
    },
  );
}

  async getPaged(
    query: PaginationQueryDto,
  ) {
    const result =
      await this.employeeRepository.getPaged(
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
        result.total / (query.size || 10),
      ),
    };
  }

  
}