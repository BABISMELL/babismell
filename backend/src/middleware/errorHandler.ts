import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return res.status(409).json({
          message: 'A unique constraint would be violated on the database'
        });
      case 'P2025':
        return res.status(404).json({
          message: 'Record not found'
        });
      default:
        return res.status(500).json({
          message: 'Database error occurred'
        });
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      message: 'Invalid input data'
    });
  }

  return res.status(500).json({
    message: 'Internal server error'
  });
};
