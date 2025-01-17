import { body } from 'express-validator';

export const createOrderValidation = [
  body('items').isArray().notEmpty().withMessage('Les articles sont requis'),
  body('items.*.perfumeId').notEmpty().withMessage('L\'ID du parfum est requis'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('La quantité doit être supérieure à 0'),
  body('addressId').notEmpty().withMessage('L\'adresse de livraison est requise'),
  body('deliveryFee').isFloat({ min: 0 }).withMessage('Les frais de livraison doivent être un nombre positif')
];