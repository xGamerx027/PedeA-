import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Clock, Minus, Plus, ShoppingBag, UtensilsCrossed, X } from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import { useCart } from '../hooks/useCart';
import { getStore } from '../services/api/store';
import { getCategories } from '../services/api/categories';
import { getProducts } from '../services/api/products';
import { Empty, ErrorBox, Loading } from '../components/ui';
import { brl } from '../utils/format';
export default function StorePage() {
  const { slug = '' } = useParams(); const nav = useNavigate(); const cart = useCart();
  const store = useAsync(() => getStore(slug), [slug]);
  const cats = useAsync(getCategories, []);
  const prods = useAsync(() => getProducts({ onlyAvailable: true }), []);
  const [cat, setCat] = useState('all'); const [open, setOpen] = useState(false);
  if (store.loading || cats.loading || prods.loading) return <Loading />;
  if (store.error || !store.data) return <ErrorBox text={store.error ?? 'Loja não encontrada'} onRetry={store.reload} />;
  const s = store.data; const list = (prods.data ?? []).filter((p) => cat === 'all' || p.categoryId === cat);
  return <div className="mx-auto min-h-screen max-w-2xl pb-24">
    <div className="h-36 bg-gradient-to-br from-brand-700 to-brand-900" style={s.coverUrl ? { backgroundImage: `url(${s.coverUrl})`, backgroundSize: 'cover' } : undefined} />
    <header className="-mt-8 flex items-end gap-3 px-4">
      <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl bg-white shadow ring-1 ring-ink/10">{s.logoUrl ? <img src={s.logoUrl} alt="" /> : <UtensilsCrossed className="text-brand-600" />}</div>
      <div className="pb-1"><h1 className="text-xl font-extrabold">{s.name}</h1><p className="flex items-center gap-1 text-xs text-ink/60"><Clock size={12} />{s.estimatedTime} · Entrega {brl(s.deliveryFee)}</p></div>
    </header>
    <nav className="sticky top-0 z-10 mt-4 flex gap-2 overflow-x-auto bg-paper/95 px-4 py-3 backdrop-blur">
      {[{ id: 'all', name: 'Tudo' }, ...(cats.data ?? [])].map((c) => <button key={c.id} onClick={() => setCat(c.id)} className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold ${cat === c.id ? 'bg-brand-600 text-white' : 'bg-white ring-1 ring-ink/15'}`}>{c.name}</button>)}
    </nav>
    {prods.error ? <ErrorBox text={prods.error} onRetry={prods.reload} /> : list.length === 0 ? <Empty text="Nenhum produto disponível nesta categoria." /> :
      <ul className="space-y-3 px-4">{list.map((p) => <li key={p.id} className="card flex gap-3 !p-3">
        <div className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-xl bg-brand-50 text-brand-500">{p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" /> : <UtensilsCrossed />}</div>
        <div className="flex min-w-0 flex-1 flex-col"><h3 className="font-bold">{p.name}</h3><p className="line-clamp-2 text-xs text-ink/60">{p.description}</p>
          <div className="mt-auto flex items-center justify-between pt-2"><span className="font-bold text-brand-700">{brl(p.price)}</span><button className="btn-primary !px-3 !py-1.5" onClick={() => cart.add(p)}><Plus size={16} />Adicionar</button></div></div>
      </li>)}</ul>}
    {cart.count > 0 && <button onClick={() => setOpen(true)} className="btn-primary fixed bottom-4 left-1/2 z-20 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 !py-3.5 shadow-xl"><ShoppingBag size={18} />Ver carrinho ({cart.count}) · {brl(cart.subtotal)}</button>}
    {open && <div className="fixed inset-0 z-50 flex justify-end bg-ink/50" onClick={() => setOpen(false)}>
      <aside className="flex h-full w-full max-w-sm flex-col bg-white p-5" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex justify-between"><h2 className="text-lg font-bold">Seu pedido</h2><button aria-label="Fechar" onClick={() => setOpen(false)}><X /></button></div>
        <ul className="flex-1 space-y-4 overflow-y-auto">{cart.lines.map(({ product: p, quantity }) => <li key={p.id} className="flex items-center justify-between gap-2 text-sm">
          <div><p className="font-semibold">{p.name}</p><p className="text-ink/60">{brl(p.price * quantity)}</p></div>
          <div className="flex items-center gap-2"><button aria-label="Diminuir" className="btn-ghost !p-1.5" onClick={() => cart.setQty(p.id, quantity - 1)}><Minus size={14} /></button><span className="w-5 text-center">{quantity}</span><button aria-label="Aumentar" className="btn-ghost !p-1.5" onClick={() => cart.setQty(p.id, quantity + 1)}><Plus size={14} /></button></div></li>)}</ul>
        <div className="mt-4 flex justify-between border-t pt-4 font-bold"><span>Subtotal</span><span>{brl(cart.subtotal)}</span></div>
        <p className="text-xs text-ink/50">Taxa de entrega calculada no checkout.</p>
        <button className="btn-primary mt-3" onClick={() => nav(`/loja/${slug}/checkout`)}>Ir para o checkout</button>
        <Link to={`/loja/${slug}`} onClick={() => setOpen(false)} className="mt-2 text-center text-sm text-brand-700">Continuar comprando</Link>
      </aside></div>}
  </div>;
}
