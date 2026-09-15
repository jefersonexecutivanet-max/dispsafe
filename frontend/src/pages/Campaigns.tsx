import { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Link } from 'react-router-dom';
import { auth, db, storage } from '../services/firebase';
import { queueCampaign } from '../services/api';

const STATUS_LABEL: Record<string, string> = {
  DRAFT: 'Rascunho',
  QUEUED: 'Na fila',
  PROCESSING: 'Enviando',
  COMPLETED: 'Concluída',
  PAUSED: 'Pausada',
  CANCELLED: 'Cancelada',
  FAILED: 'Falhou',
};

const canDispatch = (status?: string) => !['QUEUED', 'PROCESSING', 'CANCELLED'].includes(status || '');

export default function Campaigns() {
  const [items, setItems] = useState<any[]>([]);
  const [eligible, setEligible] = useState(0);
  const [approvedTemplates, setApprovedTemplates] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [template, setTemplate] = useState('');
  const [message, setMessage] = useState('');
  const [flyer, setFlyer] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [sendingId, setSendingId] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) return;
    const stopCampaigns = onSnapshot(query(collection(db, 'users', userId, 'campaigns'), orderBy('createdAt', 'desc')), (snapshot) => {
      setItems(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });
    getDocs(collection(db, 'users', userId, 'contacts')).then((snapshot) => {
      setEligible(snapshot.docs.filter((item) => {
        const contact = item.data();
        return contact.optIn === true && contact.optedOut !== true && contact.active !== false;
      }).length);
    }).catch(() => undefined);
    const stopTemplates = onSnapshot(collection(db, 'users', userId, 'whatsapp_templates'), (snapshot) => {
      setApprovedTemplates(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })).filter((item: any) => item.status === 'APPROVED'));
    });
    return () => { stopCampaigns(); stopTemplates(); };
  }, [userId]);

  const selectFlyer = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Selecione uma imagem para o flyer.');
      return;
    }
    setFlyer(file);
    setPreview(URL.createObjectURL(file));
  };

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userId) return;
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const contacts = await getDocs(collection(db, 'users', userId, 'contacts'));
      const contactIds = contacts.docs
        .filter((item) => {
          const contact = item.data();
          return contact.optIn === true && contact.optedOut !== true && contact.active !== false;
        })
        .map((item) => item.id);
      let flyerUrl = '';
      if (flyer) {
        const flyerRef = ref(storage, `users/${userId}/flyers/${Date.now()}-${flyer.name}`);
        const snapshotUpload = await uploadBytes(flyerRef, flyer);
        flyerUrl = await getDownloadURL(snapshotUpload.ref);
      }
      await addDoc(collection(db, 'users', userId, 'campaigns'), {
        name,
        template,
        templateName: template,
        message,
        flyerUrl,
        contactIds,
        totalContacts: contactIds.length,
        sentCount: 0,
        failedCount: 0,
        languageCode: 'pt_BR',
        status: 'DRAFT',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setName('');
      setTemplate('');
      setMessage('');
      setFlyer(null);
      setPreview('');
      setNotice(contactIds.length ? `Campanha salva para ${contactIds.length} contato(s) com opt-in.` : 'Campanha salva sem destinatários. Cadastre contatos com consentimento antes de disparar.');
    } catch {
      setError('Não foi possível salvar a campanha. Verifique o Firebase Storage.');
    } finally {
      setSaving(false);
    }
  };

  const start = async (id: string) => {
    if (!userId) return;
    setError('');
    setNotice('');
    setSendingId(id);
    try {
      await queueCampaign(id);
      setNotice('Disparo iniciado. O worker envia os templates aprovados pela Meta para os contatos com opt-in.');
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || requestError.message || 'Não foi possível disparar a campanha.');
    } finally {
      setSendingId('');
    }
  };

  const removeCampaign = async (id: string) => {
    if (!userId) return;
    if (!window.confirm('Tem certeza que deseja excluir esta campanha?')) return;
    
    setError('');
    setNotice('');
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'users', userId, 'campaigns', id));
      setNotice('Campanha excluída com sucesso.');
    } catch {
      setError('Não foi possível excluir a campanha.');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <p style={{ color: 'var(--green-dark)', fontWeight: 700, fontSize: 12, letterSpacing: '.08em' }}>OPERAÇÃO</p>
        <h1 style={{ marginTop: 6 }}>Campanhas</h1>
        <p style={{ color: 'var(--muted)', marginTop: 8 }}>Escreva a mensagem, use um template aprovado pela Meta e dispare para contatos com consentimento.</p>
        <p style={{ color: 'var(--muted)', marginTop: 6, fontSize: 13 }}>{eligible} contato(s) com opt-in prontos para receber.</p>
      </div>
      {error && <div className="card" style={{ color: '#bd3b36', marginBottom: 16 }}>{error}</div>}
      {notice && <div className="card" style={{ color: 'var(--green-dark)', marginBottom: 16 }}>{notice}</div>}
      <div className="grid-2">
        <form className="card" onSubmit={create}>
          <h2 style={{ fontSize: 18 }}>Nova campanha</h2>
          <label className="label">Nome da campanha</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Promoção de setembro" required />
          <label className="label">Template aprovado</label>
          {approvedTemplates.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 13, margin: '4px 0 12px' }}>
              Nenhum template sincronizado ainda. <Link to="/templates">Sincronize com o WhatsApp Business</Link> antes de criar a campanha.
            </p>
          ) : (
            <select className="input" value={template} onChange={(e) => setTemplate(e.target.value)} required>
              <option value="" disabled>Selecione um template aprovado</option>
              {approvedTemplates.map((item: any) => <option key={item.id} value={item.name}>{item.name}</option>)}
            </select>
          )}
          <label className="label">Mensagem</label>
          <textarea className="input" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Texto de referência da campanha..." required />
          <label className="label">Flyer ou imagem</label>
          <input className="input" type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => selectFlyer(e.target.files?.[0])} />
          {preview && <img src={preview} alt="Prévia do flyer" style={{ display: 'block', width: '100%', maxHeight: 220, objectFit: 'contain', marginTop: 12, borderRadius: 8, background: 'var(--bg)' }} />}
          <button className="btn btn-primary" disabled={saving} style={{ marginTop: 20 }}>{saving ? 'Salvando...' : 'Salvar campanha'}</button>
        </form>
        <div className="card">
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>Suas campanhas ({items.length})</h2>
          {items.length === 0 ? <p style={{ color: 'var(--muted)' }}>Nenhuma campanha criada.</p> : items.map((item: any) => (
            <div key={item.id} style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                  <strong>{item.name}</strong>
                  <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 3 }}>
                    {item.templateName || item.template} · {STATUS_LABEL[item.status] || item.status} · {item.totalContacts || item.contactIds?.length || 0} dest.
                    {typeof item.sentCount === 'number' ? ` · ${item.sentCount} enviada(s)` : ''}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {canDispatch(item.status) ? (
                    <button className="btn btn-primary" onClick={() => start(item.id)} disabled={sendingId === item.id} style={{ padding: '7px 10px', fontSize: 12 }}>
                      {sendingId === item.id ? 'Disparando...' : 'Disparar'}
                    </button>
                  ) : (
                    <span style={{ color: 'var(--green-dark)', fontSize: 12 }}>{STATUS_LABEL[item.status] || item.status}</span>
                  )}
                  <button 
                    onClick={() => removeCampaign(item.id)} 
                    disabled={deletingId === item.id}
                    style={{ padding: '7px 10px', fontSize: 12, background: '#bd3b36', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                  >
                    {deletingId === item.id ? '...' : 'Deletar'}
                  </button>
                </div>
              </div>
              {item.message && <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 10 }}>{item.message}</p>}
              {item.flyerUrl && <img src={item.flyerUrl} alt="Flyer da campanha" style={{ width: 100, height: 70, objectFit: 'cover', borderRadius: 6, marginTop: 10 }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}