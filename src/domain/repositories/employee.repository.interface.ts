import { EmployeeEntity } from '../entities/employee.entity';

export interface IEmployeeRepository {
  findAll(): Promise<EmployeeEntity[]>;
  findById(id: number): Promise<EmployeeEntity | null>;
  create(data: Partial<EmployeeEntity>): Promise<EmployeeEntity>;
  delete(id: number): Promise<void>;
}