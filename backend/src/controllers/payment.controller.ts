import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { PaymentStatus } from '@prisma/client';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export async function createPayment(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { orderId, amount, paymentMethod } = req.body;

    const payment = await prisma.payment.create({
      data: {
        orderId,
        amount,
        status: PaymentStatus.PENDING,
        userId: req.user.id,
        paymentMethod
      },
      include: {
        order: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error('Error in createPayment:', error);
    res.status(500).json({ error: 'Error creating payment' });
  }
}

export async function updatePaymentStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(PaymentStatus).includes(status)) {
      return res.status(400).json({ error: 'Invalid payment status' });
    }

    const payment = await prisma.payment.update({
      where: { id },
      data: { status },
      include: {
        order: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.json(payment);
  } catch (error) {
    console.error('Error in updatePaymentStatus:', error);
    res.status(500).json({ error: 'Error updating payment status' });
  }
}

export async function getPaymentById(req: Request, res: Response) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id },
      include: {
        order: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Error in getPaymentById:', error);
    res.status(500).json({ error: 'Error fetching payment' });
  }
}

export async function getUserPayments(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const payments = await prisma.payment.findMany({
      where: { userId: req.user.id },
      include: {
        order: true
      }
    });

    res.json(payments);
  } catch (error) {
    console.error('Error in getUserPayments:', error);
    res.status(500).json({ error: 'Error fetching user payments' });
  }
}