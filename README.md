# CodeGuilds

Academia de código gamificada para suas turmas — 4 casas, missões em formato quiz, XP, moedas e itens.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000 — toda entrada começa pela tela de login. Quem ainda não tem conta clica em "Criar conta" e passa por: cadastro → escolha de casa → criação de avatar → academia.

## Fluxo completo

1. `/entrar` — tela de login com duas abas: **Entrar** (login + senha) e **Criar conta** (nome, e-mail, turma, **professor**, login, senha). Vários alunos podem ter conta no mesmo navegador
2. `/casa-selecao` — Passo 1/3, escolhe uma das 4 casas
3. `/avatar` — Passo 2/3, editor de avatar em abas: pele e olhos, cabelo, rosto, roupa e acessórios (óculos e chapéus), com miniaturas de cada opção e botão 🎲 Aleatório
4. `/academia/missoes` — lista de missões/quizzes, desbloqueadas por nível
5. `/academia/inventario` — cartão do personagem (abre a Ficha do Personagem), ofertas de compra recebidas e os itens: cada um pode ser usado (se der XP), vendido (pro sistema ou pra um colega) ou excluído
6. `/academia/casa` — painel da casa, pontos das 4 casas e ranking dos colegas da mesma casa; clicar num colega abre o perfil dele (avatar, nome, nível, moedas e itens)
7. `/academia/casa/mensagens` — submenu de "Minha Casa": avisos e mensagens do professor (o sino 🔔 no cabeçalho mostra as não lidas)
8. `/academia/guildas`, `/academia/lore`, `/academia/eventos` — ainda em construção (só mostram "em breve"): história de cada casa, modo história e próximos eventos
9. `/professor` → `/professor/painel` — login e painel do professor: cada professor só vê e altera os próprios alunos e as próprias missões
10. `/admin` → `/admin/painel` — login e Painel ADM (mesmas credenciais do Professor Danilo): professores, alunos e missões de toda a plataforma

**Login do Professor Danilo / ADM (demo):** `danilo@codeguilds.com` / `prof123`, ou o código mestre `KAIROIS2024` nos dois campos. Outros professores são cadastrados pelo ADM e entram com o e-mail e a senha definidos lá.

## Estrutura

