import { Injectable } from '@nestjs/common';
import {
  Prisma,
} from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaUnitOfWork {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async execute<T>(
    work: (
      transaction: Prisma.TransactionClient,
    ) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(
      async (
        transaction: Prisma.TransactionClient,
      ) => {
        return work(transaction);
      },
    );
  }
}