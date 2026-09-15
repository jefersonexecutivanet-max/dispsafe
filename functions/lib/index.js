"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCampaign = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
(0, app_1.initializeApp)();
const db = (0, firestore_1.getFirestore)();
const metaAccessToken = (0, params_1.defineSecret)('META_ACCESS_TOKEN');
const metaPhoneNumberId = (0, params_1.defineSecret)('META_PHONE_NUMBER_ID');
const metaGraphVersion = (0, params_1.defineSecret)('META_GRAPH_VERSION');
exports.sendCampaign = (0, https_1.onCall)({ secrets: [metaAccessToken, metaPhoneNumberId, metaGraphVersion], region: 'southamerica-east1' }, async (request) => {
    if (!request.auth)
        throw new https_1.HttpsError('unauthenticated', 'Faça login para disparar uma campanha.');
    const campaignId = request.data?.campaignId;
    if (typeof campaignId !== 'string' || !campaignId)
        throw new https_1.HttpsError('invalid-argument', 'campaignId é obrigatório.');
    const userId = request.auth.uid;
    const campaignRef = db.doc(`users/${userId}/campaigns/${campaignId}`);
    const campaignSnapshot = await campaignRef.get();
    if (!campaignSnapshot.exists)
        throw new https_1.HttpsError('not-found', 'Campanha não encontrada.');
    const campaign = campaignSnapshot.data();
    if (!campaign.template)
        throw new https_1.HttpsError('failed-precondition', 'Informe um template aprovado.');
    if (campaign.status === 'SENDING')
        throw new https_1.HttpsError('already-exists', 'Esta campanha já está em processamento.');
    const contactsSnapshot = await db.collection(`users/${userId}/contacts`).where('optedIn', '==', true).where('optedOut', '==', false).get();
    if (contactsSnapshot.empty)
        throw new https_1.HttpsError('failed-precondition', 'Não existem contatos com consentimento.');
    await campaignRef.update({ status: 'SENDING', startedAt: firestore_1.Timestamp.now() });
    const graphVersion = metaGraphVersion.value() || 'v20.0';
    const url = `https://graph.facebook.com/${graphVersion}/${metaPhoneNumberId.value()}/messages`;
    let sent = 0;
    const failures = [];
    for (const contactDocument of contactsSnapshot.docs) {
        const contact = contactDocument.data();
        if (!contact.phone)
            continue;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { Authorization: `Bearer ${metaAccessToken.value()}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ messaging_product: 'whatsapp', to: contact.phone, type: 'template', template: { name: campaign.template, language: { code: 'pt_BR' } } })
            });
            if (!response.ok)
                throw new Error(await response.text());
            sent += 1;
        }
        catch (error) {
            failures.push(`${contactDocument.id}: ${error instanceof Error ? error.message : 'falha desconhecida'}`);
        }
    }
    await campaignRef.update({ status: failures.length ? 'COMPLETED_WITH_ERRORS' : 'COMPLETED', sent, failures, finishedAt: firestore_1.Timestamp.now() });
    return { sent, failed: failures.length, total: contactsSnapshot.size };
});
//# sourceMappingURL=index.js.map