```
src/
  engine/
    houses.ts     -> as 4 casas (cores, lema, brasão)
    missions.ts    -> missões e seus quizzes (dados estáticos, editados em código por enquanto)
    students.ts     -> cadastro de aluno, login/senha e sessão, professor do aluno, XP/nível/moedas, inventário
    tutorial.ts     -> passos do tutorial de primeiro acesso (aluno e professor)
    theme.ts        -> tema escuro/claro salvo no navegador (classe `light` no <html>)
    shop.ts         -> Loja da Academia: itens à venda (CRUD do ADM, semeado com 10 itens) e a compra do aluno
    teachers.ts     -> cadastro de professores (semeado com o Danilo, que é o ADM), login e sessão do professor
    avatar.ts       -> opções do avatar (10 tons de pele, 8 cores de olhos, 9 cabelos, 11 cores de cabelo, 4 expressões, 6 detalhes de rosto, 4 roupas, 8 cores de roupa, 7 óculos, 7 chapéus) + conversão de avatares salvos no formato antigo
    missionsStore.ts  -> CRUD de missões em localStorage (semeado com as 4 padrão)
    messages.ts       -> mensagens/avisos do professor pro aluno, com status de lida (localStorage)
    market.ts         -> ofertas de venda de itens entre alunos (item fica reservado até o colega comprar ou recusar)
    specialEvents.ts  -> eventos especiais (Halloween e Apocalipse Zumbi): história em cenas (abertura e final), vilão, missões prontas, recompensa final e o progresso do aluno (Student.events)
    sfx.ts            -> sons das cenas gerados no navegador (Web Audio + voz sintetizada): risada da Morte, fanfarra de vitória, jingle de nível, sino da meia-noite, trovão, fundo sombrio e a voz de cada personagem (speakCharacter); e a preferência de som/mudo
    music.ts          -> música de fundo medieval da Academia, composta e tocada via Web Audio (loop de ~30s)
    store.ts          -> hooks useStudents(), useMissions(), useMessages(), useBroadcasts(), useTeachers() e useOffers() — mesmo padrão do usePeople() do Rejuvenation Lab Simulator; useMissionAttempt() aplica a recompensa de uma missão (tela de Missões e tela de evento)
  components/
    Avatar.tsx        -> avatar em SVG puro, montado em camadas (cabelo de trás, roupa, rosto, olhos/boca, cabelo da frente, óculos, chapéu)
    GameUI.tsx         -> XPBar, badges de raridade/dificuldade
    QuizModal.tsx       -> o quiz em si (pergunta, feedback) — decide qual tela de resultado mostrar
    MissionResult.tsx   -> telas animadas de fim de missão: vitória (baú + confete) e derrota (Ceifador)
    LevelUpScreen.tsx   -> cena animada de subir de nível (brasão, número trocando, missões desbloqueadas)
    SceneSound.tsx      -> useSceneSound() + botão 🔊/🔇: pausa a música de fundo, toca o som da cena e retoma ao fechar
    AcademyHeader.tsx, AcademySidebar.tsx -> layout da Academia
    ComingSoon.tsx      -> placeholder "em breve" das telas ainda não construídas
    Pagination.tsx      -> controles de paginação (Anterior/números/Próxima) + usePagination() e PaginationFooter ("Mostrando 1–10 de N"), reutilizáveis
    SearchInput.tsx     -> campo de busca com lupa
    ItemDetailsModal.tsx -> card grande de um item (ícone, raridade, valor/XP, descrição), aberto ao clicar no item
    StudentList.tsx, MissionList.tsx, TeacherList.tsx -> listas com busca e paginação dos painéis do professor e do ADM
    HousemateSheet.tsx  -> perfil de um colega da mesma casa (avatar, nome, nível, moedas e itens — sem dados pessoais)
    SellItemModal.tsx   -> janela de venda de um item (pro sistema ou oferta pra um colega)
    ItemEconomyFields.tsx -> campos de valor em moedas e XP ao usar (professor: editor de missão e "Dar item")
    CharacterSheet.tsx  -> Ficha do Personagem do próprio aluno (avatar animado, nível, XP adquirido, moedas, missões, itens por raridade)
    StudentDetails.tsx  -> ficha do aluno no painel do professor (dados, avatar, inventário, dar/excluir item, enviar mensagem, excluir aluno)
    NotificationBell.tsx -> sino de notificações do cabeçalho da Academia
    BroadcastComposer.tsx -> comunicados do professor pra toda a turma ou pra uma casa, com o histórico de leitura
    TeacherLoginCard.tsx -> tela de login compartilhada entre /professor e /admin
    TeacherEditor.tsx   -> cadastro/edição/exclusão de professor no Painel ADM
    TutorialModal.tsx   -> tour do primeiro acesso apresentado pelo Mago Danilo (céu estrelado, balão com texto digitado, voz)
    WizardDanilo.tsx    -> o Mago Danilo em SVG, com as animações (piscar, acenar, orbe, clarão do cajado, boca falando)
    ThemeToggle.tsx     -> botão ☀️/🌙 de tema claro/escuro (+ versão flutuante pras telas sem cabeçalho)
    ShopManager.tsx, ShopItemEditor.tsx -> aba Loja do Painel ADM e o cadastro de item (com catálogo de visuais)
    ShopQuickEdit.tsx   -> edição rápida da Loja em tabela (raridade, preço, moedas, XP, ajuste em %)
    ShopItemPicker.tsx  -> escolha de item da Loja (doar pro aluno / recompensa de missão), com prévia
    EmojiPicker.tsx     -> escolha do ícone de missão e de item: 112 emojis em 7 categorias (Itens, Magia, Batalha, Código, Estudo, Criaturas, Outros) + campo pra colar outro
    MusicToggle.tsx     -> botão 🎶 ao lado do sino que liga/desliga a música de fundo
    EventScene.tsx      -> player em tela cheia da história de um evento (vinheta de título, faixas de cinema, balão estilo visual novel, voz e sons)
    EventMissionsManager.tsx -> card "Eventos da Academia" do painel do professor (criar/atribuir/tirar missões do evento, missões prontas)
    events/registry.ts  -> visual de cada evento (desenho das cenas, ícone de progresso, cores, balão do vilão)
    events/common.tsx   -> peças de arte comuns aos eventos: castelo da CodeGuilds, céu estrelado, névoa, relâmpagos, confete, raios, vitrine da recompensa
    events/HalloweenArt.tsx -> as cenas do Halloween em SVG/CSS: lua de sangue, morcegos, Rei Abóbora, fantasmas, Lanternas Sagradas
    events/ZombieArt.tsx -> as cenas do Apocalipse Zumbi: sirene, fita de quarentena, Dr. Necrose, horda de zumbis, frascos do Antídoto Z, chuva de cura
  app/
    entrar/, casa-selecao/, avatar/  -> onboarding
    academia/missoes|inventario|casa -> as 3 telas principais (layout compartilhado)
    academia/eventos, eventos/[eventId] -> Salão dos Eventos e a tela de cada evento
    academia/guildas|lore            -> placeholders "em breve" (mesmo layout)
    professor/, professor/painel/    -> área do professor
    admin/, admin/painel/            -> Painel ADM
public/
  crests/  -> os 4 brasões das casas (ignis, noctis, flavus, sapientia)
```

## O que já funciona de verdade

