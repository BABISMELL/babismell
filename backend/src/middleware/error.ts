import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        return res.status(409).json({ error: 'Un enregistrement avec ces données existe déjà.' });
      case 'P2025':
        return res.status(404).json({ error: 'Enregistrement non trouvé.' });
      default:
        return res.status(500).json({ error: 'Erreur de base de données.' });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({ error: 'Données invalides.' });
  }

  res.status(500).json({ error: 'Une erreur est survenue.' });
}