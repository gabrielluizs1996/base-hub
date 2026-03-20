import { Request, Response } from 'express';
import {
  getOrders,
  createOrder,
  cancelOrder,
} from '../services/orders.service';
import type { OrderSide, OrderStatus } from 'libs/domain/src';

type SortableFields =
  | 'id'
  | 'instrument'
  | 'price'
  | 'quantity'
  | 'remainingQuantity'
  | 'status'
  | 'createdAt'
  | 'updatedAt';

type OrdersQuery = {
  id?: string;
  instrument?: string;
  status?: OrderStatus | 'all';
  side?: OrderSide | 'all';
  sortBy?: SortableFields;
  order?: 'asc' | 'desc';
  page?: string;
  limit?: string;
  dateFrom?: Date | null;
  dateTo?: Date | null;
};

const normalizeQuery = (q: any): OrdersQuery => ({
  id: q.id || undefined,
  instrument: q.instrument || undefined,
  status: q.status && q.status !== 'all' ? q.status : undefined,
  side: q.side && q.side !== 'all' ? q.side : undefined,
  sortBy: q.sortBy,
  order: q.order,
  page: q.page,
  limit: q.limit,
  dateFrom: q.dateFrom ? new Date(`${q.dateFrom}T00:00:00.000Z`) : null,
  dateTo: q.dateTo ? new Date(`${q.dateTo}T23:59:59.999Z`) : null,
});

export const listOrders = (req: Request, res: Response) => {
  const query = normalizeQuery(req.query);
  const result = getOrders(query);
  res.json(result);
};

export const createOrderHandler = (req: Request, res: Response) => {
  const { instrument, side, price, quantity } = req.body;

  const order = createOrder(instrument, side, price, quantity);

  res.status(201).json(order);
};

export const cancelOrderHandler = (req: Request, res: Response) => {
  const { id } = req.params;

  const order = cancelOrder(id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json(order);
};
