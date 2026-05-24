import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyRepository } from '../../infrastructure/repositories/company.repository';
import { CreateCompanyDto } from '../dtos/create-company.dto';
import { UpdateCompanyDto } from '../dtos/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
  ) {}

  async getAll() {
    return this.companyRepository.findAll();
  }

  async getById(id: number) {
    const company = await this.companyRepository.findById(id);

    if (!company) {
      throw new NotFoundException('Compañía no encontrada');
    }

    return company;
  }

  async create(dto: CreateCompanyDto) {
    return this.companyRepository.create(dto);
  }

  async update(id: number, dto: UpdateCompanyDto) {
    return this.companyRepository.update(id, dto);
  }

  async delete(id: number) {
    return this.companyRepository.delete(id);
  }
}