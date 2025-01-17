import prisma from '../lib/prisma';

export const getPerfumes = async () => {
  return prisma.perfume.findMany({
    include: {
      orderItems: true
    }
  });
};

export const getPerfumeById = async (id: string) => {
  return prisma.perfume.findUnique({
    where: { id },
    include: {
      orderItems: true
    }
  });
};

export const createPerfume = async (data: any) => {
  return prisma.perfume.create({
    data,
    include: {
      orderItems: true
    }
  });
};

export const updatePerfume = async (id: string, data: any) => {
  return prisma.perfume.update({
    where: { id },
    data,
    include: {
      orderItems: true
    }
  });
};

export const deletePerfume = async (id: string) => {
  return prisma.perfume.delete({
    where: { id }
  });
};