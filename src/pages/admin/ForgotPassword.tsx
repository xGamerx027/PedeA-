import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Field, Logo } from '../../components/ui';
import { forgotPassword } from '../../services/api/auth';
export default function ForgotPassword() {
  const [email, setEmail] = useState(''); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false); const [sent, setSent] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault(); if (!/^\S+@\S+\.\S+$/.test(email)) return setErr('E-mail inválido'); setErr(''); setBusy(true);
    try { await forgotPassword(email); setSent(true); } catch { setErr('Não foi possível enviar. Tente novamente.'); } finally { setBusy(false); }
  };
  return <div className="grid min-h-screen place-items-center bg-brand-900 p-4"><form onSubmit={submit} noValidate className="card w-full max-w-sm space-y-4">
    <div className="text-center"><Logo /><p className="text-sm text-ink/60">Recuperação de senha</p></div>
    {sent ? <p className="rounded-xl bg-brand-50 p-3 text-sm text-brand-900">Se o e-mail existir, enviaremos as instruções para redefinir a senha.</p> : <>
      <Field label="E-mail" error={err}><input className={`input ${err ? 'input-error' : ''}`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
      <button className="btn-primary w-full" disabled={busy}>{busy ? 'Enviando…' : 'Enviar instruções'}</button></>}
    <Link to="/admin/login" className="block text-center text-sm text-brand-700">Voltar ao login</Link>
  </form></div>;
}
