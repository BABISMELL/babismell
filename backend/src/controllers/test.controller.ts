import { Response } from 'express';
import prisma from '../lib/prisma';

export const testDatabase = async (_: any, res: Response) => {
  try {
    const result = await prisma.user.count();
    return res.json({ message: 'Database connection successful', count: result });
  } catch (error) {
    console.error('Database test error:', error);
    return res.status(500).json({ message: 'Database connection failed' });
  }
};
