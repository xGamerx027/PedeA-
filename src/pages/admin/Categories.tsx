import { useState, type FormEvent } from 'react';
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react';
import { useAsync } from '../../hooks/useAsync';
import { createCategory, deleteCategory, getCategories, reorderCategories, updateCategory } from '../../services/api/categories';
import { Confirm, Empty, ErrorBox, Field, Loading, Modal } from '../../components/ui';
import { useToast } from '../../components/Toast';
import type { Category } from '../../types';
export default function Categories() {
  const toast = useToast(); const { data, loading, error, reload } = useAsync(getCategories, []);
  const [edit, setEdit] = useState<{ id?: string; name: string } | null>(null); const [del, setDel] = useState<Category | null>(null); const [err, setErr] = useState('');
  const save = async (e: FormEvent) => { e.preventDefault(); if (!edit) return; if (!edit.name.trim()) return setErr('Informe o nome');
    try { if (edit.id) await updateCategory(edit.id, edit.name); else await createCategory(edit.name); toast('Categoria salva'); setEdit(null); reload(); } catch { toast('Erro ao salvar', false); } };
  const remove = async () => { if (!del) return; try { await deleteCategory(del.id); toast('Categoria excluída'); setDel(null); reload(); } catch { toast('Erro ao excluir', false); } };
  const move = async (i: number, d: number) => { if (!data) return; const ids = data.map((c) => c.id); [ids[i], ids[i + d]] = [ids[i + d], ids[i]]; try { await reorderCategories(ids); reload(); } catch { toast('Erro ao reordenar', false); } };
  return <div className="space-y-4"><div className="flex items-center justify-between"><h1 className="text-2xl font-extrabold">Categorias</h1><button className="btn-primary" onClick={() => { setErr(''); setEdit({ name: '' }); }}><Plus size={16} />Nova</button></div>
    <div className="card !p-0">{loading ? <Loading /> : error ? <ErrorBox text={error} onRetry={reload} /> : !data?.length ? <Empty text="Nenhuma categoria cadastrada." /> :
      <ul className="divide-y">{data.map((c, i) => <li key={c.id} className="flex items-center gap-2 p-4 text-sm"><span className="flex-1 font-semibold">{c.name}</span>
        <button aria-label="Subir" disabled={i === 0} className="disabled:opacity-30" onClick={() => move(i, -1)}><ArrowUp size={16} /></button><button aria-label="Descer" disabled={i === data.length - 1} className="disabled:opacity-30" onClick={() => move(i, 1)}><ArrowDown size={16} /></button>
        <button aria-label="Editar" onClick={() => { setErr(''); setEdit(c); }}><Pencil size={16} /></button><button aria-label="Excluir" className="text-red-600" onClick={() => setDel(c)}><Trash2 size={16} /></button></li>)}</ul>}</div>
    {edit && <Modal title={edit.id ? 'Editar categoria' : 'Nova categoria'} onClose={() => setEdit(null)}><form onSubmit={save} noValidate className="space-y-3"><Field label="Nome" error={err}><input className={`input ${err ? 'input-error' : ''}`} value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></Field><button className="btn-primary w-full">Salvar</button></form></Modal>}
    {del && <Confirm text={`Excluir a categoria "${del.name}"?`} onConfirm={remove} onClose={() => setDel(null)} />}
  </div>;
}
