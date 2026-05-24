import { EmployeeEntity } from '../entities/employee.entity';

export interface IEmployeeRepository {
  findAll(): Promise<EmployeeEntity[]>;
  create(data: Partial<EmployeeEntity>): Promise<EmployeeEntity>;
}