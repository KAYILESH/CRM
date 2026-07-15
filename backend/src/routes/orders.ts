import { Router, Request, Response } from 'express';
import {
  getOrders, getCustomerById,
  addOrder, updateOrderStatus, deleteOrder
} from '../database';

const router = Router();

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

// GET /api/orders
router.get('/', (_req: Request, res: Response) => {
  try {
    const orders = getOrders();
    res.json({ orders, total: orders.length });
  } catch (err) {
    console.error('Failed to get orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// POST /api/orders
router.post('/', (req: Request, res: Response) => {
  try {
    const { customerId, items, status } = req.body;
    if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'customerId and non-empty items array are required' });
      return;
    }
    const customer = getCustomerById(Number(customerId));
    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    const processedItems = items.map((item: any) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      return { productId: Number(item.productId) || Date.now(), title: item.title || 'Product Item', price, quantity, total: price * quantity };
    });
    const total = processedItems.reduce((acc: number, item: any) => acc + item.total, 0);
    const newOrder = addOrder({
      customerId: Number(customerId),
      status: status && ORDER_STATUSES.includes(status) ? status : 'pending',
      items: processedItems,
      total,
      discountedTotal: total,
    });
    res.status(201).json(newOrder);
  } catch (err) {
    console.error('Failed to create order:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// PATCH /api/orders/:id/status
router.patch('/:id/status', (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    if (!ORDER_STATUSES.includes(status)) {
      res.status(400).json({ error: 'Invalid status value' });
      return;
    }
    const updated = updateOrderStatus(id, status);
    if (!updated) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json(updated);
  } catch (err) {
    console.error('Failed to update order status:', err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// DELETE /api/orders/:id
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const success = deleteOrder(id);
    if (!success) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json({ success: true, message: `Order #${id} deleted` });
  } catch (err) {
    console.error('Failed to delete order:', err);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

export default router;
