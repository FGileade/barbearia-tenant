# Regras de negócio — Barbe Club (barbearia-tenant)

> Qualquer agente (CODEX, Antigravity, Claude, humano) que for trabalhar
> neste repositório deve ler este arquivo antes de alterar modelo de dados,
> regras de segurança ou fluxo de agendamento — e mantê-lo atualizado a
> cada decisão nova.

## Visão geral

Um único **backend** Firebase (Firestore + Auth + Cloud Functions) atende
**várias barbearias**. Cada barbearia é um "tenant", identificado por um
`slug` (id do documento em `tenants/{slug}`). Todo documento do Firestore
que pertence a uma barbearia carrega o campo `tenantId` — é assim que o
isolamento entre barbearias é garantido nas regras de segurança,
independente de quantos frontends existirem.

O **frontend** tem dois modos (ver decisão revisada no histórico):
produção usa um deploy separado por barbearia (`VITE_TENANT_SLUG` fixa no
build, sem slug na URL); o modo com slug na URL (`/b/{slug}`,
`/admin/{slug}`) existe só para testar várias barbearias num servidor
local de desenvolvimento.

## Coleções do Firestore

| Coleção | Documento | Quem lê | Quem escreve |
|---|---|---|---|
| `tenants` | 1 por barbearia (id = slug) | Público | Staff da própria barbearia |
| `staff` | 1 por usuário (id = uid do Firebase Auth) | O próprio usuário | Ninguém pelo app (provisionamento manual por ora) |
| `professionals` | 1 por profissional | Público | Staff da própria barbearia |
| `services` | 1 por serviço | Público | Staff da própria barbearia |
| `clients` | 1 por cliente (id = `tenantId_telefone`) | Staff da própria barbearia | Público pode criar/atualizar o próprio documento |
| `appointments` | 1 por agendamento | Público só por id direto (nunca por listagem); staff lê tudo da própria barbearia | Público pode criar; só staff pode editar/cancelar |
| `availability` | 1 por agendamento (mesmo id do documento em `appointments`) | Público (lista e lê) | Criado junto com o agendamento (mesma escrita em lote); só staff atualiza/remove |

### Por que existe a coleção `availability`

Para montar a agenda, o cliente (sem login) precisa saber quais horários de
um profissional já estão ocupados num dia. Se essa consulta fosse feita
direto em `appointments`, qualquer visitante conseguiria listar nome e
telefone de outros clientes — por isso `availability` guarda só
`tenantId`, `professionalId`, `data`, `horaInicio` e `horaFim`, sem
nenhum dado pessoal, e pode ser pública. Os dois documentos (`appointments`
e `availability`) são criados juntos, na mesma escrita em lote, com o
mesmo id.

**Limitação conhecida:** a checagem de disponibilidade é uma leitura
pontual (não é tempo real). Dois clientes escolhendo o mesmo horário em
poucos segundos ainda podem colidir. Uma Cloud Function com transação
resolveria isso de forma definitiva — não implementada nesta fase.

## Regras de dados essenciais

- `duracaoMinutos` e `preco` de um serviço nunca podem ser negativos; `duracaoMinutos` deve ser maior que zero.
- `horaInicio` de um agendamento sempre precisa ser menor que `horaFim`.
- Um agendamento só pode ser criado se `professionalId` e `serviceId` realmente pertencerem ao `tenantId` informado.
- Todo agendamento é criado com `status = "confirmado"`; mudança de status (concluído/cancelado) é feita só pelo staff.
- O id do documento em `clients` é sempre `{tenantId}_{telefone normalizado}` (telefone só com dígitos, sem "+55") — isso garante que o mesmo telefone, na mesma barbearia, sempre aponte para o mesmo cliente, permitindo identificação automática sem cadastro.

## Agendamento sem cadastro (modelo replicado do Mimy Unhas)

O cliente nunca cria conta/login. Ao agendar, informa nome + telefone; o
app calcula o id determinístico do cliente e cria ou atualiza esse
documento (não precisa antes verificar se ele já existe). O mesmo padrão
usado no Mimy Unhas.

## Decisão pendente — cancelamento pelo cliente

