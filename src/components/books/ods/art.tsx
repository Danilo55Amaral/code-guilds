"use client";

// ============================================================================
// AS PEÇAS DE DESENHO DO LIVRO DE ODS — os 17 objetivos com as cores
// oficiais da ONU, o quadradinho de cada ODS, o planeta, a árvore, a nuvem e
// a pessoinha, que vários capítulos usam.
// ============================================================================

/** Os 17 ODS: número, nome curto, cor oficial, ícone e o que cada um quer. */
export const ODS_GOALS = [
  { n: 1, name: "Erradicação da pobreza", short: "Sem pobreza", color: "#e5243b", icon: "🏘️", goal: "Acabar com a pobreza em todas as suas formas, em todos os lugares." },
  { n: 2, name: "Fome zero e agricultura sustentável", short: "Fome zero", color: "#dda63a", icon: "🌾", goal: "Acabar com a fome e promover uma agricultura que não destrua a natureza." },
  { n: 3, name: "Saúde e bem-estar", short: "Saúde", color: "#4c9f38", icon: "❤️", goal: "Garantir vida saudável e bem-estar para todas as pessoas, de todas as idades." },
  { n: 4, name: "Educação de qualidade", short: "Educação", color: "#c5192d", icon: "📚", goal: "Garantir que todas as crianças e jovens tenham uma escola boa, inclusiva e gratuita." },
  { n: 5, name: "Igualdade de gênero", short: "Igualdade de gênero", color: "#ff3a21", icon: "🙋", goal: "Acabar com a discriminação e a violência contra mulheres e meninas." },
  { n: 6, name: "Água potável e saneamento", short: "Água", color: "#26bde2", icon: "💧", goal: "Garantir água limpa e saneamento básico para todos." },
  { n: 7, name: "Energia limpa e acessível", short: "Energia limpa", color: "#fcc30b", icon: "☀️", goal: "Garantir energia limpa, moderna e barata para todo mundo." },
  { n: 8, name: "Trabalho decente e crescimento econômico", short: "Trabalho decente", color: "#a21942", icon: "💼", goal: "Emprego digno para todos, sem trabalho infantil nem trabalho forçado." },
  { n: 9, name: "Indústria, inovação e infraestrutura", short: "Inovação", color: "#fd6925", icon: "🏭", goal: "Construir estradas, internet e indústrias que funcionem sem destruir o planeta." },
  { n: 10, name: "Redução das desigualdades", short: "Menos desigualdade", color: "#dd1367", icon: "🤲", goal: "Incluir todas as pessoas, qualquer que seja a idade, o gênero, a raça, a deficiência ou a renda." },
  { n: 11, name: "Cidades e comunidades sustentáveis", short: "Cidades", color: "#fd9d24", icon: "🏙️", goal: "Cidades seguras e verdes, com transporte público, parques e moradia digna." },
  { n: 12, name: "Consumo e produção responsáveis", short: "Consumo", color: "#bf8b2e", icon: "♻️", goal: "Desperdiçar menos, reaproveitar mais e produzir sem esgotar a natureza." },
  { n: 13, name: "Ação contra a mudança global do clima", short: "Clima", color: "#3f7e44", icon: "🌡️", goal: "Tomar medidas urgentes contra a mudança do clima e seus impactos." },
  { n: 14, name: "Vida na água", short: "Vida na água", color: "#0a97d9", icon: "🐟", goal: "Proteger os oceanos, os rios e os animais que vivem neles." },
  { n: 15, name: "Vida terrestre", short: "Vida na terra", color: "#56c02b", icon: "🌳", goal: "Proteger as florestas, a biodiversidade e combater a desertificação." },
  { n: 16, name: "Paz, justiça e instituições eficazes", short: "Paz e justiça", color: "#00689d", icon: "🕊️", goal: "Sociedades pacíficas, com justiça para todos e governos honestos." },
  { n: 17, name: "Parcerias e meios de implementação", short: "Parcerias", color: "#19486a", icon: "🤝", goal: "Países, empresas e pessoas trabalhando juntos para cumprir todos os outros." },
] as const;

/** O quadradinho de um ODS (número, ícone e a cor oficial), com o canto em (x, y). */
export function GoalTile({ n, x, y, s = 44 }: { n: number; x: number; y: number; s?: number }) {
  const g = ODS_GOALS[n - 1];
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={s} height={s} rx={s * 0.12} fill={g.color} />
      <text x={s * 0.1} y={s * 0.3} fontSize={s * 0.26} fontWeight="900" fill="#fff" fontFamily="Georgia, serif">
        {n}
      </text>
      <text x={s * 0.55} y={s * 0.75} textAnchor="middle" fontSize={s * 0.4}>
        {g.icon}
      </text>
    </g>
  );
}

