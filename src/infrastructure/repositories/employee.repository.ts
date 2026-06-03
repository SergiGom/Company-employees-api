import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmployeeEntity } from '../../domain/entities/employee.entity';
import { IEmployeeRepository } from '../../domain/repositories/employee.repository.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class EmployeeRepository implements IEmployeeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<EmployeeEntity[]> {
    const employees = await this.prisma.empleado.findMany();

    return employees.map((employee) => ({
      ...employee,
      salario: Number(employee.salario),
    }));
  }

  async findById(id: number): Promise<EmployeeEntity | null> {
    const employee = await this.prisma.empleado.findUnique({
      where: { id },
    });

    if (!employee) return null;

    return {
      ...employee,
      salario: Number(employee.salario),
    };
  }

  async findByEmail(
  correo: string,
): Promise<EmployeeEntity | null> {
  const employee =
    await this.prisma.empleado.findUnique({
      where: {
        correo,
      },
    });

  if (!employee) {
    return null;
  }

  return {
    ...employee,
    salario: Number(employee.salario),
  };
}

async getByCompanyPaged(
  companyId: number,
  page: number,
  size: number,
) {
  const skip = (page - 1) * size;

  const [employees, total] =
    await Promise.all([
      this.prisma.empleado.findMany({
        where: {
          companiaId: companyId,
        },
        skip,
        take: size,
      }),
      this.prisma.empleado.count({
        where: {
          companiaId: companyId,
        },
      }),
    ]);

  return {
    data: employees,
    page,
    size,
    total,
    totalPages: Math.ceil(
      total / size,
    ),
  };
}

  async create(
    data: Partial<EmployeeEntity>,
  ): Promise<EmployeeEntity> {
    const employee = await this.prisma.empleado.create({
      data: {
        nombre: data.nombre!,
        apellido: data.apellido!,
        correo: data.correo!,
        cargo: data.cargo!,
        salario: new Prisma.Decimal(data.salario!),
        companiaId: data.companiaId!,
      },
    });

    return {
      ...employee,
      salario: Number(employee.salario),
    };
  }

  async update(
    id: number,
    data: Partial<EmployeeEntity>,
  ): Promise<EmployeeEntity> {
    const employee = await this.prisma.empleado.update({
      where: { id },

      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        cargo: data.cargo,

        salario:
          data.salario !== undefined
            ? new Prisma.Decimal(data.salario)
            : undefined,

        companiaId: data.companiaId,
      },
    });

    return {
      ...employee,
      salario: Number(employee.salario),
    };
  }

  async patchPartial(
    id: number,
    data: Partial<EmployeeEntity>,
  ): Promise<EmployeeEntity> {
    const employee = await this.prisma.empleado.update({
      where: { id },

      data: {
        ...data,

        salario:
          data.salario !== undefined
            ? new Prisma.Decimal(data.salario)
            : undefined,
      },
    });

    return {
      ...employee,
      salario: Number(employee.salario),
    };
  }

  async delete(id: number): Promise<void> {
    await this.prisma.empleado.delete({
      where: { id },
    });
  }

  async createRange(
  employees: Partial<EmployeeEntity>[],
): Promise<EmployeeEntity[]> {

  const createdEmployees: EmployeeEntity[] = [];

  for (const employeeData of employees) {
    const employee =
      await this.prisma.empleado.create({
        data: {
          nombre:
            employeeData.nombre!,

          apellido:
            employeeData.apellido!,

          correo:
            employeeData.correo!,

          cargo:
            employeeData.cargo!,

          salario:
            new Prisma.Decimal(
              employeeData.salario!,
            ),

          companiaId:
            employeeData.companiaId!,
        },
      });

    createdEmployees.push({
      ...employee,
      salario: Number(
        employee.salario,
      ),
    });
  }

  return createdEmployees;
}

  async deleteRange(ids: number[]): Promise<void> {
    await this.prisma.empleado.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async getPaged(
    page: number,
    size: number,
    search?: string,
    orderBy: string = 'id',
    direction: 'asc' | 'desc' = 'asc',
  ): Promise<{
    data: EmployeeEntity[];
    total: number;
  }> {
    const skip = (page - 1) * size;

    const where = search
      ? {
          OR: [
            {
              nombre: {
                contains: search,
              },
            },
            {
              apellido: {
                contains: search,
              },
            },
            {
              correo: {
                contains: search,
              },
            },
          ],
        }
      : {};

    const [employees, total] = await Promise.all([
      this.prisma.empleado.findMany({
        where,
        skip,
        take: size,

        orderBy: {
          [orderBy]: direction,
        },
      }),

      this.prisma.empleado.count({
        where,
      }),
    ]);

    return {
      data: employees.map((employee) => ({
        ...employee,
        salario: Number(employee.salario),
      })),

      total,
    };
  }
}

