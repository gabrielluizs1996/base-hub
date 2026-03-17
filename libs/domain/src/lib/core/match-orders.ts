import { Order, OrderSide, OrderStatus, StatusChange } from '../types/order.types.js';

export function matchOrders(orders: Order[], newOrder: Order): Order[] {
  const updated = [...orders];
  const idx = updated.findIndex((o) => o.id === newOrder.id);
  if (idx === -1) return updated;

  const counterSide: OrderSide =
    newOrder.side === 'buy' ? 'sell' : 'buy';

  const candidates = updated
    .filter(
      (o) =>
        o.instrument === newOrder.instrument &&
        o.side === counterSide &&
        (o.status === 'open' || o.status === 'partial') &&
        o.remainingQuantity > 0 &&
        (newOrder.side === 'buy'
          ? o.price <= newOrder.price
          : o.price >= newOrder.price)
    )
    .sort((a, b) =>
      newOrder.side === 'buy' ? a.price - b.price : b.price - a.price
    );

  for (const candidate of candidates) {
    if (updated[idx].remainingQuantity <= 0) break;

    const candIdx = updated.findIndex((o) => o.id === candidate.id);
    const fillQty = Math.min(
      updated[idx].remainingQuantity,
      updated[candIdx].remainingQuantity
    );

    const now = new Date().toISOString();

    const newCandRemaining =
      updated[candIdx].remainingQuantity - fillQty;
    const newOrderRemaining =
      updated[idx].remainingQuantity - fillQty;

    const updateOrder = (
      order: Order,
      remaining: number
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

    updated[candIdx] = updateOrder(updated[candIdx], newCandRemaining);
    updated[idx] = updateOrder(updated[idx], newOrderRemaining);
  }

  return updated;
}