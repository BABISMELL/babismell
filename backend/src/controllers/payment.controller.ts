import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../@types/express';
import Stripe from 'stripe';
import { Prisma } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia'
});

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

export const createPaymentIntent = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { orderId } = req.body;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.user.id
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100), // Convert to cents
      currency: 'eur',
      metadata: {
        orderId: order.id,
        userId: req.user.id
      }
    });

    return res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const handleWebhook = async (req: AuthRequest, res: Response) => {
  try {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      return res.status(400).json({ message: 'No signature header' });
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;

        await prisma.order.update({
          where: { id: orderId },
          data: { status: Prisma.OrderStatus.PAID }
        });

        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;

        await prisma.order.update({
          where: { id: orderId },
          data: { status: Prisma.OrderStatus.FAILED }
        });

        break;
      }
    }

    return res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};