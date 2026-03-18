import { create } from 'zustand';
import { Order, type OrderSide } from '../types/order.types.js';
import { generateMockOrders } from '../mocks/generateOrders.js';
import { matchOrders } from '../core/match-orders.js';

type State = {
  orders: Order[];
  isNewOrderModalOpen: boolean;
  openNewOrderModal: () => void;
  closeNewOrderModal: () => void;
  loadMock: () => void;
  getOrder: (id: string) => Order | undefined;
  cancelOrder: (id: string) => void;
  createOrder: (
    instrument: string,
    side: OrderSide,
    price: number,
    quantity: number,
  ) => void;
};

let orderCounter = 1;

export const useOrderStore = create<State>((set, get) => ({
  orders: [],
  isNewOrderModalOpen: false,
  openNewOrderModal: () => {
    set({ isNewOrderModalOpen: true });
  },
  closeNewOrderModal: () => set({ isNewOrderModalOpen: false }),

  loadMock: () =>
    set({
      orders: generateMockOrders({ total: 50 }),
    }),

  getOrder: (id: string) => get().orders.find((o) => o.id === id),

  cancelOrder: (id: string) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id
          ? {
              ...o,
              status: 'cancelled',
              updatedAt: new Date().toISOString(),
              statusHistory: [
                ...o.statusHistory,
                {
                  from: o.status,
                  to: 'cancelled',
                  timestamp: new Date().toISOString(),
                  reason: 'Cancelado pelo usuário',
                },
              ],
            }
          : o,
      ),
    }));
  },

  createOrder: (
    instrument: string,
    side: OrderSide,
    price: number,
    quantity: number,
  ) => {
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: `ORD-${String(orderCounter++).padStart(4, '0')}`,
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

    set((state) => {
      const withNew = [newOrder, ...state.orders];
      return {
        orders: matchOrders(withNew, newOrder),
        isNewOrderModalOpen: false,
      };
    });
  },
}));
