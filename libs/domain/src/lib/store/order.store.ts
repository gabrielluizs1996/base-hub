import { create } from 'zustand';
import { Order, type OrderSide, OrderFilters } from '../types/order.types.js';
import { generateMockOrders } from '../mocks/generateOrders.js';

import {
  cancelOrderApi,
  createOrderApi,
  fetchOrdersApi,
} from '../data-access/data-access.js';

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
  fetchOrders: (params?: Record<string, any>) => Promise<void>;
  loading: boolean;
  error: string | null;
  filters: OrderFilters;
  setFilters: (filters: OrderFilters) => void;
  setPage: (page: number) => void;
  page: number;
  limit: number;
  total: number;
};

export const useOrderStore = create<State>((set, get) => ({
  orders: [],
  isNewOrderModalOpen: false,
  loading: false,
  error: null,
  filters: {
    id: '',
    instrument: '',
    status: 'all',
    side: 'all',
    dateFrom: '',
    dateTo: '',
  },
  page: 1,
  limit: 10,
  total: 0,

  setFilters: (filters) => {
    set({ filters, page: 1 });
    get().fetchOrders(filters); // 🔥 chama API automaticamente
  },

  setPage: (page) => {
    set({ page });

    const { filters } = get();

    get().fetchOrders({
      ...filters,
      page: page,
    });
  },

  openNewOrderModal: () => {
    set({ isNewOrderModalOpen: true });
  },
  closeNewOrderModal: () => set({ isNewOrderModalOpen: false }),

  loadMock: () =>
    set({
      orders: generateMockOrders({ total: 50 }),
    }),

  getOrder: (id: string) => get().orders.find((o) => o.id === id),

  cancelOrder: async (id: string) => {
    const prevOrders = get().orders;

    // 🟢 optimistic update
    set({
      orders: prevOrders.map((o) =>
        o.id === id
          ? {
              ...o,
              status: 'cancelled',
              updatedAt: new Date().toISOString(),
            }
          : o,
      ),
    });

    try {
      await cancelOrderApi(id);
    } catch (err) {
      // 🔴 rollback
      set({ orders: prevOrders });
    }
  },

  createOrder: async (instrument, side, price, quantity) => {
    const tempId = `TEMP-${Date.now()}`;
    const now = new Date().toISOString();

    const optimisticOrder: Order = {
      id: tempId,
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

    const prevOrders = get().orders;

    // 🟢 optimistic UI
    set({
      orders: [optimisticOrder, ...prevOrders],
      isNewOrderModalOpen: false,
    });

    try {
      const created = await createOrderApi({
        instrument,
        side,
        price,
        quantity,
      });

      // 🔁 substitui TEMP pelo real
      set((state) => ({
        orders: state.orders.map((o) => (o.id === tempId ? created : o)),
      }));
    } catch (err) {
      // 🔴 rollback
      set({ orders: prevOrders });
    }
  },

  fetchOrders: async (params) => {
    const { filters, page, limit } = get();

    const finalParams = {
      ...filters,
      page: page,
      limit,
      ...params, // override opcional
    };

    set({ loading: true, error: null });

    try {
      const response = await fetchOrdersApi(finalParams);

      set({
        orders: response.data,
        total: response.total,
        loading: false,
      });
    } catch (err) {
      set({
        error: 'Erro ao carregar ordens',
        loading: false,
      });
    }
  },
}));
