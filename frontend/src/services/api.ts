import axios from 'axios';
import { auth } from './firebase';
const api=axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333/api' });
// Sempre busca um ID Token válido do Firebase (o SDK cacheia e só renova quando expira).
// Antes este interceptor lia um token fixo do localStorage salvo no login, que expira em ~1h
// e passava a derrubar TODAS as chamadas autenticadas (inclusive as que já tentavam passar um
// token novo manualmente) com 401 até o usuário deslogar e logar de novo.
api.interceptors.request.use(async (c) => {
	const token = await auth.currentUser?.getIdToken();
	if (token) c.headers.Authorization = `Bearer ${token}`;
	return c;
});
export async function queueCampaign(campaignId: string) {
	if (!auth.currentUser) throw new Error('Faça login novamente para colocar a campanha na fila.');
	const response = await api.post(`/campaigns/${campaignId}/queue`);
	return response.data;
}
export async function syncWhatsAppTemplates() {
	if (!auth.currentUser) throw new Error('Faça login novamente para sincronizar os templates.');
	const response = await api.post('/templates/sync');
	return response.data as { ok: boolean; count: number; templates: Array<{ name: string; status: string; category?: string; language?: string }> };
}
export default api;