- Edição rápida da Loja (Painel ADM → Loja → "✏️ Edição rápida") — tabela com todos os itens (busca, filtro por coleção, 20 por página) pra mudar raridade, preço, moedas de revenda e XP ao usar direto na linha; linhas alteradas ficam destacadas e tudo é salvo de uma vez. Tem ajuste de preço em % pros itens filtrados (ex.: −20% na coleção de Natal = promoção). O XP fica bloqueado nos visuais (não são consumíveis)
- Itens da Loja como recompensa de missão e como doação — só pelo Painel ADM: no editor de missão, "🛍️ Usar um item da Loja como recompensa" copia o item (nome, ícone, descrição, raridade, valor, XP e, se for visual, o próprio visual — o aluno ganha e pode equipar); na ficha do aluno, "Dar item" ganha o modo "🛍️ Item da Loja" (avisa se o aluno já tem aquele visual). No Painel do Mestre continua só o "✏️ Criar item", então itens da Loja só podem ser doados pelo ADM

- 🎄 Coleção Especial de Natal na Loja — 21 itens prontos: mascotes (renazinha do trenó, boneco de neve, pinguim do Polo Norte, elfo ajudante), chapéus (gorro do Papai Noel com pompom, chifres de rena com guizos, coroa de azevinho, gorro de elfo com sininho), óculos (meia-lua do Papai Noel, floco de neve), fantasias (Papai Noel, suéter de Natal, elfo), 3 cores (vermelho Noel, verde pinheiro, branco neve), auras (nevasca, luzinhas de Natal coloridas, aurora boreal) e itens de XP (Biscoito de Gengibre, Chocolate Quente). É a primeira coleção no Painel ADM e na Loja; a seção dela tem neve caindo de verdade (`.cg-anim-snow`, desligada pra quem pede menos movimento)
- 🐰 Coleção Especial de Páscoa na Loja — 21 itens prontos: mascotes (Coelhinho da Páscoa, pintinho, ovelhinha, borboleta), chapéus (orelhas de coelho com uma dobradinha, coroa de flores, casca de ovo, chapéu de palha de Páscoa com fita e flores), óculos (ovinho pintado, cenoura), fantasias (coelho, ovo de chocolate embrulhado, ovo pintado), 3 cores (rosa algodão-doce, lilás primavera, verde menta), auras (ovinhos coloridos, jardim florido, arco-íris com nuvenzinhas) e itens de XP (Ovo de Chocolate, Cenoura Dourada). Vem logo depois do Natal no Painel ADM e na Loja; a seção dela tem pétalas 🌸 caindo (o efeito de neve virou genérico: cada coleção pode definir o que cai em `falling` no `collections.ts`)
- 🧟 Coleção Apocalipse Zumbi na Loja — 21 itens prontos: mascotes (zumbizinho de estimação, cérebro saltitante, rato do esgoto, Vírus Z), chapéus (capacete camuflado com lanterna acesa, cérebro à mostra com pontos na testa, bandana de sobrevivente rasgada, chapéu de xerife com estrela), óculos (máscara de gás com filtro duplo, olhos de zumbi com olheiras e manchas esverdeadas), fantasias (roupa de zumbi rasgada com remendo, colete de sobrevivente com rádio, traje antivírus amarelo com símbolo de risco biológico), 3 cores (verde zumbi, cinza das cinzas, ferrugem), auras (radioativa com símbolos de radiação e bolhas, horda de mãos saindo da terra sob lua verde, cidade em ruínas com fumaça) e itens de XP (Lata de Feijão, Vacina Anti-Z). Fica logo depois do Halloween no Painel ADM e na Loja; a seção dela tem cinzas caindo
- 🛸 Coleção Ataque Alienígena na Loja — 21 itens prontos: mascotes (alienzinho, mini disco voador, invasor pixelado, polvo de Marte), chapéus (antenas de marciano com bolinhas brilhando, chapéu de papel-alumínio amassado, capacete espacial de vidro com antena, antena parabólica), óculos (olhos de alienígena pretos e puxados, visor laser com mira e feixe), fantasias (traje de astronauta com painel no peito, fantasia de alienígena com gola prateada, uniforme da Frota Galáctica), 3 cores (verde marciano, prata cromada, roxo nebulosa), auras (raio trator de um disco voador, sistema solar com planeta de anéis, invasão pixelada de fliperama) e itens de XP (Gosma Alienígena, Cristal de Energia). Fica logo depois do Apocalipse Zumbi no Painel ADM e na Loja; a seção dela tem estrelinhas caindo
- 🤖 Coleção Robôs e Inteligência Artificial na Loja — 21 itens prontos: mascotes (núcleo de IA com carinha e anel orbitando, drone de estimação, gato-robô, satélite de bolso — os três primeiros têm desenho próprio em SVG em vez de emoji, via `drawnPet` no `Avatar.tsx`), chapéus (capacete cyber com LED e fones, coroa holográfica com efeito glitch, implante neural com LEDs e fios, antena de mola e parafusos de robô), óculos (realidade aumentada com mira e gráfico, olho biônico), fantasias (armadura mecha com reator no peito, jaqueta cyberpunk neon, traje de androide), 3 cores (azul holograma, rosa cyberpunk, grafite de titânio), auras (chuva de código com zeros e uns, placa de circuito, horizonte neon com sol listrado) e itens de XP (Bateria Turbo, Chip Quântico). Fica logo depois do Ataque Alienígena no Painel ADM e na Loja; a seção dela tem bits caindo (o `falling` ganhou `alt`, que alterna com `char`: 1 e 0)
- 🎃 Eventos da Academia — evento de Halloween "A Noite do Bug Assombrado":
  - **Salão dos Eventos** (Eventos no menu): banner animado e um card grande por evento, com pôster animado (castelo sob a lua de sangue, morcegos, o Rei Abóbora espiando), selo de status (Novo / Em andamento x/y / Concluído), resumo da história, progresso em Lanternas Sagradas e a recompensa final. Botão **Entrar no evento**
  - **Cena de abertura** em tela cheia (como o tutorial, porém cinematográfica): vinheta com o título piscando, faixas pretas de cinema e 6 cenas com texto digitado e balão no estilo visual novel (Narrador, Mago Danilo e o vilão Rei Abóbora, cada um com cor e voz próprias). O castelo sob a lua vermelha, o Mago chegando, o Rei Abóbora surgindo entre raios, a Maldição do Bug Eterno (fantasmas de `undefined`, `null` e `NaN`, erros "assombrados" tremendo, aboborinhas pulando), as Lanternas Sagradas e o chamado com o avatar do aluno no círculo mágico. Com som: sino da meia-noite, trovões, "plim", fundo sombrio e as vozes. Pular/Esc a qualquer momento; na próxima vez, "Entrar" vai direto pra tela do evento (dá pra rever a abertura)
  - **Tela do evento**: pôster, objetivo, uma lanterna por missão (acende quando o aluno conclui), barra de progresso e as **missões exclusivas** do evento (mesmo quiz, recompensas e cena de nível das missões normais). Elas não aparecem na tela de Missões
  - Depois da última missão aparece **Finalizar evento**, que abre a **cena final**: as lanternas acendendo com raios dourados, o Rei Abóbora girando e encolhendo até virar uma aboborinha fofa de coroa, o amanhecer (os fantasmas ganham valor e sobem em paz) e a recompensa com confete. Ao terminar, o aluno ganha o 🎃 Rei Abóbora de Estimação (mascote lendário equipável), +500 XP e +300 moedas, recebe a mensagem "Evento finalizado" e pode rever o final (sem ganhar de novo)
  - **Professor** (card "Eventos da Academia" no Painel do Mestre): cria missões do evento, atribui uma missão que já existe (ela sai da lista normal), tira do evento, ou usa as 4 missões prontas do Halloween com um clique (O Fantasma do undefined, O Caldeirão das Arrays, O Labirinto das Condições e O Duelo contra o Rei Abóbora). Mostra quantos alunos entraram e finalizaram. O aluno só vê as missões de evento do próprio professor; no Painel ADM elas aparecem com o selo 🎃 Evento
  - Novo evento no futuro = um objeto em `ACADEMY_EVENTS` (specialEvents.ts) + a arte e as cores em `components/events/`
