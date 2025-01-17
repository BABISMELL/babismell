import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../@types/express';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export async function createPayment(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { orderId, amount, paymentMethod } = req.body;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.user.id
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const payment = await prisma.payment.create({
      data: {
        orderId,
        amount,
        paymentMethod,
        status: 'pending'
      },
      include: {
        order: true
      }
    });

    return res.status(201).json(payment);
  } catch (error) {
    console.error('Create payment error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getPayments(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const payments = await prisma.payment.findMany({
      where: {
        order: {
          userId: req.user.id
        }
      },
      include: {
        order: true
      }
    });

    return res.json(payments);
  } catch (error) {
    console.error('Get payments error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getPayment(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;

    const payment = await prisma.payment.findFirst({
      where: {
        id,
        order: {
          userId: req.user.id
        }
      },
      include: {
        order: true
      }
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    return res.json(payment);
  } catch (error) {
    console.error('Get payment error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}