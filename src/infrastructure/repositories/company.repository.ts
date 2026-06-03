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
  async getPaged(
  page: number,
  size: number,
  search?: string,
  orderBy: string = 'id',
  direction: 'asc' | 'desc' = 'asc',
): Promise<{
  data: CompanyEntity[];
  total: number;
}> {
  const skip = (page - 1) * size;

  const where = search
    ? {
        OR: [
          {
            nombre: {
              contains: search,
            },
          },
          {
            direccion: {
              contains: search,
            },
          },
          {
            telefono: {
              contains: search,
            },
          },
        ],
      }
    : {};

  const [companies, total] =
    await Promise.all([
      this.prisma.compania.findMany({
        where,
        skip,
        take: size,
        orderBy: {
          [orderBy]: direction,
        },
      }),

      this.prisma.compania.count({
        where,
      }),
    ]);

  return {
    data: companies,
    total,
  };
}
}