- 🧟 Evento Apocalipse Zumbi "O Surto do Vírus Z" (segundo card do Salão dos Eventos):
  - **História**: o Dr. Necrose, expulso da academia por querer "um código que nunca morre", solta o Vírus Z no laboratório; quem pega vira zumbi do Ctrl+C, Ctrl+V (só copia e cola código sem entender). A cura é o Antídoto Z: cada missão vencida enche um dos frascos
  - **Abertura** (6 cenas): sirene do laboratório girando no castelo sob um céu verde-ácido com fita de quarentena, o Mago no laboratório com o frasco quebrado soltando fumaça, o Dr. Necrose surgindo entre raios verdes, a horda de zumbis atravessando a tela cambaleando ("Ctrl+C...", "cóóódigo..."), os frascos do antídoto na bancada (o primeiro enche) e o chamado com o avatar do aluno de máscara de gás e capacete com lanterna. Sons novos: sirene de alerta e gemido de zumbi
  - **Final** (4 cenas): os 4 frascos borbulhando, o Dr. Necrose tropeçando no próprio frasco e encolhendo até virar um zumbizinho de bolso, a chuva de antídoto clareando o céu enquanto os zumbis voltam a ser alunos comemorando, e a recompensa: 🧟 Zumbizinho de Bolso (mascote lendário equipável), +500 XP e +300 moedas
  - **Missões prontas** pro professor: O Zumbi do Ctrl+C (cópia x referência), O Laboratório dos Objetos, A Fuga pelo Loop e O Antídoto Final (try/catch, reduce, setTimeout)
  - O que era fixo do Halloween virou dado de cada evento: nome, ícone e voz do vilão, frase das missões, convite pra finalizar, nomes do progresso ("frascos cheios", "lanternas acesas") e as cores da cena, dos botões e da barra

