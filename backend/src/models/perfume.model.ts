import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

export const PerfumeModel = {
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.PerfumeWhereInput;
  }) {
    return prisma.perfume.findMany({
      ...params,
      include: {
        category: true,
        promotions: true,
      },
    });
  },

  async findById(id: string) {
    return prisma.perfume.findUnique({
      where: { id },
      include: {
        category: true,
        promotions: true,
      },
    });
  },

  async create(data: Prisma.PerfumeCreateInput) {
    return prisma.perfume.create({
      data,
      include: {
        category: true,
      },
    });
  },

  async update(id: string, data: Prisma.PerfumeUpdateInput) {
    return prisma.perfume.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  },

  async delete(id: string) {
    return prisma.perfume.delete({
      where: { id },
    });
  },
};