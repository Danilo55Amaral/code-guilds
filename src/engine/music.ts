// ============================================================================
// MUSIC — trilha de fundo medieval da Academia, gerada no navegador (Web Audio,
// sem arquivo de áudio). Ré dórico, compasso 3/4: flauta na melodia, alaúde
// dedilhando os acordes, baixo, tambor de moldura e eco de salão. 16 compassos
// (~30s) que se repetem sem parar até o aluno desligar.
//
// Navegadores só liberam som depois de alguma interação com a página. Se a
// Academia abrir sem clique nenhum (ex.: recarregou a página), a música fica
// "armada" e começa no primeiro clique/tecla do aluno.
// ============================================================================

const OFF_KEY = "cg-music-off";

/**
 * Preferência guardada no sessionStorage (só dura enquanto a aba estiver aberta):
 * desligar vale pra sessão atual, mas toda vez que o aluno entra de novo na
 * plataforma a música volta a tocar.
 */
export function isMusicOff(): boolean {
  if (typeof window === "undefined") return true;
  return window.sessionStorage.getItem(OFF_KEY) === "1";
}

export function setMusicOff(off: boolean) {
  if (typeof window === "undefined") return;
  if (off) window.sessionStorage.setItem(OFF_KEY, "1");
  else window.sessionStorage.removeItem(OFF_KEY);
}

// ---------------------------------------------------------------------------
// Partitura (tempos em colcheias; 6 colcheias = 1 compasso de 3/4)
// ---------------------------------------------------------------------------

const EIGHTH = 0.3125; // semínima = 96 bpm
const BAR = 6;

type Note = [midi: number | null, eighths: number];

// Melodia: seção A (8 compassos) + seção B (8 compassos). null = pausa.
const MELODY: Note[][] = [
  [[74, 2], [76, 1], [77, 1], [79, 1], [81, 1]],
  [[81, 3], [79, 1], [77, 2]],
  [[76, 2], [72, 2], [74, 1], [76, 1]],
  [[77, 4], [null, 2]],
  [[81, 2], [79, 1], [77, 1], [76, 1], [74, 1]],
  [[76, 2], [77, 1], [76, 1], [72, 2]],
  [[74, 2], [69, 2], [72, 1], [76, 1]],
  [[74, 4], [null, 2]],
  [[77, 2], [79, 2], [81, 2]],
  [[84, 3], [81, 1], [79, 2]],
  [[81, 2], [77, 2], [79, 1], [81, 1]],
  [[76, 4], [null, 2]],
  [[74, 2], [77, 1], [79, 1], [81, 2]],
  [[79, 2], [77, 1], [76, 1], [72, 2]],
  [[74, 1], [76, 1], [77, 2], [76, 2]],
  [[74, 5], [null, 1]],
];

// Acordes do alaúde: [baixo, quinta, oitava, terça]
const CHORDS: Record<string, [number, number, number, number]> = {
  Dm: [50, 57, 62, 65],
  C: [48, 55, 60, 64],
  F: [53, 60, 65, 69],
  Am: [45, 52, 57, 60],
};
const PROGRESSION = ["Dm", "Dm", "C", "F", "Dm", "C", "Am", "Dm", "F", "C", "Dm", "Am", "Dm", "C", "Dm", "Dm"];
// Dedilhado por compasso: baixo, quinta, oitava, terça, oitava, quinta
const ARPEGGIO = [0, 1, 2, 3, 2, 1];

type Instrument = "flute" | "lute" | "bass" | "drum" | "tap";
interface MusicEvent {
  at: number; // em colcheias desde o início do loop
  instrument: Instrument;
  midi: number;
  eighths: number;
}

function buildScore(): MusicEvent[] {
  const events: MusicEvent[] = [];
  MELODY.forEach((bar, b) => {
    let t = b * BAR;
    for (const [midi, len] of bar) {
      if (midi !== null) events.push({ at: t, instrument: "flute", midi, eighths: len });
      t += len;
    }
  });
  PROGRESSION.forEach((name, b) => {
    const chord = CHORDS[name];
    ARPEGGIO.forEach((idx, i) => events.push({ at: b * BAR + i, instrument: "lute", midi: chord[idx], eighths: 1 }));
    events.push({ at: b * BAR, instrument: "bass", midi: chord[0] - 12, eighths: BAR });
    events.push({ at: b * BAR, instrument: "drum", midi: 0, eighths: 1 });
    events.push({ at: b * BAR + 3, instrument: "tap", midi: 0, eighths: 1 });
    events.push({ at: b * BAR + 5, instrument: "tap", midi: 0, eighths: 1 });
  });
  return events.sort((a, b) => a.at - b.at);
}