- 🏛️ Coleção Mitologia Grega e 🏺 Coleção Mitologia Egípcia na Loja — 21 itens prontos cada (`SHOP_COLLECTIONS` em `shop.ts`). Grega: mascotes (águia de Zeus, serpente da Medusa, minotaurinho, golfinho de Poseidon), chapéus (coroa de louros dourada, elmo espartano com crista, asas de Hermes, cabelo de serpentes), óculos (olhar da Medusa, venda do Oráculo), fantasias (toga, armadura de hoplita, manto de Zeus), 3 cores, auras (raios de Zeus, mar de Poseidon, luz do Olimpo) e itens de XP (Ambrosia, Maçã de Ouro). Egípcia: mascotes (gato de Bastet, escorpião, crocodilo de Sobek, camelo), chapéus (nemes do faraó, orelhas de Anúbis, coroa da cobra real, disco solar de Rá), óculos (Olho de Hórus, óculos do faraó), fantasias (faraó, múmia, Cleópatra), 3 cores, auras (sol de Rá, tempestade do deserto com pirâmides, hieróglifos) e itens de XP (Papiro dos Sábios, Tâmaras do Oásis). No Painel ADM → Loja, cada coleção (Halloween, Grega, Egípcia) tem o seu card pra colocar tudo à venda ou tirar de uma vez; na Loja do aluno, cada coleção à venda ganha uma seção com o visual do tema (cores, título e enfeites flutuando — definidos em `components/collections.ts`)

