import { useState } from 'react';
import { Search } from 'lucide-react';
import { useAsync } from '../../hooks/useAsync';
import { getOrders, updateOrderStatus } from '../../services/api/orders';
import { Empty, ErrorBox, Loading, Modal, StatusBadge } from '../../components/ui';
import { useToast } from '../../components/Toast';
import { brl, dateTime, STATUS, STATUS_LIST } from '../../utils/format';
import type { Order, OrderStatus } from '../../types';
export default function Orders() {
  const toast = useToast(); const [status, setStatus] = useState<OrderStatus | ''>(''); const [q, setQ] = useState(''); const [sel, setSel] = useState<Order | null>(null);
  const { data, loading, error, reload } = useAsync(() => getOrders({ status, q }), [status, q]);
  const change = async (s: OrderStatus) => { if (!sel) return; try { const o = await updateOrderStatus(sel.id, s); setSel(o); toast('Status atualizado'); reload(); } catch { toast('Falha ao atualizar status', false); } };
  return <div className="space-y-4"><h1 className="text-2xl font-extrabold">Pedidos</h1>
    <div className="flex flex-col gap-2 sm:flex-row"><div className="relative flex-1"><Search size={16} className="absolute left-3 top-3 text-ink/40" /><input className="input !pl-9" placeholder="Buscar por código ou cliente" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      <select className="input sm:w-52" value={status} onChange={(e) => setStatus(e.target.value as OrderStatus | '')}><option value="">Todos os status</option>{STATUS_LIST.map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}</select></div>
    <div className="card !p-0">{loading ? <Loading /> : error ? <ErrorBox text={error} onRetry={reload} /> : !data?.length ? <Empty text="Nenhum pedido encontrado." /> :
      <ul className="divide-y">{data.map((o) => <li key={o.id}><button className="flex w-full items-center justify-between gap-2 p-4 text-left text-sm hover:bg-ink/5" onClick={() => setSel(o)}>
        <div><p className="font-semibold">{o.code} · {o.customerName}</p><p className="text-xs text-ink/50">{dateTime(o.createdAt)} · {o.deliveryType}</p></div>
        <div className="flex items-center gap-3"><span className="font-semibold">{brl(o.total)}</span><StatusBadge status={o.status} /></div></button></li>)}</ul>}</div>
    {sel && <Modal title={`Pedido ${sel.code}`} onClose={() => setSel(null)}><div className="space-y-3 text-sm">
      <div><p className="font-semibold">{sel.customerName}</p><p className="text-ink/60">{sel.phone}</p>{sel.address && <p className="text-ink/60">{sel.address}</p>}</div>
      <ul className="space-y-1 border-y py-3">{sel.items.map((i) => <li key={i.productId} className="flex justify-between"><span>{i.quantity}× {i.name}</span><span>{brl(i.price * i.quantity)}</span></li>)}
        <li className="flex justify-between text-ink/60"><span>Entrega</span><span>{brl(sel.deliveryFee)}</span></li><li className="flex justify-between font-bold"><span>Total</span><span>{brl(sel.total)}</span></li></ul>
      <p>Pagamento: <b>{sel.paymentMethod}</b></p>{sel.notes && <p>Obs.: {sel.notes}</p>}
      <label className="block font-medium">Status<select className="input mt-1" value={sel.status} onChange={(e) => change(e.target.value as OrderStatus)}>{STATUS_LIST.map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}</select></label></div></Modal>}
  </div>;
}
