import { create } from "zustand";
import { Order } from "../types/order.types.js";
import { generateMockOrders } from "../mocks/generateOrders.js";

type State = {
  orders: Order[];
  loadMock: () => void;
  getOrder: (id: string) => Order | undefined;
  cancelOrder: (id: string) => void;
};

export const useOrderStore = create<State>((set, get) => ({
  orders: [],

  loadMock: () =>
    set({
      orders: generateMockOrders({ total: 50 }),
    }),

  getOrder: (id: string) => get().orders.find((o) => o.id === id),

  cancelOrder: (id: string) => {
    set((state) => ({
      orders: state.orders.map((o) => o.id === id ? { ...o, status: "cancelled", updatedAt: new Date().toISOString(), statusHistory: [...o.statusHistory, { from: o.status, to: "cancelled", timestamp: new Date().toISOString(), reason: "Cancelado pelo usuário" }] } : o)
    }));
  }
}));