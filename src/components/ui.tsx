import type { ReactNode } from 'react';
import { AlertCircle, Inbox, Loader2, X } from 'lucide-react';
import { STATUS } from '../utils/format';
import type { OrderStatus } from '../types';
export const Loading = () => <div className="flex justify-center p-10 text-brand-600"><Loader2 className="animate-spin" /></div>;
export const Empty = ({ text }: { text: string }) => <div className="flex flex-col items-center gap-2 p-10 text-sm text-ink/60"><Inbox />{text}</div>;
export const ErrorBox = ({ text, onRetry }: { text: string; onRetry?: () => void }) => <div className="flex flex-col items-center gap-3 p-10 text-sm text-red-700"><AlertCircle />{text}{onRetry && <button className="btn-ghost" onClick={onRetry}>Tentar novamente</button>}</div>;
export const StatusBadge = ({ status }: { status: OrderStatus }) => <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS[status].cls}`}>{STATUS[status].label}</span>;
export const Logo = ({ dark }: { dark?: boolean }) => <span className={`text-xl font-extrabold tracking-tight ${dark ? 'text-white' : 'text-ink'}`}>Pede<span className="text-sun-500">Aí</span></span>;
export const Field = ({ label, error, children }: { label: string; error?: string; children: ReactNode }) =>
  <label className="block text-sm font-medium"><span className="mb-1 block">{label}</span>{children}{error && <span className="mt-1 block text-xs text-red-600">{error}</span>}</label>;
export const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) =>
  <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 sm:items-center sm:p-4" onClick={onClose}>
    <div role="dialog" aria-modal="true" className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
      <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">{title}</h2><button aria-label="Fechar" onClick={onClose}><X size={20} /></button></div>{children}
    </div></div>;
export const Confirm = ({ text, onConfirm, onClose, busy }: { text: string; onConfirm: () => void; onClose: () => void; busy?: boolean }) =>
  <Modal title="Confirmar ação" onClose={onClose}><p className="mb-5 text-sm">{text}</p>
    <div className="flex justify-end gap-2"><button className="btn-ghost" onClick={onClose}>Cancelar</button><button className="btn-danger" disabled={busy} onClick={onConfirm}>Confirmar</button></div></Modal>;
