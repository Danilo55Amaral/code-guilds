# CodeGuilds

Academia de código gamificada para suas turmas — 4 casas, missões em formato quiz, XP, moedas e itens.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000 — o fluxo de primeiro acesso te leva por: cadastro → escolha de casa → criação de avatar → academia.

## Fluxo completo

1. `/entrar` — cadastro (nome, e-mail, turma)
2. `/casa-selecao` — Passo 1/3, escolhe uma das 4 casas
3. `/avatar` — Passo 2/3, editor de avatar em abas: pele e olhos, cabelo, rosto, roupa e acessórios (óculos e chapéus), com miniaturas de cada opção e botão 🎲 Aleatório
4. `/academia/missoes` — lista de missões/quizzes, desbloqueadas por nível
5. `/academia/inventario` — itens ganhos nas missões
6. `/academia/casa` — painel da casa, pontos das 4 casas, ranking real dos colegas cadastrados no mesmo navegador
7. `/academia/casa/mensagens` — submenu de "Minha Casa": avisos e mensagens do professor (o sino 🔔 no cabeçalho mostra as não lidas)
8. `/academia/guildas`, `/academia/lore`, `/academia/eventos` — ainda em construção (só mostram "em breve"): história de cada casa, modo história e próximos eventos
9. `/professor` → `/professor/painel` — login e painel do professor (credenciais de demo abaixo)

**Login do professor (demo):** `danilo@codeguilds.com` / `prof123`, ou o código mestre `KAIROIS2024` (funciona nos dois campos).

## Estrutura

```
src/
  engine/
    houses.ts     -> as 4 casas (cores, lema, brasão)
    missions.ts    -> missões e seus quizzes (dados estáticos, editados em código por enquanto)
    students.ts     -> cadastro de aluno, XP/nível/moedas, inventário
    avatar.ts       -> opções do avatar (10 tons de pele, 8 cores de olhos, 9 cabelos, 11 cores de cabelo, 4 expressões, 6 detalhes de rosto, 4 roupas, 8 cores de roupa, 7 óculos, 7 chapéus) + conversão de avatares salvos no formato antigo
    missionsStore.ts  -> CRUD de missões em localStorage (semeado com as 4 padrão)
    messages.ts       -> mensagens/avisos do professor pro aluno, com status de lida (localStorage)
    sfx.ts            -> sons das cenas gerados no navegador (Web Audio + voz sintetizada): risada da Morte, fanfarra de vitória, jingle de nível; e a preferência de som/mudo
    music.ts          -> música de fundo medieval da Academia, composta e tocada via Web Audio (loop de ~30s)
    store.ts          -> hooks useStudents(), useMissions() e useMessages() — mesmo padrão do usePeople() do Rejuvenation Lab Simulator
  components/
    Avatar.tsx        -> avatar em SVG puro, montado em camadas (cabelo de trás, roupa, rosto, olhos/boca, cabelo da frente, óculos, chapéu)
    GameUI.tsx         -> XPBar, badges de raridade/dificuldade
    QuizModal.tsx       -> o quiz em si (pergunta, feedback) — decide qual tela de resultado mostrar
    MissionResult.tsx   -> telas animadas de fim de missão: vitória (baú + confete) e derrota (Ceifador)
    LevelUpScreen.tsx   -> cena animada de subir de nível (brasão, número trocando, missões desbloqueadas)
    SceneSound.tsx      -> useSceneSound() + botão 🔊/🔇: pausa a música de fundo, toca o som da cena e retoma ao fechar
    AcademyHeader.tsx, AcademySidebar.tsx -> layout da Academia
    ComingSoon.tsx      -> placeholder "em breve" das telas ainda não construídas
    Pagination.tsx      -> controles de paginação (Anterior/números/Próxima), reutilizável
    StudentDetails.tsx  -> ficha do aluno no painel do professor (dados, avatar, inventário, dar/excluir item, enviar mensagem, excluir aluno)
    NotificationBell.tsx -> sino de notificações do cabeçalho da Academia
    MusicToggle.tsx     -> botão 🎶 ao lado do sino que liga/desliga a música de fundo
  app/
    entrar/, casa-selecao/, avatar/  -> onboarding
    academia/missoes|inventario|casa -> as 3 telas principais (layout compartilhado)
    academia/guildas|lore|eventos    -> placeholders "em breve" (mesmo layout)
    professor/, professor/painel/    -> área do professor
public/
  crests/  -> os 4 brasões das casas (ignis, noctis, flavus, sapientia)
```

## O que já funciona de verdade

- Avatar redesenhado — personagem com orelhas, sombreamento, olhos com íris colorida e brilho, sobrancelhas e boca que mudam com a expressão, e roupa (túnica, moletom, manto de mago ou armadura). Acessórios: óculos (redondo, de programador, escuro, visor futurista, monóculo, tapa-olho) e chapéus (mago, coroa, boné gamer, elmo, pirata, fones gamer). Alunos cadastrados antes continuam funcionando: o avatar antigo é convertido na leitura
- Cadastro multi-aluno no mesmo navegador (mesmo padrão do Rejuvenation Lab Simulator), com "aluno ativo"
- Progressão de XP com estouro de nível tratado corretamente (pode subir mais de um nível de uma vez)
- Quiz funcional com 4 missões e 2 perguntas cada, feedback certo/errado, explicação, recompensas reais aplicadas ao aluno
- Telas animadas de fim de missão — vitória: baú tremendo e abrindo, raios de luz, item subindo, confete, título dourado e XP/moedas contando; derrota: corte de foice, tela tremendo, vinheta vermelha, o Ceifador flutuando com a foice balançando e "VOCÊ MORREU". As animações ficam em `globals.css` (classes `cg-anim-*`) e respeitam a opção de reduzir movimento do sistema. Na derrota também toca som: corte da foice, estrondo, zumbido sombrio e a voz grave da Morte rindo "Rá, rá, rá… Você morreu!" — tudo gerado no navegador (sem arquivo de áudio), com botão 🔊/🔇 na tela que fica salvo por navegador
- Música de fundo estilo RPG medieval (flauta, alaúde, baixo, tambor e eco de salão, em ré dórico) — começa sozinha ao entrar na Academia, fica em loop e continua ao trocar de página; o botão 🎶 ao lado do sino desliga/liga. Nas cenas de derrota, vitória e subir de nível a música pausa (pra dar lugar ao som da cena) e volta do mesmo ponto quando a cena fecha.
- Sons das cenas — vitória: rufar de caixa enquanto o baú treme, "tan-tan-tan-TAAAN" de trompetes com prato quando a tampa abre, "bling" de moeda em cada recompensa e acorde final em Dó maior; subir de nível: subida mágica, sinos quando o número troca, arpejos 8 bits e acorde final brilhante. Todas as cenas têm o botão 🔊/🔇 (mesma preferência) Desligar vale pra aba atual (sessionStorage): numa nova entrada na plataforma a música volta a tocar. Se o navegador bloquear som antes de qualquer interação (ex.: recarregou a página), ela começa no primeiro clique/tecla
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
- Autenticação real (o login de aluno e de professor aqui são simplificados, sem senha de verdade pro aluno)

## Ajuste: missão concluída não dá pra refazer pra ganhar recompensa de novo

Antes o botão "Refazer Missão" permitia repetir o quiz e ganhar XP/moedas/item toda vez (exploit óbvio). Agora, missão já concluída mostra "👁 Visualizar" — o aluno ainda consegue rever as perguntas e explicações, mas a tela final não mostra nem aplica nenhuma recompensa.
