import { Body, Controller, Get, Post } from '@nestjs/common';

import { EmployeeService } from '../../application/services/employee.service';
import { CreateEmployeeDto } from '../../application/dtos/create-employee.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  getAll() {
    return this.employeeService.getAll();
  }

  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    return this.employeeService.create(dto);
  }
}