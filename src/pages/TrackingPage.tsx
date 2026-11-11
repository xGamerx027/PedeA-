import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Circle } from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import { getOrder } from '../services/api/orders';
import { ErrorBox, Loading, StatusBadge } from '../components/ui';
import { brl, STATUS, STATUS_FLOW } from '../utils/format';
export default function TrackingPage() {
  const { slug = '', id = '' } = useParams();
  const { data: o, loading, error, reload } = useAsync(() => getOrder(id), [id]);
  useEffect(() => { const t = setInterval(reload, 20000); return () => clearInterval(t); }, [reload]); // polling simples; troque por websocket/SSE se a API oferecer
  if (!o) return loading ? <Loading /> : <ErrorBox text={error ?? 'Pedido não encontrado'} onRetry={reload} />;
  const steps = STATUS_FLOW.filter((s) => o.deliveryType === 'entrega' || s !== 'saiu_para_entrega'); const idx = steps.indexOf(o.status);
  return <div className="mx-auto max-w-xl space-y-4 p-4">
    <div className="card text-center"><CheckCircle2 className="mx-auto text-brand-600" size={40} /><h1 className="mt-2 text-xl font-extrabold">Pedido {o.code}</h1><div className="mt-2"><StatusBadge status={o.status} /></div></div>
    {o.status === 'cancelado' ? <p className="card text-center text-sm text-red-700">Este pedido foi cancelado.</p> :
      <ol className="card space-y-3">{steps.map((s, i) => <li key={s} className={`flex items-center gap-3 text-sm ${i <= idx ? 'font-semibold text-brand-700' : 'text-ink/40'}`}>{i <= idx ? <CheckCircle2 size={20} /> : <Circle size={20} />}{STATUS[s].label}</li>)}</ol>}
    <div className="card space-y-1 text-sm">{o.items.map((i) => <div key={i.productId} className="flex justify-between"><span>{i.quantity}× {i.name}</span><span>{brl(i.price * i.quantity)}</span></div>)}
      <div className="flex justify-between border-t pt-2 font-bold"><span>Total</span><span>{brl(o.total)}</span></div></div>
    <Link to={`/loja/${slug}`} className="btn-ghost w-full">Voltar ao cardápio</Link>
  </div>;
}
