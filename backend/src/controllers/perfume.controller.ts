import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

export async function getAllPerfumes(req: Request, res: Response) {
  try {
    const { page = '1', limit = '10', category, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let whereClause: Prisma.PerfumeWhereInput = {};

    if (category) {
      whereClause.categoryId = category as string;
    }

    if (search) {
      whereClause.OR = [
        {
          name: {
            contains: search as string,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: search as string,
            mode: 'insensitive'
          }
        }
      ];
    }

    const [perfumes, total] = await Promise.all([
      prisma.perfume.findMany({
        skip,
        take: Number(limit),
        where: whereClause,
        include: {
          category: true,
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      }),
      prisma.perfume.count({ where: whereClause })
    ]);

    res.json({
      perfumes,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    console.error('Error in getAllPerfumes:', error);
    res.status(500).json({ error: 'Error fetching perfumes' });
  }
}

export async function getPerfumeById(req: Request, res: Response) {
  try {
    const perfume = await prisma.perfume.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    if (!perfume) {
      return res.status(404).json({ error: 'Perfume not found' });
    }
    
    res.json(perfume);
  } catch (error) {
    console.error('Error in getPerfumeById:', error);
    res.status(500).json({ error: 'Error fetching perfume' });
  }
}

export async function createPerfume(req: Request, res: Response) {
  try {
    const { name, description, price, stock, categoryId, imageUrl } = req.body;

    const perfume = await prisma.perfume.create({
      data: {
        name,
        description,
        price: new Prisma.Decimal(price),
        stock: Number(stock),
        categoryId,
        imageUrl
      },
      include: {
        category: true
      }
    });

    res.status(201).json(perfume);
  } catch (error) {
    console.error('Error in createPerfume:', error);
    res.status(500).json({ error: 'Error creating perfume' });
  }
}

export async function updatePerfume(req: Request, res: Response) {
  try {
    const { name, description, price, stock, categoryId, imageUrl } = req.body;

    const perfume = await prisma.perfume.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        price: price ? new Prisma.Decimal(price) : undefined,
        stock: stock ? Number(stock) : undefined,
        categoryId,
        imageUrl
      },
      include: {
        category: true
      }
    });

    res.json(perfume);
  } catch (error) {
    console.error('Error in updatePerfume:', error);
    res.status(500).json({ error: 'Error updating perfume' });
  }
}

export async function deletePerfume(req: Request, res: Response) {
  try {
    await prisma.perfume.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error in deletePerfume:', error);
    res.status(500).json({ error: 'Error deleting perfume' });
  }
}