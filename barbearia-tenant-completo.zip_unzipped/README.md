# APP Barb — barbearia-tenant

Site + app de agendamento para barbearias, multi-tenant: um único projeto
Firebase atende várias barbearias, cada uma com sua própria URL e marca.

Antes de mexer no código, leia o **`regrasdenegocio.md`** — ele documenta
o modelo de dados, as regras de segurança e as decisões já tomadas.

## Estrutura

```
src/
  context/        TenantContext (resolve a barbearia pela URL) e BarberAuthContext (sessão do staff)
  features/
    booking/      fluxo do cliente, sem cadastro (profissional -> servico -> agenda -> confirmacao)
    barber-portal/ login, agenda do dia, gestão de profissionais e serviços
  lib/
    repositories/ toda a leitura/escrita no Firestore
    availability.ts  cálculo de horários livres
    clientId.ts      identificação automática do cliente por telefone
functions/        Cloud Function que avisa o staff a cada novo agendamento
```

## Configuração

1. Crie um projeto no Firebase Console, com Firestore, Authentication (e-mail/senha) e Cloud Messaging ativados.
2. Copie `.env.example` para `.env` e preencha com as credenciais do projeto (Configurações do projeto > Seus apps > Web). O `VITE_FIREBASE_VAPID_KEY` fica em Cloud Messaging > Certificados push da Web.
3. `npm install`
4. Crie ao menos um documento em `tenants/{slug}` pelo Console (nome, slug, ativo: true) para ter uma barbearia para testar.
5. Crie o usuário do barbeiro/gestor em Authentication, e depois um documento em `staff/{uid}` com `{ tenantId: "{slug}", role: "gestor" }` — esse vínculo ainda é manual (ver `regrasdenegocio.md`).

## Rodando localmente

```
npm run dev
```

- Cliente: `http://localhost:5173/b/{slug}`
- Painel do barbeiro: `http://localhost:5173/admin/{slug}/login`

## Publicando

```
npm run build
firebase deploy
```

Isso publica as regras do Firestore, os índices, o hosting e a Cloud
Function de notificação juntos (veja `firebase.json`). Para publicar só as
functions: `cd functions && npm run deploy`.

## O que ainda falta (próximos passos sugeridos)

- Cancelamento de agendamento pelo próprio cliente (precisa de um token
  que comprove que ele é o dono do telefone — ver `regrasdenegocio.md`).
- Tela para o gestor convidar/cadastrar outros barbeiros (hoje o vínculo
  `staff` é manual, pelo Console do Firebase).
- Endurecer a checagem de disponibilidade contra concorrência (dois
  clientes escolhendo o mesmo horário ao mesmo tempo) com uma Cloud
  Function transacional.
- Upload de foto de perfil dos profissionais e logo da barbearia (hoje
  são apenas campos de URL).
