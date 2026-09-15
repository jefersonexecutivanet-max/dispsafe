import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

initializeApp();
const db = getFirestore();
const metaAccessToken = defineSecret('META_ACCESS_TOKEN');
const metaPhoneNumberId = defineSecret('META_PHONE_NUMBER_ID');
const metaGraphVersion = defineSecret('META_GRAPH_VERSION');

export const sendCampaign = onCall({ secrets: [metaAccessToken, metaPhoneNumberId, metaGraphVersion], region: 'southamerica-east1' }, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Faça login para disparar uma campanha.');
  const campaignId = request.data?.campaignId;
  if (typeof campaignId !== 'string' || !campaignId) throw new HttpsError('invalid-argument', 'campaignId é obrigatório.');

  const userId = request.auth.uid;
  const campaignRef = db.doc(`users/${userId}/campaigns/${campaignId}`);
  const campaignSnapshot = await campaignRef.get();
  if (!campaignSnapshot.exists) throw new HttpsError('not-found', 'Campanha não encontrada.');
  const campaign = campaignSnapshot.data() as { template?: string; message?: string; status?: string };
  if (!campaign.template) throw new HttpsError('failed-precondition', 'Informe um template aprovado.');
  if (campaign.status === 'SENDING') throw new HttpsError('already-exists', 'Esta campanha já está em processamento.');

  const contactsSnapshot = await db.collection(`users/${userId}/contacts`).where('optedIn', '==', true).where('optedOut', '==', false).get();
  if (contactsSnapshot.empty) throw new HttpsError('failed-precondition', 'Não existem contatos com consentimento.');

  await campaignRef.update({ status: 'SENDING', startedAt: Timestamp.now() });
  const graphVersion = metaGraphVersion.value() || 'v20.0';
  const url = `https://graph.facebook.com/${graphVersion}/${metaPhoneNumberId.value()}/messages`;
  let sent = 0;
  const failures: string[] = [];

  for (const contactDocument of contactsSnapshot.docs) {
    const contact = contactDocument.data() as { phone?: string };
    if (!contact.phone) continue;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${metaAccessToken.value()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ messaging_product: 'whatsapp', to: contact.phone, type: 'template', template: { name: campaign.template, language: { code: 'pt_BR' } } })
      });
      if (!response.ok) throw new Error(await response.text());
      sent += 1;
    } catch (error) {
      failures.push(`${contactDocument.id}: ${error instanceof Error ? error.message : 'falha desconhecida'}`);
    }
  }

  await campaignRef.update({ status: failures.length ? 'COMPLETED_WITH_ERRORS' : 'COMPLETED', sent, failures, finishedAt: Timestamp.now() });
  return { sent, failed: failures.length, total: contactsSnapshot.size };
});
