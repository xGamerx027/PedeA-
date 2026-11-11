import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Menu, ReceiptText, Settings, Shapes, ShoppingBag } from 'lucide-react';
import { Logo } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true }, { to: '/admin/pedidos', label: 'Pedidos', icon: ReceiptText },
  { to: '/admin/produtos', label: 'Produtos', icon: ShoppingBag }, { to: '/admin/categorias', label: 'Categorias', icon: Shapes }, { to: '/admin/configuracoes', label: 'Configurações', icon: Settings },
];
export default function AdminLayout() {
  const [open, setOpen] = useState(false); const { logout } = useAuth(); const nav = useNavigate();
  return <div className="min-h-screen lg:flex">
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-brand-900 p-5 text-white transition-transform lg:static lg:translate-x-0 ${open ? '' : '-translate-x-full'}`}>
      <div className="mb-8"><Logo dark /></div>
      <nav className="space-y-1">{links.map(({ to, label, icon: I, end }) =>
        <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-white/15' : 'text-white/70 hover:bg-white/10'}`}><I size={18} />{label}</NavLink>)}</nav>
      <button className="mt-8 flex items-center gap-3 px-3 text-sm text-white/70 hover:text-white" onClick={() => { logout(); nav('/admin/login'); }}><LogOut size={18} />Sair</button>
    </aside>
    {open && <div className="fixed inset-0 z-30 bg-ink/40 lg:hidden" onClick={() => setOpen(false)} />}
    <div className="min-w-0 flex-1">
      <header className="flex items-center gap-3 border-b border-ink/10 bg-white p-4 lg:hidden"><button aria-label="Menu" onClick={() => setOpen(true)}><Menu /></button><Logo /></header>
      <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8"><Outlet /></main>
    </div></div>;
}
