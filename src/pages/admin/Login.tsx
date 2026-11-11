import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Field, Logo } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/Toast';
export default function Login() {
  const { login, isAuthenticated } = useAuth(); const nav = useNavigate(); const toast = useToast();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [err, setErr] = useState<{ email?: string; password?: string }>({}); const [busy, setBusy] = useState(false);
  if (isAuthenticated) return <Navigate to="/admin" replace />;
  const submit = async (e: FormEvent) => {
    e.preventDefault(); const er: typeof err = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) er.email = 'E-mail inválido'; if (!password) er.password = 'Informe a senha';
    setErr(er); if (Object.keys(er).length) return; setBusy(true);
    try { await login(email, password); nav('/admin'); } catch { toast('E-mail ou senha incorretos', false); setBusy(false); }
  };
  return <div className="grid min-h-screen place-items-center bg-brand-900 p-4"><form onSubmit={submit} noValidate className="card w-full max-w-sm space-y-4">
    <div className="text-center"><Logo /><p className="text-sm text-ink/60">Acesse o painel do seu negócio</p></div>
    <Field label="E-mail" error={err.email}><input className={`input ${err.email ? 'input-error' : ''}`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
    <Field label="Senha" error={err.password}><input className={`input ${err.password ? 'input-error' : ''}`} type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
    <button className="btn-primary w-full" disabled={busy}>{busy ? 'Entrando…' : 'Entrar'}</button>
    <Link to="/admin/recuperar-senha" className="block text-center text-sm text-brand-700">Esqueci minha senha</Link>
    <p className="text-center text-xs text-ink/40">Modo demo: qualquer e-mail e senha funcionam.</p>
  </form></div>;
}