const SCORE = buildScore();
const LOOP_SECONDS = MELODY.length * BAR * EIGHTH;

const midiToFreq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

// ---------------------------------------------------------------------------
// Instrumentos
// ---------------------------------------------------------------------------

function playFlute(ctx: AudioContext, out: AudioNode, freq: number, at: number, dur: number) {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = freq;
  const body = ctx.createOscillator();
  body.type = "triangle";
  body.frequency.value = freq;
  const bodyGain = ctx.createGain();
  bodyGain.gain.value = 0.25;
  // vibrato leve que só entra depois do ataque, como um flautista de verdade
  const vib = ctx.createOscillator();
  vib.frequency.value = 5;
  const vibDepth = ctx.createGain();
  vibDepth.gain.setValueAtTime(0, at);
  vibDepth.gain.linearRampToValueAtTime(freq * 0.006, at + Math.min(0.4, dur));
  vib.connect(vibDepth).connect(osc.frequency);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.28, at + 0.06);
  gain.gain.setValueAtTime(0.24, at + dur * 0.8);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur + 0.12);
  osc.connect(gain);
  body.connect(bodyGain).connect(gain);
  gain.connect(out);
  [osc, body, vib].forEach((o) => {
    o.start(at);
    o.stop(at + dur + 0.15);
  });
}

function playLute(ctx: AudioContext, out: AudioNode, freq: number, at: number) {
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.value = freq;
  const osc2 = ctx.createOscillator();
  osc2.type = "triangle";
  osc2.frequency.value = freq * 2.003;
  // filtro fechando rápido = som de corda beliscada
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.Q.value = 2;
  filter.frequency.setValueAtTime(3200, at);
  filter.frequency.exponentialRampToValueAtTime(500, at + 0.35);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.16, at + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 1.1);
  osc.connect(filter);
  osc2.connect(filter);
  filter.connect(gain).connect(out);
  [osc, osc2].forEach((o) => {
    o.start(at);
    o.stop(at + 1.2);
  });
}

function playBass(ctx: AudioContext, out: AudioNode, freq: number, at: number, dur: number) {
  const osc = ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.value = freq;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.22, at + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(gain).connect(out);
  osc.start(at);
  osc.stop(at + dur + 0.05);
}

function playDrum(ctx: AudioContext, out: AudioNode, at: number, accent: boolean) {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(accent ? 130 : 220, at);
  osc.frequency.exponentialRampToValueAtTime(accent ? 48 : 110, at + 0.16);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(accent ? 0.5 : 0.12, at + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + (accent ? 0.35 : 0.12));
  osc.connect(gain).connect(out);
  osc.start(at);
  osc.stop(at + 0.4);
}

/** Eco de salão de pedra: resposta ao impulso feita de ruído decaindo. */
export function createHallReverb(ctx: AudioContext, seconds = 2.2): ConvolverNode {
  const length = Math.floor(ctx.sampleRate * seconds);
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
  }
  const convolver = ctx.createConvolver();
  convolver.buffer = impulse;
  return convolver;
}

// ---------------------------------------------------------------------------
// Player (uma instância só por aba)
// ---------------------------------------------------------------------------

const MUSIC_VOLUME = 0.22;
const LOOKAHEAD_SECONDS = 0.3;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let timer: number | null = null;
let loopStart = 0;
let nextEvent = 0;
let removeUnlockListeners: (() => void) | null = null;
/** Pausada de propósito (ex.: tela de derrota) — diferente de desligada pelo aluno. */
let paused = false;