/** O planeta Terra visto de longe, com os continentes girando devagar. */
export function Globe({ x, y, r = 50 }: { x: number; y: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <clipPath id={`ods-globo-${r}`}>
          <circle r={r} />
        </clipPath>
      </defs>
      <circle r={r} fill="#38bdf8" />
      <g clipPath={`url(#ods-globo-${r})`}>
        <g>
          <animateTransform attributeName="transform" type="translate" values={`0 0;${-r * 2} 0`} dur="16s" repeatCount="indefinite" />
          {[0, r * 2].map((dx) => (
            <g key={dx} transform={`translate(${dx} 0)`} fill="#22c55e">
              <path d={`M${-r * 0.6} ${-r * 0.5} q${r * 0.3} ${-r * 0.3} ${r * 0.6} 0 q${r * 0.1} ${r * 0.4} ${-r * 0.2} ${r * 0.6} q${-r * 0.4} ${r * 0.1} ${-r * 0.4} ${-r * 0.6} Z`} />
              <path d={`M${r * 0.1} ${r * 0.1} q${r * 0.4} ${-r * 0.2} ${r * 0.6} ${r * 0.2} q${-r * 0.1} ${r * 0.5} ${-r * 0.4} ${r * 0.5} q${-r * 0.2} ${-r * 0.3} ${-r * 0.2} ${-r * 0.7} Z`} />
              <path d={`M${r * 0.7} ${-r * 0.6} q${r * 0.3} 0 ${r * 0.4} ${r * 0.3} q${-r * 0.2} ${r * 0.2} ${-r * 0.4} 0 Z`} />
            </g>
          ))}
        </g>
      </g>
      <circle r={r} fill="none" stroke="#0c4a6e" strokeWidth="2.5" />
      <ellipse cx={-r * 0.35} cy={-r * 0.4} rx={r * 0.25} ry={r * 0.12} fill="#fff" opacity="0.35" />
    </g>
  );
}

/** Uma árvore (o pé no chão em x, y). */
export function Tree({ x, y, s = 1, color = "#16a34a" }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-5" y="-34" width="10" height="34" rx="3" fill="#92400e" />
      <circle cy="-48" r="22" fill={color} />
      <circle cx="-14" cy="-38" r="14" fill={color} />
      <circle cx="14" cy="-38" r="14" fill={color} />
      <circle cx="-6" cy="-56" r="8" fill="#fff" opacity="0.15" />
    </g>
  );
}

/** Uma nuvem (o centro em x, y). */
export function Cloud({ x, y, s = 1, color = "#fff" }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={color}>
      <ellipse cx="0" cy="6" rx="34" ry="14" />
      <circle cx="-14" cy="0" r="14" />
      <circle cx="8" cy="-6" r="18" />
    </g>
  );
}

/** Uma pessoinha simples (o pé no chão em x, y), com a cor da roupa. */
export function Kid({ x, y, s = 1, shirt = "#2563eb", skin = "#d6a77a", hair = "#3f2a14" }: { x: number; y: number; s?: number; shirt?: string; skin?: string; hair?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-6 0 L-5 -20 M6 0 L5 -20" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
      <rect x="-11" y="-44" width="22" height="26" rx="7" fill={shirt} />
      <path d="M-11 -38 L-18 -22 M11 -38 L18 -22" stroke={skin} strokeWidth="5" strokeLinecap="round" />
      <circle cy="-54" r="11" fill={skin} />
      <path d="M-11 -56 Q-10 -68 0 -67 Q10 -68 11 -56 Q6 -62 0 -61 Q-6 -62 -11 -56 Z" fill={hair} />
      <circle cx="-4" cy="-54" r="1.4" fill="#1e293b" />
      <circle cx="4" cy="-54" r="1.4" fill="#1e293b" />
      <path d="M-3.5 -49.5 Q0 -47 3.5 -49.5" stroke="#1e293b" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** O Sol com os raios girando (o centro em x, y). */
export function Sun({ x, y, r = 22 }: { x: number; y: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="20s" repeatCount="indefinite" />
        {Array.from({ length: 10 }, (_, i) => (
          <line key={i} x1="0" y1={-r - 4} x2="0" y2={-r - 12} stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" transform={`rotate(${i * 36})`} />
        ))}
      </g>
      <circle r={r} fill="#fde047" stroke="#f59e0b" strokeWidth="2" />
    </g>
  );
}
