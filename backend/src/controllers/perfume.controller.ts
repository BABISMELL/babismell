import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../@types/express';

export const getPerfumes = async (req: Request, res: Response) => {
  try {
    const { categoryId, search } = req.query;

    const where: any = {};
    if (categoryId) {
      where.categoryId = categoryId as string;
    }
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const perfumes = await prisma.perfume.findMany({
      where,
      include: {
        category: true,
        reviews: true
      }
    });

    return res.json(perfumes);
  } catch (error) {
    console.error('Get perfumes error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPerfume = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const perfume = await prisma.perfume.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: true
      }
    });

    if (!perfume) {
      return res.status(404).json({ message: 'Perfume not found' });
    }

    return res.json(perfume);
  } catch (error) {
    console.error('Get perfume error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const createPerfume = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }

    const { name, description, price, categoryId, stock, imageUrl } = req.body;

    const perfume = await prisma.perfume.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId,
        stock: parseInt(stock),
        imageUrl
      },
      include: {
        category: true
      }
    });

    return res.status(201).json(perfume);
  } catch (error) {
    console.error('Create perfume error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updatePerfume = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }

    const { id } = req.params;
    const { name, description, price, categoryId, stock, imageUrl } = req.body;

    const perfume = await prisma.perfume.update({
      where: { id },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        categoryId,
        stock: stock ? parseInt(stock) : undefined,
        imageUrl
      },
      include: {
        category: true
      }
    });

    return res.json(perfume);
  } catch (error) {
    console.error('Update perfume error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deletePerfume = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }

    const { id } = req.params;

    await prisma.perfume.delete({
      where: { id }
    });

    return res.status(204).send();
  } catch (error) {
    console.error('Delete perfume error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};