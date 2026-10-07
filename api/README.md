## Sumário 📋

- [Descrição](#codeguilds---api)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Executando o projeto](#executando-o-projeto)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Banco de dados com Docker](#banco-de-dados-com-docker)
- [Modelo do banco de dados](#modelo-do-banco-de-dados)
- [Kysely, o query builder](#kysely-o-query-builder)
- [Migrations com o kysely-ctl](#migrations-com-o-kysely-ctl)
- [Seeds: criando o primeiro ADM](#seeds-criando-o-primeiro-adm)
- [Importando missões de um arquivo](#importando-missões-de-um-arquivo)
- [Tipos do banco gerados automaticamente](#tipos-do-banco-gerados-automaticamente)
- [O servidor Fastify](#o-servidor-fastify)
- [Validação de dados com Zod](#validação-de-dados-com-zod)
- [Funções de validação](#funções-de-validação)
- [Tratamento de erros](#tratamento-de-erros)
- [Senhas com Argon2](#senhas-com-argon2)
- [Sessões e cookies (login)](#sessões-e-cookies-login)
- [Middlewares de permissão](#middlewares-de-permissão)
- [Limite de tentativas (rate limit)](#limite-de-tentativas-rate-limit)
- [Rotas da API](#rotas-da-api)
- [Testando as rotas](#testando-as-rotas)
- [Ligação com o site (Next.js)](#ligação-com-o-site-nextjs)
- [Fase 2: o site usando a API](#fase-2-o-site-usando-a-api)
- [Fase 3: o jogo no servidor](#fase-3-o-jogo-no-servidor)
- [Fase 4: as mensagens no servidor](#fase-4-as-mensagens-no-servidor)
- [Fase 5: as entregas no servidor](#fase-5-as-entregas-no-servidor)
- [Status online dos alunos](#status-online-dos-alunos)
- [Dashboard do aluno](#dashboard-do-aluno)
- [Build da aplicação](#build-da-aplicação)
- [Deploy gratuito: Render + Neon](#deploy-gratuito-render--neon)
- [O que mudou em relação ao front de hoje](#o-que-mudou-em-relação-ao-front-de-hoje)
- [Próximas fases](#próximas-fases)

# CodeGuilds - API

API da plataforma CodeGuilds. Hoje o site guarda tudo no navegador (localStorage), então
cada computador é um mundo separado: o professor não vê os alunos que se cadastraram em
outra máquina, as senhas ficam em texto puro e qualquer aluno consegue se dar moedas pelo
DevTools. Esta API resolve isso guardando os dados num banco PostgreSQL de verdade, com login
seguro e com o servidor decidindo o que cada um pode fazer.

A **fase 1** criou a API: professores, alunos, login, sessões e permissões. A **fase 2**
ligou o site a ela (as contas saem do localStorage). A **fase 3** levou o jogo para o
servidor: progresso, missões, Loja, inventário, presentes, amizades, Mercado, trocas e
eventos, com a API decidindo cada recompensa. A **fase 4** levou as mensagens: o sininho, os
comunicados, a conversa com balões e as mensagens pro professor, com a API criando as
mensagens automáticas. A **fase 5** levou as entregas das missões de entrega, com os arquivos
no Supabase Storage. Com ela, nada do jogo fica mais só no navegador.

As fases foram feitas na branch `feat/backend` e, depois de testadas de ponta a ponta no
Preview da Vercel (com a API no Render, o banco no Neon e os arquivos no Supabase), entraram
na `main`. Hoje o site oficial e a API são publicados a partir da `main`.

## Tecnologias utilizadas

- [Node.js](https://nodejs.org) — o ambiente que roda o JavaScript no servidor.
- [TypeScript](https://www.typescriptlang.org/) — tipagem estática, deixa o código mais legível e evita erros antes de ir pra produção.
- [Fastify](https://fastify.dev) — o framework do servidor HTTP (o mesmo do SPE System).
- [Kysely](https://kysely.dev) — query builder com tipagem completa (no lugar do Knex do SPE).
- [kysely-ctl](https://github.com/kysely-org/kysely-ctl) — a CLI das migrations e dos seeds.
- [kysely-codegen](https://github.com/RobinBlomberg/kysely-codegen) — gera os tipos das tabelas direto do banco.
- [PostgreSQL](https://www.postgresql.org) — o banco de dados relacional (ACID).
- [Docker](https://www.docker.com) — roda o PostgreSQL de desenvolvimento num container.
- [Zod](https://zod.dev) — validação dos dados que chegam nas rotas.
- [@node-rs/argon2](https://github.com/napi-rs/node-rs) — hash das senhas com Argon2id.
- [@fastify/cookie](https://github.com/fastify/fastify-cookie) — leitura e escrita do cookie de sessão.
- [@fastify/rate-limit](https://github.com/fastify/fastify-rate-limit) — limite de tentativas de login.
- [dotenv](https://github.com/motdotla/dotenv) — carrega as variáveis do arquivo `.env`.
- [Tsx](https://tsx.is) — roda o TypeScript direto em desenvolvimento (com `watch`).
- [tsup](https://tsup.egoist.dev) — gera o build em JavaScript para produção.

## Estrutura de pastas

A API fica na pasta `api/`, dentro do próprio repositório do site. Ela tem o seu próprio
`package.json` e `node_modules`: o site (Next.js) e a API são projetos separados que só
conversam por HTTP.

```
api/
├── db/
│   ├── migrations/        → histórico de mudanças do banco (uma por tabela)
│   └── seeds/             → dados iniciais (o primeiro ADM, as missões de exemplo e a Loja)
├── scripts/
│   ├── import-missions.ts → cadastra de uma vez as missões de um arquivo pra um professor
│   └── missions/          → os arquivos de missões prontos pra importar
├── src/
│   ├── middlewares/
│   │   └── auth.ts        → descobre quem está logado + ensureAuthenticated/Student/Teacher/Admin
│   ├── routes/            → as rotas, cada arquivo é um plugin do Fastify
│   │   ├── auth.ts        → login, logout e "quem sou eu"
│   │   ├── chats.ts       → conversa com balões entre amigos (fase 4)
│   │   ├── events.ts      → agenda dos eventos e o progresso do aluno em cada fase
│   │   ├── friends.ts     → pedidos de amizade e amizades
│   │   ├── gifts.ts       → presentes do professor/ADM
│   │   ├── health.ts      → a API está no ar?
│   │   ├── inventory.ts   → usar, vender, descartar e equipar itens
│   │   ├── messages.ts    → caixa do aluno, mensagens e comunicados do professor (fase 4)
│   │   ├── missions.ts    → missões, correção do quiz e das entregas
│   │   ├── offers.ts      → Mercado: ofertas de venda entre alunos
│   │   ├── presence.ts    → status online dos alunos (sinal de vida a cada 30 s)
│   │   ├── shop.ts        → Loja: cadastro do ADM e compra do aluno
│   │   ├── students.ts    → cadastro e gestão de alunos
│   │   ├── submissions.ts → entregas das missões de entrega e os arquivos (fase 5)
│   │   ├── teacherMessages.ts → mensagens do aluno pro professor (fase 4)
│   │   ├── teachers.ts    → cadastro e gestão de professores
│   │   └── trades.ts      → trocas de itens entre amigos
│   ├── services/
│   │   ├── dashboard.ts   → os números do dashboard do aluno (só leitura)
│   │   ├── escrow.ts      → devolve os itens guardados em ofertas e trocas
│   │   ├── messages.ts    → grava as mensagens do aluno (as automáticas também) (fase 4)
│   │   ├── progress.ts    → updateProgress: transação + aluno travado (fase 3)
│   │   └── storage.ts     → onde ficam os arquivos: pasta local ou Supabase Storage (fase 5)
│   ├── types/
│   │   └── database.ts    → tipos das tabelas (GERADO pelo kysely-codegen, não editar)
│   ├── utils/
│   │   ├── normalize.ts   → formata login e e-mail (mesmas regras do front)
│   │   ├── password.ts    → hash e conferência de senha
│   │   ├── queries.ts     → consultas base de professores e alunos (sem a senha)
│   │   ├── rateLimit.ts   → regra do limite de tentativas de login
│   │   ├── rules.ts       → regras fixas (casas, tamanho mínimo de senha...)
│   │   └── session.ts     → abre e fecha sessões (token + cookie)
│   ├── validation/
│   │   ├── schemas.ts     → schemas do Zod usados por mais de uma rota (o item do jogo)
│   │   └── validations.ts → existsOrError, notExistsError, equalsOrError e os erros 400/403/404
│   ├── app.ts             → monta o app: plugins, erros e rotas
│   ├── database.ts        → a conexão com o banco (o "db")
│   ├── env.ts             → lê e valida as variáveis de ambiente
│   └── server.ts          → sobe o servidor (listen)
├── uploads/               → arquivos das entregas com STORAGE_DRIVER=local (NÃO vai pro git)
├── .env                   → suas variáveis (NÃO vai pro git)
├── .env.example           → modelo do .env
├── docker-compose.yml     → o container do PostgreSQL
├── kysely.config.ts       → configuração das migrations e seeds
├── package.json
└── tsconfig.json
```

O `tsconfig.json` da raiz do site tem `"exclude": ["node_modules", "api"]`, pra o Next.js
não tentar compilar a API junto com o site.

E o `.vercelignore` da raiz tem `/api`: a Vercel trata uma pasta `api/` na raiz do projeto
como funções serverless dela e tenta compilar cada arquivo (com a configuração do site, sem
os caminhos `@/` e sem JSX). Isso enche o log de erros de TypeScript e quebra o deploy. Com
a pasta ignorada, a Vercel nem recebe a API: ela só publica o site, e a API fica no Render.

Desde a fase 3, a API também **importa as regras do jogo** da pasta `src/engine/` do site
(veja [Uma regra só](#uma-regra-só-a-api-usa-as-regras-do-site)).

## Executando o projeto

Na primeira vez, na pasta `api/`:

1. Instale as dependências:

```bash
npm install
```

2. Crie o arquivo `.env` a partir do modelo e preencha (veja [Variáveis de ambiente](#variáveis-de-ambiente)):

```bash
cp .env.example .env
```

No PowerShell do Windows o comando é `Copy-Item .env.example .env`.

3. Abra o Docker Desktop e suba o banco:

```bash
npm run db:up
```

4. Crie as tabelas (roda as migrations):

```bash
npm run migrate
```

5. Crie o primeiro ADM (com os dados do `.env`):

```bash
npm run seed
```

6. Suba a API em modo de desenvolvimento:

```bash
npm run dev
```

Se tudo deu certo, aparece no terminal:

```
Iniciando servidor CodeGuilds...
0 ===========================> 100%
Servidor CodeGuilds rodando na porta 3333!
Bem vindo de Volta Danilo Amaral ^-^
```

E abrindo `http://localhost:3333/health` no navegador aparece `{"status":"ok"}`.

Nas próximas vezes basta o Docker Desktop aberto e o `npm run dev` (o container do banco
sobe sozinho com o Docker, por causa do `restart: unless-stopped`).

### Todos os scripts do package.json

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe a API com o Tsx em modo `watch` (reinicia sozinha a cada alteração) |
| `npm run build` | Gera o build de produção em `build/server.js` com o tsup |
| `npm start` | Roda o build de produção (`node build/server.js`) |
| `npm run typecheck` | Confere os tipos de todo o projeto com o TypeScript, sem gerar arquivos |
| `npm run db:up` | Sobe o container do PostgreSQL |
| `npm run db:down` | Para o container (os dados continuam salvos no volume) |
| `npm run migrate` | Roda todas as migrations que ainda não rodaram |
| `npm run migrate:make nome` | Cria um arquivo de migration novo com a data e hora no nome |
| `npm run migrate:down` | Desfaz a última migration |
| `npm run migrate:reset` | Desfaz TODAS as migrations (apaga as tabelas e os dados!) |
| `npm run seed` | Roda os seeds (cria o ADM se ele ainda não existir) |
| `npm run missions:import -- email arquivo...` | Cadastra as missões de um ou mais arquivos pro professor desse e-mail ([Importando missões](#importando-missões-de-um-arquivo)) |
| `npm run db:types` | Gera de novo o `src/types/database.ts` a partir do banco |

## Variáveis de ambiente

Assim como no SPE, os dados sensíveis (como a conexão com o banco) ficam no arquivo `.env`,
que está no `.gitignore` e nunca vai para o repositório. O `.env.example` é o modelo, sem
valores reais.

| Variável | Pra que serve | Exemplo |
|---|---|---|
| `NODE_ENV` | Ambiente: `development`, `production` ou `test` | `development` |
| `PORT` | Porta da API (o Render define a dele sozinho) | `3333` |
| `DATABASE_URL` | Endereço completo do PostgreSQL | `postgresql://codeguilds:codeguilds@localhost:5433/codeguilds` |
| `ADMIN_NAME` | Nome do primeiro ADM (usado só pelo seed) | `Danilo` |
| `ADMIN_EMAIL` | E-mail de login do primeiro ADM | `danilo@codeguilds.com` |
| `ADMIN_PASSWORD` | Senha do primeiro ADM | (uma senha forte) |
| `STORAGE_DRIVER` | Onde ficam os arquivos das entregas: `local` (pasta da API) ou `supabase` (fase 5) | `local` |
| `UPLOADS_DIR` | A pasta dos arquivos com `STORAGE_DRIVER=local` | `uploads` |
| `SUPABASE_URL` | Endereço do projeto no Supabase (só com `supabase`). Só o endereço, **sem** `/rest/v1` | `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave **secreta** do Supabase: só a API usa, nunca vai pro navegador | (a chave service_role) |
| `SUPABASE_ANON_KEY` | Chave **pública** do Supabase, enviada junto no upload direto do navegador | (a chave anon) |
| `SUPABASE_BUCKET` | O bucket dos arquivos das entregas | `entregas` |

Diferente do SPE, a conexão usa uma única variável, a `DATABASE_URL`, tanto no Docker quanto
no Neon. Assim não é preciso ter `DATABASE_HOST`, `DATABASE_PORT` etc. separados.

As variáveis são lidas e **validadas** no arquivo `src/env.ts` com o Zod. Se faltar alguma
(ou vier num formato errado), a API nem sobe e mostra qual está com problema. É melhor
descobrir isso na hora de subir do que no meio de uma aula:

```ts
import { config } from "dotenv";
import { z } from "zod";

config({ quiet: true })

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(3333),
    DATABASE_URL: z.string().min(1),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
    console.error('Variáveis de ambiente inválidas:', _env.error.issues)
    throw new Error('Variáveis de ambiente inválidas.')
}

export const env = _env.data
```

- `config({ quiet: true })` carrega o `.env` (o `quiet` tira a mensagem que o dotenv mostra a cada carregamento).
- `z.coerce.number()` converte o texto `"3333"` para o número `3333` (tudo que vem do `.env` é texto).
- `.default(...)` usa um valor padrão quando a variável não existe.
- No resto do código usamos `env.PORT`, `env.DATABASE_URL`..., já com o tipo certo.
- Na fase 5 entraram as variáveis do storage (veja a tabela acima). Com `STORAGE_DRIVER=supabase`, o `env.ts` também confere se o `SUPABASE_URL` e a `SUPABASE_SERVICE_ROLE_KEY` vieram; sem elas, a API não sobe.
- O `SUPABASE_URL` tem que ser só o endereço do projeto. O painel do Supabase também mostra o endereço com `/rest/v1` (o "RESTful endpoint"), e com ele as chamadas do Storage caem no PostgREST, que responde `404 PGRST125 Invalid path specified in request URL`. Aconteceu no primeiro deploy; desde então o `env.ts` recusa um endereço com caminho (a API nem sobe, com uma mensagem explicando) e tira a barra do fim, se tiver.

## Banco de dados com Docker

Assim como no SPE, o PostgreSQL de desenvolvimento roda num container Docker. A diferença é
que aqui ele é descrito num arquivo, o `docker-compose.yml`, então ninguém precisa decorar o
comando `docker run` com todas as opções:

```yaml
services:
  codeguilds-db:
    image: postgres:16-alpine
    container_name: codeguilds-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: codeguilds
      POSTGRES_PASSWORD: codeguilds
      POSTGRES_DB: codeguilds
    ports:
      - "5433:5432"
    volumes:
      - codeguilds-db-data:/var/lib/postgresql/data

volumes:
  codeguilds-db-data:
```

- `image` — a imagem oficial do PostgreSQL 16 (a versão `alpine` é bem menor).
- `environment` — usuário, senha e nome do banco criados na primeira vez que o container sobe. Como é só o banco local de desenvolvimento, a senha simples não é problema.
- `ports: "5433:5432"` — o PostgreSQL escuta na 5432 dentro do container, e no seu computador ele aparece na **5433**. Assim não briga com o container do SPE, que usa a 5432.
- `volumes` — os dados ficam num volume do Docker, então sobrevivem se o container for parado ou recriado.
- `restart: unless-stopped` — o container sobe sozinho quando o Docker Desktop abre.

### Acessando o banco pelo terminal

Os mesmos comandos `psql` do SPE funcionam, entrando no container:

```bash
docker exec -it codeguilds-db psql -U codeguilds -d codeguilds
```

Dentro do `psql`:

```bash
\dt                     -- lista as tabelas
\d students             -- mostra as colunas e regras da tabela students
select * from teachers; -- consulta os professores
\q                      -- sai
```

## Modelo do banco de dados

A fase 1 tem três tabelas (abaixo). A fase 3 trouxe as colunas do progresso do aluno e as
tabelas de missões, Loja, amizades, ofertas, trocas e agenda dos eventos (veja
[As tabelas novas](#as-tabelas-novas)). Os nomes das colunas no banco são em `snake_case`
(`teacher_id`) e no código TypeScript em `camelCase` (`teacherId`), veja o
[CamelCasePlugin](#camelcaseplugin-snake_case-no-banco-camelcase-no-código).

```
teachers (professores)            students (alunos)                sessions (logins abertos)
─────────────────────             ─────────────────────            ─────────────────────────
id            uuid  PK   ◄──┐     id               uuid  PK  ◄──┐  id           uuid  PK
name          varchar(90)   ├──── teacher_id       uuid  FK     │  token_hash   varchar(64) único
email         varchar(160)  │     name             varchar(90)  │  teacher_id   uuid  FK → teachers (ou)
password_hash text          │     email            varchar(160) └─ student_id   uuid  FK → students
is_admin      boolean       │     turma            varchar(40)     expires_at   timestamptz
tutorial_done boolean       │     username         varchar(40) único created_at timestamptz
created_at    timestamptz   │     password_hash    text (pode ser nulo)
                            │     house_id         varchar(20)
                            │     avatar           jsonb
                            │     level / xp / coins / bonus_slots   integer
                            │     onboarding_step  varchar(10)
                            │     tutorial_done    boolean
                            │     multiverse_access timestamptz
                            └──── created_at       timestamptz
```

Relacionamentos:

- **professor 1 : N alunos** — cada aluno pertence a um professor (`students.teacher_id`). A chave estrangeira é `on delete restrict`: o banco não deixa excluir um professor que ainda tem alunos. Por isso a rota de exclusão move os alunos antes (veja [DELETE /teachers/:id](#delete-teachersid)).
- **professor 1 : N sessões** e **aluno 1 : N sessões** — cada sessão é de um professor **ou** de um aluno. As chaves são `on delete cascade`: excluir o professor/aluno apaga as sessões dele junto.

### As regras (check) dentro do próprio banco

Algumas regras ficam no banco, não só no código. Assim, mesmo que um dia alguma rota tenha um
bug, o banco recusa o dado errado:

| Regra | Onde | O que garante |
|---|---|---|
| `students_coins_check` | `coins >= 0` | Moedas nunca ficam negativas |
| `students_xp_check` | `xp >= 0` | XP nunca fica negativo |
| `students_level_check` | `level >= 1` | O nível mínimo é 1 |
| `students_bonus_slots_check` | `bonus_slots >= 0` | Espaços extras do inventário não ficam negativos |
| `students_house_check` | `house_id in ('ignis', 'noctis', 'flavus', 'sapientia')` | Só as quatro casas da Academia |
| `students_onboarding_check` | `onboarding_step in ('casa', 'avatar', 'completo')` | Só as etapas do primeiro acesso |
| `sessions_owner_check` | `(teacher_id is null) <> (student_id is null)` | Toda sessão tem exatamente um dono |

O `<>` é "diferente de": a sessão só é aceita se uma das colunas for nula e a outra não.

### Por que uuid e não SERIAL?

No SPE os ids eram `SERIAL` (1, 2, 3...). Aqui são `uuid` (ex.: `4e606ff8-cde6-4dae-b43d-3a69d96a335f`),
gerados pelo próprio PostgreSQL com `gen_random_uuid()`. Com números em sequência, alguém
poderia trocar `/students/5` por `/students/6` pra "passear" pelos alunos; com uuid os ids
são impossíveis de adivinhar. (As permissões já impedem isso, o uuid é uma camada a mais.)

### O avatar em jsonb

O avatar do aluno tem muitas peças (pele, cabelo, olhos, roupa, chapéu, aura...), e elas
mudam bastante conforme novas coleções chegam. Em vez de uma coluna por peça, ele fica numa
coluna `jsonb`, que guarda um objeto JSON inteiro e ainda permite consultas dentro dele.
O formato do avatar é o mesmo do front (`AvatarConfig` em `src/engine/avatar.ts`).

## Kysely, o query builder

O Kysely cumpre o mesmo papel do Knex no SPE: escrever as consultas SQL como código
TypeScript. A sintaxe é bem parecida. A grande diferença é que o Kysely conhece as tabelas
e as colunas: se você errar o nome de uma coluna, o TypeScript acusa o erro antes de rodar.

### Comparando com o Knex

| O que fazer | Knex (SPE) | Kysely (CodeGuilds) |
|---|---|---|
| Buscar todos | `db('client').select('*')` | `db.selectFrom('students').selectAll().execute()` |
| Buscar um | `db('client').where('idClient', id).first()` | `db.selectFrom('students').selectAll().where('id', '=', id).executeTakeFirst()` |
| Inserir | `db('client').insert({ name })` | `db.insertInto('students').values({ name }).execute()` |
| Alterar | `db('client').where('idClient', id).update(data)` | `db.updateTable('students').set(data).where('id', '=', id).execute()` |
| Excluir | `db('client').where('idClient', id).delete()` | `db.deleteFrom('students').where('id', '=', id).execute()` |
| Juntar tabelas | `.join('presence', 'client.idClient', 'presence.idClient')` | `.innerJoin('teachers', 'teachers.id', 'students.teacherId')` |
| Contar | `.count('* as total')` | `.select((eb) => eb.fn.countAll().as('total'))` |

Diferenças que valem lembrar:

- No `where` o operador é escrito: `where('id', '=', id)`, `where('coins', '>=', 10)`, `where('houseId', 'is', null)`.
- A consulta só roda no final, com `.execute()` (devolve uma lista), `.executeTakeFirst()` (devolve o primeiro ou `undefined`) ou `.executeTakeFirstOrThrow()` (devolve o primeiro ou lança um erro).
- No `insert`, `.returning('id')` devolve o id que o banco acabou de gerar.

### A conexão (src/database.ts)

```ts
import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { env } from "./env";
import { DB } from "./types/database";

export const db = new Kysely<DB>({
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString: env.DATABASE_URL,
            max: 10,
        }),
    }),
    plugins: [new CamelCasePlugin()],
})
```

- `Kysely<DB>` — o `DB` são os tipos de todas as tabelas (gerados pelo kysely-codegen). É isso que faz o autocompletar e a checagem de nomes funcionarem.
- `PostgresDialect` + `Pool` — o driver `pg` (o mesmo do SPE) com um pool de até 10 conexões.
- `CamelCasePlugin` — explicado logo abaixo.

Em qualquer arquivo, basta importar o `db`, exatamente como no SPE:

```ts
import { db } from "../database";
```

### CamelCasePlugin: snake_case no banco, camelCase no código

No SPE, as colunas foram criadas com aspas (`"idClient"`) e o PostgreSQL passou a exigir as
aspas em toda consulta (o problema de *case-sensitivity* descrito no README do SPE). Aqui isso
não acontece: no banco as colunas são `snake_case` (o padrão do PostgreSQL, sem aspas) e o
`CamelCasePlugin` traduz sozinho:

```ts
// No código escrevemos assim:
db.selectFrom('students').select(['teacherId', 'onboardingStep'])

// E o Kysely manda para o banco:
// select "teacher_id", "onboarding_step" from "students"

// E o resultado volta em camelCase: { teacherId: '...', onboardingStep: 'casa' }
```

Atenção: as **migrations** rodam pelo kysely-ctl, com uma conexão sem o plugin. Por isso
dentro das migrations e seeds os nomes são escritos em `snake_case` mesmo (`teacher_id`,
`password_hash`).

### Transações

Quando duas ou mais operações precisam acontecer juntas (ou nenhuma), usamos uma transação.
É o conceito ACID na prática. Exemplo real da rota que exclui um professor:

```ts
await db.transaction().execute(async (trx) => {
    // 1. os alunos do professor passam para o ADM
    await trx
        .updateTable('students')
        .set({ teacherId: request.user!.id })
        .where('teacherId', '=', id)
        .execute()

    // 2. o professor é excluído
    await trx.deleteFrom('teachers').where('id', '=', id).execute()
})
```

Dentro da transação usamos o `trx` no lugar do `db`. Se qualquer passo der erro, o
PostgreSQL desfaz tudo (rollback) e nenhum aluno fica sem professor. Na fase 3, toda ação do
jogo (compra, venda, troca, recompensa) roda numa transação com o aluno travado: veja
[updateProgress](#updateprogress-transação--linha-travada).

### Por que o Kysely está fixado na versão 0.28

No `package.json` o Kysely está como `~0.28.17` (só atualiza correções da 0.28). A versão
0.29 passou a ser só "ES Module", e o `kysely-codegen` (que gera os tipos) e o build com o
tsup ainda usam o formato CommonJS. No Node 20.9 isso quebra com o erro `ERR_REQUIRE_ESM`.
A 0.28 funciona nos dois formatos. Quando o kysely-codegen for atualizado (ou quando o
projeto passar para Node 22), dá pra subir para a 0.29.

## Migrations com o kysely-ctl

A ideia é a mesma do SPE: as migrations são o controle de versão do banco. Cada arquivo tem
a data e a hora no nome e dois métodos:

- `up` — o que a migration faz (criar tabela, adicionar coluna...).
- `down` — o oposto, pra desfazer (rollback).

O kysely-ctl registra numa tabela do banco (`kysely_migration`) quais migrations já rodaram.

### A configuração (kysely.config.ts)

```ts
import { PostgresDialect } from "kysely";
import { defineConfig, getKnexTimestampPrefix } from "kysely-ctl";
import { Pool } from "pg";
import { config } from "dotenv";

config({ quiet: true })

export default defineConfig({
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString: process.env.DATABASE_URL,
        }),
    }),
    migrations: {
        migrationFolder: 'db/migrations',
        getMigrationPrefix: getKnexTimestampPrefix,
    },
    seeds: {
        seedFolder: 'db/seeds',
        getSeedPrefix: getKnexTimestampPrefix,
    },
})
```

- `migrationFolder: 'db/migrations'` — igual ao SPE, as migrations ficam na pasta `db`.
- `getKnexTimestampPrefix` — o nome dos arquivos segue o padrão do Knex (`20260928120000_create-table-teachers.ts`), o mesmo do SPE.

### Criando uma migration

```bash
npm run migrate:make create-table-missions
```

Isso cria `db/migrations/<data-e-hora>_create-table-missions.ts`. Exemplo de como fica uma
migration (a da tabela de professores):

```ts
import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('teachers')
        .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn('name', 'varchar(90)', (col) => col.notNull())
        .addColumn('email', 'varchar(160)', (col) => col.notNull().unique())
        .addColumn('password_hash', 'text', (col) => col.notNull())
        .addColumn('is_admin', 'boolean', (col) => col.notNull().defaultTo(false))
        .addColumn('tutorial_done', 'boolean', (col) => col.notNull().defaultTo(false))
        .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo(sql`now()`))
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('teachers').execute()
}
```

Equivalente em SQL (pra comparar com o script do SPE):

```sql
CREATE TABLE teachers (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(90)  NOT NULL,
    email         VARCHAR(160) NOT NULL UNIQUE,
    password_hash TEXT         NOT NULL,
    is_admin      BOOLEAN      NOT NULL DEFAULT false,
    tutorial_done BOOLEAN      NOT NULL DEFAULT false,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);
```

Alguns detalhes:

- `Kysely<any>` — nas migrations o banco é tratado sem tipos, porque os tipos gerados mostram o banco **atual**, e uma migration pode rodar num banco antigo.
- ``sql`...` `` — escreve um pedaço de SQL puro quando precisa (ex.: `gen_random_uuid()`, `now()`).
- Chave estrangeira: `.addColumn('teacher_id', 'uuid', (col) => col.notNull().references('teachers.id').onDelete('restrict'))`.
- Regra (check): `.addCheckConstraint('students_coins_check', sql`coins >= 0`)`.
- `timestamptz` — data e hora com fuso horário (o PostgreSQL guarda em UTC e o Node recebe um `Date`).

### Rodando e desfazendo

```bash
npm run migrate          # roda as que faltam
npm run migrate:down     # desfaz a última
npm run migrate:reset    # desfaz todas (apaga as tabelas e os dados!)
```

### A regra de ouro (a mesma do SPE)

Uma migration que já rodou em produção (ou que outra pessoa já rodou) **nunca mais é
editada**. Se precisar mudar alguma coisa, crie uma migration nova que faça a mudança
(ex.: `add-column-nickname-to-students`). Só dá pra editar uma migration que ainda não saiu
da sua máquina, desfazendo com `npm run migrate:down`, editando e rodando de novo.

Depois de qualquer migration nova, rode `npm run db:types` para atualizar os tipos.

## Seeds: criando o primeiro ADM

Seeds são dados iniciais que o sistema precisa pra funcionar. O principal é o primeiro ADM:
sem ele não haveria quem cadastrasse os professores. (A fase 3 trouxe mais dois, as missões
de exemplo e a Loja: veja [Seeds novos](#seeds-novos).)

O arquivo `db/seeds/20260928130000_create-admin.ts` lê `ADMIN_NAME`, `ADMIN_EMAIL` e
`ADMIN_PASSWORD` do `.env`, faz o hash da senha e cria o professor com `is_admin = true`.
Se o e-mail já existir, ele só avisa e não faz nada, então pode rodar quantas vezes quiser:

```bash
npm run seed
```

```
ADM danilo@codeguilds.com criado com sucesso!
```

Rodando de novo:

```
O ADM danilo@codeguilds.com já existe.
```

## Importando missões de um arquivo

Montar um quiz de 10 perguntas comentadas no editor do site leva tempo. O script
`scripts/import-missions.ts` cadastra de uma vez todas as missões de um arquivo pra um
professor:

```bash
npm run missions:import -- professor@escola.com scripts/missions/programacao-12-anos.ts
```

```
+ "ODS" (10 perguntas)
+ "Introdução ao Scratch" (10 perguntas)
+ "O Mundo da Programação" (10 perguntas)
+ "Blocos de Código no Scratch" (10 perguntas)
4 missões criadas para Danilo.
```

- O arquivo exporta (`export default`) uma lista de missões no mesmo formato do site (`MissionContent`, em `src/engine/missions.ts`). Os arquivos prontos ficam em `scripts/missions/`: o `programacao-12-anos.ts` tem 4 quizzes para turmas de 12 anos (ODS, Introdução ao Scratch, O Mundo da Programação e Blocos de Código no Scratch), o `programacao-12-anos-parte-2.ts` tem mais 5 (ODS parte 2, Scratch parte 2, MIT App Inventor, HTML e CSS), o `programacao-12-anos-parte-3.ts` tem mais 7 (ODS parte 3, Scratch parte 3, Roblox Studio, JavaScript, Linguagem Lua, Informática e Hardware), o `programacao-12-anos-parte-4.ts` tem mais 6 de linguagens (JavaScript parte 2, Java, Java parte 2, Python, Python parte 2 e Linguagem Lua parte 2) e o `programacao-12-anos-parte-5.ts` tem mais 6 (Pacote Office, Cultura Geek, Cultura Geek parte 2, Hardware parte 2, Roblox Studio parte 2 e Informática parte 2), o `programacao-12-anos-parte-6.ts` tem mais 6 de linguagens (JavaScript parte 3, Python parte 3, CSS parte 2, HTML parte 2, Linguagem Lua parte 3 e Java parte 3) e o `programacao-12-anos-parte-7.ts` tem mais 7 (Informática parte 3, Computação em Nuvem partes 1 a 3, Linguagens de Programação partes 1 e 2 e A História da Computação), todos com 10 perguntas comentadas. As das partes 6 e 7 vêm com nível mínimo 50 (o professor ajusta depois no painel).
- Cada missão passa pelas **mesmas regras** da rota `POST /missions`: o script usa o `missionBodySchema` e o `checkMissionContent` exportados de `src/routes/missions.ts`. E ele confere o arquivo inteiro antes de gravar a primeira missão, então um erro no arquivo não deixa metade cadastrada.
- O arquivo também pode exportar uma **função** em vez de uma lista: o script passa pra ela as missões de quiz que o professor já tem no banco (primeiro as normais, depois as de evento), e ela monta as novas a partir delas. O sorteio das perguntas fica em `scripts/missions/sorteio.ts`: nenhuma pergunta se repete, cada missão mistura 10 assuntos diferentes e cada pergunta ganha o assunto na frente, como "(Python) O que este código mostra?". A semente é fixa, então o resultado é sempre o mesmo pras mesmas missões. Os arquivos assim:
  - `scripts/missions/halloween.ts`: as 5 "Missão de Halloween Parte N" do evento A Noite do Bug Assombrado (`eventId: "halloween"`, só aparecem na tela do evento), com 50 perguntas sorteadas.
  - `scripts/missions/dracoding.ts`: as 9 missões do evento A Noite de Dracoding (`eventId: "dracoding"`), 3 por fase (`eventPhase` 1, 2 e 3), com 90 perguntas sorteadas. Ele também deixa de fora as perguntas que já estão nas missões de outros eventos do professor (ex.: as Missões de Halloween), pra não repetir. Rode **depois** das missões normais do professor estarem no banco: `npm run missions:import -- professor@escola.com scripts/missions/dracoding.ts` (precisa de pelo menos 10 missões de quiz).
- Missões de evento passam o `eventId` (e o `eventPhase`, nos eventos em fases: Natal e A Noite de Dracoding); o script confere se o evento existe.
- Dá pra passar vários arquivos de uma vez: `npm run missions:import -- professor@escola.com scripts/missions/programacao-12-anos-parte-4.ts scripts/missions/programacao-12-anos-parte-5.ts`.
- O id sai do título, como no site (`newMissionId`: "Introdução ao Scratch" vira `introducao-ao-scratch`).
- Se o professor já tem uma missão com o mesmo título, ela é pulada: dá pra rodar de novo sem duplicar.
- A missão fica do professor, igual a uma criada por ele: aparece no painel dele, ele pode editar ou excluir, e só os alunos dele a veem.

Pra importar **em produção**, rode na pasta `api/` com a `DATABASE_URL` do Neon, do mesmo
jeito que o seed do deploy (no cmd do Windows):

```bat
set "DATABASE_URL=postgresql://...neon.tech/codeguilds?sslmode=require" && npm run missions:import -- professor@escola.com scripts/missions/programacao-12-anos.ts
```

## Tipos do banco gerados automaticamente

O arquivo `src/types/database.ts` é **gerado** pelo kysely-codegen, que se conecta ao banco,
lê as tabelas e escreve os tipos:

```bash
npm run db:types
```

O resultado é algo assim (trecho):

```ts
export interface Students {
  avatar: Generated<Json>;
  coins: Generated<number>;
  houseId: string | null;
  id: Generated<string>;
  passwordHash: string | null;
  teacherId: string;
  // ...
}

export interface DB {
  sessions: Sessions;
  students: Students;
  teachers: Teachers;
}
```

- `Generated<...>` — a coluna tem valor padrão no banco, então é opcional no `insert`.
- `string | null` — a coluna aceita nulo.
- O `--camel-case` do comando gera os nomes em camelCase, combinando com o `CamelCasePlugin`.

Nunca edite esse arquivo à mão: na próxima vez que o comando rodar, as mudanças somem. O
fluxo é sempre: **criar a migration → `npm run migrate` → `npm run db:types`**.

## O servidor Fastify

Diferente do SPE, o servidor foi separado em dois arquivos.

**`src/app.ts`** monta o app: registra os plugins, o tratamento de erros e as rotas. Ele não
sobe o servidor, então pode ser importado em testes automatizados (com o `app.inject()` do
Fastify) sem abrir porta nenhuma.

**`src/server.ts`** só faz o `listen`, igual ao SPE:

```ts
import { app } from "./app";
import { env } from "./env";

app.listen({
    port: env.PORT,
    host: '0.0.0.0',
}).then(() => {
    console.log('Iniciando servidor CodeGuilds...')
    console.log('0 ===========================> 100%')
    console.log(`Servidor CodeGuilds rodando na porta ${env.PORT}!`)
    console.log('Bem vindo de Volta Danilo Amaral ^-^')
})
```

O `host: '0.0.0.0'` faz o servidor ouvir em todas as interfaces de rede, necessário no Render
(como no deploy do SPE).

### As opções do app

```ts
export const app = fastify({
    trustProxy: true,
    logger: env.NODE_ENV === 'production',
})
```

- `trustProxy: true` — em produção a requisição passa pela Vercel e pelo Render antes de chegar na API. Sem isso, o `request.ip` seria o IP desses servidores, e não o do aluno (o limite de tentativas depende do IP certo).
- `logger` — em produção o Fastify registra cada requisição, e os logs aparecem no painel do Render. Em desenvolvimento fica desligado pra não poluir o terminal.

### Plugins e rotas (o mesmo padrão do SPE)

Cada arquivo de `src/routes` exporta uma função assíncrona que recebe o `app` tipado com o
`FastifyInstance`, igual ao `clientsRoutes` do SPE. No `app.ts` elas são registradas com um
prefixo:

```ts
app.register(studentsRoutes, {
    prefix: 'students',
})
```

Assim a rota `app.get('/:id', ...)` dentro de `studentsRoutes` responde em `/students/:id`.

Outros plugins registrados no `app.ts`:

- `@fastify/cookie` — dá acesso ao `request.cookies` e ao `reply.setCookie()`.
- `@fastify/rate-limit` — o limite de tentativas (com `global: false`: só vale nas rotas que pedirem).

### Corpo JSON vazio

Por padrão, o Fastify recusa um `POST` que diz ser JSON (`Content-Type: application/json`)
mas vem sem corpo, e é exatamente assim que o front costuma chamar o `/auth/logout`. O
`app.ts` troca o leitor de JSON padrão por um que aceita corpo vazio (vira `undefined`) e
continua recusando JSON mal formatado com uma mensagem clara.

## Validação de dados com Zod

Igual ao SPE, todo dado que chega numa rota (corpo, parâmetros da URL e query) passa por um
schema do Zod antes de ser usado. O padrão é o mesmo: o schema fica dentro da rota, com um
nome que diz o que ele valida:

```ts
app.get('/:id', { preHandler: ensureAuthenticated }, async (request, reply) => {
    const getStudentParamsSchema = z.object({
        id: z.uuid(),
    })

    const { id } = getStudentParamsSchema.parse(request.params)
    // ...
})
```

Se o dado não bater com o schema, o `.parse()` lança um `ZodError`, e o
[tratamento de erros](#tratamento-de-erros) responde `400` dizendo qual campo está errado.

A versão usada é a **Zod 4** (no SPE era a 3). O jeito de escrever é quase igual; as
diferenças que aparecem no código:

| Zod 3 (SPE) | Zod 4 (CodeGuilds) | O que valida |
|---|---|---|
| `z.string().email()` | `z.email()` | E-mail |
| `z.string().uuid()` | `z.uuid()` | Id no formato uuid |
| — | `z.json()` | Qualquer valor JSON (usado no avatar) |

Outros recursos usados:

- `z.string().trim().min(1).max(90)` — tira os espaços das pontas e exige de 1 a 90 caracteres.
- `.optional()` — o campo pode não vir (usado nas rotas de alteração, como o `PUT` do SPE).
- `z.enum(HOUSES)` — só aceita um dos valores da lista (as quatro casas).

### Mensagens em português

No `env.ts` está a linha:

```ts
z.config(z.locales.ptBR())
```

Com ela, as mensagens do Zod saem em português. Exemplo de resposta para um cadastro com
dados errados:

```json
{
  "message": "Dados inválidos.",
  "issues": [
    { "field": "name", "message": "Pequeno demais: esperava que o texto tivesse >= 1 caracteres" },
    { "field": "email", "message": "Formato do email inválido" }
  ]
}
```

### Campos a mais são ignorados

O `z.object()` descarta qualquer campo que não esteja no schema. Isso é uma proteção
importante: se um aluno mandar `{ "avatar": {...}, "coins": 99999 }` na rota de alterar o
próprio cadastro, o `coins` simplesmente some, porque não está no schema do aluno.

## Funções de validação

As três funções do SPE continuam aqui, em `src/validation/validations.ts`, pras regras de
negócio que o Zod não tem como saber (ex.: "esse login já existe no banco?").

A única mudança: em vez de lançar um texto (`throw msg`), elas lançam um `ValidationError`,
que o tratamento de erros transforma numa resposta `400` com a mensagem.

```ts
export class ValidationError extends Error {
    statusCode = 400
}

export function existsOrError(value: unknown, msg: string): void {
    if (!value) throw new ValidationError(msg)
    if (Array.isArray(value) && value.length === 0) throw new ValidationError(msg)
    if (typeof value === 'string' && !value.trim()) throw new ValidationError(msg)
}

export function notExistsError(value: unknown, msg: string): void {
    try {
        existsOrError(value, msg)
    } catch (error) {
        return
    }
    throw new ValidationError(msg)
}

export function equalsOrError(valueA: unknown, valueB: unknown, msg: string): void {
    if (valueA !== valueB) throw new ValidationError(msg)
}
```

Na fase 3 entraram mais dois erros no mesmo arquivo, pra quando a regra não é "dado
inválido":

```ts
// Registro que não existe (vira resposta 404)
export class NotFoundError extends Error {
    statusCode = 404
}

// Ação que a pessoa logada não pode fazer (vira resposta 403)
export class ForbiddenError extends Error {
    statusCode = 403
}
```

Eles são úteis dentro do `updateProgress`, onde não dá pra usar o `reply.status(...)`: a
regra só lança o erro (ex.: `throw new NotFoundError('Esse item não está no seu inventário.')`),
a transação é desfeita e o tratamento de erros responde com o status certo.

Exemplos de uso reais:

```ts
// O professor escolhido no cadastro precisa existir
const teacher = await db.selectFrom('teachers').select('id').where('id', '=', teacherId).executeTakeFirst()
existsOrError(teacher, 'Professor não encontrado.')

// O e-mail do novo professor não pode estar em uso
notExistsError(emailTaken, `O e-mail "${email}" já é de outro professor.`)
```

## Tratamento de erros

O `app.setErrorHandler` no `app.ts` recebe qualquer erro lançado nas rotas e decide a
resposta. Assim nenhuma rota precisa de `try/catch`:

| Tipo de erro | Status | Resposta |
|---|---|---|
| `ZodError` (dado fora do schema) | `400` | `{ message: 'Dados inválidos.', issues: [...] }` |
| `ValidationError` (existsOrError & cia.) | `400` | `{ message: '...' }` |
| Valor repetido numa coluna única (código `23505` do PostgreSQL) | `409` | `{ message: 'Esse registro já existe.' }` |
| `NotFoundError` e `ForbiddenError` (fase 3) | `404` / `403` | `{ message: '...' }` |
| Erros do Fastify e dos plugins (JSON inválido, 429 do limite...) | o status do erro | `{ message: '...' }` |
| Qualquer outro erro | `500` | `{ message: 'Erro interno no servidor.' }` |

No `500`, o erro de verdade é registrado no log (e mostrado no terminal em desenvolvimento),
mas a resposta nunca mostra detalhes internos para quem chamou a API.

No SPE, quando o `zod.parse` falhava, a API respondia `500`. Aqui ela responde `400` dizendo
o que está errado, que é o certo: o problema está no dado enviado, não no servidor.

### Os status HTTP usados na API

| Status | Quando |
|---|---|
| `200` | Deu certo |
| `201` | Deu certo e algo foi criado (cadastro) |
| `400` | Dado inválido ou regra de negócio não atendida |
| `401` | Não está logado, ou login e senha errados |
| `403` | Está logado, mas não tem permissão pra isso |
| `404` | O registro não existe |
| `409` | Conflito: o registro já existe |
| `429` | Muitas tentativas seguidas (limite de login) |
| `500` | Erro inesperado no servidor |

## Senhas com Argon2

No front de hoje, as senhas ficam em texto puro no localStorage. Na API, **nenhuma senha é
salva**: guardamos só o **hash** dela, uma "impressão digital" que não dá pra desfazer.

```ts
import { hash, verify } from "@node-rs/argon2";

export async function hashPassword(password: string): Promise<string> {
    return hash(password)
}

export async function verifyPassword(passwordHash: string, password: string): Promise<boolean> {
    return verify(passwordHash, password)
}
```

- No cadastro: `passwordHash: await hashPassword(password)`.
- No login: `await verifyPassword(teacher.passwordHash, password)` diz se a senha digitada gera o mesmo hash.

O algoritmo é o **Argon2id**, o recomendado hoje para senhas. Ele é propositalmente lento
(alguns milissegundos por senha), o que não atrapalha um login mas torna inviável alguém
testar milhões de senhas se um dia o banco vazar. Cada hash tem um "sal" aleatório, então dois
alunos com a mesma senha têm hashes diferentes.

Consequência prática: **nem o professor nem o ADM conseguem ver a senha de um aluno**. Se o
aluno esquecer, o professor define uma nova (rota `PUT /students/:id/password`).

## Sessões e cookies (login)

### Como o login funciona

1. O aluno manda login e senha para `POST /auth/students/login`.
2. A API confere a senha com o hash.
3. Se estiver certa, a API gera um **token** aleatório (32 bytes, impossível de adivinhar).
4. No banco, na tabela `sessions`, ela guarda **só o hash do token** (SHA-256), junto com o dono e a validade.
5. O token vai para o navegador num **cookie** chamado `cg_session`.
6. A partir daí, o navegador manda o cookie sozinho em toda requisição, e a API sabe quem é.

```
Navegador                                API                                 Banco
   │  POST /auth/students/login              │                                    │
   │  { username, password }   ────────────► │ confere a senha com o hash ──────► │
   │                                         │ gera o token                       │
   │                                         │ salva sha256(token) ─────────────► │ sessions
   │  ◄──────── Set-Cookie: cg_session=token │                                    │
   │                                         │                                    │
   │  GET /students/:id                      │                                    │
   │  Cookie: cg_session=token ────────────► │ procura sha256(token) ───────────► │
   │                                         │ achou → request.user = aluno       │
   │  ◄──────────────────────── { student }  │                                    │
```

Por que guardar só o hash do token? Se alguém conseguir ler a tabela `sessions`, não
consegue usar o que leu pra entrar na conta de ninguém, porque o hash não volta a ser o token.

### As opções do cookie

```ts
reply.setCookie(SESSION_COOKIE, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    ...(isTeacher && { expires: expiresAt }),
})
```

- `httpOnly: true` — o JavaScript da página não consegue ler o cookie. Mesmo que um dia entre um script malicioso no site, ele não rouba a sessão.
- `sameSite: 'lax'` — o navegador não manda o cookie em requisições disparadas por outros sites (proteção contra CSRF).
- `secure` — em produção, o cookie só viaja por HTTPS.
- `expires` — só o professor tem data de validade no cookie (fica logado por 7 dias). O cookie do aluno não tem, então some quando o navegador fecha, igual ao front de hoje, em que cada nova entrada começa pela tela de login. Mesmo assim, no banco, a sessão do aluno vence em 12 horas.

### Validade e limpeza

| Quem | Validade da sessão |
|---|---|
| Professor e ADM | 7 dias |
| Aluno | 12 horas (ou até fechar o navegador) |

Toda vez que alguém faz login, as sessões vencidas de todo mundo são apagadas do banco, então
a tabela não cresce sem parar.

As sessões também caem quando:

- a pessoa faz logout (`POST /auth/logout`);
- o professor define uma senha nova para o aluno (todas as sessões do aluno são apagadas);
- o professor ou o aluno é excluído (as sessões vão junto, pelo `on delete cascade`).

### Por que sessão no banco e não JWT?

Com JWT, o token carrega os dados e o servidor não guarda nada. É ótimo para escalar, mas
não dá pra "derrubar" um token antes de ele vencer. Com a sessão no banco, trocar a senha de
um aluno ou excluir um professor tira o acesso **na hora**. Para uma plataforma escolar isso
vale mais, e o custo é uma consulta rápida por requisição.

## Middlewares de permissão

Os middlewares ficam em `src/middlewares/auth.ts`. Como no SPE, eles recebem o `request` e o
`reply` e rodam antes das rotas.

### loadUser: quem está fazendo a requisição?

Registrado no `app.ts` com `app.addHook('onRequest', loadUser)`, ele roda antes de **todas**
as rotas: lê o cookie, procura a sessão no banco e preenche o `request.user`:

```ts
export type AuthUser =
    | { role: 'professor', id: string, isAdmin: boolean }
    | { role: 'aluno', id: string, teacherId: string }
```

Sem cookie (ou com a sessão vencida), o `request.user` fica `null`. O `declare module "fastify"`
no mesmo arquivo ensina ao TypeScript que toda requisição tem esse campo.

### ensureAuthenticated, ensureTeacher e ensureAdmin

São colocados no `preHandler` de cada rota. Se a regra não bater, respondem na hora e a rota
nem é executada:

```ts
app.get('/', { preHandler: ensureTeacher }, async (request) => {
    // só chega aqui se for professor (ou ADM)
})
```

| Middleware | Quem passa | Se não passar |
|---|---|---|
| `ensureAuthenticated` | Qualquer pessoa logada | `401 Faça login para continuar.` |
| `ensureTeacher` | Professores (o ADM também é professor) | `401` ou `403 Apenas professores podem fazer isso.` |
| `ensureAdmin` | Só o ADM | `401` ou `403 Apenas o ADM pode fazer isso.` |

Algumas regras dependem do registro (ex.: "o professor só mexe nos alunos **dele**"). Essas
ficam em funções dentro do arquivo da rota, como `canAccessStudent` e `canManageStudent` em
`routes/students.ts`.

## Limite de tentativas (rate limit)

Pra ninguém ficar chutando a senha de um aluno, as rotas de login aceitam no máximo **5
tentativas por minuto** para cada **IP + login**. Na sexta, a resposta é:

```json
{ "message": "Muitas tentativas. Espere 60 segundos e tente de novo." }
```

### Por que IP + login, e não só o IP?

Numa escola, a turma inteira sai para a internet pelo **mesmo IP**. Se o limite fosse só por
IP, cinco alunos errando a senha travariam o login da sala toda. Com IP + login, só quem erra
muito a **própria** senha espera um minuto; os colegas continuam entrando normalmente.

A regra está em `src/utils/rateLimit.ts`:

```ts
export function loginRateLimit(field: 'email' | 'username'): RateLimitOptions {
    return {
        max: 5,
        timeWindow: '1 minute',
        hook: 'preHandler',
        keyGenerator: (request: FastifyRequest) => {
            const body = request.body as Record<string, unknown> | undefined
            const login = String(body?.[field] ?? '').trim().toLowerCase()

            return `${request.ip}:${login}`
        },
    }
}
```

- `hook: 'preHandler'` — o limite roda depois de o corpo da requisição ser lido. No padrão (`onRequest`) o corpo ainda não existe e não daria pra saber o login.
- `keyGenerator` — a "chave" que é contada: IP + login.

E na rota:

```ts
app.post('/students/login', { config: { rateLimit: loginRateLimit('username') } }, async (request, reply) => {
```

O cadastro de alunos (`POST /students`) também tem limite: 30 por minuto por IP. Isso segura
robôs criando contas e ainda deixa uma turma inteira se cadastrar ao mesmo tempo.

O contador fica na memória do servidor. Se a API reiniciar, os contadores zeram, o que não
é problema para esse uso.

## Rotas da API

Em desenvolvimento a base é `http://localhost:3333`. Pelo site (com o
[rewrite](#ligação-com-o-site-nextjs)) a base é `/api`: por exemplo, `/api/auth/me`.

Resumo:

| Método | Rota | Quem pode |
|---|---|---|
| GET | `/health` | Todos |
| GET | `/health/ping` | Todos (o cron-job.org) |
| POST | `/auth/teachers/login` | Todos |
| POST | `/auth/students/login` | Todos |
| POST | `/auth/logout` | Todos |
| GET | `/auth/me` | Logados |
| GET | `/teachers` | Todos (só id, nome e se é o ADM) |
| GET | `/teachers/admin` | ADM |
| GET | `/teachers/:id` | O próprio professor ou o ADM |
| POST | `/teachers` | ADM |
| PUT | `/teachers/:id` | O próprio professor ou o ADM |
| DELETE | `/teachers/:id` | ADM |
| POST | `/students` | Todos (é o cadastro) |
| GET | `/students` | Professores (os seus) e ADM (todos) |
| GET | `/students/community` | Logados (dados públicos de todos os alunos) |
| GET | `/students/:id` | O próprio aluno, o professor dele ou o ADM |
| PUT | `/students/:id` | O professor dele / o ADM, ou o próprio aluno (campos diferentes) |
| PUT | `/students/:id/password` | O professor dele ou o ADM |
| DELETE | `/students/:id/items/:itemId` | O professor dele ou o ADM (tira um item do inventário) |
| DELETE | `/students/:id` | O professor dele ou o ADM |
| GET | `/students/:id/dashboard` | O professor dele ou o ADM (dashboard do aluno) |
| POST | `/presence` | Alunos (sinal de vida; devolve quem está online) |
| GET | `/presence` | Logados (quem está online) |

As rotas do jogo (inventário, missões, Loja, presentes, amigos, Mercado, trocas e eventos)
estão em [As rotas da fase 3](#as-rotas-da-fase-3).

### O formato do professor e do aluno nas respostas

As respostas **nunca** trazem o `passwordHash`. As colunas que saem estão em
`src/utils/queries.ts` (`teachersQuery()` e `studentsQuery()`).

Professor:

```json
{
  "id": "61b56c8f-1762-4fe4-b903-5e4d6cddcf6a",
  "name": "Danilo",
  "email": "danilo@codeguilds.com",
  "isAdmin": true,
  "tutorialDone": false,
  "createdAt": "2026-09-28T14:50:00.000Z"
}
```

Aluno:

```json
{
  "id": "4e606ff8-cde6-4dae-b43d-3a69d96a335f",
  "teacherId": "395b31ca-795a-4484-9291-2893f6d1d75f",
  "name": "Ana Teste",
  "email": "ana@teste.test",
  "turma": "7A",
  "username": "ana.teste",
  "houseId": "noctis",
  "avatar": { "skinTone": 2, "hairStyle": "curto" },
  "level": 1,
  "xp": 0,
  "coins": 0,
  "onboardingStep": "avatar",
  "tutorialDone": false,
  "bonusSlots": 0,
  "multiverseAccess": null,
  "inventory": [{ "id": "i_1759...", "name": "Fragmento Inicial", "icon": "✨", "rarity": "comum", "value": 5, "xp": 20, "...": "..." }],
  "pendingItems": [],
  "equipped": {},
  "completedMissionIds": [],
  "events": {},
  "createdAt": "2026-09-28T14:50:30.000Z",
  "hasPassword": true
}
```

O `hasPassword` substitui a senha: o professor sabe se ainda precisa definir uma, sem nunca
ver qual é. Os campos do progresso (`inventory` até `events`) entraram na fase 3 (veja
[O progresso do aluno no banco](#o-progresso-do-aluno-no-banco)).

---

### GET /health

Confere se a API e o banco estão no ar (faz um `select 1` no banco). Use pra testar o deploy.
Como consulta o banco, ela **acorda o Neon**: não use no cron-job.org.

Resposta `200`:

```json
{ "status": "ok" }
```

### GET /health/ping

Só responde, sem tocar no banco. É a rota que o cron-job.org chama a cada 10 minutos pra o
Render não colocar a API pra dormir. Assim a API fica acordada, mas o Neon pode dormir quando
ninguém usa o site (veja [Manter a API acordada](#3-manter-a-api-acordada)).

Resposta `200`: `{ "status": "ok" }`.

---

### POST /auth/teachers/login

Login do professor e do ADM. Limite: 5 tentativas por minuto por IP + e-mail.

Corpo:

```json
{ "email": "danilo@codeguilds.com", "password": "..." }
```

O e-mail é comparado sem diferenciar maiúsculas e sem os espaços das pontas.

- `200` — `{ "teacher": { ... } }` e o cookie `cg_session` (válido por 7 dias).
- `401` — `{ "message": "E-mail ou senha incorretos." }`. A mensagem é a mesma para e-mail inexistente e senha errada, pra ninguém descobrir quais e-mails estão cadastrados.
- `429` — muitas tentativas.

---

### POST /auth/students/login

Login do aluno. Limite: 5 tentativas por minuto por IP + login.

Corpo:

```json
{ "username": "ana.teste", "password": "..." }
```

O login passa pela mesma formatação do front (`normalizeUsername`): minúsculo, sem acento e
só com letras, números, ponto, hífen e `_`. Então `"Ána.Teste "` vira `"ana.teste"`.

- `200` — `{ "student": { ... } }` e o cookie `cg_session` (some ao fechar o navegador; no banco vence em 12 horas).
- `401` — `{ "message": "Login ou senha incorretos." }`.
- `401` — `{ "message": "Sua conta ainda não tem senha — peça ao professor para definir uma." }` (aluno sem senha).
- `429` — muitas tentativas.

---

### POST /auth/logout

Apaga a sessão do banco e limpa o cookie. Pode ser chamada sem corpo. Resposta `200`.
Se for um aluno, ele também fica offline na hora (o sinal de vida dele é apagado, veja
[Status online](#status-online-dos-alunos)).

---

### GET /auth/me

Diz quem está logado. O site chama ao abrir, pra saber se mostra a tela de login ou o painel.

- Professor: `200` — `{ "role": "professor", "teacher": { ... } }`
- Aluno: `200` — `{ "role": "aluno", "student": { ... } }`
- Ninguém logado: `401` — `{ "message": "Faça login para continuar." }`

---

### GET /teachers

Rota **pública**: a tela de cadastro do aluno mostra a lista de professores para ele escolher
o seu. Por isso devolve só o id, o nome e se é o ADM (sem e-mail). O ADM vem primeiro,
depois por ordem de cadastro. O site usa o `isAdmin` pra saber quem é o dono das missões de
exemplo (elas eram do professor-semente `t_danilo` e agora são do ADM).

```json
{ "teachers": [ { "id": "...", "name": "Danilo", "isAdmin": true }, { "id": "...", "name": "Prof Teste", "isAdmin": false } ] }
```

### GET /teachers/admin

Só o ADM. A mesma lista, com todos os dados de cada professor (e-mail, se é ADM etc.).

### GET /teachers/:id

O próprio professor ou o ADM. `200 { "teacher": {...} }`, `403` ou `404`.

### POST /teachers

Só o ADM cadastra professores.

```json
{ "name": "Prof Teste", "email": "prof@teste.test", "password": "teste123" }
```

- `201` — `{ "teacher": { ... } }`
- `400` — dados inválidos ou `O e-mail "..." já é de outro professor.`

### PUT /teachers/:id

O próprio professor ou o ADM. Todos os campos são opcionais (muda só o que vier):

```json
{ "name": "Novo nome", "email": "novo@email.com", "password": "nova-senha", "tutorialDone": true }
```

O papel de ADM não muda por aqui. `200 { "teacher": {...} }`, `400`, `403` ou `404`.

### DELETE /teachers/:id

Só o ADM. Os alunos **e as missões** do professor excluído passam para o professor escolhido
na query `?heirId=<id>` (o "herdeiro", que o Painel ADM pede na tela de exclusão); sem ele,
passam para o ADM que fez a exclusão. Tudo numa [transação](#transações). As sessões e a
agenda dos eventos do professor excluído são apagadas junto (os alunos passam a seguir a
agenda do herdeiro).

```
DELETE /teachers/395b31ca-795a-4484-9291-2893f6d1d75f?heirId=61b56c8f-1762-4fe4-b903-5e4d6cddcf6a
```

- `200` — excluído.
- `400` — `O ADM não pode ser excluído.`, `Escolha outro professor para receber os alunos.` (herdeiro igual ao excluído) ou `O professor escolhido para receber os alunos não existe.`
- `404` — professor não encontrado.

---

### POST /students

O **cadastro** do aluno, por isso é pública. Ao terminar, o aluno já fica logado (recebe o
cookie), igual ao front de hoje. Limite: 30 cadastros por minuto por IP.

```json
{
  "name": "Ana Teste",
  "email": "ana@teste.test",
  "turma": "7A",
  "username": "ana.teste",
  "password": "abcd",
  "teacherId": "395b31ca-795a-4484-9291-2893f6d1d75f"
}
```

Regras: login com pelo menos 3 caracteres (depois de formatado) e que ninguém use; senha com
pelo menos 4 caracteres (a mesma regra do front); professor existente.

- `201` — `{ "student": { ... } }`
- `400` — dados inválidos, `Professor não encontrado.` ou `O login "..." já está em uso — escolha outro.`

O aluno novo começa no nível 1, com 0 XP, 0 moedas e na etapa `casa` do primeiro acesso.

### GET /students

- Professor: devolve só os alunos dele.
- ADM: devolve todos. Com `?teacherId=<id>`, só os de um professor.

```json
{ "students": [ { ... }, { ... } ] }
```

### GET /students/community

Qualquer pessoa logada. A comunidade da Academia: **todos** os alunos, só com os dados
públicos (sem e-mail, turma, login nem senha). É o que o aluno usa pra ver os pontos das
casas, o ranking, os perfis dos colegas, os amigos e com quem negociar.

```json
{
  "students": [
    {
      "id": "...",
      "teacherId": "...",
      "name": "Ana Teste",
      "houseId": "noctis",
      "avatar": { ... },
      "level": 1,
      "xp": 0,
      "coins": 0,
      "onboardingStep": "completo",
      "createdAt": "..."
    }
  ]
}
```

No Fastify, uma rota fixa (`/community`) sempre tem prioridade sobre uma com parâmetro
(`/:id`), então `/students/community` nunca é confundida com um aluno de id "community".

### GET /students/:id

O próprio aluno, o professor dele ou o ADM. `200 { "student": {...} }`, `403` ou `404`.

### PUT /students/:id

Cada um pode mudar coisas diferentes, por isso existem dois schemas nesta rota:

**O professor do aluno ou o ADM:**

```json
{ "name": "...", "email": "...", "turma": "...", "username": "...", "houseId": "flavus", "teacherId": "..." }
```

- Só o ADM pode mandar `teacherId` (trocar o aluno de professor); o professor recebe `403`.
- Se o aluno ainda estava escolhendo a casa (etapa `casa`) e o professor define uma, ele já segue para a etapa `avatar` (a mesma regra do `houseChangePatch` do front).

**O próprio aluno:**

```json
{ "avatar": { ... }, "houseId": "noctis", "onboardingStep": "avatar", "tutorialDone": true }
```

- A casa só pode ser escolhida pelo aluno durante o primeiro acesso (etapas `casa` e `avatar`: na tela do avatar dá pra voltar e trocar). Depois que fica `completo`: `400 A casa só pode ser escolhida no primeiro acesso. Depois, só o professor troca.`

**Nível, XP e moedas não mudam por esta rota**, nem pelo professor nem pelo aluno. Quem vai
mexer neles são as regras do jogo no servidor (missões, loja, trocas), nas próximas fases.

Respostas: `200 { "student": {...} }`, `400`, `403` ou `404`.

### PUT /students/:id/password

O professor do aluno ou o ADM define uma senha nova:

```json
{ "password": "nova123" }
```

Todas as sessões abertas do aluno caem: ele precisa entrar de novo com a senha nova.
`200`, `400`, `403` ou `404`.

### DELETE /students/:id/items/:itemId

O professor do aluno ou o ADM tira um item do inventário dele (se era um visual equipado,
sai do avatar também). `200 { "student": {...} }`, `403` ou `404`.

### DELETE /students/:id

O professor do aluno ou o ADM. As sessões, as amizades e as ofertas e trocas que o aluno
**fez** são apagadas junto. As ofertas e trocas que ele **recebeu** devolvem os itens pra
quem ofereceu, antes de ele sair (veja [Itens guardados](#itens-guardados-ofertas-e-trocas)).
`200`, `403` ou `404`.

## Testando as rotas

Assim como no SPE, dá pra testar com o [Insomnia](https://insomnia.rest) (ou o Postman).
O Insomnia guarda o cookie `cg_session` sozinho depois do login, então as próximas
requisições já vão como o usuário logado.

Ordem pra testar do zero:

1. `POST http://localhost:3333/auth/teachers/login` com o e-mail e a senha do ADM do `.env`.
2. `POST http://localhost:3333/teachers` pra cadastrar um professor.
3. `GET http://localhost:3333/teachers` pra pegar o id dele.
4. `POST http://localhost:3333/students` pra cadastrar um aluno com esse `teacherId`.
5. `GET http://localhost:3333/students` (logado como o professor) pra ver o aluno.

Com o `curl` (Git Bash), o `-c` salva o cookie num arquivo e o `-b` manda ele de volta:

```bash
curl -c cookies.txt -H "Content-Type: application/json" \
  -d '{"email":"danilo@codeguilds.com","password":"SUA_SENHA"}' \
  http://localhost:3333/auth/teachers/login

curl -b cookies.txt http://localhost:3333/auth/me
```

## Ligação com o site (Next.js)

O site (na Vercel) e a API (no Render) ficam em domínios diferentes. Os navegadores bloqueiam
cada vez mais os cookies entre domínios diferentes, e o login dependeria disso. A solução é o
site **repassar** as chamadas para a API: o navegador só conversa com o domínio do site, e o
cookie funciona sem CORS nenhum.

Isso está no `next.config.js` da raiz do projeto:

```js
async rewrites() {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) return [];
  return [{ source: "/api/:path*", destination: `${apiUrl}/:path*` }];
},
```

- O front chama `/api/auth/me`, e o Next.js repassa para `${API_URL}/auth/me`.
- Local: crie um `.env.local` na raiz do site com `API_URL=http://localhost:3333` e reinicie o `npm run dev` do site.
- Vercel: em **Settings → Environment Variables**, crie `API_URL` com a URL da API no Render.
- Sem `API_URL`, nada é repassado. Desde a fase 2, o site depende da API para login e cadastro, então sem ela ninguém entra (a tela mostra "O servidor da CodeGuilds não está configurado").

Nas chamadas feitas pelo navegador, o cookie vai sozinho. Exemplo de como o front vai falar
com a API:

```ts
const response = await fetch('/api/auth/students/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
})

const data = await response.json()
if (!response.ok) alert(data.message)
```

## Fase 2: o site usando a API

Na fase 2, o site deixou de guardar as **contas** no localStorage e passou a usar a API. O
**progresso do jogo** (nível, XP, moedas, inventário, missões feitas, visuais equipados,
eventos) e o resto (missões, loja, mensagens, amigos, trocas) continuaram no navegador. Esta
seção descreve como ficou ao fim da fase 2; o que mudou depois está em
[Fase 3: o jogo no servidor](#fase-3-o-jogo-no-servidor).

### O que era da API e o que ainda era do navegador (fim da fase 2)

| Dado | Onde fica agora |
|---|---|
| Login, senha, sessão | API (cookie `cg_session`) |
| Professores (nome, e-mail, ADM, tutorial) | API |
| Perfil do aluno: nome, e-mail, turma, login, professor, casa, avatar, etapa do primeiro acesso, tutorial | API |
| Nível, XP, moedas, inventário, itens esperando espaço, espaços extras | Navegador (fase 3) |
| Missões feitas, visuais equipados, progresso nos eventos, passe do Multiverso | Navegador (fase 3) |
| Missões, loja, mensagens, amigos, chat, ofertas, trocas, entregas, presentes | Navegador (fases 3 a 6) |

Consequência: a **conta** do aluno funciona em qualquer computador, mas o **progresso** ainda
fica em cada navegador. Por isso a plataforma só deve ir para turmas reais depois das fases 3 e 4.

### Os arquivos do site envolvidos

```
src/
├── services/
│   └── api.ts          → o cliente HTTP (fetch em /api/..., erros viram ApiError com a mensagem da API)
└── engine/
    ├── accounts.ts     → a ponte com a API: sincronização, login, cadastro, saída e as mudanças de conta
    ├── students.ts     → o aluno (perfil em cache + progresso local) e as regras do jogo
    ├── teachers.ts     → cache dos professores e o espelho da sessão do professor
    └── store.ts        → os hooks useStudents e useTeachers, agora em cima do accounts.ts
```

### O cliente HTTP (src/services/api.ts)

Um `fetch` com três cuidados:

- Sempre chama `/api/...` (o Next.js repassa pra API), com `credentials: 'same-origin'`: o cookie de login vai sozinho.
- Se a API responde com erro, lança um `ApiError` com a mensagem que a própria API mandou (em português) e o `status`. Se vier erro de validação do Zod, junta o primeiro campo inválido na mensagem.
- Sem internet ou com a API fora do ar, o erro tem `status 0` e a mensagem "Não foi possível falar com o servidor...". Se o `API_URL` do site não estiver configurado, o Next responde 404 e a mensagem explica isso.

```ts
const { student } = await api.post<{ student: StudentAccount }>('/auth/students/login', { username, password })
```

### O cache: as telas continuam lendo na hora

As telas do site foram feitas lendo o localStorage de forma síncrona (sem esperar nada).
Pra não reescrever as 23 telas que usam `useStudents` e `useTeachers`, os mesmos localStorage
de antes (`cg-students` e `cg-teachers`) viraram um **cache** do que a API devolveu:

1. A tela abre e mostra na hora o que está no cache.
2. Em segundo plano, o `refreshFromApi()` pergunta à API quem está logado (`/auth/me`) e busca as listas que essa pessoa pode ver (na fase 3 entraram também as missões, a Loja, a agenda dos eventos e, pro aluno, os amigos, as ofertas e as trocas):
   - professor: `/students` (os alunos dele) e `/teachers` (ou `/teachers/admin`, se for ADM);
   - aluno: `/students/community` (a comunidade) e `/teachers`;
   - ninguém logado: só `/teachers` (a tela de cadastro precisa da lista).
3. O que voltou é gravado no cache (`saveStudentAccounts`, `saveTeachers`) e o `emitChange()` avisa os hooks, que atualizam as telas.

O `refreshFromApi()` roda quando os hooks montam (no máximo a cada 5 segundos, por mais
telas que abram juntas), quando a pessoa volta pra aba do site e depois de login, cadastro e
edições.

No `cg-students`, cada aluno junta as duas coisas: o **perfil** (sempre o que a API mandou por
último) e o **progresso** (que só existe neste navegador e é mantido a cada atualização).
Um aluno que aparece pela primeira vez neste navegador começa com o progresso zerado; só no
cadastro ele ganha o presente de boas-vindas (o Fragmento Inicial).

O cache pode ter mais gente do que a pessoa logada pode ver (outros alunos que já usaram o
mesmo computador). Por isso a última lista da API fica em `cg-visible-students`, e o
`listStudents()` só devolve esses (e sempre o aluno logado).

Professores e alunos guardados antes do back end (ids `t_...` e `s_...`) são ignorados: eles
não têm conta na API.

### A sessão: o cookie manda, o localStorage espelha

Quem diz quem está logado é o cookie da API. O site guarda um **espelho** disso, pra decidir
na hora qual tela mostrar:

- professor: `cg-teacher-session` no localStorage (o painel abre direto ao voltar);
- aluno: `cg-active-student` no sessionStorage (como antes).

Regras:

- Só existe **uma sessão por navegador**: entrar como aluno encerra a sessão de professor e vice-versa (a API só guarda um cookie `cg_session`).
- Enquanto a primeira conferência com a API não termina, o `ready` dos hooks fica `false` e as telas protegidas mostram "Carregando…". Assim, quem abre uma aba nova e ainda está logado não é mandado pro login por engano.
- Se a API responde "ninguém logado" (401), o espelho é apagado. Se a API está fora do ar, o espelho é mantido e o site segue com o cache.
- Todo login, cadastro e saída muda um contador de versão da sessão (`sessionVersion`). Uma sincronização que começou antes descarta o que trouxe: sem isso, uma resposta atrasada de "ninguém logado" apagaria a sessão que acabou de abrir.

### O que mudou nos hooks

`useStudents`:

| Função | Antes | Agora |
|---|---|---|
| `login(username, password)` | conferia no localStorage | `Promise` — API `/auth/students/login` |
| `signUp(dados)` | criava no localStorage | `Promise` — API `POST /students` (o aluno já sai logado) |
| `patchActive(patch)` | salvava no localStorage | salva no cache e, se mudou o perfil (avatar, casa, etapa do primeiro acesso, tutorial), manda pra API em segundo plano |
| `patchStudent(id, patch)` | salvava qualquer campo | só progresso do jogo (**removido na fase 3**: o progresso só muda pela API) |
| `updateAccount(id, patch)` | — | **novo**: nome, e-mail, turma, login, casa e (ADM) professor, na API |
| `setPassword(id, senha)` | — | **novo**: o professor define uma senha nova |
| `deleteStudent(id)` | apagava do localStorage | `Promise` — API `DELETE /students/:id` e depois limpa o que o aluno tinha no navegador |
| `logout()` | apagava o aluno ativo | apaga o espelho na hora e avisa a API |

`useTeachers`: `login`, `addTeacher`, `editTeacher` e `deleteTeacher` viraram `Promise` e
falam com a API; `finishTutorial` salva no cache na hora e manda pra API em segundo plano.
As funções que falam com a API devolvem a mensagem de erro (ou `null` se deu certo), e as
telas mostram essa mensagem.

### O que mudou nas telas

- **`/entrar`**: login e cadastro esperam a API (botão "Entrando…" / "Criando sua conta…") e mostram o erro que ela mandar (ex.: login já em uso). O formato do login e o tamanho da senha continuam sendo conferidos antes, no próprio site.
- **Login do professor e do ADM**: senha escondida no campo, sem o código mestre e sem a senha de demonstração na tela.
- **Painel ADM → Professores**: a lista não mostra mais senhas; na edição, a senha é opcional (em branco, continua a mesma); a exclusão manda o herdeiro escolhido pra API.
- **Ficha do aluno (painel do professor e ADM)**: a senha do aluno não aparece mais ("🔒 Definida (só o aluno sabe)" ou "⚠️ Sem senha"). Em "Acesso do aluno" o professor troca o login e define uma senha nova. Dados, casa, professor (ADM) e exclusão esperam a API e mostram o erro, se houver.

### Rodando o site com a API na sua máquina

1. Suba a API (`npm run dev` na pasta `api/`, com o Docker aberto).
2. Na raiz do site, o arquivo `.env.local` precisa ter:

```bash
API_URL=http://localhost:3333
```

3. Reinicie o `npm run dev` do site (o `next.config.js` só lê o `API_URL` quando o servidor inicia).
4. Abra `http://localhost:3000/api/health`: tem que aparecer `{"status":"ok"}` (é a API respondendo pelo site).

## Fase 3: o jogo no servidor

Na fase 3, tudo que vale moedas, XP ou itens passou para a API. Antes, o site calculava a
recompensa e salvava no navegador, então bastava abrir o DevTools e mudar o `cg-students`
pra ficar rico. Agora a tela só **pede** a ação ("usei o item X", "terminei o quiz com estas
respostas", "quero comprar o item Y") e a API confere, aplica a regra e devolve o aluno
atualizado.

### O que é da API e o que ainda é do navegador

| Dado | Onde fica agora |
|---|---|
| Login, senha, sessão, professores, perfil do aluno | API (fase 2) |
| Nível, XP, moedas, inventário, itens esperando espaço, espaços extras | **API** |
| Missões feitas, visuais equipados, progresso nos eventos, passe do Multiverso | **API** |
| Missões (catálogo de cada professor) e a Loja | **API** |
| Presentes do professor, amizades, ofertas do Mercado, trocas entre amigos | **API** |
| Agenda dos eventos (iniciar, liberar fase, encerrar) | **API** |
| Recompensa da missão de entrega aprovada | **API** |
| Mensagens (sininho), conversa com balões, mensagens pro professor, comunicados | **API** (fase 4) |
| Entregas das missões de entrega (texto e arquivos) | **API** + Supabase Storage (fase 5) |

Ao fim da fase 3, as mensagens ainda eram locais: o **site** criava a mensagem (🛒 Compra,
🔄 Troca, 🎁 Presente...) no navegador de quem fez a ação. A fase 4 resolveu isso: a própria
API cria cada mensagem, na mesma transação da ação (veja
[Fase 4: as mensagens no servidor](#fase-4-as-mensagens-no-servidor)).

### Uma regra só: a API usa as regras do site

As regras do jogo já existiam no site, em `src/engine/` (ganhar XP e subir de nível, guardar
itens com limite de espaço, comprar, trocar...). Em vez de reescrever tudo no servidor (e
correr o risco de as duas versões ficarem diferentes), a **API importa os mesmos arquivos**:

```ts
// api/src/routes/inventory.ts
import { consumeItem, sellItemToSystem, equipItem } from "../../../src/engine/students";
```

O site usa essas funções pra mostrar (ex.: "faltam 30 moedas"), e a API usa pra decidir.
Uma regra só, em um lugar só.

Os arquivos de `src/engine/` que a API importa:

| Arquivo | Regras usadas pela API |
|---|---|
| `students.ts` | usar item, vender, descartar, equipar, guardar itens com limite de espaço, recompensa de missão, `grantItem` |
| `missions.ts` | correção do quiz (`hasPassed`), tipos das missões |
| `shop.ts` | compra (`applyPurchase`), coleções da Loja, itens padrão |
| `avatar.ts` | visuais e coleções (pra conferir visual repetido na Loja) |
| `multiverse.ts` | usar a Chave do Multiverso |
| `market.ts` | criar, aceitar e devolver ofertas |
| `trades.ts` | propor, aceitar e devolver trocas |
| `gifts.ts` | o tipo do presente |
| `specialEvents.ts` | fases dos eventos, abertura vista, concluir fase e recompensa |
| `eventItems.ts` | o item do evento com as alterações do ADM na Loja (`resolveEventItem`) |

Três cuidados pra isso funcionar:

- **Esses arquivos não podem importar nada com `@/`** (o atalho do Next.js pra pasta `src/`). A API não conhece esse atalho. Por isso as chamadas à API ficam em arquivos separados (`gameApi.ts`, `shopApi.ts`, `socialApi.ts`, `eventsApi.ts`), que a API nunca importa.
- Eles também não podem usar o `window` ou o `localStorage` quando são carregados, só dentro das funções (todos já conferem `typeof window === "undefined"`). As funções que a API usa são **puras**: recebem o aluno e devolvem o aluno alterado, sem salvar nada.
- O `tsconfig.json` da API tem `"lib": ["ES2022", "DOM"]`, porque esses arquivos citam tipos do navegador (como `window`). No build, o tsup segue os imports e coloca essas regras dentro do `build/server.js`.

### O progresso do aluno no banco

Nível, XP, moedas, espaços extras e o passe do Multiverso já eram colunas da tabela
`students`. A migration `20260929120000_add-progress-to-students` trouxe o resto, em `jsonb`,
com **exatamente** o formato que o site usa (`InventoryItem`, `equipped` etc., de
`src/engine/students.ts`):

| Coluna | O que guarda |
|---|---|
| `inventory` | os itens do aluno |
| `pending_items` | os itens que esperam espaço no inventário |
| `equipped` | os visuais equipados no avatar (espaço → id do item) |
| `completed_mission_ids` | os ids das missões concluídas |
| `events` | o progresso em cada evento/fase (abertura vista, fase concluída) |

Por que `jsonb` e não uma tabela de itens? Porque o inventário sempre é lido e salvo inteiro,
junto com o aluno, e as regras do site já trabalham com o objeto completo. Uma tabela de itens
só valeria a pena se precisássemos de consultas do tipo "quem tem o item X", que o jogo não faz.

Um detalhe ao **salvar** `jsonb`: o driver `pg` transforma um array do JavaScript num array do
PostgreSQL (e não num JSON), e o banco recusa. Por isso os valores vão com `JSON.stringify`:

```ts
inventory: JSON.stringify(student.inventory) as Json,
```

### updateProgress: transação + linha travada

Toda ação do jogo passa pela função `updateProgress` (`src/services/progress.ts`):

```ts
const result = await updateProgress(studentId, (student) => {
    const item = findItem(student, itemId)
    return { student: sellItemToSystem(student, itemId), coinsGained: item.value }
})
```

Por dentro, numa [transação](#transações):

1. carrega o aluno **travando a linha** (`select ... for update`);
2. monta o objeto `Student` no formato das regras do site (`toStudent`);
3. aplica a regra (a função que a rota passou);
4. salva o progresso de volta (`saveProgress`).

Se a regra lançar um erro (ex.: "Esse item não está no seu inventário."), nada é salvo.

**Por que travar a linha?** Imagine o aluno clicando duas vezes rápido em "Vender". Sem a
trava, as duas requisições leriam o aluno ao mesmo tempo (as duas com o item), as duas
venderiam, e ele ganharia as moedas duas vezes. Com o `for update`, a segunda requisição
**espera** a primeira terminar e lê o aluno já sem o item, então a venda falha como deveria.

O terceiro parâmetro, `alsoSave`, grava outras coisas na mesma transação. A compra usa isso
pra somar a venda no item da Loja: ou salva as duas coisas, ou nenhuma.

#### Ações com dois alunos: lockStudents

Aceitar uma oferta mexe no comprador e no vendedor; aceitar uma troca, nos dois amigos; um
presente pra turma, em todos os alunos. Pra isso existe o `lockStudents(trx, ids)`, que trava
várias linhas de uma vez, **sempre na ordem do id**:

```ts
const students = await lockStudents(trx, [offer.buyerId, offer.sellerId])
```

Por que a ordem importa? Se a Ana aceitar uma troca do Bruno enquanto o Bruno aceita uma troca
da Ana, e cada requisição travasse primeiro "o seu" aluno, as duas ficariam esperando a outra
soltar pra sempre (um *deadlock*). Travando sempre em ordem de id, as duas tentam travar a
mesma linha primeiro, e uma simplesmente espera a outra.

A ordem das travas na API inteira é sempre a mesma: **primeiro a oferta/troca/amizade, depois
os alunos** (em ordem de id).

### Itens guardados: ofertas e trocas

No Mercado e nas trocas, os itens oferecidos **saem do inventário** na hora e ficam guardados
na própria linha da oferta (coluna `item`) ou da troca (coluna `offered`), até a outra pessoa
decidir. Assim ninguém vende o mesmo item duas vezes nem usa um item que está numa proposta.

O `src/services/escrow.ts` cuida de devolver esses itens:

| Quando | O que volta |
|---|---|
| O comprador recusa ou o vendedor cancela a oferta | o item volta pro vendedor |
| O amigo recusa ou quem propôs cancela a troca | os itens oferecidos voltam pra quem propôs |
| A amizade é desfeita | as trocas pendentes entre os dois são canceladas (os itens voltam) |
| Um aluno é excluído | as ofertas e trocas que ele **recebeu** devolvem os itens pra quem ofereceu |

Se quem vai receber o item de volta estiver com o inventário cheio, o item vai pra "esperando
espaço" (nada se perde). As ofertas e trocas que o aluno excluído **fez** somem junto com ele
(`on delete cascade`).

### As tabelas novas

```
missions (missões)                 shop_items (Loja)                 event_runs (agenda dos eventos)
──────────────────                 ─────────────────                 ───────────────────────────────
id           varchar(120) PK       id             varchar(80) PK     teacher_id  uuid FK ┐ PK
teacher_id   uuid FK → teachers    name, icon, description           event_id    varchar ┘
title, icon, difficulty            rarity         varchar(10)        status      'ativo' | 'encerrado'
min_level    integer               price, value, xp  integer         started_at  timestamptz
description  text                  cosmetic       jsonb (visual)     ended_at    timestamptz
reward_xp, reward_coins  integer   slots          integer (espaço)   phases_released_at  jsonb
                                                                       phases_closed_at    jsonb
reward_item  jsonb                 hidden, featured  boolean
questions    jsonb                 event_item_key varchar(80)
kind         'quiz' | 'entrega'    collection     varchar(20)
task         jsonb                 sold           integer
event_id, event_phase              created_at
created_at

friendships (amizades)             offers (Mercado)                  trades (trocas)
──────────────────────             ────────────────                  ───────────────
id          uuid PK                id         uuid PK                id            uuid PK
from_id     uuid FK → students     seller_id  uuid FK → students     from_id       uuid FK → students
to_id       uuid FK → students     buyer_id   uuid FK → students     to_id         uuid FK → students
status      'pendente' | 'aceito'  item       jsonb (guardado)       offered       jsonb (guardados)
created_at, accepted_at            price      integer                requested_ids jsonb
                                   created_at                        requested     jsonb (cópia)
                                                                     created_at
```

Detalhes que valem lembrar:

- **O id da missão continua sendo o "slug" do título** (`loops-com-for`), como no site, porque os alunos guardam as missões feitas (`completed_mission_ids`) por esse id. Dois títulos iguais viram `loops-com-for` e `loops-com-for-1`.
- `missions.teacher_id` é `on delete restrict`: a exclusão do professor passa as missões pro herdeiro antes (junto com os alunos).
- **Uma amizade só entre dois alunos**, não importa quem pediu: o índice único `friendships_pair_index` usa `least(from_id, to_id)` e `greatest(from_id, to_id)`, então (Ana, Bruno) e (Bruno, Ana) contam como o mesmo par. Esse índice foi criado com `sql` puro na migration, porque o construtor de índices do Kysely não aceita expressões.
- `offers`, `trades` e `friendships` têm `check` pra ninguém negociar consigo mesmo (`seller_id <> buyer_id`, `from_id <> to_id`), e `offers_price_check` (preço ≥ 0).
- `event_runs` tem chave primária composta (professor + evento): uma linha por professor e evento, e o `insert ... on conflict` reabre o evento em vez de duplicar.
- **Nomes das tabelas no código**: o `CamelCasePlugin` também traduz o nome da tabela. No banco é `shop_items` e `event_runs`; no código, `db.selectFrom('shopItems')` e `db.selectFrom('eventRuns')`.

### Seeds novos

| Seed | O que faz |
|---|---|
| `20260929130000_create-default-missions` | cria as missões de exemplo do site (`MISSIONS`, de `src/engine/missions.ts`), com o primeiro ADM como dono. Missões que já existem (mesmo id) são puladas. |
| `20260929140000_create-default-shop` | coloca os itens padrão da Loja (`DEFAULT_SHOP`, de `src/engine/shop.ts`), só se a Loja estiver vazia. |

Os dois podem rodar quantas vezes quiser (`npm run seed`), sem duplicar nada.

### As rotas da fase 3

Todas as rotas de aluno devolvem o **aluno atualizado** (`student`, no mesmo formato do
`/auth/me`), e o site guarda ele no cache na hora.

| Método | Rota | Quem pode | O que faz |
|---|---|---|---|
| POST | `/inventory/:itemId/use` | Aluno | usa o item (consumível dá XP; item de espaço aumenta o inventário; a Chave abre o Multiverso) |
| POST | `/inventory/:itemId/sell` | Aluno | vende o item pro sistema pelo valor dele |
| DELETE | `/inventory/:itemId` | Aluno | descarta o item |
| POST | `/inventory/:itemId/equip` | Aluno | equipa o visual no avatar |
| POST | `/inventory/:itemId/unequip` | Aluno | tira o visual do avatar |
| POST | `/inventory/pending/claim` | Aluno | guarda os itens que esperavam espaço (todos ou `{ itemId }`) |
| POST | `/inventory/multiverse/enter` | Aluno | entra na Sala do Multiverso (gasta o passe) |
| GET | `/missions` | Logados | aluno: as do professor dele; professor: as dele; ADM: todas (ou `?teacherId=`) |
| POST | `/missions` | Professores | cria a missão (o ADM pode escolher o `teacherId`) |
| PUT | `/missions/:id` | O dono ou o ADM | altera o que vier (`null` tira a tarefa/evento/fase) |
| DELETE | `/missions/:id` | O dono ou o ADM | exclui |
| POST | `/missions/:id/attempt` | Aluno | manda as respostas do quiz; a API corrige e dá a recompensa |
| POST | `/submissions/:id/review` | O professor da missão ou o ADM | corrige a entrega: aprova (dá a recompensa) ou pede pra refazer (fase 5; antes `/missions/:id/approve` e `/missions/:id/review`) |
| GET | `/shop` | Logados | ADM: todos os itens; os outros: só os que não estão escondidos |
| POST / PUT / DELETE | `/shop`, `/shop/:id` | ADM | cadastra, edita e tira itens da Loja |
| POST / DELETE | `/shop/collections/:collection` | ADM | coloca ou tira uma coleção inteira |
| POST | `/shop/:id/buy` | Aluno | compra o item |
| POST | `/gifts` | Professores | dá um item pra uma lista de alunos |
| GET / POST | `/friends` | Aluno | os vínculos do aluno / manda um pedido de amizade |
| POST | `/friends/:id/accept` | Aluno (quem recebeu) | aceita o pedido |
| DELETE | `/friends/:id` | Aluno (um dos dois) | recusa, cancela ou desfaz a amizade |
| GET / POST | `/offers` | Aluno | as ofertas recebidas e feitas / oferece um item pra um colega |
| POST | `/offers/:id/accept` | Aluno (o comprador) | compra |
| DELETE | `/offers/:id` | Aluno (um dos dois) | recusa ou cancela (o item volta pro vendedor) |
| GET / POST | `/trades` | Aluno | as propostas recebidas e feitas / propõe uma troca pra um amigo |
| POST | `/trades/:id/accept` | Aluno (quem recebeu) | aceita a troca |
| DELETE | `/trades/:id` | Aluno (um dos dois) | recusa ou cancela (os itens voltam pra quem propôs) |
| GET | `/events/runs` | Logados | a agenda (aluno: a do professor dele; professores: todas) |
| POST | `/events/runs/:eventId/start` | Professores | inicia ou reabre o evento pra turma |
| POST | `/events/runs/:eventId/phases/:phase/release` | Professores | libera (ou reabre) a fase, em qualquer ordem (evento em fases) |
| POST | `/events/runs/:eventId/phases/:phase/close` | Professores | encerra a fase (evento em fases) |
| POST | `/events/runs/:eventId/release` | Professores | libera a próxima fase ainda não liberada (rota antiga, mantida pro site anterior) |
| POST | `/events/runs/:eventId/end` | Professores | encerra o evento |
| POST | `/events/:eventId/phases/:phase/intro` | Aluno | marca a abertura da fase como vista |
| POST | `/events/:eventId/phases/:phase/finish` | Aluno | conclui a fase e ganha a recompensa |

---

#### Inventário

Exemplo, usando um item:

```
POST /inventory/i_1759080000000_1234/use
```

```json
{
  "student": { "...": "o aluno atualizado" },
  "effect": { "kind": "xp", "xpGained": 20, "leveledUp": true, "fromLevel": 1, "newLevel": 2 }
}
```

O `effect.kind` diz o que aconteceu: `"xp"` (consumível), `"espaco"` (com `slotsGained` e
`claimed`, os itens que esperavam e entraram) ou `"multiverso"`. Item que não está no
inventário: `404`. Item que não pode ser usado (ex.: um visual): `400`.

Na venda a resposta traz `coinsGained`; no `pending/claim`, `moved` (quantos entraram). Sem
espaço livre, o `pending/claim` responde `400`.

#### Missões

- O `POST /missions` confere se a missão faz sentido (`checkMissionContent`): tem título, ícone, dificuldade e item; o quiz tem perguntas, e cada pergunta tem a resposta certa entre as opções; a missão de entrega tem o enunciado da tarefa.
- No `PUT`, só o ADM troca o dono (`teacherId`).
- **A correção do quiz é feita aqui.** O aluno manda as respostas (`{ "answers": { "q1": "a", "q2": "c" } }`) e o servidor compara com o `correctOptionId` de cada pergunta. Com 60% ou mais numa missão ainda não concluída, ganha XP, moedas e o item. A resposta:

```json
{ "student": { ... }, "correctCount": 3, "total": 4, "passed": true, "rewarded": true, "leveledUp": false, "fromLevel": 2, "newLevel": 2, "itemWaiting": false }
```

- Refazer uma missão já concluída, ou tirar menos de 60%, responde `200` com `rewarded: false` (a tela mostra a nota, mas não paga de novo). Missão de nível acima do aluno: `400`. Missão de outro professor: `403`. Missão de entrega: `400` (quem aprova é o professor).
- A correção das missões de entrega mudou de lugar algumas vezes: na fase 3 era `POST /missions/:id/approve` (só aprovava); na fase 4 virou `POST /missions/:id/review` (aprovar ou refazer, com as mensagens); na fase 5, com as entregas no banco, ela foi pra `POST /submissions/:id/review`, que também grava a situação da entrega (veja [Fase 5](#fase-5-as-entregas-no-servidor)).

#### Loja

- `POST /shop/:id/buy` usa o `applyPurchase` do site: confere moedas, espaço no inventário e se o aluno já tem aquele visual. Resposta: `{ "student": {...}, "item": {...o item que entrou no inventário} }`. Item escondido não pode ser comprado (`400`).
- O ADM não consegue cadastrar dois itens com o mesmo visual (`400`).
- Ao editar um item, o `eventItemKey` (o elo com um item de evento) e a `collection` só mudam se vierem no corpo: editar o preço não desliga o item do evento.
- `POST /shop/collections/natal` coloca à venda os visuais da coleção que ainda não estão na Loja (`{ "added": 12 }`); o `DELETE` tira (`{ "removed": 12 }`).

#### Presentes

```json
POST /gifts
{
  "studentIds": ["...", "..."],
  "item": { "name": "Pena Dourada", "icon": "🪶", "description": "Um presente", "rarity": "raro", "value": 20, "xp": 5 }
}
```

- O professor só presenteia os alunos dele (`403`); o ADM, qualquer aluno.
- Item de espaço (`slots`), só o ADM (`403`).
- Cada aluno ganha o próprio exemplar (`grantItem`). Resposta: `{ "delivered": 2, "waiting": 0, "results": [{ "studentId": "...", "waiting": false }] }`. O `waiting` diz se o item foi pra "esperando espaço" (o site usa isso na mensagem de presente).

#### Amigos

- `POST /friends` com `{ "toId": "..." }`. Se o outro aluno já tinha mandado um pedido, os dois viram amigos na hora e a resposta tem `"accepted": true` (`200`); senão, `201` com o pedido pendente.
- Pedido repetido, pra si mesmo ou quando já são amigos: `400`.
- `DELETE /friends/:id` serve pra recusar, cancelar ou desfazer a amizade. Desfazendo, as trocas pendentes entre os dois são canceladas e os itens voltam (numa transação só).

#### Mercado (ofertas)

- `POST /offers` com `{ "buyerId": "...", "itemId": "...", "price": 40 }`. O item sai do inventário do vendedor (e do avatar, se estava equipado). Preço de 0 a 100.000.
- `POST /offers/:id/accept`: o comprador precisa ter as moedas e um espaço livre (`400` com a mensagem, ex.: `Moedas insuficientes — faltam 939.`). Deu certo: o comprador paga e recebe o item, o vendedor recebe as moedas.
- Oferta que já não existe (comprada ou cancelada): `404` `Essa oferta não existe mais.`

#### Trocas

- `POST /trades` com `{ "toId": "...", "offeredIds": ["..."], "requestedIds": ["..."] }`. Só entre **amigos** (`400` `Vocês precisam ser amigos pra trocar itens.`), de 1 a 6 itens de cada lado, no máximo 5 propostas esperando resposta.
- Enquanto a proposta é salva, a amizade fica travada (`for share`): se o amigo desfizer a amizade no mesmo instante, ele espera a proposta terminar e depois a cancela junto.
- `POST /trades/:id/accept`: o amigo precisa ainda ter todos os itens pedidos, e os itens que recebe precisam caber no inventário dele. Quem propôs recebe os itens pedidos (sem espaço, eles esperam espaço).

#### Eventos

A **agenda** diz, pra cada professor, quais eventos estão acontecendo pra turma dele:

```json
GET /events/runs
{
  "runs": {
    "<id do professor>": {
      "natal": { "status": "ativo", "startedAt": "...", "phasesReleasedAt": ["...", null, "..."], "phasesClosedAt": ["..."] },
      "halloween": { "status": "encerrado", "startedAt": "...", "endedAt": "...", "phasesReleasedAt": ["..."], "phasesClosedAt": [] }
    }
  }
}
```

- `start`, `release`, `close` e `end` aceitam `{ "teacherId": "..." }`: o ADM mexe na agenda de qualquer professor; o professor só na dele (`403`). A resposta traz a agenda desse professor.
- `start` num evento encerrado **reabre** mantendo as fases como estavam. `end` num evento nunca iniciado: `404`.
- **Fases à vontade** (eventos em fases): o professor (ou o ADM) libera, encerra e reabre cada fase quando quiser, em qualquer ordem. `phasesReleasedAt[i]` = quando a Fase i+1 foi liberada (`null` = não liberada) e `phasesClosedAt[i]` = quando foi encerrada (`null` = aberta). Reabrir apaga a data de encerramento e mantém a da primeira liberação. Com o evento parado, fase que não existe, evento de uma fase só, liberar fase já liberada ou encerrar fase que não está liberada: `400`.
- Pro aluno (`phaseStatuses`, `phaseLock` e `currentPhase` em `src/engine/specialEvents.ts`): ele joga as fases liberadas **em ordem** (só entra numa fase depois de concluir as liberadas antes dela); numa fase encerrada não entra mais (`400`, "Essa fase foi encerrada pelo seu professor."), mas o progresso fica guardado e quem já concluiu a fase continua podendo rever. Fase nunca liberada não trava as seguintes.
- Evento que não existe: `400` (o `eventId` é conferido pelo Zod contra a lista de eventos do site).

O **progresso** do aluno:

- `intro`: marca a abertura como vista. Precisa do evento acontecendo e da fase liberada pro aluno (liberada pelo professor e com a fase anterior concluída). Se a abertura já tinha sido vista, só responde `200` (rever a abertura não muda nada).
- `finish`: conclui a fase. A API confere tudo de novo: o evento acontecendo, a fase liberada, a fase ainda não concluída e **todas as missões da fase concluídas** (as missões são buscadas no banco, do professor do aluno). A recompensa usa o item do evento com as alterações que o ADM fez na Loja (`resolveEventItem`, pela `event_item_key`). Resposta:

```json
{ "student": { ... }, "leveledUp": true, "fromLevel": 3, "newLevel": 4, "itemWaiting": false, "item": { ... }, "xp": 300, "coins": 150 }
```

### O site na fase 3

```
src/engine/
├── gameApi.ts     → ações do jogo: inventário, quiz, compra, Mercado, trocas, presentes, eventos, aprovar entrega
├── shopApi.ts     → cadastro da Loja pelo ADM (itens e coleções)
├── socialApi.ts   → pedidos de amizade e amizades
├── eventsApi.ts   → agenda dos eventos (iniciar, liberar fase, encerrar)
├── accounts.ts    → a sincronização agora também busca missões, Loja, amigos, ofertas, trocas e a agenda
├── market.ts      → regras puras das ofertas + cache "cg-offers"
├── trades.ts      → regras puras das trocas + cache "cg-trades"
├── friends.ts     → cache "cg-friends" (a conversa com balões continua local)
└── eventSchedule.ts → cache "cg-event-runs"
```

Toda função do `gameApi.ts` segue o mesmo padrão: chama a API, guarda o aluno que voltou no
cache e avisa as telas (`emitChange`). Ela devolve `{ ok: true, ... }` ou
`{ ok: false, error }` com a mensagem da API, e a tela mostra essa mensagem:

```ts
const result = await game.sellItem(item.id)
if (!result.ok) return flash(result.error, "erro")
flash(`💰 Você vendeu ${item.name} por ${result.coinsGained} moedas.`)
```

O que mudou nos hooks do `store.ts`:

| Hook | O que mudou |
|---|---|
| `useStudents` | o `patchStudent` saiu: progresso só muda pelas ações do jogo |
| `useMissions` | criar, editar e excluir falam com a API |
| `useMissionAttempt` | manda as respostas do quiz; a API corrige |
| `useShop` | cadastro (ADM) e compra pela API |
| `useGameActions` | **novo**: as ações do inventário, do quiz e dos eventos |
| `useGifts` | o `give` espera a API e devolve `{ ok, delivered, waiting }` |
| `useFriends` | pedir, aceitar, recusar e desfazer amizade pela API |
| `useOffers` | oferecer, comprar, recusar e cancelar pela API |
| `useTrades` | propor, aceitar, recusar e cancelar pela API |
| `useEventRuns` | iniciar, liberar fase e encerrar pela API |
| `useSubmissions` | corrigir uma entrega chama a API (que dá a recompensa e, desde a fase 4, manda a mensagem) antes de marcar como corrigida |

As telas travam o botão enquanto a API responde (uma ação por vez, pra dois cliques rápidos
não mandarem o mesmo pedido duas vezes) e mostram o erro, se houver.

### Testando a fase 3

Com o Insomnia (ou o `curl`), logado como aluno:

1. `GET /auth/me` pra ver o inventário (o aluno ganha o Fragmento Inicial no cadastro).
2. `POST /inventory/<id do item>/use` e veja o XP subir.
3. `GET /missions` e `POST /missions/<id>/attempt` com as respostas.
4. `GET /shop` e `POST /shop/<id>/buy`.

Pra testar trocas, cadastre dois alunos, mande o pedido de amizade com um (`POST /friends`) e
aceite com o outro (`POST /friends/<id>/accept`).

## Fase 4: as mensagens no servidor

Na fase 4, tudo que é mensagem passou para a API:

- a **caixa do aluno** (o sininho 🔔 e a página Mensagens): avisos e mensagens do professor, comunicados e as mensagens automáticas da plataforma;
- os **comunicados** do professor pra turma toda ou pra uma casa;
- a **conversa com balões** entre amigos;
- as **mensagens do aluno pro professor** (e as respostas).

Antes, cada uma dessas coisas ficava no navegador onde foi criada. Um aviso do professor só
aparecia pro aluno se os dois usassem o mesmo computador. Agora o aluno vê tudo em qualquer
lugar.

### A API cria as mensagens automáticas

A grande mudança: as mensagens automáticas (🏆 missão concluída, 🛒 compra, 💰 venda,
🔄 troca, 🎁 presente, 🤝 amizade, 📝 entrega) são criadas pela **própria API**, dentro da
mesma transação da ação. Se a compra der errado, a mensagem "compra realizada" também não
fica. E o vendedor recebe o 💰 Venda mesmo estando em outro computador.

Os textos das mensagens continuam em `src/engine/messages.ts` (`missionRewardMessage`,
`saleMessage`, `tradeProposalMessage`...), e a API importa esse arquivo, igual às regras do
jogo na fase 3. Uma regra só pros textos também.

O `src/services/messages.ts` tem a função que grava:

```ts
await sendMessages(trx, [{
    studentId: buyer.id,
    kind: 'compra',
    body: purchaseMessage({ item, sellerName: seller.name, price: offer.price }),
}])
```

Ela recebe o `trx` de quem chamou (pra ficar na mesma transação) ou o próprio `db`. As rotas
do jogo chamam no `alsoSave` do `updateProgress` ou dentro das próprias transações:

| Ação | Mensagem | Pra quem |
|---|---|---|
| Quiz com recompensa (`POST /missions/:id/attempt`) | 🏆 Missão concluída (+ aviso de espaço) | o aluno |
| Entrega corrigida (`POST /submissions/:id/review`, desde a fase 5) | 🏆 com "Entrega aprovada por..." ou 📝 "refazer" com o comentário | o aluno |
| Compra na Loja | 🛒 Compra na Loja | o aluno |
| Oferta aceita | 🛒 Compra / 💰 Venda | comprador / vendedor |
| Proposta de troca | 🔄 proposta | o amigo |
| Troca aceita | 🔄 troca feita | quem propôs |
| Troca recusada (pelo amigo) | 🔄 não aceitou, os itens voltaram | quem propôs |
| Presente | 🎁 Presente, assinado pelo professor | cada aluno |
| Pedido de amizade / pedido aceito | 🤝 Amizade | o outro aluno |
| Fase de evento concluída | 🏆 recompensa da fase (ou do evento) | o aluno |
| Resposta do professor | 💬 Resposta à sua mensagem | o aluno |

Cancelar a própria proposta de troca não manda mensagem (só quem recusa avisa).

### As tabelas novas

```
messages (caixa do aluno)          chat_messages (conversa)          teacher_messages (pro professor)
─────────────────────────          ────────────────────────          ────────────────────────────────
id           uuid PK               id         uuid PK                id           uuid PK
student_id   uuid FK → students    from_id    uuid FK → students     student_id   uuid FK → students
sender_id    uuid FK → teachers    to_id      uuid FK → students     teacher_id   uuid FK → teachers
             (nulo = automática)   phrase_id  varchar(40)            topic        varchar(20)
kind         varchar(10)           sent_at    timestamptz            mission_id   varchar(120)
body         text                  read_at    timestamptz            body         text
audience     jsonb (comunicado)                                      sent_at, read_at
broadcast_id uuid  (comunicado)                                      reply, replied_at, replier_name
created_at, read_at
```

- **`messages.sender_id` nulo** = mensagem automática da plataforma. Se o professor for excluído, as mensagens que ele mandou continuam com o aluno (`on delete set null`).
- **Comunicado**: uma linha por aluno, todas com o mesmo `broadcast_id`. Assim cada aluno tem o próprio `read_at`, e o professor vê "lida por 12/30".
- `messages_body_check` aceita até 3000 caracteres (as mensagens automáticas mais longas juntam a recompensa, o comentário do professor e o aviso de espaço). O que o professor escreve continua limitado a 1000 (`MESSAGE_MAX_LENGTH`), conferido pelo Zod.
- **`chat_messages` só guarda o id do balão** (`phrase_id`), nunca texto. O índice `chat_messages_pair_index` usa `least/greatest`, igual às amizades, pra achar rápido a conversa de um par.
- **`teacher_messages.teacher_id`** é `on delete restrict`: a exclusão do professor passa essas mensagens pro herdeiro (junto com os alunos e as missões). O `mission_id` não é chave estrangeira: a missão pode ser excluída e a mensagem continua.
- Excluir um aluno apaga a caixa dele, as conversas e as mensagens que ele mandou pro professor (`on delete cascade`).

### As rotas da fase 4

| Método | Rota | Quem pode | O que faz |
|---|---|---|---|
| GET | `/messages` | Aluno / professor | aluno: a própria caixa; professor: `?studentId=` (a caixa de um aluno dele, pra ficha) |
| POST | `/messages` | O professor do aluno ou o ADM | aviso ou mensagem pra um aluno |
| POST | `/messages/broadcast` | Professores | comunicado pros alunos dele: a turma toda ou uma casa |
| GET | `/messages/broadcasts` | Professores | os comunicados que ele mandou, com quantos leram |
| POST | `/messages/:id/read` | Aluno | marca uma mensagem como lida |
| POST | `/messages/read-all` | Aluno | marca todas como lidas |
| GET | `/chats` | Aluno | as conversas com todos os amigos |
| POST | `/chats` | Aluno | manda um balão pra um amigo |
| POST | `/chats/:friendId/read` | Aluno | o que o amigo mandou fica lido |
| GET | `/teacher-messages` | Aluno / professor | aluno: as que ele mandou; professor: as que recebeu |
| POST | `/teacher-messages` | Aluno | escreve pro professor dele |
| POST | `/teacher-messages/:id/read` | O professor que recebeu | marca como lida |
| POST | `/teacher-messages/:id/reply` | O professor que recebeu | responde (a resposta também chega na caixa do aluno) |

---

#### Caixa e mensagens do professor

- A caixa traz as 300 mensagens mais recentes, da mais nova pra mais antiga.
- O professor só escreve `aviso` ou `mensagem` (os outros tipos são automáticos): `{ "studentId": "...", "kind": "aviso", "body": "Prova na sexta!" }`.
- Marcar de novo uma mensagem já lida não muda a data de leitura.

#### Comunicados

```json
POST /messages/broadcast
{ "audience": { "type": "casa", "houseId": "ignis" }, "kind": "mensagem", "body": "Parabéns, Ignis!" }
```

- `audience` é `{ "type": "turma" }` ou `{ "type": "casa", "houseId": "..." }`. O Zod confere com um `discriminatedUnion`: se o `type` é `casa`, o `houseId` é obrigatório.
- **Quem recebe é a API que decide**: os alunos do professor logado (e da casa, se for o caso). O site não manda a lista de alunos, então ninguém consegue mandar um comunicado pros alunos de outro professor.
- Resposta: `{ "broadcastId": "...", "sent": 12 }`. Grupo sem alunos: `400`.
- `GET /messages/broadcasts` agrupa as cópias pelo `broadcast_id` no próprio SQL (`group by`), com `count(*)` (total) e `count(read_at)` (quantos leram: o `count` de uma coluna só conta o que não é nulo). O `count` do PostgreSQL volta como texto (é um `bigint`), por isso a rota converte com `Number()`.

#### Conversa com balões

- `POST /chats` com `{ "toId": "...", "phraseId": "oi" }`. A API confere o balão no catálogo do site (`getPhrase`, em `src/engine/friends.ts`): balão que não existe é recusado (`400`), então nenhum texto livre entra, nem mexendo na requisição.
- Só entre amigos (`400` `Vocês precisam ser amigos pra conversar.`).
- Um balão por segundo pro mesmo amigo (`400` `Calma! Espere um pouquinho...`), além da espera de 1,5 s que a própria tela já faz.
- Cada conversa guarda os últimos 200 balões: ao gravar um novo, a rota apaga os mais antigos, na mesma transação.
- Desfazer a amizade apaga a conversa dos dois (na transação do `DELETE /friends/:id`).

#### Mensagens pro professor

- `POST /teacher-messages` com `{ "topic": "duvida-missao", "missionId": "loops-com-for", "body": "Não entendi a pergunta 2" }`. Vai pro professor atual do aluno.
- No máximo 5 mensagens esperando o professor ler (`400`).
- `POST /teacher-messages/:id/reply` com `{ "reply": "..." }`: grava a resposta (e marca como lida, se ainda não estava) e manda a mensagem 💬 pra caixa do aluno, na mesma transação. A resposta é assinada como "Professor Fulano" (ou "ADM Fulano").

### O site na fase 4

```
src/engine/
├── messagesApi.ts    → caixa, mensagens e comunicados do professor, mensagens pro professor e a atualização da caixa
├── socialApi.ts      → + mandar balão e marcar a conversa como lida
├── messages.ts       → os textos das mensagens (a API usa) + cache "cg-messages"
├── friends.ts        → catálogo dos balões (a API usa) + cache "cg-chats"
└── teacherMessages.ts → assuntos e limites (a API usa) + cache "cg-teacher-messages"
```

**Como a mensagem nova aparece sem recarregar a página?** A API não "empurra" nada pro site
(isso exigiria WebSocket, que o plano gratuito do Render não mantém bem). Em vez disso, o site
pergunta de tempos em tempos, com o hook `useInboxPolling`:

| Onde | A cada |
|---|---|
| Sininho do aluno (cabeçalho da Academia) | 20 s |
| Conversa com balões aberta | 4 s |
| Painel do professor (mensagens dos alunos) | 20 s |

Só pergunta com a aba visível (`document.visibilityState`), e usa o `refreshInbox()`, que é
bem mais leve que a sincronização completa: só a caixa, as conversas e as mensagens pro
professor. Depois de cada ação do jogo (comprar, trocar...), o `gameApi.ts` também pede a
caixa de novo (`scheduleInboxRefresh`), pra mensagem 🛒 aparecer na hora.

Num computador compartilhado, quando um aluno entra, o cache de mensagens fica só com as dele
(as de quem usou antes são apagadas).

O que mudou nos hooks:

| Hook | O que mudou |
|---|---|
| `useMessages` | a caixa vem da API; o professor, ao abrir a ficha de um aluno, busca a caixa dele; `send` devolve o erro (ou null) |
| `useBroadcasts` | não recebe mais o professor: a API sabe quem está logado; o envio não manda a lista de alunos |
| `useFriends` | `sendPhrase` e `markRead` pela API |
| `useTeacherMessages` | `send`, `markRead` e `reply` pela API, devolvendo o erro (ou null) |
| `useInboxPolling` | **novo**: pergunta à API se chegou mensagem nova |
| `useShop`, `useOffers`, `useTrades`, `useGifts`, `useFriends`, `useMissionAttempt` | não criam mais mensagens: a API cria |

### Testando a fase 4

1. Logado como professor: `POST /messages` com um aviso pra um aluno.
2. Logado como o aluno: `GET /messages` (o aviso está lá) e `POST /messages/<id>/read`.
3. Faça uma compra na Loja (`POST /shop/<id>/buy`) e veja a mensagem 🛒 no `GET /messages`.
4. Com dois alunos amigos: `POST /chats` com `{ "toId": "...", "phraseId": "oi" }` e `GET /chats` com o outro.

## Fase 5: as entregas no servidor

Nas missões de entrega, o aluno manda uma resposta escrita e/ou arquivos (PDF, Word, Scratch,
App Inventor, Roblox Studio; até 5 arquivos de 25 MB) e o professor corrige. Até a fase 4, a
entrega ficava no localStorage e os arquivos no IndexedDB do navegador do aluno: o professor
só conseguia ver e baixar se usasse **o mesmo computador**. Na fase 5, a entrega fica no
banco e os arquivos num storage de verdade, e o professor corrige de qualquer lugar.

### Por que o arquivo não passa pela API

O site na Vercel repassa as chamadas `/api/*` pra API (o
[rewrite](#ligação-com-o-site-nextjs)), mas a Vercel recusa qualquer corpo acima de
**4,5 MB** (erro `413 FUNCTION_PAYLOAD_TOO_LARGE`), e uma entrega pode ter 25 MB. Além disso,
o disco do Render gratuito é apagado a cada deploy, então os arquivos não poderiam ficar nele.

A solução é o **envio direto**: a API não recebe o arquivo, ela só **autoriza** o envio. O
navegador manda o arquivo direto pro Supabase Storage, com um endereço assinado que a API
gerou (vale pra um arquivo só). O download também: a API confere quem está pedindo e
redireciona pra um link que vale 1 minuto.

```
navegador                      API (Render)                   Supabase Storage
    │  1. POST /submissions          │                                  │
    │  (texto + nome e tamanho       │  confere com as regras do site   │
    │   de cada arquivo)  ─────────► │  grava a entrega ("enviando")    │
    │                                │  pede um endereço assinado ────► │
    │  ◄─── endereços de envio ───── │                                  │
    │                                                                   │
    │  2. PUT de cada arquivo, direto ────────────────────────────────► │
    │                                                                   │
    │  3. POST /submissions/:id/confirm                                 │
    │  ────────────────────────────► │  confere se chegaram (HEAD) ───► │
    │  ◄──── entrega "pendente" ──── │  a entrega vai pro professor     │
```

### Dois jeitos de guardar: local e Supabase

O `src/services/storage.ts` tem as mesmas funções pros dois jeitos, escolhidos pelo
`STORAGE_DRIVER` do `.env`:

| Função | `local` (desenvolvimento) | `supabase` (produção) |
|---|---|---|
| `createUploadTarget` | devolve `/submissions/uploads/:fileId` (a própria API recebe) | pede ao Supabase um endereço de envio assinado |
| `saveLocalFile` | grava o arquivo na pasta `uploads/` | (não é usada) |
| `storedSize` | o tamanho do arquivo no disco | `HEAD` no arquivo do Supabase |
| `createDownload` | manda o arquivo (stream) | redireciona pra um link assinado de 1 minuto |
| `removeFiles` | apaga do disco | apaga do Supabase |

Assim, em desenvolvimento tudo funciona sem conta no Supabase, e o site não precisa saber qual
é qual: a API devolve, pra cada arquivo, um `target` que diz pra onde mandar:

```json
{ "kind": "api", "path": "/submissions/uploads/5b0c..." }
{ "kind": "url", "url": "https://xxxx.supabase.co/storage/v1/object/upload/sign/entregas/submissions/...?token=...", "headers": { "x-upsert": "false", "apikey": "..." } }
```

As chamadas ao Supabase usam a API REST do Storage direto com `fetch` (são só 4 endereços),
sem instalar a biblioteca do Supabase. A chave **secreta** (`SUPABASE_SERVICE_ROLE_KEY`) só
sai da API pro Supabase; o navegador recebe apenas o endereço assinado e a chave pública.

No modo local, o arquivo chega cru (`Content-Type: application/octet-stream`). Um leitor
desse tipo é registrado **só dentro** do plugin das entregas (`addContentTypeParser` vale só
no plugin onde foi registrado), entrega o corpo como stream (o arquivo nunca fica inteiro na
memória) e tem limite de 25 MB.

### As tabelas novas

```
submissions (entregas)                    submission_files (arquivos)
──────────────────────                    ───────────────────────────
id            uuid PK                ◄──┐ id             uuid PK
mission_id    varchar FK → missions     └ submission_id  uuid FK → submissions
student_id    uuid FK → students          name           varchar(200)
teacher_id    uuid FK → teachers          size           integer (bytes)
text          text (até 5000)             kind           varchar (pdf, doc, scratch...)
status        enviando | pendente |       storage_key    submissions/<entrega>/<arquivo>
              aprovada | refazer          created_at
attempt       integer (1ª, 2ª...)
submitted_at, reviewed_at, reviewer_name, feedback
```

- **`enviando`**: o aluno começou o envio e os arquivos ainda estão subindo. O professor não vê. Se o envio não terminar (a internet caiu, a aba fechou), a próxima tentativa apaga essa entrega e os arquivos que chegaram.
- O arquivo em si só existe no storage; no banco fica o registro (nome, tamanho, tipo e a `storage_key`).
- `mission_id` e `student_id` são `on delete cascade`: excluir a missão ou o aluno apaga as entregas. Os **arquivos** no storage não somem sozinhos com o banco, então as rotas de exclusão pegam as chaves antes (`storageKeysOf`) e apagam do storage logo depois.
- `teacher_id` é `on delete restrict`: a exclusão do professor passa as entregas pro herdeiro (junto com os alunos, as missões e as mensagens).

### As rotas da fase 5

| Método | Rota | Quem pode | O que faz |
|---|---|---|---|
| GET | `/submissions` | Logados | aluno: as dele; professor: as das missões dele; ADM: todas (ou `?teacherId=`) |
| POST | `/submissions` | Aluno | passo 1: confere e cria a entrega; devolve pra onde mandar cada arquivo |
| PUT | `/submissions/uploads/:fileId` | Aluno (dono) | passo 2, só com `STORAGE_DRIVER=local`: recebe o arquivo |
| POST | `/submissions/:id/confirm` | Aluno (dono) | passo 3: confere os arquivos e manda a entrega pro professor |
| GET | `/submissions/files/:fileId` | O aluno, o professor da missão ou o ADM | baixa o arquivo |
| POST | `/submissions/:id/review` | O professor da missão ou o ADM | corrige: aprova (com a recompensa) ou pede pra refazer |

---

#### Enviando

```json
POST /submissions
{
  "missionId": "projeto-de-loops",
  "text": "Meu projeto usa um laço for pra desenhar a estrela.",
  "files": [{ "name": "estrela.sb3", "size": 182004 }]
}
```

- A API confere com a **mesma regra do site** (`checkSubmission`, em `src/engine/submissions.ts`): a missão é de entrega e do professor do aluno, ainda não foi concluída, não tem outra entrega esperando correção, veio o que a missão pede (texto e/ou arquivos), cada arquivo é de um tipo aceito na missão (pela extensão), até 5 arquivos de 25 MB, texto até 5000 caracteres.
- Sem arquivos, a entrega já nasce `pendente` (vai direto pro professor).
- Resposta `201`: `{ "submission": {...}, "uploads": [{ "fileId": "...", "target": {...} }] }`.

No passo 3 (`/confirm`), a API confere cada arquivo no storage: se não chegou, `400`
`O arquivo "x" não chegou. Envie a entrega de novo.`; se chegou com tamanho diferente do
informado, `400` `...chegou incompleto...`. Tudo certo: a entrega vira `pendente`.

#### Baixando

`GET /submissions/files/:fileId` confere quem está pedindo (o aluno que enviou, o professor da
missão ou o ADM; os outros recebem `403`) e:

- no modo local, manda o arquivo com `Content-Disposition: attachment; filename*=UTF-8''nome.sb3` (o `filename*` aceita acentos no nome);
- no Supabase, responde `302` pra um link assinado de 1 minuto, com `&download=nome` (o navegador salva com o nome original).

No site, o botão "⬇ Baixar" só abre `/api/submissions/files/<id>`: o navegador segue o
redirecionamento sozinho, e o cookie de login vai junto (é o mesmo domínio).

#### Corrigindo

```json
POST /submissions/<id>/review
{ "decision": "refazer", "feedback": "Faltou usar o laço for." }
```

- `aprovada`: o aluno ganha a recompensa (se ainda não tinha concluído a missão) e a mensagem 🏆 com o comentário.
- `refazer`: o comentário é obrigatório; o aluno recebe a mensagem 📝 Entrega e pode enviar de novo (a 2ª tentativa, a 3ª...).
- A recompensa, a situação da entrega e a mensagem são gravadas **na mesma transação**. A atualização da entrega tem `where status = 'pendente'`: se dois professores clicarem ao mesmo tempo, o segundo encontra a entrega já corrigida e tudo dele é desfeito (`400` `Essa entrega já foi corrigida.`), então o aluno nunca ganha a recompensa duas vezes.
- A resposta é assinada como "Professor Fulano" (ou "ADM Fulano").

### O site na fase 5

```
src/engine/
├── submissionsApi.ts  → os 3 passos do envio, a correção e o download
└── submissions.ts     → limites e regras (a API usa as mesmas) + cache "cg-submissions"
```

O `fileStore.ts` (o IndexedDB) saiu. O `useSubmissions` agora:

| Função | Antes | Agora |
|---|---|---|
| `submit({ mission, text, files })` | guardava no localStorage e no IndexedDB | os 3 passos pela API |
| `review(id, decisão, comentário)` | recebia também a missão e o nome do professor | só o id: a API sabe a missão e assina a correção |

As entregas entram na sincronização (`refreshFromApi`) e na atualização periódica
(`useInboxPolling`): o professor vê uma entrega nova em até 20 s, e o aluno vê a correção.

### Testando a fase 5

Em desenvolvimento (`STORAGE_DRIVER=local`), com o Insomnia ou o PowerShell:

1. Logado como aluno: `POST /submissions` com uma missão de entrega do professor dele e um arquivo (`files: [{ name: "a.pdf", size: 1234 }]`).
2. `PUT /submissions/uploads/<fileId>` com o arquivo no corpo (`Content-Type: application/octet-stream`).
3. `POST /submissions/<id>/confirm`.
4. Logado como o professor: `GET /submissions`, `GET /submissions/files/<fileId>` (baixa) e `POST /submissions/<id>/review`.

O arquivo aparece em `api/uploads/submissions/<id da entrega>/<id do arquivo>`.

## Status online dos alunos

O professor, o ADM e os próprios alunos veem quem está na plataforma agora: uma bolinha
**verde** (online) ou **vermelha** (offline) ao lado do nome nos rankings (geral, da casa e dos
eventos), na lista de amigos e na lista de alunos do painel. Clicando no aluno, o perfil mostra o
selo **Online** ou **Offline**. No painel, a lista de alunos mostra quantos estão online e tem o
botão "Mostrar só os online".

### Como funciona: o sinal de vida

Não existe um jeito de o servidor "ver" quem está com o site aberto. Então o site avisa:

1. Enquanto o aluno está logado, o navegador manda um **sinal de vida** (`POST /presence`) a
   cada 30 segundos, em qualquer tela (o `PresenceHeartbeat`, montado no layout raiz do site).
2. A API grava o horário desse sinal na tabela `student_presence`.
3. **Online é quem deu sinal nos últimos 90 segundos** (`ONLINE_WINDOW_SECONDS`, em
   `src/routes/presence.ts`). A folga existe porque os navegadores atrasam os timers das abas em
   segundo plano (até uma vez por minuto): o aluno que só trocou de aba continua online.
4. Fechou o site? Sem sinal, ele aparece offline em até 90 segundos. Saiu da conta? O
   `POST /auth/logout` apaga o sinal, e ele fica offline na hora.

O próprio sinal de vida já devolve a lista de quem está online, então o aluno faz uma chamada
só a cada 30 segundos. O professor e o ADM não mandam sinal (não são alunos): eles consultam
com `GET /presence`, também a cada 30 segundos, e só com a aba visível.

### A tabela student_presence (e por que ela é separada)

```
student_presence
├── student_id   uuid, chave primária → students.id (on delete cascade)
└── last_seen_at timestamptz (o horário do último sinal)
```

O sinal de vida é escrito o tempo todo. Se ele ficasse numa coluna da tabela `students`, cada
sinal mexeria na linha do aluno, a mesma que guarda o progresso. Numa tabela própria, o status
online **nunca encosta nos dados dos alunos** (desde outubro de 2026 a plataforma tem alunos de
verdade, e a regra é não arriscar esses dados). A migration só cria a tabela nova: nada do que
já existe muda. Excluir um aluno apaga a linha dele junto (`on delete cascade`).

Pra não gravar à toa (duas abas abertas mandam dois sinais), o upsert só atualiza se o último
sinal tem mais de 15 segundos:

```ts
await db
    .insertInto('studentPresence')
    .values({ studentId })
    .onConflict((oc) => oc
        .column('studentId')
        .doUpdateSet({ lastSeenAt: sql`now()` })
        .where('studentPresence.lastSeenAt', '<', sql<Date>`now() - interval '15 seconds'`))
    .execute()
```

### Quem pode ver

Todo mundo logado, como a comunidade (`GET /students/community`): o professor e o ADM
acompanham a turma, e os alunos veem os amigos e os colegas nos rankings. A resposta é só a
lista de ids de quem está online:

```json
{ "online": ["5b0c...", "9e41..."] }
```

### E o plano gratuito do Neon?

O sinal de vida só acontece enquanto alguém está com o site aberto, e nesses momentos o banco já
fica acordado (o sininho consulta a API a cada 20 segundos). Com todo mundo fora do site,
ninguém manda sinal e o Neon pode dormir normalmente.

## Dashboard do aluno

Na ficha do aluno, o professor (dos alunos dele) e o ADM (de todos) têm o botão
**📊 Dashboard**. Ele abre a tela `/painel/aluno/[id]` do site, com:

- **indicadores**: missões concluídas, tempo online, média de acertos e último acesso;
- **cabeçalho**: status online, nível, XP, moedas, último acesso e último login;
- **gráficos**: tempo online por dia (30 dias), missões concluídas por semana (12 semanas),
  progresso no catálogo (anel), acertos x erros e média de acertos por missão;
- **tabelas**: as últimas tentativas de quiz e a situação das entregas.

A tela se atualiza sozinha a cada minuto (com a aba visível) e tem o botão "Atualizar".

### De onde vem cada número

| Número | Fonte | Desde quando |
|---|---|---|
| Missões concluídas | `students.completed_mission_ids` | Sempre |
| Missões por semana | As mensagens 🏆 "Missão concluída" que a API manda a cada missão concluída (quiz ou entrega aprovada) | Sempre |
| Último login | A sessão mais recente do aluno (`sessions.created_at`) | Sempre |
| Último acesso | `student_presence.last_seen_at` (o último sinal de vida) | Desde o status online |
| Tempo online | `student_activity_days` | Desde o dashboard |
| Acertos e erros | `quiz_attempts` | Desde o dashboard |
| Entregas | `submissions`, por situação | Sempre |

A tela avisa ("Registrado desde ...") quando um número só conta a partir de quando passou a
ser gravado, pra ninguém achar que o aluno nunca entrou antes.

### As duas tabelas novas

```
student_activity_days                    quiz_attempts
├── student_id     uuid → students.id    ├── id          uuid
├── day            date (Brasília)       ├── student_id  uuid → students.id
└── online_seconds integer               ├── mission_id  varchar → missions.id
    (chave: student_id + day)            ├── correct     integer (acertos)
                                         ├── total       integer (perguntas)
                                         ├── passed      boolean (60% ou mais)
                                         └── created_at  timestamptz
```

As duas são **só de registro**: nenhuma muda o progresso, os itens ou as missões do aluno. A
migration só cria as tabelas. Excluir o aluno apaga as linhas dele (`on delete cascade`); excluir
uma missão apaga as tentativas dela.

**Tempo online.** O sinal de vida (`POST /presence`, a cada 30 segundos) soma no dia de hoje o
tempo desde o sinal anterior, **se o aluno ainda estava online** (até 90 segundos). Quem saiu da
conta ou ficou um tempo fora volta sem somar a ausência. Sinal repetido em menos de 15 segundos
não soma nada (duas abas abertas não contam em dobro). O tempo é calculado pelo relógio do banco,
não pelo do navegador do aluno.

**Acertos.** A rota `POST /missions/:id/attempt` grava cada tentativa, aprovada ou não, na mesma
transação da correção (no `alsoSave` do `updateProgress`). A média de acertos é o total de
perguntas certas dividido pelo total de perguntas respondidas.

### A rota GET /students/:id/dashboard

Só o professor do aluno ou o ADM (`canManageStudent`); o próprio aluno recebe `403`. As consultas
ficam em `src/services/dashboard.ts` e rodam em paralelo (`Promise.all`). Resposta (resumida):

```json
{
  "student": { "id": "...", "name": "Ana", "level": 3, "...": "..." },
  "online": {
    "now": true, "lastSeenAt": "...", "lastLoginAt": "...",
    "totalSeconds": 15600, "activeDays": 6, "since": "2026-10-06",
    "days": [{ "day": "2026-10-06", "seconds": 2400 }]
  },
  "missions": {
    "completedTotal": 12, "available": 28, "completedAvailable": 11,
    "completedQuiz": 10, "completedTasks": 1,
    "weekly": [{ "week": "2026-09-29", "count": 4 }]
  },
  "quiz": {
    "attempts": 15, "passed": 12, "correct": 118, "total": 150, "since": "...",
    "byMission": [{ "missionId": "ods", "title": "ODS", "icon": "🌍", "attempts": 2, "best": 0.9, "average": 0.8 }],
    "recent": [{ "missionId": "ods", "title": "ODS", "correct": 9, "total": 10, "passed": true, "createdAt": "..." }]
  },
  "submissions": { "aprovada": 1, "pendente": 1 }
}
```

Um detalhe do SQL: `hoje - 30` precisa ser `hoje - 30::int`. Sem o cast, o Postgres lê o 30 como
uma data (data - data dá um número) e a comparação com `day` falha.

### Os gráficos (src/components/dashboard/charts.tsx)

Desenhados em SVG, sem biblioteca, seguindo o guia de visualização de dados: cores por papel em
variáveis CSS (`--viz-*`), com valores próprios pro tema escuro e pro claro (a paleta passou no
validador de contraste e daltonismo nos dois temas); barras finas com a ponta arredondada e 2px
de espaço; tooltip em cada barra (mouse e teclado); acertos e erros sempre com ✓/✗ e o nome, nunca
só a cor; e "Ver dados em tabela" nos gráficos de barras.

## Build da aplicação

Como no SPE, o build usa o tsup para converter o TypeScript em JavaScript:

```bash
npm run build
```

O script é `tsup src/server.ts --out-dir build`: o tsup parte do `server.ts`, segue todos os
imports e gera **um único arquivo**, `build/server.js`. As dependências do `node_modules` não
entram no arquivo: continuam sendo carregadas do `node_modules` normalmente.

Pra testar o build:

```bash
npm start
```

## Deploy gratuito: Render + Neon

Enquanto a plataforma não tiver custo, a combinação gratuita é esta:

| Parte | Serviço | Plano |
|---|---|---|
| Site | Vercel | Hobby (o de hoje) |
| API | Render — Web Service | Free |
| Banco | Neon — PostgreSQL | Free (0,5 GB, não expira) |
| Arquivos das entregas | Supabase — Storage | Free (1 GB) |

**Não use o PostgreSQL gratuito do Render**: ele expira 30 dias depois de criado e é apagado
duas semanas depois disso. O Web Service gratuito do Render, por outro lado, não expira.

#### Os limites do plano gratuito (conferidos em outubro de 2026)

| Serviço | Limite que importa | Cuidado |
|---|---|---|
| Vercel (Hobby) | 100 GB de tráfego por mês | **Só uso não comercial.** Se você for pago pra criar ou manter a plataforma, ou vender o CodeGuilds pra escolas, precisa do plano Pro. Pedir doações não conta como comercial. |
| Render (Free) | 750 horas por mês; dorme após 15 min sem uso | O cron-job.org chama o `/health/ping` (seção 3). Sem cartão cadastrado, ao passar de um limite o serviço é suspenso, não cobrado. |
| Neon (Free) | 1 GB de banco; 100 horas de processamento por mês; dorme após 5 min sem consulta | O cron **não** pode chamar o `/health` (seção 3). Se as horas acabarem, o banco para até o mês seguinte, sem perder dados. |
| Supabase (Free) | 1 GB de arquivos; 5 GB de download por mês; até 50 MB por arquivo | Pausa o projeto depois de 1 semana sem uso (seção 5). |

Os planos gratuitos mudam com o tempo: confira as páginas de preço de cada serviço antes de
publicar.

### 1. O banco no Neon

1. Crie uma conta em [neon.com](https://neon.com) e um projeto chamado `codeguilds`.
2. Copie a *connection string*. Ela é parecida com `postgresql://usuario:senha@ep-xxxx.neon.tech/codeguilds?sslmode=require`. O `?sslmode=require` é obrigatório: a conexão com o Neon é sempre criptografada.
3. Na sua máquina, rode as migrations e o seed **apontando para o Neon**, trocando a `DATABASE_URL` só nesse comando. No PowerShell:

```bash
$env:DATABASE_URL="postgresql://...neon.tech/codeguilds?sslmode=require"; npm run migrate; npm run seed
```

Use no seed uma senha de ADM forte, diferente da de desenvolvimento (troque o `ADMIN_PASSWORD`
do mesmo jeito, só nesse comando). Depois feche esse terminal: a `DATABASE_URL` do Neon fica
valendo nele até ser fechado, e um `npm run migrate:reset` distraído apagaria o banco de
produção.

### 2. A API no Render

**Jeito mais fácil: o Blueprint.** O arquivo `render.yaml`, na raiz do repositório, já tem a
configuração toda (comandos, filtros, região, a rota de checagem e as variáveis). No Render,
clique em **New → Blueprint**, escolha o repositório `code-guilds` e confirme. O Render pede
só os valores secretos (`DATABASE_URL` e as três do Supabase) e cria a API.

- O Blueprint publica a branch `main` (o `branch:` do `render.yaml`). Na tela do Blueprint, escolha a `main` também: é dela que o Render lê o `render.yaml`. Enquanto a API estava em desenvolvimento, os dois apontavam pra `feat/backend`.
- A região é `ohio`: crie o banco do Neon em **AWS US East 2 (Ohio)**, pra API e banco ficarem perto (cada tela faz várias consultas; banco longe deixa tudo lento).
- O Supabase precisa existir **antes** (seção 5): com `STORAGE_DRIVER=supabase`, a API não sobe sem as chaves dele.

**Ou, configurando à mão** (o mesmo que o Blueprint faz):

1. No Render, crie um **Web Service** ligado ao repositório do GitHub.
2. **Root Directory**: deixe **vazio**. Não use `api` (veja o porquê logo abaixo).
3. **Build Command**:

```bash
cd api && npm install --include=dev && npm run build && npm run migrate
```

- O `cd api` entra na pasta da API (é lá que ficam o `package.json` e os scripts).
- O `--include=dev` é necessário: com `NODE_ENV=production` definido, o `npm install` pularia as dependências de desenvolvimento, e o build precisa delas (o tsup e o kysely-ctl).
- O `npm run migrate` no build aplica sozinho as migrations novas a cada deploy.

4. **Start Command**:

```bash
cd api && npm start
```

5. **Build Filters** (em **Settings → Build & Deploy**), em **Included Paths**:

```
api/**
src/engine/**
```

Assim o Render só publica a API de novo quando muda algo nela ou numa regra do jogo. Uma
mudança só no visual do site (uma tela, uma animação) não republica a API.

**Por que o Root Directory fica vazio?** A API importa as regras do jogo de `src/engine/`, que
fica **fora** da pasta `api/` (veja [Uma regra só](#uma-regra-só-a-api-usa-as-regras-do-site)).
Com o Root Directory em `api`, o Render só deixa disponíveis os arquivos dessa pasta, e o
build quebraria ao não achar `src/engine/`. Com ele vazio, o Render baixa o repositório
inteiro, o `cd api` entra na pasta, e o tsup junta as regras dentro do `build/server.js`.
Depois do build, a API não precisa mais da pasta `src/`: tudo que ela usa está no
`build/server.js`.

6. **Environment Variables**: `NODE_ENV=production`, `DATABASE_URL` (a do Neon) e as do Supabase (seção 5 abaixo): `STORAGE_DRIVER=supabase`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY` e `SUPABASE_BUCKET`. O `PORT` o Render define sozinho.
7. Depois do deploy, abra `https://<sua-api>.onrender.com/health` e confira o `{"status":"ok"}`.

**Atenção**: o disco do Web Service gratuito do Render é apagado a cada deploy (e quando a
API "dorme"). Por isso, em produção, os arquivos das entregas **não podem** usar o
`STORAGE_DRIVER=local`: eles sumiriam. Use o Supabase (seção 5).

### 3. Manter a API acordada

No plano gratuito, o Render desliga a API depois de 15 minutos sem uso, e ela leva cerca de 1
minuto para voltar. Pra isso não acontecer no meio da aula:

1. Crie uma conta gratuita no [cron-job.org](https://cron-job.org).
2. Crie um job que chame `https://<sua-api>.onrender.com/health/ping` a cada 10 minutos.

**Use o `/health/ping`, não o `/health`.** O Neon gratuito dá **100 horas de processamento
por mês** (CU-hours) e desliga o banco depois de 5 minutos sem consulta. O `/health` consulta
o banco: chamado a cada 10 minutos, ele acordaria o Neon o tempo todo e gastaria cerca de 93
das 100 horas só com o cron, sem contar as aulas. Quando as horas acabam, o banco fica fora do
ar até o mês seguinte (os dados não se perdem). O `/health/ping` não toca no banco: a API
fica acordada, e o Neon só acorda quando alguém usa o site.

O Render dá 750 horas gratuitas por mês, e uma API ligada o mês inteiro usa no máximo 744.
Se preferir economizar, dá pra configurar o job só nos horários de aula.

### 4. O site na Vercel

Em **Settings → Environment Variables** do projeto na Vercel, crie `API_URL` com
`https://<sua-api>.onrender.com` e faça um novo deploy do site.

Opcional: a Vercel republica o site a cada commit, mesmo quando só a pasta `api/` mudou. Pra
evitar isso, em **Settings → Git → Ignored Build Step**, escolha **Custom** e use:

```bash
git diff HEAD^ HEAD --quiet -- . ':(exclude)api'
```

O comando confere se o commit mudou algo **fora** da pasta `api/`. Se não mudou (saída 0), a
Vercel pula o deploy; se mudou (saída 1), ela publica o site normalmente. Uma mudança em
`src/engine/` republica os dois (o site e a API), como deve ser.

### 5. Os arquivos no Supabase Storage

1. Crie uma conta em [supabase.com](https://supabase.com) e um projeto (o plano gratuito tem 1 GB de arquivos). O banco do Supabase **não** é usado: o banco continua no Neon; aqui só o Storage.
2. Em **Storage**, crie um bucket chamado `entregas`:
   - **Public bucket: desligado** (privado). Ninguém baixa um arquivo sem passar pela API, que confere se é o aluno que enviou, o professor que corrige ou o ADM.
   - **Restrict file size**: `25 MB` (o mesmo limite do site). Assim nem um envio "na mão" passa disso.
3. Em **Project Settings → API**, copie:
   - a **Project URL** → `SUPABASE_URL` (só `https://xxxx.supabase.co`; **não** use o endereço com `/rest/v1`);
   - a chave **anon / public** → `SUPABASE_ANON_KEY` (essa pode ir pro navegador);
   - a chave **service_role / secret** → `SUPABASE_SERVICE_ROLE_KEY`. Essa é secreta: dá acesso total ao projeto. Ela fica só nas variáveis do Render, nunca no site nem no git.
4. Coloque as variáveis no Render (seção 2) com `STORAGE_DRIVER=supabase` e faça um novo deploy.
5. Teste: um aluno envia uma entrega com um arquivo, e o professor baixa. No Supabase, o arquivo aparece em `entregas/submissions/<id da entrega>/<id do arquivo>`.

O Supabase gratuito pausa o projeto depois de uma semana sem uso. O ping do cron-job.org
(seção 3) mantém a API acordada, mas não o Supabase: numa semana sem missão de entrega (ou
nas férias) o projeto pode pausar. Os arquivos não se perdem, mas ninguém envia nem baixa
entregas até você entrar no painel do Supabase e clicar em **Restore**. Vale conferir antes
de passar uma missão de entrega.

### 6. Backup do banco (com alunos de verdade)

Desde outubro de 2026 a plataforma tem alunos de verdade. A regra é: **nenhuma mudança pode
afetar os dados deles** (progresso, XP, moedas, itens, mensagens e entregas). Por isso:

- As migrations só **acrescentam**: tabela nova, coluna nova com valor padrão ou que aceita `null`. Nada de apagar ou renomear colunas, nem de reescrever dados, sem um plano combinado e um backup feito antes.
- Teste tudo primeiro no banco local (Docker). O banco de produção só recebe o que já funcionou aqui.
- Antes de qualquer mudança arriscada no banco, faça um backup completo.

**Fazendo o backup.** O `pg_dump` gera uma cópia completa do banco num arquivo. Não precisa
instalar o PostgreSQL: ele roda num container do Docker. No cmd, numa pasta **fora do
projeto** (o backup tem os dados dos alunos e nunca pode ir pro git):

```bat
docker run --rm -v "%cd%":/backup postgres:18-alpine pg_dump "COLE_AQUI_A_URL_DO_NEON" -Fc -f /backup/codeguilds-2026-10-05.dump
```

- A `DATABASE_URL` é a mesma do Render (ou do botão **Connect** do Neon). Use a imagem `postgres:18` (ou mais nova): o `pg_dump` precisa ser da mesma versão do banco ou mais novo.
- O `-Fc` gera o formato "custom" do PostgreSQL: compactado e próprio pro `pg_restore`.
- Guarde o arquivo num lugar seguro (um HD externo ou uma pasta particular na nuvem). Ele tem e-mails e dados dos alunos.
- Os **arquivos** das entregas ficam no Supabase, não no banco, então não entram no backup. Eles só somem se uma entrega, um aluno ou uma missão forem excluídos.

**Conferindo o backup.** Um backup que nunca foi testado não é garantia. Restaure no banco
local (o container `codeguilds-db` do Docker) e compare a quantidade de registros:

```bat
docker exec codeguilds-db psql -U codeguilds -d codeguilds -c "create database restore_teste"
docker run --rm -v "%cd%":/backup postgres:18-alpine pg_restore --no-owner --no-privileges -d "postgresql://codeguilds:SENHA_DO_ENV_LOCAL@host.docker.internal:5433/restore_teste" /backup/codeguilds-2026-10-05.dump
docker exec codeguilds-db psql -U codeguilds -d restore_teste -c "select count(*) from students"
```

- O `host.docker.internal` é como um container chega na porta 5433 do seu computador (onde está o banco local).
- O `--no-owner --no-privileges` ignora os usuários do Neon, que não existem no banco local.
- Restaurando num banco local mais antigo (o container usa o PostgreSQL 16), pode aparecer o aviso `unrecognized configuration parameter "transaction_timeout"`. Ele é inofensivo: é uma configuração das versões novas, e os dados entram normalmente.
- Depois de conferir, apague o banco de teste: `docker exec codeguilds-db psql -U codeguilds -d codeguilds -c "drop database restore_teste"`.

**E se precisar voltar um backup em produção?** Nunca por cima do banco que está no ar sem
antes conversar e planejar. O Neon tem dois recursos que ajudam: as **branches** (uma cópia
instantânea do banco, ótima pra testar uma migration arriscada antes de rodar no banco
principal) e o **restore** para um momento anterior, dentro do período de histórico do plano
(o gratuito guarda pouco tempo; confira o prazo no painel do Neon).

### Migrando para um plano pago depois

Nada no código muda: basta trocar a `DATABASE_URL` (novo banco), a `API_URL` (nova API) e as
variáveis do Supabase (ou de outro storage, implementando as mesmas funções em
`src/services/storage.ts`) nas variáveis de ambiente.

## O que mudou em relação ao front de hoje

- **Senhas**: ninguém mais consegue ver a senha de um aluno, nem o professor. O professor só define uma nova. O campo `hasPassword` diz se o aluno já tem senha.
- **Código mestre**: o front aceita o código mestre antigo como senha do ADM. A API **não** tem código mestre: o ADM entra com o próprio e-mail e senha.
- **Economia**: nível, XP, moedas e itens não podem ser alterados diretamente por nenhuma rota. Desde a fase 3, só as regras do jogo (no servidor) mexem neles: quiz corrigido pela API, compra, venda, troca, presente, recompensa de evento e de entrega aprovada.
- **Ids**: os ids passam a ser uuid, gerados pelo banco (no front eram como `s_1759...` e `t_danilo`). Alunos e professores criados antes do back end não têm conta na API e são ignorados pelo site; as missões de exemplo passam para o ADM.
- **Uma sessão por navegador**: antes dava pra estar logado como professor e como aluno ao mesmo tempo no mesmo navegador; agora entrar com uma conta encerra a outra.

## Próximas fases

- ~~**Fase 2 — ligar o site à API**~~ ✅ **feita**: contas, login, cadastro, perfil do aluno e professores (veja [Fase 2: o site usando a API](#fase-2-o-site-usando-a-api)).
- ~~**Fase 3 — o jogo no servidor**~~ ✅ **feita**: progresso do aluno, missões, Loja, inventário, presentes, amizades, Mercado, trocas, agenda e recompensas dos eventos, Chave do Multiverso e a recompensa das entregas aprovadas (veja [Fase 3: o jogo no servidor](#fase-3-o-jogo-no-servidor)). As amizades, as trocas e os eventos, que estavam planejados pras fases 4 e 6, vieram junto, porque também mexem em itens e moedas.
- ~~**Fase 4 — mensagens**~~ ✅ **feita**: o sininho, os comunicados, a conversa com balões e as mensagens do aluno pro professor, com a API criando as mensagens automáticas na mesma transação de cada ação (veja [Fase 4: as mensagens no servidor](#fase-4-as-mensagens-no-servidor)).
- ~~**Fase 5 — entregas**~~ ✅ **feita**: as entregas das missões de entrega (texto e arquivos) no servidor, com os arquivos no Supabase Storage enviados direto pelo navegador (veja [Fase 5: as entregas no servidor](#fase-5-as-entregas-no-servidor)). Com ela, nada do jogo fica mais só no navegador.
- **Testes automatizados**: Vitest com o `app.inject()` do Fastify, começando por login, permissões, recompensas e trocas.
