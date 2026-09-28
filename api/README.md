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
ligou o site a ela (as contas saem do localStorage). As próximas fases (missões, loja,
inventário, trocas, eventos...) estão no fim deste documento.

O desenvolvimento das fases acontece na branch `feat/backend`; a `main` continua sendo a
versão só com localStorage, publicada na Vercel como demonstração, até a migração terminar.

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
│   └── seeds/             → dados iniciais (o primeiro ADM)
├── src/
│   ├── middlewares/
│   │   └── auth.ts        → descobre quem está logado + ensureAuthenticated/Teacher/Admin
│   ├── routes/            → as rotas, cada arquivo é um plugin do Fastify
│   │   ├── auth.ts        → login, logout e "quem sou eu"
│   │   ├── health.ts      → a API está no ar?
│   │   ├── students.ts    → cadastro e gestão de alunos
│   │   └── teachers.ts    → cadastro e gestão de professores
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
│   │   └── validations.ts → existsOrError, notExistsError, equalsOrError
│   ├── app.ts             → monta o app: plugins, erros e rotas
│   ├── database.ts        → a conexão com o banco (o "db")
│   ├── env.ts             → lê e valida as variáveis de ambiente
│   └── server.ts          → sobe o servidor (listen)
├── .env                   → suas variáveis (NÃO vai pro git)
├── .env.example           → modelo do .env
├── docker-compose.yml     → o container do PostgreSQL
├── kysely.config.ts       → configuração das migrations e seeds
├── package.json
└── tsconfig.json
```

O `tsconfig.json` da raiz do site tem `"exclude": ["node_modules", "api"]`, pra o Next.js
(e a Vercel) não tentar compilar a API junto com o site.

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

A fase 1 tem três tabelas. Os nomes das colunas no banco são em `snake_case`
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
PostgreSQL desfaz tudo (rollback) e nenhum aluno fica sem professor. Nas próximas fases, as
trocas entre alunos e as compras na loja vão usar muito isso.

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

Seeds são dados iniciais que o sistema precisa pra funcionar. Aqui o único é o primeiro ADM:
sem ele não haveria quem cadastrasse os professores.

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
| DELETE | `/students/:id` | O professor dele ou o ADM |

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
  "createdAt": "2026-09-28T14:50:30.000Z",
  "hasPassword": true
}
```

O `hasPassword` substitui a senha: o professor sabe se ainda precisa definir uma, sem nunca
ver qual é.

---

### GET /health

Confere se a API e o banco estão no ar (faz um `select 1` no banco). É a rota que o
cron-job.org chama pra manter a API acordada no Render.

Resposta `200`:

```json
{ "status": "ok" }
```

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

Só o ADM. Os alunos do professor excluído passam para o professor escolhido na query
`?heirId=<id>` (o "herdeiro", que o Painel ADM pede na tela de exclusão); sem ele, passam
para o ADM que fez a exclusão. Tudo numa [transação](#transações). As sessões do professor
excluído caem na hora.

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

### DELETE /students/:id

O professor do aluno ou o ADM. As sessões do aluno são apagadas junto. `200`, `403` ou `404`.

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
- Sem `API_URL`, nada é repassado. Desde a fase 2, na branch `feat/backend`, o site depende da API para login e cadastro, então sem ela ninguém entra (a tela mostra "O servidor da CodeGuilds não está configurado").

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
eventos) e o resto (missões, loja, mensagens, amigos, trocas) continuam no navegador até as
próximas fases.

### O que é da API e o que ainda é do navegador

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
2. Em segundo plano, o `refreshAccounts()` pergunta à API quem está logado (`/auth/me`) e busca as listas que essa pessoa pode ver:
   - professor: `/students` (os alunos dele) e `/teachers` (ou `/teachers/admin`, se for ADM);
   - aluno: `/students/community` (a comunidade) e `/teachers`;
   - ninguém logado: só `/teachers` (a tela de cadastro precisa da lista).
3. O que voltou é gravado no cache (`saveStudentAccounts`, `saveTeachers`) e o `emitChange()` avisa os hooks, que atualizam as telas.

