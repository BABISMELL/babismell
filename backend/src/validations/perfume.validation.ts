import { body } from 'express-validator';

export const perfumeValidation = [
  body('name').notEmpty().withMessage('Le nom est requis'),
  body('brand').notEmpty().withMessage('La marque est requise'),
  body('price').isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif'),
  body('categoryId').notEmpty().withMessage('La catégorie est requise'),
  body('description').notEmpty().withMessage('La description est requise'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Le stock doit être un nombre positif')
];