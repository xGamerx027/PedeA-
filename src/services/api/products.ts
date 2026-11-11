import type { Product } from '../../types';
import { db } from '../../mocks/data';
import { api, mock, uid, USE_MOCKS } from './client';
const E = '/products';
export type ProductInput = Omit<Product, 'id'>;
export async function getProducts(params?: { onlyAvailable?: boolean }): Promise<Product[]> {
  if (USE_MOCKS) return mock(() => db.products.filter((p) => !params?.onlyAvailable || p.available));
  return (await api.get<Product[]>(E, { params })).data;
}
export async function createProduct(data: ProductInput): Promise<Product> {
  if (USE_MOCKS) return mock(() => { const p = { ...data, id: uid() }; db.products.unshift(p); return p; });
  return (await api.post<Product>(E, data)).data;
}
export async function updateProduct(id: string, data: Partial<ProductInput>): Promise<Product> {
  if (USE_MOCKS) return mock(() => { const p = db.products.find((x) => x.id === id)!; Object.assign(p, data); return p; });
  return (await api.patch<Product>(`${E}/${id}`, data)).data;
}
export async function deleteProduct(id: string): Promise<void> {
  if (USE_MOCKS) return mock(() => { db.products = db.products.filter((p) => p.id !== id); });
  await api.delete(`${E}/${id}`);
}
