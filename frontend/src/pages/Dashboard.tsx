import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../services/firebase';

type DashboardData = { totalContacts?: number; authorized?: number; optOuts?: number; campaigns?: number; delivered?: number; sent?: number; };

export default function Dashboard() {
	const [data, setData] = useState<DashboardData | null>(null);
	const [error, setError] = useState('');
	useEffect(() => onAuthStateChanged(auth, async (user) => {
		if (!user) return;
		try {
			const snapshot = await getDoc(doc(db, 'dashboards', user.uid));
			setData(snapshot.exists() ? snapshot.data() as DashboardData : {});
		} catch {
			setError('Não foi possível carregar os dados do Firebase. Ative o Firestore no console do projeto.');
		}
	}), []);
	const cards = data;
	return <div><div style={{ marginBottom: 28 }}><p style={{ color: 'var(--green-dark)', fontWeight: 700, fontSize: 12, letterSpacing: '.08em' }}>VISÃO GERAL</p><h1 style={{ marginTop: 6 }}>Olá, vamos começar.</h1><p style={{ color: 'var(--muted)', marginTop: 8 }}>Acompanhe a operação das suas comunicações.</p></div>{error && <div className="card" style={{ color: '#bd3b36', marginBottom: 16 }}>{error}</div>}<div className="grid-4">{[['Contatos', cards?.totalContacts ?? 0], ['Autorizados', cards?.authorized ?? 0], ['Campanhas', cards?.campaigns ?? 0], ['Entregues', `${cards?.delivered ?? 0}/${cards?.sent ?? 0}`]].map(([label, value]) => <div className="card" key={label as string}><p style={{ color: 'var(--muted)', fontSize: 13 }}>{label}</p><strong style={{ display: 'block', fontSize: 30, marginTop: 12, fontFamily: 'Space Grotesk' }}>{value}</strong></div>)}</div><div className="card" style={{ marginTop: 18 }}><h2 style={{ fontSize: 18 }}>Próximos passos</h2><p style={{ color: 'var(--muted)', marginTop: 8 }}>Adicione contatos autorizados e crie sua primeira campanha para começar.</p></div></div>;
}
