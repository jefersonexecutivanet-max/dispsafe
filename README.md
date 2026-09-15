# DispSafe

Plataforma de campanhas de WhatsApp baseada na API oficial da Meta, com consentimento, opt-out e controle operacional.

## Arquitetura

- Frontend React/Vite publicado no Firebase Hosting.
- Firebase Authentication para cadastro, login e logout.
- Cloud Firestore como fonte única de contatos, campanhas, mensagens e eventos.
- Backend Node.js + Express separado, usando Firebase Admin SDK.
- Worker do backend com fila Firestore, lock transacional e processamento idempotente.
- WhatsApp Cloud API oficial da Meta.
- Sem PostgreSQL, MySQL, MongoDB, Redis, Cloud Functions ou automação de WhatsApp Web.

## Instalação

```powershell
npm --prefix frontend install
npm --prefix backend install
```

Copie `backend/.env.example` para `backend/.env` e preencha as credenciais. As credenciais administrativas do Firebase devem ser obtidas em **Configurações do projeto > Contas de serviço**. Nunca coloque `FIREBASE_PRIVATE_KEY` ou `META_ACCESS_TOKEN` no frontend, no Firestore ou no Git.

## Desenvolvimento

Terminal 1:

```powershell
npm --prefix backend run dev
```

Terminal 2:

```powershell
npm --prefix frontend run dev -- --host 127.0.0.1
```

Health check: `GET http://localhost:3333/api/health`.

## Fluxo de campanha

1. O usuário autentica no Firebase.
2. Adiciona contatos com `optIn: true`.
3. Cria uma campanha em `users/{uid}/campaigns`.
4. O frontend chama `POST /api/campaigns/{id}/queue` com o Firebase ID Token.
5. O backend valida consentimento e usa transação para marcar `QUEUED`/`PROCESSING`.
6. O worker envia templates aprovados pela Meta.
7. Cada tentativa é registrada em `users/{uid}/messages`.
8. O webhook `/api/webhook` registra atualizações da Meta.

Estados: `DRAFT`, `QUEUED`, `PROCESSING`, `COMPLETED`, `PAUSED`, `CANCELLED` e `FAILED`.

## Webhook Meta

Configure `GET/POST https://SEU_BACKEND/api/webhook` na Meta. O valor de `META_VERIFY_TOKEN` precisa ser igual no painel da Meta e no `backend/.env`.

## Deploy

```powershell
npm --prefix frontend run build
npx firebase-tools deploy --only hosting,firestore:rules,storage --project dispsafe
```

O backend Node pode ser hospedado em qualquer serviço que mantenha um processo HTTP e um worker, conforme o plano e os preços vigentes do provedor. O Firebase Hosting serve o frontend.

## Conformidade

O sistema envia somente para contatos com consentimento. Templates precisam estar aprovados pela Meta quando a janela de atendimento exigir. Não há garantia de que um número nunca será bloqueado; o uso deve respeitar as políticas da Meta, limites oficiais e a legislação aplicável.
