import type { Category } from '../../types';
import { db } from '../../mocks/data';
import { api, mock, uid, USE_MOCKS } from './client';
const E = '/categories';
export async function getCategories(): Promise<Category[]> {
  if (USE_MOCKS) return mock(() => [...db.categories].sort((a, b) => a.order - b.order));
  return (await api.get<Category[]>(E)).data;
}
export async function createCategory(name: string): Promise<Category> {
  if (USE_MOCKS) return mock(() => { const c = { id: uid(), name, order: db.categories.length + 1 }; db.categories.push(c); return c; });
  return (await api.post<Category>(E, { name })).data;
}
export async function updateCategory(id: string, name: string): Promise<Category> {
  if (USE_MOCKS) return mock(() => { const c = db.categories.find((x) => x.id === id)!; c.name = name; return c; });
  return (await api.put<Category>(`${E}/${id}`, { name })).data;
}
export async function deleteCategory(id: string): Promise<void> {
  if (USE_MOCKS) return mock(() => { db.categories = db.categories.filter((c) => c.id !== id); });
  await api.delete(`${E}/${id}`);
}
export async function reorderCategories(ids: string[]): Promise<void> {
  if (USE_MOCKS) return mock(() => { ids.forEach((id, i) => { const c = db.categories.find((x) => x.id === id); if (c) c.order = i + 1; }); }, 100);
  await api.put(`${E}/order`, { ids });
}