- 🎃 Coleção de Halloween na Loja — 26 itens prontos (`HALLOWEEN_COLLECTION` em `shop.ts`): 6 mascotes (abobrinha, lobinho, morceguinho, aranha, caveirinha, fantasminha), 4 chapéus desenhados (bruxa, cabeça de abóbora, orelhas de lobisomem, tiara de morcego), 3 óculos (Jack-o'-Lantern, vampiro, teia de aranha com aranhinha), 3 fantasias completas — um tipo novo de visual que troca a roupa inteira (vampiro de gola alta, esqueleto, abóbora com carinha na barriga) —, 4 cores de roupa, 4 auras (assombrada com fantasminhas, lua sangrenta com morcegos, revoada de morcegos, abóboras) e 2 itens de XP (Doce ou Travessura, Poção da Bruxa). No Painel ADM → Loja, o card "🎃 Coleção de Halloween" coloca tudo à venda de uma vez (ou só os que faltam) e tira tudo depois do Halloween — quem comprou continua com os itens. Cada peça também pode ser cadastrada sozinha pelo catálogo (marcada com 🎃). Na Loja do aluno, a coleção ganha uma seção própria "Por tempo limitado", sempre escura, com morcegos e abóboras flutuando

- Loja da Academia (`/academia/loja`, "🛍️ Loja" no menu) — banner "Mercado Arcano" com o saldo e o avatar do aluno, itens em destaque com borda brilhante na cor da raridade, vitrine com abas (Tudo / Visuais do avatar / Itens) e ordenação (destaques, preço, mais vendidos), selo 🔥 Popular (3+ vendas). Nos visuais, cada card mostra o próprio aluno vestindo o item e o 👁 Provar veste no avatar do banner antes de comprar. Comprar pede confirmação (preço e saldo depois), desconta as moedas, põe o item no inventário, manda uma mensagem 🛒 Compra e abre a tela "Compra feita!" com 👕 Equipar agora. Visual já comprado não pode ser comprado de novo. Vem com 10 itens de exemplo na primeira vez
- Visuais exclusivos do avatar — só existem na Loja: chapéus (auréola, chifres, tiara estelar, cartola), óculos (neon, de coração, pixelado), cores de roupa (ouro real, prata lunar, carmesim sombrio, ciano neon), auras (fogo, arcana, gelo, estelar) e mascotes no ombro (dragãozinho, coruja, gato, fantasminha, robô). No Inventário, item de visual tem 👕 Equipar / ↩ Retirar do avatar (um por espaço; equipar outro do mesmo espaço troca); o avatar do editor fica guardado e volta ao retirar. Vender, oferecer ou excluir um item equipado tira ele do avatar. O avatar "vestido" aparece em todo lugar (cabeçalho, ranking, perfil de colega, ficha, painéis) — ver `wornAvatar()` em `students.ts`
- Aba 🛍️ Loja no Painel ADM — lista os itens à venda com quantas vendas e quantas moedas os alunos já gastaram; + Novo item abre o editor: tipo (visual do avatar ou item comum), catálogo de visuais com prévia no avatar (os que já estão à venda ficam bloqueados), nome, descrição, raridade, preço, valor de revenda, XP ao usar (itens comuns), ícone e ⭐ destaque. Tirar da Loja não mexe em quem já comprou

- Tema claro e escuro — o escuro continua sendo o padrão, idêntico ao de antes. O botão ☀️/🌙 (no cabeçalho da Academia, no Painel do Mestre, no Painel ADM e flutuando no canto das telas de login/cadastro/casa/avatar) alterna os temas: no escuro mostra o sol (vai pro claro), no claro mostra a lua (volta pro escuro). A escolha fica salva no navegador e é aplicada antes da página aparecer (sem "piscar"). Como funciona: em `tailwind.config.ts` cada cor da paleta lê uma variável CSS cujo padrão é a cor do tema escuro; a classe `light` no `<html>` só troca essas variáveis. As cenas de vitória, derrota e subir de nível continuam escuras nos dois temas (`.cg-dark-scope`)

- Mensagens automáticas de missão, compra e venda — ao passar numa missão, o aluno recebe uma mensagem ⚔️ Missão com o nome daquela missão e o item, XP e moedas que ela deu; quando um colega compra um item, o comprador recebe 🛒 Compra ("comprado com sucesso de Fulano") e o vendedor recebe 💰 Venda ("vendido com sucesso pra Fulano"). As de compra/venda são geradas no próprio `acceptOffer()` do mercado
- Filtro por tipo na página Mensagens do aluno — Todas, Avisos, Mensagens, Presentes, Missões, Compras e Vendas, cada um com contagem e um pontinho quando há não lidas; combinado com a paginação (10 por página), e trocar de filtro volta pra página 1

- Mensagem de parabéns ao ganhar item — quando o professor ou o ADM dá um item pela ficha do aluno, o aluno recebe automaticamente uma mensagem do tipo 🎁 Presente (no sino e em Mensagens) com o item, a raridade e quem deu: "pelo Professor X" (Painel do Mestre) ou "pela Administração da Academia (ADM X)" (Painel ADM). O tipo Presente não aparece pra escolha ao escrever mensagens/comunicados — é só automático

- Descrição e card de item — todo item novo tem descrição obrigatória (até 300 caracteres), escrita pelo professor no editor de missão (item de recompensa) e no "Dar item" da ficha do aluno. Clicar num item abre um card maior com ícone, raridade, valor/XP, a descrição e a data em que foi obtido: no Inventário (itens, ofertas recebidas e enviadas), no perfil de um colega de casa, na ficha do aluno nos painéis e no item de recompensa da lista de Missões. Fecha no ✕, no Esc ou clicando fora. Itens antigos mostram "Este item ainda não tem descrição"; missões antigas precisam ganhar a descrição do item pra serem salvas de novo no editor

- Edição dos dados do aluno — na ficha do aluno (Painel do Mestre e Painel ADM), a seção "👤 Dados do aluno" tem ✏️ Alterar pra trocar nome (o que aparece junto do avatar, no ranking e nos painéis), e-mail e turma, com validação de nome e turma obrigatórios e e-mail válido. Cada professor só edita os próprios alunos; o ADM edita qualquer um
- Troca de casa pelo professor/ADM — na seção Cadastro da ficha do aluno, a casa é um seletor: trocar move o aluno na hora (ranking, pontos das casas, contagem por casa e comunicados por casa). Se o aluno ainda estava escolhendo a casa no primeiro acesso, a escolha do professor vale e ele segue direto pro avatar

- Busca e paginação nos painéis — no Painel do Mestre e no Painel ADM, alunos podem ser buscados por nome, nível ("Nv 3", "nível 3" ou só "3") ou casa ("Ignis", "Casa Noctis"); missões por nome, raridade ou item (mesma busca da tela de Missões do aluno); no ADM, professores por nome ou e-mail. Tudo sem diferenciar maiúsculas/acentos e paginado de 10 em 10; ao buscar, volta pra página 1
- Paginação de mensagens — página Mensagens do aluno (10 por página), mensagens enviadas na ficha do aluno e histórico de comunicados do professor (5 por página)

- Ícone próprio pra cada item — o professor escolhe o emoji do item no seletor (no item de recompensa do editor de missão e no "Dar item" da ficha do aluno). O ícone aparece no inventário, nas ofertas, na venda, no perfil dos colegas, na ficha do aluno, na lista de missões e no baú da tela de vitória. Itens criados antes disso continuam com o ícone da raridade (🔹🔷💠👑)

- Tutorial de primeiro acesso com o **Mago Danilo** — o aluno vê o tour da Academia ao entrar pela primeira vez (depois de escolher casa e avatar) e o professor vê o tour do Painel do Mestre (o ADM ganha um passo sobre o Painel ADM). Quem apresenta é o Mago Danilo, desenhado em SVG como o Ceifador (`components/WizardDanilo.tsx`): chapéu pontudo com lua e estrela, óculos redondos de programador, barba longa, túnica estrelada e cajado com orbe mágico. Num céu estrelado ele entra flutuando sobre um círculo mágico girando, pisca, acena, o orbe pulsa e o cajado solta um clarão a cada passo; a fala aparece num balão de quadrinho sendo "digitada" (a boca mexe enquanto isso; clicar no balão mostra tudo) e, com o som ligado (🔊/🔇, mesma preferência das cenas), toca um "plim" mágico e a voz dele lê a fala. Dá pra pular (botão, Esc), navegar com ← → e rever pelo ❓ Tutorial. O "já viu" fica salvo no cadastro (`tutorialDone`). Os textos, na voz do mago, ficam em `engine/tutorial.ts`

- Vários professores — cada aluno escolhe o professor no cadastro e só vê as missões desse professor. No Painel do Mestre, cada professor só vê, cria e altera as próprias missões e só vê e altera os próprios alunos (ficha, itens, acesso, mensagens, comunicados). Alunos e missões de antes dessa versão ficam com o Professor Danilo
- Painel ADM (`/admin`, com as credenciais do Professor Danilo) — cadastra, edita e exclui professores (o ADM não pode ser excluído; ao excluir um professor, os alunos e as missões dele passam pra outro professor escolhido na hora), vê todos os alunos e todas as missões com filtro por professor, troca o professor de um aluno, cria/edita/exclui qualquer missão (escolhendo o professor dono) e tem na ficha de qualquer aluno as mesmas ações do professor (dar/excluir itens, alterar acesso, mensagens, excluir aluno)
- Comunicados — no Painel do Mestre, o professor envia um aviso/mensagem pra todos os seus alunos ou pra todos os seus alunos de uma casa; cada aluno recebe no sino e em Mensagens, com o selo "📢 Toda a turma" ou "🏠 Casa X", e o professor vê quantos já leram

- Economia de itens — todo item tem um valor em moedas e, se for consumível, uma quantidade de XP. No Inventário o aluno pode: ✨ **Usar** (o item some e ele ganha o XP — pode até subir de nível, com a cena animada), 💰 **Vender pro sistema** (recebe o valor na hora), 🤝 **Vender pra um colega** (escolhe o colega e o preço; o item fica reservado até o colega comprar — se tiver moedas — ou recusar, e aí volta) e 🗑 **Excluir** (com confirmação). Ofertas recebidas aparecem no topo do Inventário e com contador no menu
- Professor define o valor e o XP de cada item — no editor de missão (item de recompensa) e no "Dar item" da ficha do aluno; escolhendo um item de missão da lista, raridade/valor/XP já vêm preenchidos. Itens criados antes disso ganham valor pela raridade (Comum 10, Raro 30, Épico 80, Lendário 200) e não são consumíveis
- Contas de aluno com login e senha — a tela de login aparece sempre que alguém entra na plataforma (a sessão fica no sessionStorage e dura só enquanto a aba está aberta). "Criar conta" permite cadastrar quantos alunos quiser no mesmo navegador, com validação de login repetido, senha mínima de 4 caracteres e confirmação de senha. O botão 🚪 Sair no cabeçalho da Academia troca de conta. O login é sempre minúsculo e sem espaços/acentos
- Acesso do aluno no painel do professor — a ficha mostra o login e a senha (escondida, com 👁 pra mostrar) e o professor pode alterar os dois. Alunos cadastrados antes dessa versão ganham um login tirado do e-mail e ficam sem senha até o professor definir uma
- Colegas de casa — no ranking de Minha Casa cada colega aparece com o avatar, o XP e as moedas; clicando, abre o perfil com avatar animado, nome, nível, moedas e itens
- Ficha do Personagem — no Inventário, o cartão do aluno abre a ficha: avatar grande flutuando com o brilho da casa, nível, XP total adquirido, moedas, missões concluídas, progresso até o próximo nível, identificação (nome, e-mail, turma, casa, data de entrada), itens por raridade e o visual do avatar. Fecha no ✕, no Esc ou clicando fora
- Avatar redesenhado — personagem com orelhas, sombreamento, olhos com íris colorida e brilho, sobrancelhas e boca que mudam com a expressão, e roupa (túnica, moletom, manto de mago ou armadura). Acessórios: óculos (redondo, de programador, escuro, visor futurista, monóculo, tapa-olho) e chapéus (mago, coroa, boné gamer, elmo, pirata, fones gamer). Alunos cadastrados antes continuam funcionando: o avatar antigo é convertido na leitura
- Cadastro multi-aluno no mesmo navegador (mesmo padrão do Rejuvenation Lab Simulator), com "aluno ativo"
- Progressão de XP crescente: do nível 1 pro 2 são 500 XP, e cada nível seguinte pede 150 XP a mais que o anterior (500 → 650 → 800 → 950 → … → 1.850 no nível 10 → 5.450 no nível 34). Estouro de nível tratado corretamente (pode subir mais de um nível de uma vez) — ver `xpToNextLevel()` em `students.ts`
- Painel do professor mostra quantos alunos há em cada uma das 4 casas
- Quiz funcional com 4 missões e 2 perguntas cada, feedback certo/errado, explicação, recompensas reais aplicadas ao aluno
- Telas animadas de fim de missão — vitória: baú tremendo e abrindo, raios de luz, item subindo, confete, título dourado e XP/moedas contando; derrota: corte de foice, tela tremendo, vinheta vermelha, o Ceifador flutuando com a foice balançando e "VOCÊ MORREU". As animações ficam em `globals.css` (classes `cg-anim-*`) e respeitam a opção de reduzir movimento do sistema. Na derrota também toca som: corte da foice, estrondo, zumbido sombrio e a voz grave da Morte rindo "Rá, rá, rá… Você morreu!" — tudo gerado no navegador (sem arquivo de áudio), com botão 🔊/🔇 na tela que fica salvo por navegador
- Música de fundo estilo RPG medieval (flauta, alaúde, baixo, tambor e eco de salão, em ré dórico) — começa sozinha ao entrar na Academia, fica em loop e continua ao trocar de página; o botão 🎶 ao lado do sino desliga/liga. Nas cenas de derrota, vitória e subir de nível a música pausa (pra dar lugar ao som da cena) e volta do mesmo ponto quando a cena fecha. Desligar vale pra aba atual (sessionStorage): numa nova entrada na plataforma a música volta a tocar. Se o navegador bloquear som antes de qualquer interação (ex.: recarregou a página), ela começa no primeiro clique/tecla.
- Sons das cenas — vitória: rufar de caixa enquanto o baú treme, "tan-tan-tan-TAAAN" de trompetes com prato quando a tampa abre, "bling" de moeda em cada recompensa e acorde final em Dó maior; subir de nível: subida mágica, sinos quando o número troca, arpejos 8 bits e acorde final brilhante. Todas as cenas têm o botão 🔊/🔇 (mesma preferência)
- Cena de subir de nível — depois de coletar as recompensas, se o XP fez o aluno subir: brasão hexagonal com anéis girando, ondas de choque, o número do nível antigo sai e o novo entra, faíscas subindo, "SUBIU DE NÍVEL!" e a lista das missões que acabaram de ser desbloqueadas (avisa também quando sobe vários níveis de uma vez)
- Mensagens do professor pro aluno — na ficha do aluno, "Enviar mensagem" (tipo Aviso ou Mensagem); o professor vê o histórico e se cada uma já foi lida. O aluno recebe no sino 🔔 do cabeçalho (contador de não lidas + últimas 5) e na página Minha Casa → Mensagens, onde pode marcar como lida
- Exclusão de aluno pelo professor (com confirmação) — apaga o aluno, o progresso e as mensagens dele; se era o aluno logado naquele navegador, ele é deslogado
- Ficha do aluno no painel do professor — clicando no aluno, abre avatar, dados de cadastro, casa, nível/XP/moedas, missões concluídas e inventário completo; o professor pode **dar itens** (nome + raridade, com sugestões dos itens das missões) e **excluir itens** (com confirmação)
- Busca de missões na tela de Missões — por nome, raridade ou item de recompensa, sem diferenciar maiúsculas/acentos ("epico" acha "Épico"), combinada com os filtros Todas/Ativas/Concluídas
- Paginação de missões (10 por página) — a busca e os filtros rodam sobre todas as missões antes de paginar, então encontram missões de qualquer página; ao buscar ou trocar de filtro, volta pra página 1
- Ranking da Casa com dados reais dos alunos cadastrados (não é mockado) — se só você tiver cadastrado, aparece só você
- Painel do professor com **criar/editar/excluir missões** de verdade (perguntas dinâmicas, adiciona/remove à vontade) — persistido em localStorage, semeado com as 4 missões originais na primeira vez
- Testado com ts-node fora do navegador: casas, missões, addXp (incluindo estouro múltiplo de nível), aplicação de recompensas, e o CRUD completo de missões (criar, editar sem mudar o id, excluir) — 23/23 verificações passaram no total

## O que ainda não existe (próximos passos sugeridos)

- Persistência real (hoje é 100% localStorage, por dispositivo/navegador — sem backend, sem sincronização entre alunos/professor; uma missão criada pelo professor num navegador não aparece pros alunos em outro dispositivo)
- Mais missões/quizzes de exemplo
- Autenticação real (o login de aluno e de professor aqui são simplificados: as senhas ficam em texto puro no localStorage, justamente pro professor conseguir ver — serve pra demonstração, não pra produção)

## Ajuste: missão concluída não dá pra refazer pra ganhar recompensa de novo

Antes o botão "Refazer Missão" permitia repetir o quiz e ganhar XP/moedas/item toda vez (exploit óbvio). Agora, missão já concluída mostra "👁 Visualizar" — o aluno ainda consegue rever as perguntas e explicações, mas a tela final não mostra nem aplica nenhuma recompensa.
