import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import { useCart } from '../hooks/useCart';
import { useToast } from '../components/Toast';
import { getStore } from '../services/api/store';
import { createOrder } from '../services/api/orders';
import { Field, Loading } from '../components/ui';
import { brl } from '../utils/format';
import type { DeliveryType } from '../types';
export default function CheckoutPage() {
  const { slug = '' } = useParams(); const nav = useNavigate(); const toast = useToast(); const cart = useCart();
  const store = useAsync(() => getStore(slug), [slug]);
  const [f, setF] = useState({ name: '', phone: '', type: 'entrega' as DeliveryType, address: '', payment: '', notes: '' });
  const [err, setErr] = useState<Record<string, string>>({}); const [busy, setBusy] = useState(false);
  if (cart.count === 0) return <Navigate to={`/loja/${slug}`} replace />;
  if (store.loading || !store.data) return <Loading />;
  const s = store.data; const fee = f.type === 'entrega' ? s.deliveryFee : 0; // exibição; a API calcula o total real
  const set = (k: keyof typeof f, v: string) => setF((x) => ({ ...x, [k]: v }));
  const submit = async (e: FormEvent) => {
    e.preventDefault(); const er: Record<string, string> = {};
    if (!f.name.trim()) er.name = 'Informe seu nome'; if (f.phone.replace(/\D/g, '').length < 10) er.phone = 'Telefone inválido';
    if (f.type === 'entrega' && !f.address.trim()) er.address = 'Informe o endereço'; if (!f.payment) er.payment = 'Escolha a forma de pagamento';
    setErr(er); if (Object.keys(er).length) return;
    setBusy(true);
    try {
      const o = await createOrder({ customerName: f.name, phone: f.phone, deliveryType: f.type, address: f.type === 'entrega' ? f.address : undefined, paymentMethod: f.payment, notes: f.notes || undefined, items: cart.lines.map((l) => ({ productId: l.product.id, quantity: l.quantity })) });
      cart.clear(); toast('Pedido enviado com sucesso!'); nav(`/loja/${slug}/pedido/${o.id}`, { replace: true });
    } catch { toast('Não foi possível enviar o pedido. Tente novamente.', false); setBusy(false); }
  };
  const cls = (k: string) => `input ${err[k] ? 'input-error' : ''}`;
  return <form onSubmit={submit} noValidate className="mx-auto max-w-xl space-y-4 p-4 pb-10">
    <Link to={`/loja/${slug}`} className="flex items-center gap-1 text-sm text-brand-700"><ArrowLeft size={16} />Voltar ao cardápio</Link>
    <h1 className="text-2xl font-extrabold">Finalizar pedido</h1>
    <div className="card space-y-3">
      <Field label="Nome" error={err.name}><input className={cls('name')} value={f.name} onChange={(e) => set('name', e.target.value)} /></Field>
      <Field label="Telefone / WhatsApp" error={err.phone}><input className={cls('phone')} inputMode="tel" value={f.phone} onChange={(e) => set('phone', e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-2">{(['entrega', 'retirada'] as const).map((t) => <button type="button" key={t} onClick={() => set('type', t)} className={`rounded-xl py-2.5 text-sm font-semibold capitalize ${f.type === t ? 'bg-brand-600 text-white' : 'bg-white ring-1 ring-ink/20'}`}>{t}</button>)}</div>
      {f.type === 'entrega' ? <Field label="Endereço de entrega" error={err.address}><input className={cls('address')} value={f.address} onChange={(e) => set('address', e.target.value)} /></Field> : <p className="text-sm text-ink/60">Retirada em: {s.address}</p>}
      <Field label="Forma de pagamento" error={err.payment}><select className={cls('payment')} value={f.payment} onChange={(e) => set('payment', e.target.value)}><option value="">Selecione…</option>{s.paymentMethods.map((m) => <option key={m}>{m}</option>)}</select></Field>
      <Field label="Observações"><textarea className="input" rows={2} value={f.notes} onChange={(e) => set('notes', e.target.value)} /></Field>
    </div>
    <div className="card space-y-1 text-sm">{cart.lines.map((l) => <div key={l.product.id} className="flex justify-between"><span>{l.quantity}× {l.product.name}</span><span>{brl(l.product.price * l.quantity)}</span></div>)}
      <div className="flex justify-between text-ink/60"><span>Entrega</span><span>{brl(fee)}</span></div>
      <div className="flex justify-between border-t pt-2 text-base font-bold"><span>Total</span><span>{brl(cart.subtotal + fee)}</span></div></div>
    <button className="btn-primary w-full !py-3.5" disabled={busy}>{busy ? 'Enviando…' : 'Confirmar pedido'}</button>
  </form>;
}
