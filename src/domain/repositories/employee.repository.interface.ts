import { EmployeeEntity } from '../entities/employee.entity';

export interface IEmployeeRepository {
  findAll(): Promise<EmployeeEntity[]>;

  findById(id: number): Promise<EmployeeEntity | null>;

  create(data: Partial<EmployeeEntity>): Promise<EmployeeEntity>;

  update(
    id: number,
    data: Partial<EmployeeEntity>,
  ): Promise<EmployeeEntity>;

  delete(id: number): Promise<void>;

  getByCompanyPaged(
  companyId: number,
  page: number,
  size: number,
): Promise<any>;

  patchPartial(
    id: number,
    data: Partial<EmployeeEntity>,
  ): Promise<EmployeeEntity>;

  createRange(
    employees: Partial<EmployeeEntity>[],
  ): Promise<EmployeeEntity[]>;

  findByEmail(
  correo: string,
): Promise<EmployeeEntity | null>;

  deleteRange(ids: number[]): Promise<void>;

  getPaged(
    page: number,
    size: number,
    search?: string,
    orderBy?: string,
    direction?: 'asc' | 'desc',
  ): Promise<{
    data: EmployeeEntity[];
    total: number;
  }>;
}