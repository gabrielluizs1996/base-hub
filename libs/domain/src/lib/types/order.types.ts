export type OrderSide = "buy" | "sell";

export type OrderStatus = "open" | "partial" | "executed" | "cancelled";

export interface StatusChange {
  from: OrderStatus | null;
  to: OrderStatus;
  timestamp: string;
  reason?: string;
}

export interface Order {
  id: string;
  instrument: string;
  side: OrderSide;
  price: number;
  quantity: number;
  remainingQuantity: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusChange[];
}

export interface OrderFilters {
  id: string;
  instrument: string;
  status: OrderStatus | "all";
  side: OrderSide | "all";
  dateFrom: string;
  dateTo: string;
}

export type SortField = keyof Pick<Order, "id" | "instrument" | "side" | "price" | "quantity" | "remainingQuantity" | "status" | "createdAt">;
export type SortDirection = "asc" | "desc";
