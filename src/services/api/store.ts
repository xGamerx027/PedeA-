import type { Store } from '../../types';
import { db } from '../../mocks/data';
import { api, mock, USE_MOCKS } from './client';
const E = { public: (slug: string) => `/stores/${slug}`, mine: '/store' };
export async function getStore(slug: string): Promise<Store> {
  if (USE_MOCKS) return mock(() => db.store);
  return (await api.get<Store>(E.public(slug))).data;
}
export async function getMyStore(): Promise<Store> {
  if (USE_MOCKS) return mock(() => db.store);
  return (await api.get<Store>(E.mine)).data;
}
export async function updateStore(data: Store): Promise<Store> {
  if (USE_MOCKS) return mock(() => { db.store = { ...data }; return db.store; });
  return (await api.put<Store>(E.mine, data)).data;
}
