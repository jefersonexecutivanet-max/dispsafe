import { useEffect, useState } from 'react';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { syncWhatsAppTemplates } from '../services/api';

const STATUS_LABEL: Record<string, string> = { APPROVED: 'Aprovado', PENDING: 'Em análise', REJECTED: 'Rejeitado', PAUSED: 'Pausado' };

export default function Templates() {
  const [items, setItems] = useState<any[]>([]);
  const [metaTemplates, setMetaTemplates] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', body: '' });
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState('');
  const [syncNotice, setSyncNotice] = useState('');
  const userId = auth.currentUser?.uid;

  useEffect(() => userId ? onSnapshot(query(collection(db, 'users', userId, 'templates'), orderBy('createdAt', 'desc')), (s) => setItems(s.docs.map((item) => ({ id: item.id, ...item.data() })))) : undefined, [userId]);
  useEffect(() => userId ? onSnapshot(collection(db, 'users', userId, 'whatsapp_templates'), (s) => setMetaTemplates(s.docs.map((item) => ({ id: item.id, ...item.data() })))) : undefined, [userId]);

  const create = async (event: React.FormEvent) => { event.preventDefault(); if (!userId) return; await addDoc(collection(db, 'users', userId, 'templates'), { ...form, status: 'DRAFT', createdAt: serverTimestamp() }); setForm({ name: '', body: '' }); };

  const sync = async () => {
    setSyncing(true);
    setSyncError('');
    setSyncNotice('');
    try {
      const result = await syncWhatsAppTemplates();
      setSyncNotice(`${result.count} template(s) sincronizado(s) com o WhatsApp Business.`);
    } catch (error: any) {
      setSyncError(error.response?.data?.error || error.message || 'Não foi possível sincronizar com a Meta.');
    } finally {
      setSyncing(false);
    }
  };

  return <div>
    <h1>Templates</h1>
    <p style={{ color: 'var(--muted)', margin: '8px 0 24px' }}>Sincronize os templates aprovados pela Meta e organize modelos de referência.</p>

    <div className="card" style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: 18 }}>Templates do WhatsApp Business</h2>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>Busca os templates cadastrados na sua conta da Meta (aprovados, em análise ou rejeitados) e usa esse nome exato no disparo das campanhas.</p>
        </div>
        <button className="btn btn-primary" onClick={sync} disabled={syncing}>{syncing ? 'Sincronizando...' : 'Sincronizar com WhatsApp'}</button>
      </div>
      {syncError && <p style={{ color: '#bd3b36', marginTop: 12 }}>{syncError}</p>}
      {syncNotice && <p style={{ color: 'var(--green-dark)', marginTop: 12 }}>{syncNotice}</p>}
      <div style={{ marginTop: 16 }}>
        {metaTemplates.length === 0 ? <p style={{ color: 'var(--muted)' }}>Nenhum template sincronizado ainda. Clique em "Sincronizar com WhatsApp".</p> : metaTemplates.map((item) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <div><strong>{item.name}</strong><p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 2 }}>{item.category || '—'} · {item.language || '—'}</p></div>
            <span style={{ fontSize: 12, color: item.status === 'APPROVED' ? 'var(--green-dark)' : '#bd3b36' }}>{STATUS_LABEL[item.status] || item.status}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="grid-2">
      <form className="card" onSubmit={create}>
        <h2 style={{ fontSize: 18 }}>Rascunho de referência</h2>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4, marginBottom: 12 }}>Apenas uma anotação interna — não é enviado à Meta nem usado no disparo.</p>
        <label className="label">Nome</label>
        <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <label className="label">Mensagem</label>
        <textarea className="input" rows={5} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required />
        <button className="btn btn-primary" style={{ marginTop: 20 }}>Salvar rascunho</button>
      </form>
      <div className="card">
        <h2 style={{ fontSize: 18, marginBottom: 16 }}>Rascunhos salvos ({items.length})</h2>
        {items.length === 0 ? <p style={{ color: 'var(--muted)' }}>Nenhum rascunho salvo.</p> : items.map((item) => <div key={item.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}><strong>{item.name}</strong><p style={{ color: 'var(--muted)', marginTop: 5, fontSize: 13 }}>{item.body}</p></div>)}
      </div>
    </div>
  </div>;
}
