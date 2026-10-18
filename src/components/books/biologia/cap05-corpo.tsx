"use client";

import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, Label, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";

// ============================================================================
// CAPÍTULO 5 — O CORPO HUMANO (missão "Biologia: O Corpo Humano"): o coração
// batendo com o eletrocardiograma correndo, o caminho do alimento pelo
// sistema digestório, os pulmões enchendo e esvaziando com o diafragma e as
// trocas no alvéolo, a grande e a pequena circulação com o sangue andando e o
// impulso nervoso correndo pelo neurônio.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o coração batendo e o eletrocardiograma
// ---------------------------------------------------------------------------

function HeartArt() {
  const ecg = "M0 230 L60 230 L70 222 L80 230 L95 230 L102 200 L110 262 L118 230 L140 230 L150 220 L165 230 L230 230";
  return (
    <Art viewBox="0 0 460 300" label="Um coração batendo e a linha do eletrocardiograma">
      <defs>
        <radialGradient id="hrt5-g" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#f87171" />
          <stop offset="1" stopColor="#b91c1c" />
        </radialGradient>
        <clipPath id="hrt5-screen">
          <rect x="20" y="190" width="420" height="90" rx="10" />
        </clipPath>
      </defs>
      <circle cx="230" cy="100" r="96" fill="#fecaca" opacity="0.5" className="cg-anim-glow" style={{ "--cg-dur": "1s" } as React.CSSProperties} />
      <g className="cg-anim-beat" style={{ "--cg-dur": "1s" } as React.CSSProperties}>
        {/* vasos de cima: aorta (vermelha), artéria pulmonar e veia cava (azuis) */}
        <path d="M236 70 C236 30 262 14 290 20 C306 24 312 40 300 48" stroke="#dc2626" strokeWidth="18" fill="none" strokeLinecap="round" />
        <path d="M212 70 L206 18" stroke="#2563eb" strokeWidth="16" strokeLinecap="round" />
        <path d="M258 76 C266 56 282 48 300 60" stroke="#3b82f6" strokeWidth="12" fill="none" strokeLinecap="round" />
        <path d="M150 112 C138 60 190 48 228 74 C262 46 320 56 312 112 C306 160 260 184 232 204 C200 182 156 160 150 112 Z" fill="url(#hrt5-g)" stroke="#7f1d1d" strokeWidth="4" />
        <path d="M232 92 C226 130 236 160 232 196" stroke="#7f1d1d" strokeWidth="3" fill="none" opacity="0.6" />
        <path d="M188 96 C200 104 210 120 214 140 M262 100 C276 110 286 126 288 144" stroke="#fca5a5" strokeWidth="3" fill="none" opacity="0.7" />
        <ellipse cx="190" cy="92" rx="14" ry="8" fill="#fff" opacity="0.25" />
      </g>
      {/* o monitor com o eletrocardiograma correndo */}
      <rect x="20" y="190" width="420" height="90" rx="10" fill="#052e16" stroke="#14532d" strokeWidth="3" />
      <g clipPath="url(#hrt5-screen)">
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0;-230 0" dur="2s" repeatCount="indefinite" />
          {[0, 230, 460].map((x) => (
            <path key={x} d={ecg} transform={`translate(${x} 0)`} stroke="#4ade80" strokeWidth="3" fill="none" strokeLinejoin="round" />
          ))}
        </g>
      </g>
      <text x="420" y="212" textAnchor="end" fontSize="16" fontWeight="900" fill="#4ade80" fontFamily="monospace">
        ♥ 72 bpm
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O sistema digestório e o caminho do alimento
// ---------------------------------------------------------------------------

const FOOD_PATH =
  "M150 70 L152 130 L160 192 C190 196 204 222 184 238 C172 248 160 252 150 268 C130 280 190 286 180 300 C170 316 122 302 130 320 C138 338 186 330 176 346 C160 356 130 356 112 350 L104 272 L208 266 L206 352 L162 374 L160 392";

function DigestiveArt() {
  return (
    <Art viewBox="0 0 520 410" label="O sistema digestório, com o alimento descendo da boca até o intestino grosso">
      {/* o contorno do corpo */}
      <circle cx="150" cy="50" r="38" fill="#fde7d3" stroke="#c08a5e" strokeWidth="2" />
      <path d="M134 86 L134 104 L74 116 C60 120 56 140 58 170 L74 390 L226 390 L242 170 C244 140 240 120 226 116 L166 104 L166 86 Z" fill="#fde7d3" stroke="#c08a5e" strokeWidth="2" />
      <path d="M140 64 Q150 72 160 64" stroke="#be185d" strokeWidth="3" fill="none" />
      {/* esôfago */}
      <path d="M150 70 L152 130 L160 192" stroke="#f9a8d4" strokeWidth="9" fill="none" strokeLinecap="round" />
      {/* fígado */}
      <path d="M86 186 C110 168 170 170 182 184 C170 200 150 214 120 222 C100 226 84 212 86 186 Z" fill="#9a3412" stroke="#7c2d12" strokeWidth="2" />
      {/* estômago */}
      <path d="M160 188 C196 176 222 200 214 228 C206 254 168 258 152 242 C146 234 156 226 166 232 C182 240 198 230 196 214 C194 198 174 196 160 202 Z" fill="#fb7185" stroke="#be123c" strokeWidth="2" />
      {/* pâncreas */}
      <path d="M150 256 C170 250 200 250 222 244" stroke="#fde68a" strokeWidth="9" strokeLinecap="round" fill="none" />
      {/* intestino grosso (moldura) e delgado (enrolado) */}
      <path d="M112 350 L104 272 L208 266 L206 352 L162 374 L160 390" stroke="#f59e0b" strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
      <path d="M150 268 C130 280 190 286 180 300 C170 316 122 302 130 320 C138 338 186 330 176 346 C160 356 130 356 112 350" stroke="#fda4af" strokeWidth="9" fill="none" strokeLinecap="round" />
      {/* o bolinho de comida fazendo o caminho */}
      <circle r="7" fill="#78350f" stroke="#451a03" strokeWidth="1.5">
        <animateMotion dur="10s" repeatCount="indefinite" path={FOOD_PATH} />
      </circle>
      <Label x={158} y={66} tx={300} ty={60} size={17}>
        Boca
      </Label>
      <Label x={154} y={130} tx={300} ty={120} size={17}>
        Esôfago
      </Label>
      <Label x={110} y={196} tx={300} ty={168} size={17}>
        Fígado
      </Label>
      <Label x={206} y={214} tx={300} ty={208} size={17}>
        Estômago
      </Label>
      <Label x={214} y={246} tx={300} ty={248} size={17}>
        Pâncreas
      </Label>
      <Label x={176} y={306} tx={300} ty={300} size={17}>
        Intestino delgado
      </Label>
      <Label x={206} y={330} tx={300} ty={342} size={17}>
        Intestino grosso
      </Label>
      <Label x={161} y={384} tx={300} ty={386} size={17}>
        Reto e ânus
      </Label>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A respiração: os pulmões enchendo, o diafragma descendo e as trocas no alvéolo
// ---------------------------------------------------------------------------

function Lung({ side }: { side: -1 | 1 }) {
  const d =
    side < 0
      ? "M150 96 C120 90 92 120 88 170 C84 220 96 246 120 248 C140 250 152 236 154 210 C156 170 156 130 150 96 Z"
      : "M190 96 C220 90 248 120 252 170 C256 220 244 246 220 248 C200 250 188 236 186 210 C184 170 184 130 190 96 Z";
  return (
    <g>
      <path d={d} fill="#fda4af" stroke="#be123c" strokeWidth="2.5" />
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M${170 + side * 12} ${130 + k * 30} C${170 + side * 40} ${136 + k * 30} ${170 + side * 56} ${150 + k * 30} ${170 + side * 66} ${170 + k * 30}`} stroke="#be123c" strokeWidth="1.5" fill="none" opacity="0.6" />
      ))}
    </g>
  );
}

function LungsArt() {
  const loop = { dur: "5s", repeatCount: "indefinite" };
  return (
    <Art viewBox="0 0 540 300" label="Os pulmões enchendo e esvaziando, o diafragma subindo e descendo, e as trocas de gases no alvéolo">
      {/* traqueia e brônquios */}
      <path d="M170 10 L170 104 M170 104 C160 116 152 124 146 140 M170 104 C180 116 188 124 194 140" stroke="#fecdd3" strokeWidth="12" fill="none" strokeLinecap="round" />
      {[24, 40, 56, 72, 88].map((y) => (
        <path key={y} d={`M163 ${y} L177 ${y}`} stroke="#be123c" strokeWidth="2" opacity="0.6" />
      ))}
      {/* os pulmões (crescem a partir do meio do peito, junto com a inspiração) */}
      <g transform="translate(170 150)">
        <animateTransform attributeName="transform" type="scale" values="1 1;1.07 1.1;1 1" dur="5s" repeatCount="indefinite" additive="sum" />
        <g transform="translate(-170 -150)">
          <Lung side={-1} />
          <Lung side={1} />
        </g>
      </g>
      {/* o diafragma */}
      <path d="M70 262 C120 230 220 230 270 262" stroke="#b45309" strokeWidth="7" fill="none" strokeLinecap="round">
        <animate attributeName="d" values="M70 262 C120 230 220 230 270 262;M70 266 C120 254 220 254 270 266;M70 262 C120 230 220 230 270 262" {...loop} />
      </path>
      {/* o ar entrando (azul) e saindo (cinza) */}
      {[0, 0.3, 0.6].map((d) => (
        <circle key={`in${d}`} r="4" fill="#38bdf8">
          <animateMotion path="M170 0 L170 104 L140 170" keyPoints="0;1;1" keyTimes="0;0.5;1" calcMode="linear" dur="5s" begin={`${d - 5}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.45;0.5;1" dur="5s" begin={`${d - 5}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {[0, 0.3, 0.6].map((d) => (
        <circle key={`out${d}`} r="4" fill="#64748b">
          <animateMotion path="M200 170 L170 104 L170 0" keyPoints="0;0;1" keyTimes="0;0.5;1" calcMode="linear" dur="5s" begin={`${d - 5}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.5;0.55;1" dur="5s" begin={`${d - 5}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <g fontFamily="Georgia, serif" fontSize="13" fontWeight="900" textAnchor="middle">
        <text x="170" y="292" fill="#0369a1">
          <animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.46;0.5;0.96;1" {...loop} />
          Inspiração: o diafragma desce e o ar entra
        </text>
        <text x="170" y="292" fill="#475569" opacity="0">
          <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.46;0.5;0.96;1" {...loop} />
          Expiração: o diafragma sobe e o ar sai
        </text>
      </g>
      {/* o alvéolo ampliado */}
      <path d="M200 200 L330 150" stroke="#b08a52" strokeWidth="1.5" strokeDasharray="4 3" />
      <circle cx="420" cy="140" r="96" fill="#fffaf0" stroke="#d9c79d" strokeWidth="2" />
      <circle cx="420" cy="130" r="48" fill="#fecdd3" stroke="#be123c" strokeWidth="2.5" />
      <path d="M340 196 C380 200 460 200 500 190" stroke="#dc2626" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M340 196 C360 197 380 199 400 199" stroke="#2563eb" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.85" />
      {[0, 1].map((k) => (
        <g key={`o${k}`}>
          <animateMotion path="M410 120 L420 192" dur="2.4s" begin={`${k * 1.2 - 2.4}s`} repeatCount="indefinite" />
          <text textAnchor="middle" fontSize="11" fontWeight="900" fill="#b91c1c" fontFamily="Georgia, serif">
            O₂
          </text>
        </g>
      ))}
      {[0, 1].map((k) => (
        <g key={`c${k}`}>
          <animateMotion path="M444 192 L440 120" dur="2.4s" begin={`${0.6 + k * 1.2 - 2.4}s`} repeatCount="indefinite" />
          <text textAnchor="middle" fontSize="11" fontWeight="900" fill="#334155" fontFamily="Georgia, serif">
            CO₂
          </text>
        </g>
      ))}
      <text x="420" y="64" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#9f1239" fontFamily="Georgia, serif">
        Alvéolo
      </text>
      <text x="420" y="226" textAnchor="middle" fontSize="11.5" fill="#5b4a2e" fontFamily="Georgia, serif">
        o sangue pega O₂ e deixa CO₂
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A circulação: pequena (coração ↔ pulmões) e grande (coração ↔ corpo)
// ---------------------------------------------------------------------------

const CIRCUITS: { path: string; color: string; dur: number }[] = [
  { path: "M244 178 C190 150 190 90 228 66", color: "#2563eb", dur: 3 },
  { path: "M292 66 C330 90 330 140 280 156", color: "#dc2626", dur: 3 },
  { path: "M280 190 C390 210 390 268 300 286", color: "#dc2626", dur: 4 },
  { path: "M220 286 C130 268 130 190 238 162", color: "#2563eb", dur: 4 },
];

function CirculationArt() {
  return (
    <Art viewBox="0 0 540 320" label="O sangue saindo do coração para os pulmões e voltando, e saindo do coração para o corpo e voltando">
      {/* pulmões */}
      <g transform="translate(260 46)">
        <path d="M-8 -20 C-40 -26 -60 0 -58 22 C-56 38 -36 40 -14 30 Z" fill="#fda4af" stroke="#be123c" strokeWidth="2" />
        <path d="M8 -20 C40 -26 60 0 58 22 C56 38 36 40 14 30 Z" fill="#fda4af" stroke="#be123c" strokeWidth="2" />
      </g>
      <text x="260" y="14" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#9f1239" fontFamily="Georgia, serif">
        Pulmões
      </text>
      {/* o corpo */}
      <rect x="190" y="270" width="140" height="40" rx="12" fill="#fde7d3" stroke="#c08a5e" strokeWidth="2" />
      <text x="260" y="295" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#7c2d12" fontFamily="Georgia, serif">
        Corpo (células)
      </text>
      {/* os vasos e o sangue andando */}
      {CIRCUITS.map((c, i) => (
        <g key={i}>
          <path d={c.path} stroke={c.color} strokeWidth="8" fill="none" opacity="0.35" strokeLinecap="round" />
          {[0, 1, 2].map((k) => (
            <circle key={k} r="5" fill={c.color} stroke="#fff" strokeWidth="1">
              <animateMotion dur={`${c.dur}s`} begin={`${(k * c.dur) / 3 - c.dur}s`} repeatCount="indefinite" path={c.path} />
            </circle>
          ))}
        </g>
      ))}
      {/* o coração com as 4 cavidades */}
      <g className="cg-anim-beat" style={{ "--cg-dur": "1s" } as React.CSSProperties}>
        <path d="M206 160 C198 118 236 112 260 132 C284 112 322 118 314 160 C308 196 276 210 260 222 C244 210 212 196 206 160 Z" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="3" />
        <path d="M260 132 L260 220 M212 162 L308 162" stroke="#7f1d1d" strokeWidth="2.5" />
        <path d="M212 160 C210 130 236 122 258 136 L258 160 Z M212 164 L258 164 L258 216 C240 206 216 192 212 164 Z" fill="#93c5fd" />
        <path d="M308 160 C310 130 284 122 262 136 L262 160 Z M308 164 L262 164 L262 216 C280 206 304 192 308 164 Z" fill="#fca5a5" />
      </g>
      <g fontFamily="Georgia, serif" fontSize="11.5" fontWeight="700">
        <text x="20" y="60" fill="#1e3a8a">
          Pequena circulação:
        </text>
        <text x="20" y="76" fill="#5b4a2e" fontWeight="400">
          coração → pulmões → coração
        </text>
        <text x="20" y="92" fill="#5b4a2e" fontWeight="400">
          (o sangue pega oxigênio)
        </text>
        <text x="380" y="230" fill="#991b1b">
          Grande circulação:
        </text>
        <text x="380" y="246" fill="#5b4a2e" fontWeight="400">
          coração → corpo → coração
        </text>
        <text x="380" y="262" fill="#5b4a2e" fontWeight="400">
          (entrega oxigênio às células)
        </text>
        <circle cx="390" cy="60" r="6" fill="#dc2626" />
        <text x="400" y="64" fill="#991b1b">
          rico em oxigênio
        </text>
        <circle cx="390" cy="82" r="6" fill="#2563eb" />
        <text x="400" y="86" fill="#1e3a8a">
          rico em gás carbônico
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O neurônio, com o impulso nervoso correndo
// ---------------------------------------------------------------------------

function NeuronArt() {
  const impulse = "M40 70 L66 92 C120 100 200 92 300 102 C360 108 420 98 470 100 L510 80";
  return (
    <Art viewBox="0 0 540 190" label="Um neurônio com dendritos, corpo celular, axônio e terminações, e o impulso nervoso passando">
      {/* dendritos */}
      {["M70 98 L40 70 L20 76 M40 70 L36 46", "M76 84 L70 50 L54 34 M70 50 L86 28", "M74 112 L48 136 L26 132 M48 136 L44 160", "M92 118 L96 150 L80 170 M96 150 L118 166"].map((d) => (
        <path key={d} d={d} stroke="#a855f7" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {/* corpo celular e núcleo */}
      <circle cx="84" cy="100" r="28" fill="#d8b4fe" stroke="#7e22ce" strokeWidth="3" />
      <circle cx="84" cy="100" r="11" fill="#7e22ce" />
      {/* axônio com a bainha de mielina */}
      <path d="M110 100 C200 92 300 104 470 100" stroke="#a855f7" strokeWidth="5" fill="none" />
      {[140, 200, 260, 320, 380, 430].map((x) => (
        <rect key={x} x={x} y="91" width="44" height="18" rx="9" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
      ))}
      {/* terminações */}
      {["M470 100 L506 76", "M470 100 L512 100", "M470 100 L506 124"].map((d, i) => (
        <g key={d}>
          <path d={d} stroke="#a855f7" strokeWidth="4" fill="none" />
          <circle cx={[506, 512, 506][i]} cy={[76, 100, 124][i]} r="6" fill="#c084fc" stroke="#7e22ce" strokeWidth="1.5" />
        </g>
      ))}
      {/* o impulso */}
      <g>
        <animateMotion dur="2.2s" repeatCount="indefinite" path={impulse} />
        <circle r="12" fill="#fde047" opacity="0.4" />
        <circle r="6" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
      </g>
      <Label x={36} y={50} tx={20} ty={18} size={12}>
        Dendritos
      </Label>
      <Label x={96} y={120} tx={110} ty={176} size={12}>
        Corpo celular
      </Label>
      <Label x={250} y={98} tx={240} ty={150} anchor="middle" size={12}>
        Axônio (com bainha de mielina)
      </Label>
      <Label x={490} y={88} tx={430} ty={30} anchor="end" size={12}>
        Terminações
      </Label>
      <text x="400" y="182" textAnchor="middle" fontSize="12" fill="#a16207" fontWeight="700" fontFamily="Georgia, serif">
        ⚡ o impulso nervoso → até 120 metros por segundo!
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 5, content, bare });

export const chapter5: BookPage[] = [
  page(
    <ChapterOpener
      n={5}
      title="O Corpo Humano"
      goals={["O caminho do alimento na digestão", "Como respiramos e o que acontece nos alvéolos", "Como o coração e o sangue levam oxigênio ao corpo", "O sistema nervoso, os ossos e os rins"]}
    >
      <Fig h={34}>
        <HeartArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🍽️">O sistema digestório</H>
      <P>
        Digerir é <T>quebrar o alimento</T> em pedacinhos tão pequenos (os nutrientes) que conseguem passar para o sangue. A digestão começa na <T>boca</T>: os dentes trituram e
        a saliva já começa a quebrar o amido. Pelo <T>esôfago</T>, o alimento chega ao <T>estômago</T>, onde o suco gástrico, bem ácido, digere as proteínas.
      </P>
      <Fig n="5.1" caption="Siga o bolinho de comida: da boca ao intestino grosso, ele percorre cerca de 9 metros!" h={36}>
        <DigestiveArt />
      </Fig>
      <P>
        No <T>intestino delgado</T>, com a ajuda da bile (do <T>fígado</T>) e do suco pancreático (do <T>pâncreas</T>), a digestão termina, e os nutrientes são <T>absorvidos</T>{" "}
        pelas vilosidades, dobrinhas que aumentam a superfície. O <T>intestino grosso</T> absorve principalmente a água, e o que sobra forma as fezes.
      </P>
    </>,
  ),

  page(
    <>
      <H icon="💨">A respiração</H>
      <P>
        Respiramos cerca de <T>20 mil vezes por dia</T>! Na <T>inspiração</T>, o diafragma (um músculo embaixo dos pulmões) desce, o peito se expande e o ar entra pelo nariz,
        passa pela traqueia e pelos brônquios e chega aos pulmões. Na <T>expiração</T>, o diafragma sobe e o ar sai.
      </P>
      <Fig n="5.2" caption="Os pulmões enchem e esvaziam com o movimento do diafragma. No alvéolo, o oxigênio passa para o sangue e o gás carbônico sai dele." h={30}>
        <LungsArt />
      </Fig>
      <P>
        A troca de gases acontece nos <T>alvéolos</T>, saquinhos minúsculos cercados de vasos sanguíneos. O <T>oxigênio</T> passa do ar para o sangue, e o <T>gás carbônico</T>,
        que as células produziram, passa do sangue para o ar, para ser expirado.
      </P>
      <Box kind="sabia">Se abríssemos todos os alvéolos dos dois pulmões, eles cobririam uma área parecida com a de uma quadra de tênis!</Box>
    </>,
  ),

  page(
    <>
      <H icon="❤️">O coração e a circulação</H>
      <P>
        O <T>coração</T> é um músculo do tamanho de uma mão fechada, que bate cerca de 70 vezes por minuto, a vida inteira. Ele tem <T>quatro cavidades</T> e bombeia o sangue
        por dois caminhos:
      </P>
      <Fig n="5.3" caption="Vermelho: sangue rico em oxigênio. Azul: sangue rico em gás carbônico." h={30}>
        <CirculationArt />
      </Fig>
      <P>
        As <T>artérias</T> levam o sangue que sai do coração; as <T>veias</T> trazem o sangue de volta; e os <T>capilares</T>, finíssimos, fazem as trocas com as células. No
        sangue existem:
      </P>
      <Cards
        items={[
          { icon: "🔴", title: "Hemácias", text: "Glóbulos vermelhos: levam o oxigênio, preso à hemoglobina." },
          { icon: "⚪", title: "Leucócitos", text: "Glóbulos brancos: o exército de defesa do corpo." },
          { icon: "🧷", title: "Plaquetas", text: "Fecham os machucados, formando o coágulo." },
          { icon: "💧", title: "Plasma", text: "A parte líquida, que leva nutrientes e hormônios." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🧠">Sistema nervoso, ossos e rins</H>
      <P>
        O <T>sistema nervoso</T> comanda o corpo. O <T>cérebro</T> e a <T>medula espinhal</T> formam o sistema nervoso central; os <T>nervos</T> levam as mensagens até cada
        parte do corpo. Essas mensagens são impulsos elétricos que viajam pelos <T>neurônios</T>.
      </P>
      <Fig n="5.4" caption="O impulso nervoso entra pelos dendritos e corre pelo axônio até as terminações, onde passa para a próxima célula." h={22}>
        <NeuronArt />
      </Fig>
      <Cards
        items={[
          { icon: "🦴", title: "Esqueleto", text: "Cerca de 206 ossos no adulto: sustentam, protegem os órgãos e fabricam o sangue (na medula óssea)." },
          { icon: "💪", title: "Músculos", text: "Mais de 600! Puxam os ossos para nos mexermos. O coração também é músculo." },
          { icon: "⚗️", title: "Rins", text: "Filtram o sangue e tiram o que sobra, formando a urina, que vai para a bexiga." },
          { icon: "👁️", title: "Sentidos", text: "Visão, audição, olfato, paladar e tato mandam informações para o cérebro." },
        ]}
      />
      <Box kind="mago">Puxe a mão rápido ao encostar numa panela quente: isso é um <strong>reflexo</strong>. A medula responde antes mesmo de o cérebro perceber a dor!</Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Digestão: boca → esôfago → estômago → intestino delgado (absorve os nutrientes) → intestino grosso (absorve a água).",
          "Na respiração, o diafragma desce (inspiração) e sobe (expiração); as trocas de gases acontecem nos alvéolos.",
          "O coração bombeia o sangue pela pequena circulação (pulmões) e pela grande circulação (corpo).",
          "Hemácias levam oxigênio, leucócitos defendem e plaquetas fazem a coagulação.",
          "O sistema nervoso usa neurônios; os rins filtram o sangue e formam a urina.",
        ]}
      />
      <Glossary
        items={[
          ["Vilosidades", "Dobrinhas do intestino delgado que absorvem os nutrientes."],
          ["Alvéolo", "Saquinho do pulmão onde acontece a troca de gases."],
          ["Artéria", "Vaso que leva o sangue do coração para o corpo."],
          ["Veia", "Vaso que traz o sangue de volta ao coração."],
          ["Neurônio", "Célula do sistema nervoso que conduz o impulso elétrico."],
        ]}
      />
      <Quiz
        items={[
          ["Onde a maior parte dos nutrientes é absorvida?", "No intestino delgado."],
          ["Onde acontece a troca de oxigênio e gás carbônico?", "Nos alvéolos dos pulmões."],
          ["Qual é a função das hemácias?", "Transportar o oxigênio pelo corpo."],
          ["Qual órgão filtra o sangue e produz a urina?", "Os rins."],
        ]}
      />
    </>,
  ),
];
