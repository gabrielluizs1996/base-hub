import {
  generateMockOrders,
  type Order,
  type OrderSide,
  type OrderStatus,
  matchOrders,
} from '@base-hub/domain';

let orders = generateMockOrders({ total: 50 });

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

const sortMap: Record<SortableFields, (o: Order) => any> = {
  id: (o) => o.id,
  instrument: (o) => o.instrument,
  price: (o) => o.price,
  quantity: (o) => o.quantity,
  remainingQuantity: (o) => o.remainingQuantity,
  status: (o) => o.status,
  createdAt: (o) => o.createdAt,
  updatedAt: (o) => o.updatedAt,
};

export const getOrders = (query: OrdersQuery) => {
  let result = [...orders];

  if (query.id) {
    result = result.filter((o) => o.id.includes(query.id!));
  }

  if (query.instrument) {
    result = result.filter((o) =>
      o.instrument.toLowerCase().includes(query.instrument!.toLowerCase()),
    );
  }

  if (query.status && query.status !== 'all') {
    result = result.filter(
      (o) => o.status.toLowerCase() === query.status!.toLowerCase(),
    );
  }

  if (query.side && query.side !== 'all') {
    result = result.filter((o) => o.side === query.side);
  }

  if (query.sortBy) {
    const direction = query.order === 'asc' ? 1 : -1;
    const getter = sortMap[query.sortBy];

    result.sort((a, b) => {
      const aVal = getter(a);
      const bVal = getter(b);

      if (aVal > bVal) return direction;
      if (aVal < bVal) return -direction;
      return 0;
    });
  }

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const start = (page - 1) * limit;
  const end = start + limit;

  if (query.dateFrom) {
    const from = new Date(query.dateFrom);
    result = result.filter((o) => new Date(o.createdAt) >= from);
  }

  if (query.dateTo) {
    const to = new Date(query.dateTo);
    result = result.filter((o) => new Date(o.createdAt) <= to);
  }

  return {
    data: result.slice(start, end),
    total: result.length,
    page,
    limit,
  };
};

export const createOrder = (
  instrument: string,
  side: OrderSide,
  price: number,
  quantity: number,
): Order => {
  const now = new Date().toISOString();

  const newOrder: Order = {
    id: `ORD-${String(orders.length + 1).padStart(4, '0')}`,
    instrument,
    side,
    price,
    quantity,
    remainingQuantity: quantity,
    status: 'open',
    createdAt: now,
    updatedAt: now,
    statusHistory: [{ from: null, to: 'open', timestamp: now }],
  };

  const withNew = [newOrder, ...orders];
  orders = matchOrders(withNew, newOrder);
  const created = orders.find((o) => o.id === newOrder.id);

  if (!created) {
    throw new Error('Erro ao criar ordem');
  }

  return created;
};

// ✅ CANCEL
export const cancelOrder = (id: string): Order | null => {
  const order = orders.find((o) => o.id === id);

  if (!order) return null;

  const prevStatus = order.status;

  order.status = 'cancelled';
  order.updatedAt = new Date().toISOString();
  order.statusHistory.push({
    from: prevStatus,
    to: 'cancelled',
    timestamp: new Date().toISOString(),
    reason: 'Cancelado pelo usuário',
  });

  return order;
};
