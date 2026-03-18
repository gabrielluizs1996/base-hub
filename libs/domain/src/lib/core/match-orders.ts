import {
  Order,
  OrderSide,
  OrderStatus,
  StatusChange,
} from '../types/order.types.js';

export function matchOrders(orders: Order[], newOrder: Order): Order[] {
  const updated = [...orders];

  const idx = updated.findIndex((o) => o.id === newOrder.id);
  if (idx === -1) return updated;

  const counterSide: OrderSide =
    newOrder.side === 'buy' ? 'sell' : 'buy';

  let remaining = updated[idx].remainingQuantity;

  const candidates = updated
    .filter(
      (o) =>
        o.id !== newOrder.id && // 🚫 evita auto-match
        o.instrument === newOrder.instrument &&
        o.side === counterSide &&
        (o.status === 'open' || o.status === 'partial') &&
        o.remainingQuantity > 0 &&
        (newOrder.side === 'buy'
          ? o.price <= newOrder.price
          : o.price >= newOrder.price),
    )
    .sort((a, b) => {
      if (newOrder.side === 'buy') {
        if (a.price !== b.price) return a.price - b.price;
      } else {
        if (a.price !== b.price) return b.price - a.price;
      }

      return (
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
      );
    });

  const updateOrder = (
    order: Order,
    remaining: number,
    now: string,
  ): Order => {
    const newStatus: OrderStatus =
      remaining === 0 ? 'executed' : 'partial';

    if (newStatus !== order.status) {
      const change: StatusChange = {
        from: order.status,
        to: newStatus,
        timestamp: now,
      };

      return {
        ...order,
        remainingQuantity: remaining,
        status: newStatus,
        updatedAt: now,
        statusHistory: [...order.statusHistory, change],
      };
    }

    return {
      ...order,
      remainingQuantity: remaining,
      updatedAt: now,
    };
  };

  for (const candidate of candidates) {
    if (remaining <= 0) break;

    const candIdx = updated.findIndex((o) => o.id === candidate.id);
    if (candIdx === -1) continue;

    const now = new Date().toISOString();

    const fillQty = Math.min(
      remaining,
      updated[candIdx].remainingQuantity,
    );

    const newCandRemaining =
      updated[candIdx].remainingQuantity - fillQty;

    remaining -= fillQty;

    updated[candIdx] = updateOrder(
      updated[candIdx],
      newCandRemaining,
      now,
    );

    const orderIdx = updated.findIndex((o) => o.id === newOrder.id);
    if (orderIdx === -1) continue;

    updated[orderIdx] = updateOrder(
      updated[orderIdx],
      remaining,
      now,
    );
  }

  return updated;
}