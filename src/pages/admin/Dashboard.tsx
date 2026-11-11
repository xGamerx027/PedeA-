import { useAsync } from '../../hooks/useAsync';
import { getDashboard } from '../../services/api/orders';
import { ErrorBox, Loading, StatusBadge } from '../../components/ui';
import { brl, dateTime } from '../../utils/format';
export default function Dashboard() {
  const { data: d, loading, error, reload } = useAsync(getDashboard, []);
  if (loading) return <Loading />; if (error || !d) return <ErrorBox text={error ?? 'Erro'} onRetry={reload} />;
  const max = Math.max(...d.sales.map((s) => s.value), 1);
  const kpis = [['Pedidos do dia', String(d.ordersToday)], ['Faturamento', brl(d.revenue)], ['Ticket médio', brl(d.avgTicket)], ['Pendentes', String(d.pending)]];
  return <div className="space-y-6"><h1 className="text-2xl font-extrabold">Dashboard</h1>
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{kpis.map(([l, v]) => <div key={l} className="card"><p className="text-xs text-ink/60">{l}</p><p className="mt-1 text-2xl font-extrabold">{v}</p></div>)}</div>
    <div className="card"><h2 className="mb-4 font-bold">Vendas da semana</h2><div className="flex h-40 items-end gap-3">{d.sales.map((s) => <div key={s.label} className="flex flex-1 flex-col items-center gap-1"><div className="w-full rounded-t-lg bg-brand-500" style={{ height: `${(s.value / max) * 100}%` }} title={brl(s.value)} /><span className="text-xs text-ink/60">{s.label}</span></div>)}</div></div>
    <div className="card"><h2 className="mb-3 font-bold">Pedidos recentes</h2><ul className="divide-y">{d.recent.map((o) => <li key={o.id} className="flex items-center justify-between gap-2 py-3 text-sm"><div><p className="font-semibold">{o.code} · {o.customerName}</p><p className="text-xs text-ink/50">{dateTime(o.createdAt)}</p></div><div className="flex items-center gap-3"><span className="font-semibold">{brl(o.total)}</span><StatusBadge status={o.status} /></div></li>)}</ul></div></div>;
}
