import { Body, Controller, Get, Post, Param, Delete } from '@nestjs/common';

import { EmployeeService } from '../../application/services/employee.service';
import { CreateEmployeeDto } from '../../application/dtos/create-employee.dto';




@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  getAll() {
    return this.employeeService.getAll();
  }

  @Get(':id')
findById(@Param('id') id: string) {
  return this.employeeService.findById(Number(id));
}

  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    return this.employeeService.create(dto);
  }

  @Delete(':id')
delete(@Param('id') id: string) {
  return this.employeeService.delete(Number(id));
}
}