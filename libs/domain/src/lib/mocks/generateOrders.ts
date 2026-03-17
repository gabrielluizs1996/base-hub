import { Order, type OrderStatus } from "../types/order.types.js";
import { randomDate, randomInstrument, randomSide } from "./factories.js";

type Options = {
  total?: number;
  daysBack?: number;
};

export function generateMockOrders(options?: Options): Order[] {
  const total = options?.total ?? 30;
  const daysBack = options?.daysBack ?? 30;

  const statuses: Order["status"][] = ["open", "partial", "executed", "cancelled"];

  return Array.from({ length: total }).map((_, i) => {
    const quantity = Math.floor(Math.random() * 900 + 100);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const createdAt = randomDate(daysBack);
    const createdDate = new Date(createdAt);

    let remaining = quantity;

    if (status === "executed") remaining = 0;
    if (status === "partial") remaining = Math.min(quantity - 1, Math.floor(quantity * Math.random() * 0.8) + 1);

    let updatedAt = createdAt;

    const statusHistory: Order["statusHistory"] = [
      { from: null, to: "open", timestamp: createdAt },
    ];

    const pushHistory = (from: OrderStatus | null, to: OrderStatus, baseDate: Date) => {
      const t = new Date(baseDate.getTime() + Math.random() * 3600000).toISOString();
      statusHistory.push({ from, to, timestamp: t });
      return t;
    };

    if (status === "partial") {
      updatedAt = pushHistory("open", "partial", createdDate);
    }

    if (status === "executed") {
      if (Math.random() > 0.4) {
        const t1 = pushHistory("open", "partial", createdDate);
        updatedAt = pushHistory("partial", "executed", new Date(t1));
      } else {
        updatedAt = pushHistory("open", "executed", createdDate);
      }
    }

    if (status === "cancelled") {
      if (Math.random() > 0.6) {
        const t1 = pushHistory("open", "partial", createdDate);
        const t2 = pushHistory("partial", "cancelled", new Date(t1));
        statusHistory[statusHistory.length - 1].reason = "Cancelado pelo usuário";
        updatedAt = t2;
      } else {
        const t = pushHistory("open", "cancelled", createdDate);
        statusHistory[statusHistory.length - 1].reason = "Cancelado pelo usuário";
        updatedAt = t;
      }
    }

    return {
      id: `ORD-${String(i + 1).padStart(4, "0")}`,
      instrument: randomInstrument(),
      side: randomSide(),
      price: parseFloat((Math.random() * 80 + 10).toFixed(2)),
      quantity,
      remainingQuantity: remaining,
      status,
      createdAt,
      updatedAt,
      statusHistory,
    };
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}