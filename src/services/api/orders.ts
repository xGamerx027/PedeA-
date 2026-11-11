import type { CreateOrderInput, Dashboard, Order, OrderStatus } from '../../types';
import { db } from '../../mocks/data';
import { api, mock, uid, USE_MOCKS } from './client';
const E = { orders: '/orders', dashboard: '/dashboard' };
export async function getOrders(params?: { status?: OrderStatus | ''; q?: string }): Promise<Order[]> {
  if (USE_MOCKS) return mock(() => db.orders.filter((o) => (!params?.status || o.status === params.status) && (!params?.q || `${o.code} ${o.customerName}`.toLowerCase().includes(params.q.toLowerCase()))));
  return (await api.get<Order[]>(E.orders, { params })).data;
}
export async function getOrder(id: string): Promise<Order> {
  if (USE_MOCKS) return mock(() => { const o = db.orders.find((x) => x.id === id); if (!o) throw new Error('Pedido não encontrado'); return o; });
  return (await api.get<Order>(`${E.orders}/${id}`)).data;
}
// Totais e validações são responsabilidade da API; o mock apenas simula a resposta.
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  if (USE_MOCKS) return mock(() => {
    const items = input.items.map((i) => { const p = db.products.find((x) => x.id === i.productId)!; return { productId: p.id, name: p.name, price: p.price, quantity: i.quantity }; });
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const deliveryFee = input.deliveryType === 'entrega' ? db.store.deliveryFee : 0;
    const o: Order = { id: uid(), code: `#${1001 + db.orders.length}`, customerName: input.customerName, phone: input.phone, deliveryType: input.deliveryType, address: input.address, paymentMethod: input.paymentMethod, notes: input.notes, items, subtotal, deliveryFee, total: subtotal + deliveryFee, status: 'recebido', createdAt: new Date().toISOString() };
    db.orders.unshift(o); return o;
  });
  return (await api.post<Order>(E.orders, input)).data;
}
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  if (USE_MOCKS) return mock(() => { const o = db.orders.find((x) => x.id === id)!; o.status = status; return o; }, 200);
  return (await api.patch<Order>(`${E.orders}/${id}/status`, { status })).data;
}
export async function getDashboard(): Promise<Dashboard> {
  if (USE_MOCKS) return mock(() => {
    const valid = db.orders.filter((o) => o.status !== 'cancelado'); const revenue = valid.reduce((s, o) => s + o.total, 0);
    return { ordersToday: db.orders.length, revenue, avgTicket: valid.length ? revenue / valid.length : 0, pending: db.orders.filter((o) => o.status === 'recebido').length,
      sales: ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].map((label, i) => ({ label, value: [320, 410, 380, 520, 740, 910, 650][i] })), recent: db.orders.slice(0, 5) };
  });
  return (await api.get<Dashboard>(E.dashboard)).data;
}
