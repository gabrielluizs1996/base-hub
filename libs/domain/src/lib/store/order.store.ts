import { create } from "zustand";
import { Order } from "../types/order.types.js";
import { generateMockOrders } from "../mocks/generateOrders.js";

type State = {
  orders: Order[];
  loadMock: () => void;
  getOrder: (id: string) => Order | undefined;
};

export const useOrderStore = create<State>((set, get) => ({
  orders: [],

  loadMock: () =>
    set({
      orders: generateMockOrders({ total: 50 }),
    }),

  getOrder: (id: string) => get().orders.find((o) => o.id === id),
}));