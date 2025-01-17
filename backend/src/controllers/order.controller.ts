import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { OrderStatus } from '@prisma/client';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

interface OrderItem {
  perfumeId: string;
  quantity: number;
}

export async function createOrder(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { items, shippingAddressId } = req.body;

    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    // Create the order with its items
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        status: OrderStatus.PENDING,
        shippingAddressId,
        items: {
          create: items.map((item: OrderItem) => ({
            quantity: item.quantity,
            perfume: { connect: { id: item.perfumeId } }
          }))
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

    res.status(201).json(order);
  } catch (error) {
    console.error('Error in createOrder:', error);
    res.status(500).json({ error: 'Error creating order' });
  }
}

export async function getOrderById(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: req.params.id,
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
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error in getOrderById:', error);
    res.status(500).json({ error: 'Error fetching order' });
  }
}

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

    if (!Object.values(OrderStatus).includes(status)) {
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