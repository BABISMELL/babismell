import { body } from 'express-validator';

export const paymentValidation = [
  body('amount').isFloat({ min: 0 }).withMessage('Le montant doit être positif'),
  body('currency').equals('XOF').withMessage('La devise doit être XOF'),
  body('paymentMethodId').notEmpty().withMessage('La méthode de paiement est requise'),
  body('orderId').notEmpty().withMessage('L\'ID de la commande est requis')
];