**Ainda não implementado.** Permitir que o próprio cliente cancele um
agendamento exigiria comprovar que ele é o dono do telefone informado
(ex.: token único enviado por WhatsApp, ou link assinado) — o mesmo risco
de segurança já identificado no PDR do Mimy Unhas antes de liberar essa
função. Enquanto essa decisão não for tomada, cancelamento só pode ser
feito pelo staff da barbearia (painel do barbeiro/gestor).

Importante para quem for implementar o cancelamento pelo staff (Bloco 5):
ao marcar um agendamento como `cancelado`, é preciso também **apagar o
documento correspondente em `availability`** (mesmo id) — senão o
horário continua aparecendo como ocupado para novos clientes mesmo depois
do cancelamento.

## Provisionamento de staff

Não existe, ainda, uma tela para o gestor cadastrar barbeiros pelo próprio
app — o vínculo `staff/{uid} -> tenantId` é criado manualmente pelo
console do Firebase. Uma Cloud Function para automatizar esse
provisionamento é uma melhoria futura, não implementada nesta fase.

## Usuário master (dev da plataforma)

`staff/{uid}` com `role: "master"` dá acesso de staff a **todas** as
barbearias (a função `isMaster()` em `firestore.rules` faz `isStaffOf`
retornar verdadeiro para qualquer `tenantId`). No frontend, o master herda
o `tenantId` da barbearia aberta (slug fixo do deploy, ou da URL no modo
hub), então entra no painel de qualquer uma delas. O documento não tem
`tenantId` próprio e, como toda escrita em `staff` é bloqueada pelas regras,
só pode ser criado pelo Console do Firebase ou Admin SDK.

Master atual: `MQqsCzFnT4VVVqdKzsz7fWOn2Oj2` (filipegileade@gmail.com).

## Histórico de decisões

- **[Revisado]** Multi-tenant com um único app/backend compartilhado (URL
  por slug), em vez de um frontend separado por barbearia — decisão
  tomada para facilitar manutenção (uma alteração vale para todas as
  barbearias). **Substituída pela decisão abaixo.**
- Cada barbearia passou a ter seu **próprio deploy de frontend** (projeto
  Vercel + domínio próprios, mesma URL sem slug), identificado por uma
  variável de ambiente fixa no build (`VITE_TENANT_SLUG`), em vez de pelo
  slug na URL. O backend/Firestore continua único e compartilhado — o
  isolamento entre barbearias não muda, continua sendo garantido pelas
  regras de segurança por `tenantId`, não pela forma como o frontend é
  publicado. Motivo da mudança: cada barbearia precisa da própria
  marca/imagens sem depender de um app "genérico" pedindo slug — e
  travar o tenant no build evita qualquer risco de um frontend acessar
  dados de outra barbearia por engano. O modo antigo (slug na URL,
  `/b/{slug}`, `/admin/{slug}`) foi mantido só como "modo hub" para
  desenvolvimento local, não é mais usado em produção.
- Branding por barbearia (`logoUrl`, `corPrimaria` em `tenants/{slug}`)
  já existia antes dessa mudança e continua vindo do Firestore, não do
  código — trocar a marca não exige rebuild/redeploy do frontend.
- Regras de segurança do Firestore e modelo de dados implementados no
  Bloco 2 do projeto (ver checklist na conversa).
- Login do staff (Firebase Auth, e-mail/senha) foi adiantado para o
  Bloco 4 (originalmente previsto só no Bloco 5), porque a notificação de
  agendamento (fcmTokens) precisa de autenticação para não deixar
  qualquer pessoa se inscrever para receber avisos de uma barbearia
  alheia. O restante do painel do barbeiro (agenda do dia, gestão de
  profissionais/serviços) continua no Bloco 5.
- Notificação de agendamento via **Firebase Cloud Messaging (FCM)**, o
  mesmo canal já decidido para o Mimy Unhas: o staff ativa manualmente
  pelo painel (`fcmTokens/{token}`); uma Cloud Function (`functions/src/index.ts`,
  gatilho `onDocumentCreated` em `appointments`) envia o push para todos
  os tokens daquela barbearia e limpa tokens inválidos automaticamente.
- O service worker do FCM (`public/firebase-messaging-sw.js`) é gerado
  automaticamente pelo `vite.config.ts` a partir do `.env` a cada build —
  não deve ser editado manualmente.
