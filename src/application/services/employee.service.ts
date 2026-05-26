import { Injectable } from '@nestjs/common';
import { EmployeeRepository } from '../../infrastructure/repositories/employee.repository';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async getAll() {
    return this.employeeRepository.findAll();
  }

  async findById(id: number) {
  return this.employeeRepository.findById(id);
}

  async create(dto: CreateEmployeeDto) {
    return this.employeeRepository.create(dto);
  }

  async delete(id: number) {
  return this.employeeRepository.delete(id);
}
}