function scheduleAhead() {
  if (!ctx || !master) return;
  while (loopStart + SCORE[nextEvent].at * EIGHTH < ctx.currentTime + LOOKAHEAD_SECONDS) {
    const ev = SCORE[nextEvent];
    const at = loopStart + ev.at * EIGHTH;
    const dur = ev.eighths * EIGHTH;
    if (ev.instrument === "flute") playFlute(ctx, master, midiToFreq(ev.midi), at, dur);
    else if (ev.instrument === "lute") playLute(ctx, master, midiToFreq(ev.midi), at);
    else if (ev.instrument === "bass") playBass(ctx, master, midiToFreq(ev.midi), at, dur);
    else playDrum(ctx, master, at, ev.instrument === "drum");

    nextEvent++;
    if (nextEvent === SCORE.length) {
      nextEvent = 0;
      loopStart += LOOP_SECONDS;
    }
  }
}

/** Se o navegador ainda não liberou o áudio, espera o primeiro clique/tecla pra começar. */
function resumeOnFirstInteraction(audio: AudioContext) {
  const resume = () => {
    // Se a música estiver pausada (tela de derrota), quem retoma é o resumeMusic().
    if (!paused) audio.resume();
    removeUnlockListeners?.();
  };
  const events = ["pointerdown", "keydown", "touchstart"] as const;
  events.forEach((e) => window.addEventListener(e, resume, { once: true }));
  removeUnlockListeners = () => {
    events.forEach((e) => window.removeEventListener(e, resume));
    removeUnlockListeners = null;
  };
}

export function isMusicPlaying(): boolean {
  return timer !== null;
}

export function startMusic() {
  if (typeof window === "undefined" || timer !== null) return;
  const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;

  ctx = new AudioCtx();
  master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, ctx.currentTime);
  master.gain.exponentialRampToValueAtTime(MUSIC_VOLUME, ctx.currentTime + 2);

  const dry = ctx.createGain();
  dry.gain.value = 0.8;
  const wet = ctx.createGain();
  wet.gain.value = 0.35;
  const reverb = createHallReverb(ctx);
  master.connect(dry).connect(ctx.destination);
  master.connect(reverb).connect(wet).connect(ctx.destination);

  loopStart = ctx.currentTime + 0.1;
  nextEvent = 0;
  if (ctx.state === "suspended") resumeOnFirstInteraction(ctx);
  scheduleAhead();
  timer = window.setInterval(scheduleAhead, 50);
}

/**
 * Pausa sem perder o ponto da música: abaixa o volume rápido e congela o áudio
 * (com o relógio do áudio parado, o agendador também não agenda notas novas).
 */
export function pauseMusic() {
  if (!ctx || !master || paused) return;
  paused = true;
  const c = ctx;
  const m = master;
  m.gain.cancelScheduledValues(c.currentTime);
  m.gain.setValueAtTime(Math.max(m.gain.value, 0.0001), c.currentTime);
  m.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.3);
  window.setTimeout(() => {
    if (paused && ctx === c) c.suspend();
  }, 350);
}

/** Retoma de onde parou, voltando o volume aos poucos. */
export function resumeMusic() {
  if (!ctx || !master || !paused) return;
  paused = false;
  const c = ctx;
  const m = master;
  c.resume().then(() => {
    // Se pausou de novo enquanto retomava, não sobe o volume.
    if (paused || ctx !== c) return;
    m.gain.cancelScheduledValues(c.currentTime);
    m.gain.setValueAtTime(0.0001, c.currentTime);
    m.gain.exponentialRampToValueAtTime(MUSIC_VOLUME, c.currentTime + 1.2);
  });
}

export function stopMusic() {
  paused = false;
  if (timer !== null) window.clearInterval(timer);
  timer = null;
  removeUnlockListeners?.();
  const oldCtx = ctx;
  const oldMaster = master;
  ctx = null;
  master = null;
  if (!oldCtx || !oldMaster) return;
  // fade-out curto em vez de cortar seco; fecha o contexto antigo depois
  oldMaster.gain.cancelScheduledValues(oldCtx.currentTime);
  oldMaster.gain.setValueAtTime(Math.max(oldMaster.gain.value, 0.0001), oldCtx.currentTime);
  oldMaster.gain.exponentialRampToValueAtTime(0.0001, oldCtx.currentTime + 0.4);
  window.setTimeout(() => oldCtx.close(), 500);
}
