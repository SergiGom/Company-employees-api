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

  async create(data: Partial<EmployeeEntity>): Promise<EmployeeEntity> {
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
}