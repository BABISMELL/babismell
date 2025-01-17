import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export async function testDatabase(req: Request, res: Response) {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Get counts from main tables
    const [userCount, perfumeCount, orderCount] = await Promise.all([
      prisma.user.count(),
      prisma.perfume.count(),
      prisma.order.count()
    ]);

    res.json({
      status: 'success',
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
      counts: {
        users: userCount,
        perfumes: perfumeCount,
        orders: orderCount
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    await prisma.$disconnect();
  }
}
