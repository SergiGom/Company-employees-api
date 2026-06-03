import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import type { IUserRepository } from '../../domain/repositories/user.repository.interface';

import { UserEntity } from '../../domain/entities/user.entity';

@Injectable()
export class UserRepository
  implements IUserRepository
{
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findByEmail(
  correo: string,
): Promise<UserEntity | null> {
  const user =
    await this.prisma.usuario.findUnique({
      where: {
        correo,
      },
    });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    correo: user.correo,
    password: user.password,
    role: user.role,
    ciudad: user.ciudad,
    companiaId: user.companiaId,
    createdAt: user.createdAt,
  };
}

async create(
  correo: string,
  password: string,
  role: string,
  ciudad?: string,
  companiaId?: number,
): Promise<UserEntity> {
  const user =
    await this.prisma.usuario.create({
      data: {
        correo,
        password,
        role,
        ciudad,
        companiaId,
      },
    });

  return {
    id: user.id,
    correo: user.correo,
    password: user.password,
    role: user.role,
    ciudad: user.ciudad,
    companiaId: user.companiaId,
    createdAt: user.createdAt,
  };
}
}

