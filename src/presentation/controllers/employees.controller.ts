
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { EmployeeService } from '../../application/services/employee.service';

import { CreateEmployeeDto } from '../../application/dtos/create-employee.dto';

import { PatchEmployeeDto } from '../../application/dtos/patch-employee.dto';

import { PaginationQueryDto } from '../../application/dtos/pagination-query.dto';

import { Roles } from '../../auth/decorators/roles.decorator';

import { RolesGuard } from '../../auth/guards/roles.guard';



@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('employees')
export class EmployeesController {
  constructor(
    private readonly employeeService: EmployeeService,
  ) {}

  @Get()
  getPaged(@Query() query: PaginationQueryDto) {
    return this.employeeService.getPaged(query);
  }

 @Get(':id')
async findById(
  @Req() req: any,
  @Param('id') id: string,
) {
  await this.employeeService.validateOwnership(
    req.user,
    Number(id),
  );

  return this.employeeService.findById(
    Number(id),
  );
}

  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    return this.employeeService.create(dto);
  }

 @Post('lote')
@Roles('ADMIN')
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
createRange(
  @Body() employees: CreateEmployeeDto[],
) {
  return this.employeeService.createRange(
    employees,
  );
}

 @Patch(':id')
async patch(
  @Req() req: any,
  @Param('id') id: string,
  @Body() dto: PatchEmployeeDto,
) {
  await this.employeeService.validatePatchPermission(
    req.user,
  );

  await this.employeeService.validateOwnership(
    req.user,
    Number(id),
  );

  return this.employeeService.patch(
    Number(id),
    dto,
  );
}

  @Delete('lote')
@Roles('ADMIN')
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
deleteRange(
  @Body() ids: number[],
) {
  return this.employeeService.deleteRange(
    ids,
  );
}

 @Delete(':id')
@Roles('ADMIN')
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
async delete(
  @Req() req: any,
  @Param('id') id: string,
) {
  await this.employeeService.validateDeletePermission(
    req.user,
  );

  await this.employeeService.validateOwnership(
    req.user,
    Number(id),
  );

  return this.employeeService.delete(
    Number(id),
  );
}
}

