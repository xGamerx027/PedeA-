import { useEffect, useState, type FormEvent } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { getMyStore, updateStore } from '../../services/api/store';
import { ErrorBox, Field, Loading } from '../../components/ui';
import { useToast } from '../../components/Toast';
import type { Store } from '../../types';
const PAYMENTS = ['Pix', 'Dinheiro', 'Cartão de crédito', 'Cartão de débito'];
export default function Settings() {
  const toast = useToast(); const { data, loading, error, reload } = useAsync(getMyStore, []);
  const [f, setF] = useState<Store | null>(null); const [err, setErr] = useState<Record<string, string>>({}); const [busy, setBusy] = useState(false);
  useEffect(() => { if (data) setF(data); }, [data]);
  if (loading) return <Loading />; if (error || !f) return <ErrorBox text={error ?? 'Erro'} onRetry={reload} />;
  const set = <K extends keyof Store>(k: K, v: Store[K]) => setF({ ...f, [k]: v }); const cls = (k: string) => `input ${err[k] ? 'input-error' : ''}`;
  const submit = async (e: FormEvent) => { e.preventDefault(); const er: Record<string, string> = {};
    if (!f.name.trim()) er.name = 'Informe o nome'; if (!f.phone.trim()) er.phone = 'Informe o telefone'; if (f.deliveryFee < 0) er.deliveryFee = 'Valor inválido'; if (!f.paymentMethods.length) er.pay = 'Selecione ao menos uma forma';
    setErr(er); if (Object.keys(er).length) return; setBusy(true);
    try { await updateStore(f); toast('Configurações salvas'); } catch { toast('Erro ao salvar', false); } finally { setBusy(false); } };
  return <form onSubmit={submit} noValidate className="max-w-2xl space-y-4"><h1 className="text-2xl font-extrabold">Configurações</h1>
    <div className="card space-y-3"><Field label="Nome do estabelecimento" error={err.name}><input className={cls('name')} value={f.name} onChange={(e) => set('name', e.target.value)} /></Field>
      <div className="grid gap-3 sm:grid-cols-2"><Field label="URL do logo"><input className="input" value={f.logoUrl} onChange={(e) => set('logoUrl', e.target.value)} /></Field><Field label="URL da capa"><input className="input" value={f.coverUrl} onChange={(e) => set('coverUrl', e.target.value)} /></Field></div>
      <div className="grid gap-3 sm:grid-cols-2"><Field label="Telefone" error={err.phone}><input className={cls('phone')} value={f.phone} onChange={(e) => set('phone', e.target.value)} /></Field><Field label="Endereço"><input className="input" value={f.address} onChange={(e) => set('address', e.target.value)} /></Field></div>
      <Field label="Horário de funcionamento"><textarea className="input" rows={3} value={f.hours} onChange={(e) => set('hours', e.target.value)} /></Field>
      <div className="grid gap-3 sm:grid-cols-2"><Field label="Taxa de entrega (R$)" error={err.deliveryFee}><input className={cls('deliveryFee')} type="number" step="0.01" min="0" value={f.deliveryFee} onChange={(e) => set('deliveryFee', Number(e.target.value))} /></Field><Field label="Tempo estimado"><input className="input" value={f.estimatedTime} onChange={(e) => set('estimatedTime', e.target.value)} /></Field></div>
      <fieldset><legend className="mb-1 text-sm font-medium">Formas de pagamento</legend><div className="flex flex-wrap gap-3">{PAYMENTS.map((m) => <label key={m} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.paymentMethods.includes(m)} onChange={(e) => set('paymentMethods', e.target.checked ? [...f.paymentMethods, m] : f.paymentMethods.filter((x) => x !== m))} />{m}</label>)}</div>{err.pay && <p className="mt-1 text-xs text-red-600">{err.pay}</p>}</fieldset></div>
    <button className="btn-primary" disabled={busy}>{busy ? 'Salvando…' : 'Salvar alterações'}</button></form>;
}
