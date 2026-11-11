import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
type T = { id: number; msg: string; ok: boolean };
const Ctx = createContext<(msg: string, ok?: boolean) => void>(() => {});
export const useToast = () => useContext(Ctx);
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<T[]>([]);
  const push = useCallback((msg: string, ok = true) => { const id = Date.now() + Math.random(); setItems((i) => [...i, { id, msg, ok }]); setTimeout(() => setItems((i) => i.filter((x) => x.id !== id)), 3500); }, []);
  return <Ctx.Provider value={push}>{children}
    <div className="fixed bottom-4 left-1/2 z-[60] flex -translate-x-1/2 flex-col gap-2" role="status">
      {items.map((t) => <div key={t.id} className="flex items-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm text-white shadow-lg">{t.ok ? <CheckCircle2 size={18} className="text-brand-500" /> : <XCircle size={18} className="text-red-400" />}{t.msg}</div>)}
    </div></Ctx.Provider>;
};
