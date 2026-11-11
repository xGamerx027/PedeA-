import type { OrderStatus } from '../types';
export const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const dateTime = (iso: string) => new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
export const STATUS: Record<OrderStatus, { label: string; cls: string }> = {
  recebido: { label: 'Recebido', cls: 'bg-sky-100 text-sky-800' },
  confirmado: { label: 'Confirmado', cls: 'bg-indigo-100 text-indigo-800' },
  em_preparo: { label: 'Em preparo', cls: 'bg-amber-100 text-amber-800' },
  pronto: { label: 'Pronto', cls: 'bg-lime-100 text-lime-800' },
  saiu_para_entrega: { label: 'Saiu para entrega', cls: 'bg-violet-100 text-violet-800' },
  entregue: { label: 'Entregue', cls: 'bg-emerald-100 text-emerald-800' },
  cancelado: { label: 'Cancelado', cls: 'bg-red-100 text-red-800' },
};
export const STATUS_FLOW: OrderStatus[] = ['recebido','confirmado','em_preparo','pronto','saiu_para_entrega','entregue'];
export const STATUS_LIST = Object.keys(STATUS) as OrderStatus[];
