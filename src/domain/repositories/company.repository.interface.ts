import { CompanyEntity } from '../entities/company.entity';

export interface ICompanyRepository {
  findAll(): Promise<CompanyEntity[]>;
  findById(id: number): Promise<CompanyEntity | null>;
  create(data: Partial<CompanyEntity>): Promise<CompanyEntity>;
  update(id: number, data: Partial<CompanyEntity>): Promise<CompanyEntity>;
  delete(id: number): Promise<void>;
}