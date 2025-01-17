import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../@types/express';
import { Prisma } from '@prisma/client';

interface OrderItemInput {
  perfumeId: string;
  quantity: number;
}

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { items, shippingAddress } = req.body;

    // Calculate total and prepare order items
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const perfume = await prisma.perfume.findUnique({
        where: { id: item.perfumeId }
      });

      if (!perfume) {
        return res.status(404).json({ message: `Perfume with id ${item.perfumeId} not found` });
      }

      if (perfume.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for perfume ${perfume.name}` });
      }

      total += perfume.price * item.quantity;
      orderItems.push({
        quantity: item.quantity,
        price: perfume.price,
        perfume: { connect: { id: perfume.id } }
      });

      // Update stock
      await prisma.perfume.update({
        where: { id: perfume.id },
        data: { stock: perfume.stock - item.quantity }
      });
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        total,
        status: Prisma.OrderStatus.PENDING,
        items: {
          create: orderItems
        },
        shippingAddress: {
          create: shippingAddress
        }
      },
      include: {
        items: {
          include: {
            perfume: true
          }
        },
        shippingAddress: true
      }
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: req.user.id
      },
      include: {
        items: {
          include: {
            perfume: true
          }
        },
        shippingAddress: true
      }
    });

    return res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId: req.user.id
      },
      include: {
        items: {
          include: {
            perfume: true
          }
        },
        shippingAddress: true
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export async function getUserOrders(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: req.user.id
      },
      include: {
        items: {
          include: {
            perfume: true
          }
        },
        shippingAddress: true,
        payment: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(orders);
  } catch (error) {
    console.error('Error in getUserOrders:', error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
}

export async function updateOrderStatus(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { status } = req.body;

    if (!Object.values(Prisma.OrderStatus).includes(status)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }

    const order = await prisma.order.update({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      data: { status },
      include: {
        items: {
          include: {
            perfume: true
          }
        },
        shippingAddress: true,
        payment: true
      }
    });

    res.json(order);
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    res.status(500).json({ error: 'Error updating order status' });
  }
}