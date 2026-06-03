import { Type } from 'class-transformer';

import {
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';

import { CreateCompanyDto } from './create-company.dto';
import { CreateEmployeeDto } from './create-employee.dto';

export class CreateCompanyWithEmployeesDto {
  @ValidateNested()
  @Type(() => CreateCompanyDto)
  company!: CreateCompanyDto;

  @ValidateNested({
    each: true,
  })
  @Type(() => CreateEmployeeDto)
  @ArrayMinSize(1)
  employees!: CreateEmployeeDto[];
}