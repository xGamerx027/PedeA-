import { useState, type FormEvent } from 'react';
import { Pencil, Plus, Trash2, UtensilsCrossed } from 'lucide-react';
import { useAsync } from '../../hooks/useAsync';
import { createProduct, deleteProduct, getProducts, updateProduct, type ProductInput } from '../../services/api/products';
import { getCategories } from '../../services/api/categories';
import { Confirm, Empty, ErrorBox, Field, Loading, Modal } from '../../components/ui';
import { useToast } from '../../components/Toast';
import { brl } from '../../utils/format';
import type { Product } from '../../types';
const blank: ProductInput = { name: '', description: '', price: 0, imageUrl: '', categoryId: '', available: true };
export default function Products() {
  const toast = useToast(); const prods = useAsync(() => getProducts(), []); const cats = useAsync(getCategories, []);
  const [edit, setEdit] = useState<(ProductInput & { id?: string }) | null>(null); const [del, setDel] = useState<Product | null>(null); const [err, setErr] = useState<Record<string, string>>({}); const [busy, setBusy] = useState(false);
  const save = async (e: FormEvent) => {
    e.preventDefault(); if (!edit) return; const er: Record<string, string> = {};
    if (!edit.name.trim()) er.name = 'Informe o nome'; if (!(edit.price > 0)) er.price = 'Preço deve ser maior que zero'; if (!edit.categoryId) er.categoryId = 'Escolha uma categoria';
    setErr(er); if (Object.keys(er).length) return; setBusy(true);
    try { const { id, ...data } = edit; if (id) await updateProduct(id, data); else await createProduct(data); toast('Produto salvo'); setEdit(null); prods.reload(); } catch { toast('Erro ao salvar produto', false); } finally { setBusy(false); }
  };
  const remove = async () => { if (!del) return; setBusy(true); try { await deleteProduct(del.id); toast('Produto excluído'); setDel(null); prods.reload(); } catch { toast('Erro ao excluir', false); } finally { setBusy(false); } };
  const toggle = async (p: Product) => { try { await updateProduct(p.id, { available: !p.available }); prods.reload(); } catch { toast('Erro ao atualizar', false); } };
  const cname = (id: string) => cats.data?.find((c) => c.id === id)?.name ?? '—'; const cls = (k: string) => `input ${err[k] ? 'input-error' : ''}`;
  return <div className="space-y-4"><div className="flex items-center justify-between"><h1 className="text-2xl font-extrabold">Produtos</h1><button className="btn-primary" onClick={() => { setErr({}); setEdit({ ...blank, categoryId: cats.data?.[0]?.id ?? '' }); }}><Plus size={16} />Novo</button></div>
    <div className="card !p-0">{prods.loading ? <Loading /> : prods.error ? <ErrorBox text={prods.error} onRetry={prods.reload} /> : !prods.data?.length ? <Empty text="Nenhum produto cadastrado." /> :
      <ul className="divide-y">{prods.data.map((p) => <li key={p.id} className="flex items-center gap-3 p-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-brand-50 text-brand-500">{p.imageUrl ? <img src={p.imageUrl} alt="" className="h-full w-full object-cover" /> : <UtensilsCrossed size={18} />}</div>
        <div className="min-w-0 flex-1 text-sm"><p className="truncate font-semibold">{p.name}</p><p className="text-xs text-ink/50">{cname(p.categoryId)} · {brl(p.price)}</p></div>
        <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={p.available} onChange={() => toggle(p)} />Ativo</label>
        <button aria-label="Editar" onClick={() => { setErr({}); setEdit(p); }}><Pencil size={16} /></button><button aria-label="Excluir" className="text-red-600" onClick={() => setDel(p)}><Trash2 size={16} /></button></li>)}</ul>}</div>
    {edit && <Modal title={edit.id ? 'Editar produto' : 'Novo produto'} onClose={() => setEdit(null)}><form onSubmit={save} noValidate className="space-y-3">
      <Field label="Nome" error={err.name}><input className={cls('name')} value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></Field>
      <Field label="Descrição"><textarea className="input" rows={2} value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></Field>
      <div className="grid grid-cols-2 gap-3"><Field label="Preço (R$)" error={err.price}><input className={cls('price')} type="number" step="0.01" min="0" value={edit.price || ''} onChange={(e) => setEdit({ ...edit, price: Number(e.target.value) })} /></Field>
        <Field label="Categoria" error={err.categoryId}><select className={cls('categoryId')} value={edit.categoryId} onChange={(e) => setEdit({ ...edit, categoryId: e.target.value })}><option value="">Selecione…</option>{cats.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field></div>
      <Field label="URL da imagem"><input className="input" value={edit.imageUrl} onChange={(e) => setEdit({ ...edit, imageUrl: e.target.value })} /></Field>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={edit.available} onChange={(e) => setEdit({ ...edit, available: e.target.checked })} />Disponível</label>
      <button className="btn-primary w-full" disabled={busy}>{busy ? 'Salvando…' : 'Salvar'}</button></form></Modal>}
    {del && <Confirm text={`Excluir "${del.name}"? Essa ação não pode ser desfeita.`} busy={busy} onConfirm={remove} onClose={() => setDel(null)} />}
  </div>;
}
