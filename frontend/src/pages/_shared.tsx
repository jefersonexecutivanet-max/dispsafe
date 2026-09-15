import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

export function PublicShell({ children }: { children: React.ReactNode }) {
  return <main style={{ maxWidth: 1160, margin: '0 auto', padding: '0 32px' }}>{children}</main>;
}

export function AuthPage({ register = false }: { register?: boolean }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const data = Object.fromEntries(form.entries());
    try {
      const credential = register
        ? await createUserWithEmailAndPassword(auth, String(data.email), String(data.password))
        : await signInWithEmailAndPassword(auth, String(data.email), String(data.password));
      if (register) {
        await updateProfile(credential.user, { displayName: String(data.name) });
        await setDoc(doc(db, 'users', credential.user.uid), { name: data.name, company: data.company, email: data.email, createdAt: serverTimestamp() });
      }
      localStorage.setItem('token', await credential.user.getIdToken());
      navigate('/dashboard');
    } catch (requestError: any) {
      const messages: Record<string, string> = { 'auth/email-already-in-use': 'Este e-mail já está cadastrado.', 'auth/invalid-credential': 'E-mail ou senha inválidos.', 'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.', 'auth/network-request-failed': 'Não foi possível conectar ao Firebase.' };
      setError(messages[requestError.code] || 'Não foi possível concluir a operação no Firebase.');
    } finally {
      setLoading(false);
    }
  };
  return <div className="public-shell"><div style={{ maxWidth: 440, margin: '0 auto', padding: '50px 0' }}><div className="brand" style={{ marginBottom: 28, justifyContent: 'center' }}><span className="brand-mark">DS</span>DispSafe</div><div className="card">
    <h1>{register ? 'Criar sua conta' : 'Bem-vindo de volta'}</h1>
    <p style={{ color: 'var(--muted)', marginTop: 8 }}>{register ? 'Comece a gerenciar suas comunicações.' : 'Acesse seu painel de comunicação.'}</p>
    <form onSubmit={submit}>
      {register && <><label className="label">Nome</label><input name="name" className="input" required /><label className="label">Empresa</label><input name="company" className="input" required /></>}
      <label className="label">E-mail</label><input name="email" className="input" type="email" required />
      <label className="label">Senha</label><input name="password" className="input" type="password" minLength={8} required />
      {register && <><label className="label">Confirmar senha</label><input name="confirmPassword" className="input" type="password" minLength={8} required /></>}
      {error && <p style={{ color: '#bd3b36', background: '#fff0ef', padding: 10, borderRadius: 8, marginTop: 16, fontSize: 13 }}>{error}</p>}
      <button className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: 20 }}>{loading ? 'Processando...' : register ? 'Criar conta' : 'Entrar'}</button>
    </form>
    <p style={{ marginTop: 16 }}>{register ? 'Já tem uma conta? ' : 'Ainda não tem conta? '}<Link to={register ? '/login' : '/cadastro'}>{register ? 'Entrar' : 'Cadastre-se'}</Link></p>
  </div></div></div>;
}

export function SectionPage({ title, description }: { title: string; description: string }) {
  return <div><h1>{title}</h1><p style={{ color: 'var(--muted)', margin: '8px 0 24px' }}>{description}</p><div className="card"><strong>Nenhum dado disponível ainda</strong><p style={{ color: 'var(--muted)', marginTop: 8 }}>Conecte sua conta para começar a usar este módulo.</p></div></div>;
}