O `refreshAccounts()` roda quando os hooks montam (no máximo a cada 5 segundos, por mais
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
| `patchStudent(id, patch)` | salvava qualquer campo | só progresso do jogo (ex.: o professor tirar um item) |
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

**Não use o PostgreSQL gratuito do Render**: ele expira 30 dias depois de criado e é apagado
duas semanas depois disso. O Web Service gratuito do Render, por outro lado, não expira.

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

1. No Render, crie um **Web Service** ligado ao repositório do GitHub.
2. **Root Directory**: `api` (a API está nessa pasta do repositório).
3. **Build Command**:

```bash
npm install --include=dev && npm run build && npm run migrate
```

- O `--include=dev` é necessário: com `NODE_ENV=production` definido, o `npm install` pularia as dependências de desenvolvimento, e o build precisa delas (o tsup e o kysely-ctl).
- O `npm run migrate` no build aplica sozinho as migrations novas a cada deploy.

4. **Start Command**:

```bash
npm start
```

5. **Environment Variables**: `NODE_ENV=production` e `DATABASE_URL` (a do Neon). O `PORT` o Render define sozinho.
6. Depois do deploy, abra `https://<sua-api>.onrender.com/health` e confira o `{"status":"ok"}`.

### 3. Manter a API acordada

No plano gratuito, o Render desliga a API depois de 15 minutos sem uso, e ela leva cerca de 1
minuto para voltar. Pra isso não acontecer no meio da aula:

1. Crie uma conta gratuita no [cron-job.org](https://cron-job.org).
2. Crie um job que chame `https://<sua-api>.onrender.com/health` a cada 10 minutos.

O Render dá 750 horas gratuitas por mês, e uma API ligada o mês inteiro usa no máximo 744.
Se preferir economizar, dá pra configurar o job só nos horários de aula.

### 4. O site na Vercel

Em **Settings → Environment Variables** do projeto na Vercel, crie `API_URL` com
`https://<sua-api>.onrender.com` e faça um novo deploy do site.

### Migrando para um plano pago depois

Nada no código muda: basta trocar a `DATABASE_URL` (novo banco) e a `API_URL` (nova API)
nas variáveis de ambiente.

## O que mudou em relação ao front de hoje

- **Senhas**: ninguém mais consegue ver a senha de um aluno, nem o professor. O professor só define uma nova. O campo `hasPassword` diz se o aluno já tem senha.
- **Código mestre**: o front aceita o código mestre antigo como senha do ADM. A API **não** tem código mestre: o ADM entra com o próprio e-mail e senha.
- **Economia**: nível, XP e moedas não podem ser alterados diretamente por nenhuma rota. Nas próximas fases, só as regras do jogo (no servidor) vão mexer neles.
- **Ids**: os ids passam a ser uuid, gerados pelo banco (no front eram como `s_1759...` e `t_danilo`). Alunos e professores criados antes do back end não têm conta na API e são ignorados pelo site; as missões de exemplo passam para o ADM.
- **Uma sessão por navegador**: antes dava pra estar logado como professor e como aluno ao mesmo tempo no mesmo navegador; agora entrar com uma conta encerra a outra.

## Próximas fases

- ~~**Fase 2 — ligar o site à API**~~ ✅ **feita**: contas, login, cadastro, perfil do aluno e professores (veja [Fase 2: o site usando a API](#fase-2-o-site-usando-a-api)).
- **Fase 3 — núcleo do jogo**: tabelas de missões, loja, inventário e itens, com as recompensas calculadas no servidor (o aluno diz "terminei a missão X" e o servidor confere e paga). Compras e uso de itens em transações.
- **Fase 4 — social**: amizades, chat, mensagens, trocas entre alunos (em transação), presentes e mensagens para o professor.
- **Fase 5 — entregas**: envio de arquivos das missões de entrega para o Supabase Storage (1 GB grátis), com limite de tamanho por arquivo.
- **Fase 6 — eventos e multiverso**: eventos com fases liberadas pelo professor, ranking e a Chave do Multiverso.
- **Testes automatizados**: Vitest com o `app.inject()` do Fastify, começando por login, permissões, recompensas e trocas.
