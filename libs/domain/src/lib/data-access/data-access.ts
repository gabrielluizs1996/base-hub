// libs/data-access/src/lib/orders.api.ts
const API_URL = process.env.NODE_ENV !== 'production' ? 'http://localhost:3001/api/orders' : 'http://faithful-victory-production-7c17.up.railway.app/api/orders';
import { Order, type OrderSide } from '@base-hub/domain';

type OrdersResponse = {
  data: Order[];
  total: number;
  page: number;
  limit: number;
};

export const fetchOrdersApi = async (
  params?: Record<string, any>,
): Promise<OrdersResponse> => {
  const query = new URLSearchParams(params).toString();

  const res = await fetch(`${API_URL}?${query}`);
  if (!res.ok) throw new Error('Erro ao buscar orders');

  return (await res.json()) as OrdersResponse;;
};

export async function createOrderApi(payload: {
  instrument: string;
  side: OrderSide;
  price: number;
  quantity: number;
}): Promise<Order> {
  const res = await fetch(`${API_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Erro ao criar ordem');

  const data = await res.json() as Order; // 👈 tipagem aqui
  return data;
}

export async function cancelOrderApi(id: string) {
  const res = await fetch(`${API_URL}/${id}/cancel`, {
    method: 'PATCH',
  });

  if (!res.ok) throw new Error('Erro ao cancelar ordem');

  return res.json();
}
