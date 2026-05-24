import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompanyEntity } from '../../domain/entities/company.entity';
import { ICompanyRepository } from '../../domain/repositories/company.repository.interface';

@Injectable()
export class CompanyRepository implements ICompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CompanyEntity[]> {
    return this.prisma.compania.findMany();
  }

  async findById(id: number): Promise<CompanyEntity | null> {
    return this.prisma.compania.findUnique({
      where: { id },
    });
  }

  async create(data: Partial<CompanyEntity>): Promise<CompanyEntity> {
    return this.prisma.compania.create({
      data: {
        nombre: data.nombre!,
        direccion: data.direccion!,
        telefono: data.telefono!,
      },
    });
  }

  async update(
    id: number,
    data: Partial<CompanyEntity>,
  ): Promise<CompanyEntity> {
    return this.prisma.compania.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.compania.delete({
      where: { id },
    });
  }
}