import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Product } from '../types';
interface Line { product: Product; quantity: number }
interface Ctx { lines: Line[]; count: number; subtotal: number; add: (p: Product) => void; setQty: (id: string, q: number) => void; clear: () => void }
const CartCtx = createContext<Ctx>(null!);
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [lines, setLines] = useState<Line[]>([]);
  const add = (product: Product) => setLines((l) => l.some((x) => x.product.id === product.id) ? l.map((x) => x.product.id === product.id ? { ...x, quantity: x.quantity + 1 } : x) : [...l, { product, quantity: 1 }]);
  const setQty = (id: string, q: number) => setLines((l) => q <= 0 ? l.filter((x) => x.product.id !== id) : l.map((x) => x.product.id === id ? { ...x, quantity: q } : x));
  const count = lines.reduce((s, l) => s + l.quantity, 0);
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.quantity, 0); // apenas exibição; a API recalcula
  return <CartCtx.Provider value={{ lines, count, subtotal, add, setQty, clear: () => setLines([]) }}>{children}</CartCtx.Provider>;
};
export const useCart = () => useContext(CartCtx);
