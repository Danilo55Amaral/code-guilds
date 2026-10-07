// ============================================================================
// SFX — efeitos sonoros gerados no próprio navegador (sem arquivos de áudio).
// Web Audio faz os efeitos (corte da foice, estrondo, zumbido sombrio), a
// fanfarra de vitória, o jingle de subir de nível e o "plim" do tutorial; a
// síntese de voz do navegador faz a risada da Morte + "Você morreu!" e a voz
// do Mago Danilo no tutorial.
// A preferência de som (ligado/mudo) fica no localStorage, por navegador.
// ============================================================================

import { createHallReverb } from "./music";

const MUTED_KEY = "cg-sound-muted";

export function isSoundMuted(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(MUTED_KEY) === "1";
}

export function setSoundMuted(muted: boolean) {
  if (typeof window === "undefined") return;
  if (muted) window.localStorage.setItem(MUTED_KEY, "1");
  else window.localStorage.removeItem(MUTED_KEY);
}

function noiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

/** Corte da foice: ruído passando por um filtro que "varre" do grave pro agudo e volta. */
function playWhoosh(ctx: AudioContext, out: AudioNode, at: number) {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, 0.6);
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 1.2;
  filter.frequency.setValueAtTime(400, at);
  filter.frequency.exponentialRampToValueAtTime(3200, at + 0.22);
  filter.frequency.exponentialRampToValueAtTime(250, at + 0.55);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.6, at + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.55);
  src.connect(filter).connect(gain).connect(out);
  src.start(at);
  src.stop(at + 0.6);
}

/** Estrondo grave junto com a tela tremendo. */
function playBoom(ctx: AudioContext, out: AudioNode, at: number) {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(95, at);
  osc.frequency.exponentialRampToValueAtTime(32, at + 0.9);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.9, at + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 1.1);
  osc.connect(gain).connect(out);
  osc.start(at);
  osc.stop(at + 1.2);
}

/** Zumbido sombrio de fundo (duas notas graves levemente desafinadas). */
function playDrone(ctx: AudioContext, out: AudioNode, at: number, seconds: number) {
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 320;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.12, at + 1.2);
  gain.gain.setValueAtTime(0.12, at + seconds - 1.5);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + seconds);
  filter.connect(gain).connect(out);
  [55, 55.7, 82.4].forEach((freq) => {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = freq;
    osc.connect(filter);
    osc.start(at);
    osc.stop(at + seconds);
  });
}

function speakDeath() {
  if (!("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  // Prefere uma voz masculina em português (fica mais sombria no grave); senão, qualquer voz pt.
  const ptVoices = synth.getVoices().filter((v) => v.lang.toLowerCase().startsWith("pt"));
  const voice = ptVoices.find((v) => /daniel|ricardo|antonio|felipe|male|masculin/i.test(v.name)) ?? ptVoices[0];

  const say = (text: string, pitch: number, rate: number) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "pt-BR";
    if (voice) u.voice = voice;
    u.pitch = pitch; // 0 = o mais grave possível
    u.rate = rate;
    u.volume = 1;
    synth.speak(u);
  };

  synth.cancel();
  say("Rá, rá, rá, rá, rá!", 0.1, 0.75);
  say("Você morreu!", 0, 0.6);
}

/**
 * Toca a cena sonora da morte, sincronizada com a animação da DefeatScreen
 * (corte em ~0.1s, tremor em ~0.25s, "VOCÊ MORREU" a partir de ~0.7s).
 * Devolve uma função que interrompe tudo (usada se o aluno fechar a tela antes).
 */
export function playDeathSound(): () => void {
  if (typeof window === "undefined") return () => {};

  const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  let ctx: AudioContext | null = null;
  if (AudioCtx) {
    ctx = new AudioCtx();
    const master = ctx.createGain();
    master.gain.value = 0.7;
    master.connect(ctx.destination);
    const now = ctx.currentTime;
    playWhoosh(ctx, master, now + 0.1);
    playBoom(ctx, master, now + 0.25);
    playDrone(ctx, master, now + 0.3, 6);
  }

  const speechTimer = window.setTimeout(speakDeath, 700);

  return () => {
    window.clearTimeout(speechTimer);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    ctx?.close();
  };
}

// ============================================================================
// VITÓRIA E SUBIR DE NÍVEL — fanfarra e jingle, sincronizados com as cenas
// VictoryScreen (baú abre em ~1.2s, recompensas em 1.6/1.75/1.9s) e
// LevelUpScreen (número troca em ~1.15s, título em ~1.3s).
// ============================================================================

const midiToFreq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

/** Contexto com volume geral + eco de salão. Devolve null se o navegador não tiver Web Audio. */
function openSceneContext(volume: number): { ctx: AudioContext; out: GainNode } | null {
  const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  const ctx = new AudioCtx();
  const out = ctx.createGain();
  out.gain.value = volume;
  const wet = ctx.createGain();
  wet.gain.value = 0.3;
  out.connect(ctx.destination);
  out.connect(createHallReverb(ctx, 1.8)).connect(wet).connect(ctx.destination);
  return { ctx, out };
}

/** Metal (trompete): duas dentes-de-serra levemente desafinadas, com o filtro "abrindo" no ataque. */
function playBrass(ctx: AudioContext, out: AudioNode, midi: number, at: number, dur: number, volume = 0.22) {
  const freq = midiToFreq(midi);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.Q.value = 1.5;
  filter.frequency.setValueAtTime(700, at);
  filter.frequency.exponentialRampToValueAtTime(3200, at + 0.05);
  filter.frequency.exponentialRampToValueAtTime(1800, at + 0.25);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(volume, at + 0.03);
  gain.gain.setValueAtTime(volume * 0.8, at + Math.max(0.05, dur - 0.05));
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur + 0.18);
  filter.connect(gain).connect(out);
  [1, 1.004].forEach((detune) => {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = freq * detune;
    osc.connect(filter);
    osc.start(at);
    osc.stop(at + dur + 0.2);
  });
}

/** Nota "8 bits" (onda quadrada), clássica de videogame. */
function playChip(ctx: AudioContext, out: AudioNode, midi: number, at: number, dur: number, volume = 0.1) {
  const osc = ctx.createOscillator();
  osc.type = "square";
  osc.frequency.value = midiToFreq(midi);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 4500;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(volume, at + 0.01);
  gain.gain.setValueAtTime(volume * 0.85, at + Math.max(0.02, dur - 0.03));
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur + 0.08);
  osc.connect(filter).connect(gain).connect(out);
  osc.start(at);
  osc.stop(at + dur + 0.1);
}

/** Sino/brilho mágico: fundamental + parciais inarmônicos, decaindo devagar. */
function playChime(ctx: AudioContext, out: AudioNode, midi: number, at: number, dur: number, volume = 0.12) {
  const freq = midiToFreq(midi);
  const partials: [number, number][] = [
    [1, volume],
    [2.76, volume * 0.35],
    [5.4, volume * 0.12],
  ];
  partials.forEach(([ratio, vol]) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq * ratio;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(vol, at + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    osc.connect(gain).connect(out);
    osc.start(at);
    osc.stop(at + dur + 0.05);
  });
}

/** Tímpano: batida grave com a afinação caindo um pouco. */
function playTimpani(ctx: AudioContext, out: AudioNode, midi: number, at: number, volume = 0.6) {
  const freq = midiToFreq(midi);
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq * 1.5, at);
  osc.frequency.exponentialRampToValueAtTime(freq, at + 0.06);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(volume, at + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 1);
  osc.connect(gain).connect(out);
  osc.start(at);
  osc.stop(at + 1.05);
}

/** Prato de ataque: ruído agudo com decaimento longo. */
function playCrash(ctx: AudioContext, out: AudioNode, at: number, volume = 0.3) {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, 2);
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 5000;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(volume, at + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 1.8);
  src.connect(filter).connect(gain).connect(out);
  src.start(at);
  src.stop(at + 2);
}

/** Rufar de caixa crescendo (suspense enquanto o baú treme). */
function playSnareRoll(ctx: AudioContext, out: AudioNode, from: number, to: number) {
  const buffer = noiseBuffer(ctx, 0.05);
  for (let t = from; t < to; t += 0.045) {
    const progress = (t - from) / (to - from);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 1800;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.03 + progress * 0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
    src.connect(filter).connect(gain).connect(out);
    src.start(t);
    src.stop(t + 0.05);
  }
}

/** "Bling" de moeda: duas notas agudas bem rápidas. */
function playCoin(ctx: AudioContext, out: AudioNode, at: number) {
  playChip(ctx, out, 88, at, 0.06, 0.06); // Mi6
  playChip(ctx, out, 95, at + 0.06, 0.22, 0.06); // Si6
}

/** Subida mágica: ruído filtrado varrendo do grave pro agudo. */
function playRiser(ctx: AudioContext, out: AudioNode, from: number, to: number) {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, to - from + 0.1);
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 3;
  filter.frequency.setValueAtTime(300, from);
  filter.frequency.exponentialRampToValueAtTime(7000, to);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, from);
  gain.gain.exponentialRampToValueAtTime(0.25, to - 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, to + 0.05);
  src.connect(filter).connect(gain).connect(out);
  src.start(from);
  src.stop(to + 0.1);
}

function closeScene(ctx: AudioContext): () => void {
  return () => {
    if (ctx.state !== "closed") ctx.close();
  };
}

/**
 * Fanfarra de vitória (~4.5s), em Dó maior:
 * rufar de caixa enquanto o baú treme → "tan-tan-tan-TAAAN" dos trompetes com
 * prato quando a tampa abre → "bling" de moeda em cada cartão de recompensa →
 * frase final subindo até o acorde de Dó maior.
 */
export function playVictoryFanfare(): () => void {
  if (typeof window === "undefined") return () => {};
  const scene = openSceneContext(0.55);
  if (!scene) return () => {};
  const { ctx, out } = scene;
  const t = ctx.currentTime + 0.05;

  // suspense
  playSnareRoll(ctx, out, t + 0.15, t + 1.15);
  playTimpani(ctx, out, 43, t + 0.2, 0.35); // Sol2
  playTimpani(ctx, out, 48, t + 0.7, 0.45); // Dó3

  // baú abre: tan-tan-tan-TAAAN
  playCrash(ctx, out, t + 1.2);
  playTimpani(ctx, out, 36, t + 1.2, 0.7); // Dó2
  playBrass(ctx, out, 67, t + 1.2, 0.1); // Sol4
  playBrass(ctx, out, 67, t + 1.33, 0.1);
  playBrass(ctx, out, 67, t + 1.46, 0.1);
  playBrass(ctx, out, 72, t + 1.6, 0.65); // Dó5
  [60, 64, 67].forEach((m) => playBrass(ctx, out, m, t + 1.6, 0.65, 0.1)); // acorde Dó-Mi-Sol por baixo

  // cartões de recompensa aparecendo
  [1.6, 1.75, 1.9].forEach((d) => playCoin(ctx, out, t + d));

  // frase final
  playBrass(ctx, out, 69, t + 2.35, 0.14); // Lá4
  playBrass(ctx, out, 71, t + 2.5, 0.14); // Si4
  playBrass(ctx, out, 72, t + 2.65, 0.14); // Dó5
  playBrass(ctx, out, 74, t + 2.8, 0.14); // Ré5
  playTimpani(ctx, out, 43, t + 2.8, 0.4);
  playCrash(ctx, out, t + 3, 0.2);
  playTimpani(ctx, out, 36, t + 3, 0.7);
  [72, 76, 79, 84].forEach((m) => playBrass(ctx, out, m, t + 3, 1.3, 0.13)); // acorde final Dó maior
  [84, 88, 91].forEach((m, i) => playChime(ctx, out, m, t + 3.05 + i * 0.07, 1.8, 0.06)); // brilho

  return closeScene(ctx);
}

/**
 * Jingle de subir de nível (~3.5s), estilo RPG de videogame:
 * subida mágica enquanto o brasão aparece → impacto com sinos quando o número
 * troca → arpejos "8 bits" subindo → acorde final brilhante com tremolo.
 */
export function playLevelUpJingle(): () => void {
  if (typeof window === "undefined") return () => {};
  const scene = openSceneContext(0.5);
  if (!scene) return () => {};
  const { ctx, out } = scene;
  const t = ctx.currentTime + 0.05;

  // subida: ruído varrendo + escala de Dó subindo
  playRiser(ctx, out, t, t + 1.1);
  [60, 62, 64, 65, 67, 69, 71, 72, 74, 76].forEach((m, i) => playChip(ctx, out, m, t + 0.3 + i * 0.08, 0.07, 0.05));

  // número troca
  playTimpani(ctx, out, 36, t + 1.15, 0.6);
  playCrash(ctx, out, t + 1.15, 0.18);
  [84, 88, 91, 96].forEach((m) => playChime(ctx, out, m, t + 1.15, 1.6, 0.07));

  // arpejos subindo: Dó → Ré menor → Mi menor → Fá → Sol
  const arps = [72, 76, 79, 74, 77, 81, 76, 79, 83, 77, 81, 84, 79, 83, 86];
  arps.forEach((m, i) => playChip(ctx, out, m, t + 1.3 + i * 0.055, 0.05, 0.08));

  // acorde final de Dó maior com tremolo
  const end = t + 1.3 + arps.length * 0.055 + 0.05;
  const trem = ctx.createGain();
  trem.connect(out);
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 9;
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 0.35;
  lfo.connect(lfoDepth).connect(trem.gain);
  lfo.start(end);
  lfo.stop(end + 1.6);
  [84, 88, 91].forEach((m) => playChip(ctx, trem, m, end, 1.3, 0.07));
  playBrass(ctx, out, 60, end, 1.3, 0.08); // Dó4 por baixo, dá corpo
  playChime(ctx, out, 96, end, 2, 0.08);

  return closeScene(ctx);
}

// ============================================================================
// MAGO DANILO — o guia do tutorial. "Plim" mágico a cada passo e a voz dele
// lendo a fala do balão (síntese de voz do navegador, como a da Morte).
// ============================================================================

/** "Plim" de varinha mágica ao trocar de passo do tutorial (~1s). */
export function playMagicChime(): () => void {
  if (typeof window === "undefined") return () => {};
  const scene = openSceneContext(0.35);
  if (!scene) return () => {};
  const { ctx, out } = scene;
  const t = ctx.currentTime + 0.02;
  [84, 88, 91, 96].forEach((m, i) => playChime(ctx, out, m, t + i * 0.07, 0.9, 0.06));
  return closeScene(ctx);
}

/**
 * Um personagem lê a fala em voz alta, com a altura (`pitch`, 0 a 2) e a
 * velocidade (`rate`) da voz dele. Emojis saem do texto (a voz leria o nome
 * deles). Devolve a função que interrompe a fala.
 */
export function speakCharacter(text: string, { pitch, rate }: { pitch: number; rate: number }): () => void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return () => {};
  const synth = window.speechSynthesis;
  const ptVoices = synth.getVoices().filter((v) => v.lang.toLowerCase().startsWith("pt"));
  const voice = ptVoices.find((v) => /daniel|ricardo|antonio|felipe|male|masculin/i.test(v.name)) ?? ptVoices[0];
  const clean = text.replace(/\p{Extended_Pictographic}|️/gu, "").replace(/\s+/g, " ").trim();

  synth.cancel();
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = "pt-BR";
  if (voice) u.voice = voice;
  u.pitch = pitch;
  u.rate = rate;
  u.volume = 1;
  synth.speak(u);
  return () => synth.cancel();
}

/** O Mago Danilo lê a fala do tutorial: voz um pouco grave, de mago sábio. */
export function speakWizard(text: string): () => void {
  return speakCharacter(text, { pitch: 0.8, rate: 1.05 });
}

// ============================================================================
// CENAS DE EVENTO (components/EventScene.tsx) — sino da meia-noite, trovão e
// o fundo sombrio que fica tocando enquanto a história é contada.
// ============================================================================

/** Sino da meia-noite: badaladas graves e longas, com eco de salão. */
export function playMidnightBell(strikes = 3): () => void {
  if (typeof window === "undefined") return () => {};
  const scene = openSceneContext(0.45);
  if (!scene) return () => {};
  const { ctx, out } = scene;
  const t = ctx.currentTime + 0.05;
  for (let i = 0; i < strikes; i++) {
    playChime(ctx, out, 50, t + i * 1.2, 3.8, 0.22); // Ré3
    playChime(ctx, out, 62, t + i * 1.2, 2.6, 0.07); // Ré4 (brilho do bronze)
  }
  return closeScene(ctx);
}

/** Trovão: estalo agudo e um ronco grave que vai rolando e sumindo. */
export function playThunder(): () => void {
  if (typeof window === "undefined") return () => {};
  const scene = openSceneContext(0.7);
  if (!scene) return () => {};
  const { ctx, out } = scene;
  const t = ctx.currentTime + 0.05;

  const crack = ctx.createBufferSource();
  crack.buffer = noiseBuffer(ctx, 0.4);
  const crackFilter = ctx.createBiquadFilter();
  crackFilter.type = "highpass";
  crackFilter.frequency.value = 1200;
  const crackGain = ctx.createGain();
  crackGain.gain.setValueAtTime(0.0001, t);
  crackGain.gain.exponentialRampToValueAtTime(0.5, t + 0.01);
  crackGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
  crack.connect(crackFilter).connect(crackGain).connect(out);
  crack.start(t);
  crack.stop(t + 0.4);

  const rumble = ctx.createBufferSource();
  rumble.buffer = noiseBuffer(ctx, 3.2);
  const rumbleFilter = ctx.createBiquadFilter();
  rumbleFilter.type = "lowpass";
  rumbleFilter.frequency.setValueAtTime(420, t);
  rumbleFilter.frequency.exponentialRampToValueAtTime(90, t + 3);
  const rumbleGain = ctx.createGain();
  rumbleGain.gain.setValueAtTime(0.0001, t);
  rumbleGain.gain.exponentialRampToValueAtTime(0.9, t + 0.12);
  rumbleGain.gain.exponentialRampToValueAtTime(0.35, t + 1);
  rumbleGain.gain.exponentialRampToValueAtTime(0.0001, t + 3.1);
  rumble.connect(rumbleFilter).connect(rumbleGain).connect(out);
  rumble.start(t);
  rumble.stop(t + 3.2);

  playBoom(ctx, out, t + 0.05);
  return closeScene(ctx);
}

/** Sirene de alerta: tom subindo e descendo, duas vezes, com um zumbido de alto-falante velho. */
export function playSiren(): () => void {
  if (typeof window === "undefined") return () => {};
  const scene = openSceneContext(0.3);
  if (!scene) return () => {};
  const { ctx, out } = scene;
  const t = ctx.currentTime + 0.05;
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 900;
  filter.Q.value = 0.8;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.35, t + 0.3);
  gain.gain.setValueAtTime(0.35, t + 3.4);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 4);
  for (let i = 0; i < 2; i++) {
    const s = t + i * 2;
    osc.frequency.setValueAtTime(420, s);
    osc.frequency.linearRampToValueAtTime(880, s + 1);
    osc.frequency.linearRampToValueAtTime(420, s + 2);
  }
  osc.connect(filter).connect(gain).connect(out);
  osc.start(t);
  osc.stop(t + 4.1);
  return closeScene(ctx);
}

/** Disco voador: zumbido de teremim subindo e descendo, com vibrato, e um "uuuooo" que passa. */
export function playUfoHum(): () => void {
  if (typeof window === "undefined") return () => {};
  const scene = openSceneContext(0.35);
  if (!scene) return () => {};
  const { ctx, out } = scene;
  const t = ctx.currentTime + 0.05;
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(420, t);
  osc.frequency.exponentialRampToValueAtTime(980, t + 1.1);
  osc.frequency.exponentialRampToValueAtTime(520, t + 2.2);
  osc.frequency.exponentialRampToValueAtTime(760, t + 3.2);
  const vibrato = ctx.createOscillator();
  vibrato.frequency.value = 7;
  const vibratoDepth = ctx.createGain();
  vibratoDepth.gain.value = 22;
  vibrato.connect(vibratoDepth).connect(osc.frequency);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.3, t + 0.4);
  gain.gain.setValueAtTime(0.3, t + 2.8);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.6);
  osc.connect(gain).connect(out);
  // zumbido grave do motor da nave por baixo
  const hum = ctx.createOscillator();
  hum.type = "sawtooth";
  hum.frequency.value = 58;
  const humFilter = ctx.createBiquadFilter();
  humFilter.type = "lowpass";
  humFilter.frequency.value = 200;
  const humGain = ctx.createGain();
  humGain.gain.setValueAtTime(0.0001, t);
  humGain.gain.exponentialRampToValueAtTime(0.18, t + 0.6);
  humGain.gain.exponentialRampToValueAtTime(0.0001, t + 3.6);
  hum.connect(humFilter).connect(humGain).connect(out);
  [osc, vibrato, hum].forEach((o) => {
    o.start(t);
    o.stop(t + 3.7);
  });
  return closeScene(ctx);
}

/** Tiros de laser: "pew pew pew", notas quadradas caindo rápido de tom. */
export function playLaser(): () => void {
  if (typeof window === "undefined") return () => {};
  const scene = openSceneContext(0.3);
  if (!scene) return () => {};
  const { ctx, out } = scene;
  const t = ctx.currentTime + 0.05;
  [0, 0.22, 0.44, 0.9, 1.05].forEach((d) => {
    const at = t + d;
    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(1800, at);
    osc.frequency.exponentialRampToValueAtTime(180, at + 0.18);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.25, at + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.2);
    osc.connect(gain).connect(out);
    osc.start(at);
    osc.stop(at + 0.22);
  });
  return closeScene(ctx);
}

/** Gemido de zumbi: voz grave e rouca, tremendo e caindo de tom ("uuuuhhh"). */
export function playZombieGroan(): () => void {
  if (typeof window === "undefined") return () => {};
  const scene = openSceneContext(0.5);
  if (!scene) return () => {};
  const { ctx, out } = scene;
  const t = ctx.currentTime + 0.05;
  [
    [0, 105],
    [0.9, 88],
  ].forEach(([delay, pitch]) => {
    const at = t + delay;
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(pitch, at);
    osc.frequency.linearRampToValueAtTime(pitch * 0.72, at + 1.8);
    const wobble = ctx.createOscillator();
    wobble.frequency.value = 6;
    const wobbleDepth = ctx.createGain();
    wobbleDepth.gain.value = 5;
    wobble.connect(wobbleDepth).connect(osc.frequency);
    const formant = ctx.createBiquadFilter();
    formant.type = "bandpass";
    formant.frequency.setValueAtTime(520, at);
    formant.frequency.linearRampToValueAtTime(380, at + 1.8);
    formant.Q.value = 4;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.5, at + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 1.9);
    osc.connect(formant).connect(gain).connect(out);
    osc.start(at);
    wobble.start(at);
    osc.stop(at + 2);
    wobble.stop(at + 2);
  });
  return closeScene(ctx);
}

/**
 * Fundo sombrio contínuo: notas graves levemente desafinadas com o filtro
 * "respirando" devagar. Toca até chamar a função devolvida (que abaixa o volume e fecha).
 */
export function playSpookyAmbience(): () => void {
  if (typeof window === "undefined") return () => {};
  const scene = openSceneContext(0.5);
  if (!scene) return () => {};
  const { ctx, out } = scene;
  const t = ctx.currentTime + 0.05;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 280;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.12;
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 140;
  lfo.connect(lfoDepth).connect(filter.frequency);
  lfo.start(t);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.13, t + 2.5);
  filter.connect(gain).connect(out);
  [49, 49.6, 73.4, 98.1].forEach((freq) => {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = freq;
    osc.connect(filter);
    osc.start(t);
  });

  return () => {
    if (ctx.state === "closed") return;
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    window.setTimeout(() => {
      if (ctx.state !== "closed") ctx.close();
    }, 700);
  };
}

// ============================================================================
// EVENTO DE NATAL — guizos do trenó, vento da nevasca e o fundo de inverno
// (mais calmo e mágico que o fundo sombrio dos outros eventos).
// ============================================================================

/** Guizos do trenó: chocalhos em colcheias e o começo de Jingle Bells (melodia de domínio público) em sininhos. */
export function playSleighBells(): () => void {
  if (typeof window === "undefined") return () => {};
  const scene = openSceneContext(0.4);
  if (!scene) return () => {};
  const { ctx, out } = scene;
  const t = ctx.currentTime + 0.05;
  // chocalho: estalinhos de ruído agudo, com os tempos fortes um pouco mais altos
  for (let i = 0; i < 16; i++) {
    const at = t + i * 0.14;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx, 0.12);
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 6500;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(i % 2 ? 0.12 : 0.22, at + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.1);
    src.connect(filter).connect(gain).connect(out);
    src.start(at);
    src.stop(at + 0.12);
  }
  // mi mi mi, mi mi mi, mi sol dó ré mi
  const beat = 0.28;
  const melody: [number, number][] = [
    [76, 0], [76, 1], [76, 2],
    [76, 4], [76, 5], [76, 6],
    [76, 8], [79, 9], [72, 10], [74, 10.75], [76, 11.5],
  ];
  melody.forEach(([midi, pos]) => playChime(ctx, out, midi + 12, t + pos * beat, 0.9, 0.09));
  return closeScene(ctx);
}

/** Vento da nevasca: ruído passando por um filtro que sobe e desce devagar, como um uivo. */
export function playWindHowl(): () => void {
  if (typeof window === "undefined") return () => {};
  const scene = openSceneContext(0.5);
  if (!scene) return () => {};
  const { ctx, out } = scene;
  const t = ctx.currentTime + 0.05;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, 4);
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 6;
  filter.frequency.setValueAtTime(300, t);
  filter.frequency.exponentialRampToValueAtTime(900, t + 1.2);
  filter.frequency.exponentialRampToValueAtTime(420, t + 2.2);
  filter.frequency.exponentialRampToValueAtTime(1100, t + 3.2);
  filter.frequency.exponentialRampToValueAtTime(350, t + 3.9);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.9, t + 0.8);
  gain.gain.setValueAtTime(0.9, t + 3);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.95);
  src.connect(filter).connect(gain).connect(out);
  src.start(t);
  src.stop(t + 4);
  return closeScene(ctx);
}

/**
 * Fundo de inverno contínuo: um acorde suave e brilhante com o filtro "respirando"
 * e um ventinho baixo por baixo. Toca até chamar a função devolvida.
 */
export function playWinterAmbience(): () => void {
  if (typeof window === "undefined") return () => {};
  const scene = openSceneContext(0.4);
  if (!scene) return () => {};
  const { ctx, out } = scene;
  const t = ctx.currentTime + 0.05;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1200;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.1;
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 500;
  lfo.connect(lfoDepth).connect(filter.frequency);
  lfo.start(t);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.1, t + 3);
  filter.connect(gain).connect(out);
  // Dó maior com sétima e nona, bem aberto: soa como neve caindo.
  [60, 67, 71, 74, 79].forEach((midi, i) => {
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = midiToFreq(midi) * (1 + (i % 2 ? 0.002 : -0.002));
    osc.connect(filter);
    osc.start(t);
  });
  const wind = ctx.createBufferSource();
  wind.buffer = noiseBuffer(ctx, 4);
  wind.loop = true;
  const windFilter = ctx.createBiquadFilter();
  windFilter.type = "bandpass";
  windFilter.frequency.value = 500;
  windFilter.Q.value = 2;
  const windGain = ctx.createGain();
  windGain.gain.value = 0.18;
  wind.connect(windFilter).connect(windGain).connect(gain);
  wind.start(t);

  return () => {
    if (ctx.state === "closed") return;
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    window.setTimeout(() => {
      if (ctx.state !== "closed") ctx.close();
    }, 700);
  };
}

// ============================================================================
// A NOITE DE DRACODING — o uivo da alcateia, o órgão do castelo do vampiro, os
// corvos do milharal, a musiquinha do circo sombrio e a revoada de morcegos.
// ============================================================================

/** Uivo de lobo: um "auuuu" subindo, segurando com vibrato e caindo; um segundo lobo responde lá longe. */
export function playWolfHowl(): () => void {
  if (typeof window === "undefined") return () => {};
  const scene = openSceneContext(0.45);
  if (!scene) return () => {};
  const { ctx, out } = scene;
  const t = ctx.currentTime + 0.05;
  // [atraso, afinação relativa, volume]: o líder da alcateia e um lobo mais agudo, mais longe
  const wolves: [number, number, number][] = [
    [0, 1, 0.42],
    [1.25, 1.24, 0.16],
  ];
  wolves.forEach(([delay, pitch, volume]) => {
    const at = t + delay;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(volume, at + 0.4);
    gain.gain.setValueAtTime(volume, at + 1.9);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 2.8);
    // a vogal "u": um filtro na região grave da voz
    const formant = ctx.createBiquadFilter();
    formant.type = "lowpass";
    formant.frequency.value = 900 * pitch;
    formant.Q.value = 2;
    formant.connect(gain).connect(out);
    const vibrato = ctx.createOscillator();
    vibrato.frequency.value = 5.2;
    const vibratoDepth = ctx.createGain();
    vibratoDepth.gain.setValueAtTime(0, at);
    vibratoDepth.gain.linearRampToValueAtTime(9 * pitch, at + 1.1);
    vibrato.connect(vibratoDepth);
    (["sine", "triangle"] as OscillatorType[]).forEach((type) => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(290 * pitch, at);
      osc.frequency.exponentialRampToValueAtTime(540 * pitch, at + 0.6);
      osc.frequency.linearRampToValueAtTime(585 * pitch, at + 1.7);
      osc.frequency.exponentialRampToValueAtTime(350 * pitch, at + 2.8);
      vibratoDepth.connect(osc.frequency);
      osc.connect(formant);
      osc.start(at);
      osc.stop(at + 2.9);
    });
    vibrato.start(at);
    vibrato.stop(at + 2.9);
  });
  return closeScene(ctx);
}

/** Nota de órgão de igreja: vários "tubos" (harmônicos) soando juntos, com ataque rápido. */
function playOrganNote(ctx: AudioContext, out: AudioNode, midi: number, at: number, dur: number, volume = 0.05) {
  const freq = midiToFreq(midi);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(volume, at + 0.025);
  gain.gain.setValueAtTime(volume, at + Math.max(0.03, dur - 0.04));
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur + 0.25);
  gain.connect(out);
  // [harmônico, peso]: como os registros puxados de um órgão
  const pipes: [number, number][] = [
    [0.5, 0.5],
    [1, 1],
    [2, 0.6],
    [3, 0.32],
    [4, 0.22],
    [8, 0.08],
  ];
  pipes.forEach(([ratio, weight], i) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq * ratio * (1 + (i % 2 ? 0.0015 : -0.0015));
    const pipe = ctx.createGain();
    pipe.gain.value = weight;
    osc.connect(pipe).connect(gain);
    osc.start(at);
    osc.stop(at + dur + 0.3);
  });
}

/**
 * Órgão do castelo do vampiro: o começo da Tocata e Fuga em Ré menor, de Bach
 * (domínio público) — "lá-sol-láaa... sol-fá-mi-ré-dó#... ré" — com o acorde grave no fim.
 */
export function playOrganSting(): () => void {
  if (typeof window === "undefined") return () => {};
  const scene = openSceneContext(0.55);
  if (!scene) return () => {};
  const { ctx, out } = scene;
  const t = ctx.currentTime + 0.05;
  // [nota midi, início, duração] — cada nota soa em oitavas
  const melody: [number, number, number][] = [
    [81, 0, 0.11],
    [79, 0.11, 0.11],
    [81, 0.22, 1.05],
    [79, 1.5, 0.12],
    [77, 1.62, 0.12],
    [76, 1.74, 0.12],
    [74, 1.86, 0.12],
    [73, 1.98, 0.62],
    [74, 2.7, 1.5],
  ];
  melody.forEach(([midi, start, dur]) => {
    playOrganNote(ctx, out, midi, t + start, dur, 0.035);
    playOrganNote(ctx, out, midi - 12, t + start, dur, 0.035);
  });
  // o acorde final de Ré menor, com o pedal bem grave
  [38, 50, 57, 62, 65].forEach((midi) => playOrganNote(ctx, out, midi, t + 2.7, 1.5, 0.03));
  return closeScene(ctx);
}

/** Corvos do milharal: grasnados roucos ("cróóó") de dois corvos e o bater de asas fugindo. */
export function playCrows(): () => void {
  if (typeof window === "undefined") return () => {};
  const scene = openSceneContext(0.4);
  if (!scene) return () => {};
  const { ctx, out } = scene;
  const t = ctx.currentTime + 0.05;

  function caw(at: number, pitch: number, volume: number) {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(pitch * 1.2, at);
    osc.frequency.exponentialRampToValueAtTime(pitch, at + 0.05);
    osc.frequency.exponentialRampToValueAtTime(pitch * 0.78, at + 0.26);
    // a rouquidão: o volume treme bem rápido
    const rasp = ctx.createGain();
    rasp.gain.value = 0.55;
    const am = ctx.createOscillator();
    am.frequency.value = 62;
    const amDepth = ctx.createGain();
    amDepth.gain.value = 0.45;
    am.connect(amDepth).connect(rasp.gain);
    const beak = ctx.createBiquadFilter();
    beak.type = "bandpass";
    beak.frequency.value = 1500;
    beak.Q.value = 2.2;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(volume, at + 0.025);
    gain.gain.setValueAtTime(volume, at + 0.16);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.28);
    osc.connect(rasp).connect(beak).connect(gain).connect(out);
    [osc, am].forEach((o) => {
      o.start(at);
      o.stop(at + 0.3);
    });
  }

  // [início, afinação, volume]: um corvo perto, outro mais grave, e o primeiro de novo, já longe
  const caws: [number, number, number][] = [
    [0, 560, 0.5],
    [0.34, 540, 0.5],
    [0.68, 520, 0.45],
    [1.05, 430, 0.38],
    [1.36, 410, 0.34],
    [1.95, 560, 0.18],
    [2.25, 530, 0.14],
  ];
  caws.forEach(([at, pitch, volume]) => caw(t + at, pitch, volume));

  // as asas batendo enquanto eles fogem
  const flap = noiseBuffer(ctx, 0.08);
  for (let i = 0; i < 12; i++) {
    const at = t + 0.05 + i * 0.09;
    const src = ctx.createBufferSource();
    src.buffer = flap;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 700;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.35 * (1 - i / 14), at + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.07);
    src.connect(filter).connect(gain).connect(out);
    src.start(at);
    src.stop(at + 0.08);
  }
  return closeScene(ctx);
}

/**
 * Circo sombrio: uma valsinha em Mi menor de caixinha de música e realejo,
 * desafinando e ficando mais lenta, como se a corda estivesse acabando.
 */
export function playCreepyCircus(): () => void {
  if (typeof window === "undefined") return () => {};
  const scene = openSceneContext(0.38);
  if (!scene) return () => {};
  const { ctx, out } = scene;
  const t = ctx.currentTime + 0.05;

  function note(midi: number, at: number, dur: number, cents: number, volume: number, type: OscillatorType) {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = midiToFreq(midi);
    osc.detune.value = cents;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 3200;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(volume, at + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    osc.connect(filter).connect(gain).connect(out);
    osc.start(at);
    osc.stop(at + dur + 0.05);
  }

  // valsa em 3/4: [melodia do compasso (3 notas), baixo do "um", acorde do "pá-pá"]
  const bars: [number[], number, number[]][] = [
    [[76, 79, 83], 52, [59, 64]],
    [[82, 83, 79], 47, [59, 63]],
    [[76, 78, 79], 52, [59, 64]],
    [[78, 75, 71], 47, [54, 63]],
    [[72, 76, 79], 48, [55, 64]],
    [[78, 75, 71], 47, [54, 63]],
  ];
  let at = t;
  let beat = 0.27;
  bars.forEach(([melody, bass, chord], b) => {
    const cents = -b * 9; // desafinando aos poucos
    melody.forEach((midi, i) => {
      const when = at + i * beat;
      note(midi, when, beat * 1.6, cents, 0.11, "triangle"); // caixinha de música
      note(midi + 12, when, beat * 0.9, cents + 6, 0.025, "square"); // o brilho do realejo
      if (i === 0) note(bass, when, beat * 0.9, cents, 0.13, "square");
      else chord.forEach((c) => note(c, when, beat * 0.5, cents, 0.04, "square"));
    });
    at += beat * 3;
    beat *= 1.06; // a corda acabando: cada compasso um pouco mais lento
  });
  note(64, at, 1.6, -60, 0.12, "triangle"); // a última nota, bem desafinada
  return closeScene(ctx);
}

/** Revoada de morcegos: guinchos agudos espalhados e o bater de asas passando de um lado pro outro. */
export function playBatSwarm(): () => void {
  if (typeof window === "undefined") return () => {};
  const scene = openSceneContext(0.35);
  if (!scene) return () => {};
  const { ctx, out } = scene;
  const t = ctx.currentTime + 0.05;
  const pan = ctx.createStereoPanner();
  pan.pan.setValueAtTime(-0.9, t);
  pan.pan.linearRampToValueAtTime(0.9, t + 2.6);
  pan.connect(out);

  // o "ffff-ffff" das asas: ruído grave tremendo no ritmo das batidas
  const wings = ctx.createBufferSource();
  wings.buffer = noiseBuffer(ctx, 3);
  const wingFilter = ctx.createBiquadFilter();
  wingFilter.type = "bandpass";
  wingFilter.frequency.value = 420;
  wingFilter.Q.value = 0.8;
  const wingGain = ctx.createGain();
  wingGain.gain.setValueAtTime(0.0001, t);
  wingGain.gain.exponentialRampToValueAtTime(0.3, t + 0.5);
  wingGain.gain.setValueAtTime(0.3, t + 2);
  wingGain.gain.exponentialRampToValueAtTime(0.0001, t + 2.9);
  const flutter = ctx.createGain();
  flutter.gain.value = 0.5;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 17;
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 0.5;
  lfo.connect(lfoDepth).connect(flutter.gain);
  wings.connect(wingFilter).connect(flutter).connect(wingGain).connect(pan);
  wings.start(t);
  wings.stop(t + 3);
  lfo.start(t);
  lfo.stop(t + 3);

  // guinchos: assobios bem agudos caindo de tom, num padrão fixo (sem sorteio)
  for (let i = 0; i < 22; i++) {
    const at = t + 0.1 + ((i * 0.137) % 2.5);
    const top = 4200 + ((i * 733) % 2600);
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(top, at);
    osc.frequency.exponentialRampToValueAtTime(top * 0.62, at + 0.05);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.05 + (i % 3) * 0.015, at + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.06);
    osc.connect(gain).connect(pan);
    osc.start(at);
    osc.stop(at + 0.07);
  }
  return closeScene(ctx);
}

// ============================================================================
// SALA DO MULTIVERSO — zumbido cósmico: um grave profundo "respirando" e
// notas agudas cintilando lá longe, como o som do espaço entre os mundos.
// ============================================================================

/** Fundo cósmico contínuo. Toca até chamar a função devolvida. */
export function playCosmicAmbience(): () => void {
  if (typeof window === "undefined") return () => {};
  const scene = openSceneContext(0.45);
  if (!scene) return () => {};
  const { ctx, out } = scene;
  const t = ctx.currentTime + 0.05;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, t);
  master.gain.exponentialRampToValueAtTime(0.5, t + 3);
  master.connect(out);

  // grave profundo (Lá1 + quinta), com o filtro abrindo e fechando devagar
  const lowFilter = ctx.createBiquadFilter();
  lowFilter.type = "lowpass";
  lowFilter.frequency.value = 220;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 120;
  lfo.connect(lfoDepth).connect(lowFilter.frequency);
  lfo.start(t);
  const lowGain = ctx.createGain();
  lowGain.gain.value = 0.35;
  lowFilter.connect(lowGain).connect(master);
  [55, 55.4, 82.4].forEach((freq) => {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = freq;
    osc.connect(lowFilter);
    osc.start(t);
  });

  // cintilado: notas agudas de sino, com tremolo lento cada uma no seu ritmo
  [1318.5, 1760, 2093, 2637].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    const trem = ctx.createOscillator();
    trem.frequency.value = 0.11 + i * 0.07;
    const tremDepth = ctx.createGain();
    tremDepth.gain.value = 0.018;
    trem.connect(tremDepth).connect(gain.gain);
    osc.connect(gain).connect(master);
    osc.start(t);
    trem.start(t);
  });

  return () => {
    if (ctx.state === "closed") return;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    window.setTimeout(() => {
      if (ctx.state !== "closed") ctx.close();
    }, 900);
  };
}

// ============================================================================
// MUNDO 1 — DOMÍNIO DO DRAGÃO ANCESTRAL: o vento do céu em redemoinho, o
// rugido de Vaelzhar (com um eco que atravessa universos), o bater das asas
// passando perto e o estalo da magia (buraco negro + relâmpagos).
// ============================================================================

/** Desliga uma cena aos poucos (fade de `seconds`) e fecha o contexto. */
function fadeAndClose(ctx: AudioContext, master: GainNode, seconds = 0.8) {
  if (ctx.state === "closed") return;
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
  master.gain.exponentialRampToValueAtTime(0.0001, now + seconds);
  window.setTimeout(() => {
    if (ctx.state !== "closed") ctx.close();
  }, seconds * 1000 + 100);
}

/** Fecha a cena sozinha depois de `ms` (ou antes, se chamarem a função devolvida). */
function autoClose(ctx: AudioContext, ms: number): () => void {
  const close = closeScene(ctx);
  const timer = window.setTimeout(close, ms);
  return () => {
    window.clearTimeout(timer);
    close();
  };
}

/** Fundo do mundo do dragão: vento uivando no redemoinho + um grave antigo e um coro distante. */
export function playDragonAmbience(): () => void {
  if (typeof window === "undefined") return () => {};
  const scene = openSceneContext(0.42);
  if (!scene) return () => {};
  const { ctx, out } = scene;
  const t = ctx.currentTime + 0.05;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, t);
  master.gain.exponentialRampToValueAtTime(0.6, t + 3);
  master.connect(out);

  // vento: ruído num filtro estreito que sobe e desce devagar
  const wind = ctx.createBufferSource();
  wind.buffer = noiseBuffer(ctx, 4);
  wind.loop = true;
  const windFilter = ctx.createBiquadFilter();
  windFilter.type = "bandpass";
  windFilter.Q.value = 2.5;
  windFilter.frequency.value = 520;
  const windLfo = ctx.createOscillator();
  windLfo.frequency.value = 0.08;
  const windDepth = ctx.createGain();
  windDepth.gain.value = 340;
  windLfo.connect(windDepth).connect(windFilter.frequency);
  const windGain = ctx.createGain();
  windGain.gain.value = 0.2;
  wind.connect(windFilter).connect(windGain).connect(master);
  wind.start(t);
  windLfo.start(t);

  // grave antigo: Ré bem grave + quinta, com o filtro respirando
  const low = ctx.createBiquadFilter();
  low.type = "lowpass";
  low.frequency.value = 170;
  const lowLfo = ctx.createOscillator();
  lowLfo.frequency.value = 0.05;
  const lowDepth = ctx.createGain();
  lowDepth.gain.value = 90;
  lowLfo.connect(lowDepth).connect(low.frequency);
  lowLfo.start(t);
  const lowGain = ctx.createGain();
  lowGain.gain.value = 0.32;
  low.connect(lowGain).connect(master);
  [36.7, 36.95, 55].forEach((freq) => {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = freq;
    osc.connect(low);
    osc.start(t);
  });

  // coro místico lá longe (Ré menor), cada voz entrando e saindo no seu ritmo
  [293.7, 349.2, 440, 587.3].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    const trem = ctx.createOscillator();
    trem.frequency.value = 0.06 + i * 0.045;
    const tremDepth = ctx.createGain();
    tremDepth.gain.value = 0.012;
    trem.connect(tremDepth).connect(gain.gain);
    osc.connect(gain).connect(master);
    osc.start(t);
    trem.start(t);
  });

  return () => fadeAndClose(ctx, master);
}

/**
 * O rugido do Dragão Ancestral (~3.5s): rosnado grave com a garganta tremendo, o bramido
 * (ruído passando por "formantes", como a boca abrindo), um sub que faz o chão tremer e um eco
 * longo que vai sumindo, como se atravessasse outros universos.
 */
export function playDragonRoar(): () => void {
  if (typeof window === "undefined") return () => {};
  const scene = openSceneContext(0.85);
  if (!scene) return () => {};
  const { ctx, out } = scene;
  const t = ctx.currentTime + 0.05;
  const dur = 3.4;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, t);
  master.gain.exponentialRampToValueAtTime(1, t + 0.35);
  master.gain.setValueAtTime(1, t + 1.2);
  master.gain.exponentialRampToValueAtTime(0.7, t + 2.3);
  master.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  master.connect(out);

  // eco que atravessa universos
  const delay = ctx.createDelay(1.5);
  delay.delayTime.value = 0.46;
  const echoFilter = ctx.createBiquadFilter();
  echoFilter.type = "lowpass";
  echoFilter.frequency.value = 1300;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.45;
  const echoOut = ctx.createGain();
  echoOut.gain.value = 0.55;
  master.connect(delay);
  delay.connect(echoFilter);
  echoFilter.connect(feedback).connect(delay);
  echoFilter.connect(echoOut).connect(out);

  // distorção: deixa o rugido áspero
  const shaper = ctx.createWaveShaper();
  const curve = new Float32Array(1024);
  const k = 38;
  for (let i = 0; i < curve.length; i++) {
    const x = (i * 2) / curve.length - 1;
    curve[i] = ((1 + k) * x) / (1 + k * Math.abs(x));
  }
  shaper.curve = curve;
  const shaped = ctx.createGain();
  shaped.gain.value = 0.35;
  shaper.connect(shaped).connect(master);

  // rosnado: dentes-de-serra com vibrato rápido (a garganta tremendo)
  const flutter = ctx.createOscillator();
  flutter.frequency.value = 27;
  const flutterDepth = ctx.createGain();
  flutterDepth.gain.value = 13;
  flutter.connect(flutterDepth);
  flutter.start(t);
  flutter.stop(t + dur);
  const growl = ctx.createGain();
  growl.gain.value = 0.45;
  growl.connect(shaper);
  [0.985, 1, 1.03, 2.01].forEach((m) => {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(58 * m, t);
    osc.frequency.exponentialRampToValueAtTime(94 * m, t + 0.45);
    osc.frequency.exponentialRampToValueAtTime(80 * m, t + 1.9);
    osc.frequency.exponentialRampToValueAtTime(44 * m, t + dur);
    flutterDepth.connect(osc.frequency);
    osc.connect(growl);
    osc.start(t);
    osc.stop(t + dur);
  });

  // bramido: ruído por dois filtros que abrem e fecham como uma boca
  const breath = ctx.createBufferSource();
  breath.buffer = noiseBuffer(ctx, dur + 0.1);
  (
    [
      [320, 760, 430, 4, 0.9],
      [900, 1600, 780, 5, 0.5],
    ] as const
  ).forEach(([from, peak, end, q, vol]) => {
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = q;
    filter.frequency.setValueAtTime(from, t);
    filter.frequency.exponentialRampToValueAtTime(peak, t + 0.5);
    filter.frequency.exponentialRampToValueAtTime(end, t + dur);
    const gain = ctx.createGain();
    gain.gain.value = vol;
    breath.connect(filter).connect(gain).connect(shaper);
  });
  breath.start(t);
  breath.stop(t + dur + 0.1);

  // sub: o chão tremendo
  const sub = ctx.createOscillator();
  sub.type = "sine";
  sub.frequency.setValueAtTime(46, t);
  sub.frequency.exponentialRampToValueAtTime(30, t + dur);
  const subGain = ctx.createGain();
  subGain.gain.value = 0.7;
  sub.connect(subGain).connect(master);
  sub.start(t);
  sub.stop(t + dur);

  return autoClose(ctx, 8000);
}

/** As asas do dragão passando pertinho de quem olha (duas batidas). */
export function playDragonWhoosh(): () => void {
  if (typeof window === "undefined") return () => {};
  const scene = openSceneContext(0.7);
  if (!scene) return () => {};
  const { ctx, out } = scene;
  const t = ctx.currentTime + 0.05;
  playWhoosh(ctx, out, t);
  playWhoosh(ctx, out, t + 0.5);
  playBoom(ctx, out, t + 0.1);
  return autoClose(ctx, 2500);
}

/** O dragão pousando na pirâmide: um baque grave. */
export function playDragonLanding(): () => void {
  if (typeof window === "undefined") return () => {};
  const scene = openSceneContext(0.7);
  if (!scene) return () => {};
  const { ctx, out } = scene;
  playBoom(ctx, out, ctx.currentTime + 0.05);
  return autoClose(ctx, 2000);
}

/**
 * A magia do dragão (~5.5s): o buraco negro nascendo (um grave que incha), a energia subindo
 * e os relâmpagos estalando nas mãos.
 */
export function playArcaneSurge(): () => void {
  if (typeof window === "undefined") return () => {};
  const scene = openSceneContext(0.55);
  if (!scene) return () => {};
  const { ctx, out } = scene;
  const t = ctx.currentTime + 0.05;

  // buraco negro: grave inchando
  const hole = ctx.createOscillator();
  hole.type = "sine";
  hole.frequency.setValueAtTime(70, t);
  hole.frequency.exponentialRampToValueAtTime(34, t + 5);
  const holeGain = ctx.createGain();
  holeGain.gain.setValueAtTime(0.0001, t);
  holeGain.gain.exponentialRampToValueAtTime(0.7, t + 1.4);
  holeGain.gain.exponentialRampToValueAtTime(0.0001, t + 5.4);
  hole.connect(holeGain).connect(out);
  hole.start(t);
  hole.stop(t + 5.5);

  playRiser(ctx, out, t, t + 1.4);

  // estalos elétricos: rajadas curtas de ruído agudo em horas aleatórias
  const crackle = noiseBuffer(ctx, 0.08);
  for (let i = 0; i < 46; i++) {
    const at = t + 1.2 + Math.random() * 4;
    const src = ctx.createBufferSource();
    src.buffer = crackle;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 1800 + Math.random() * 2500;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.15 + Math.random() * 0.3, at + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.05 + Math.random() * 0.05);
    src.connect(filter).connect(gain).connect(out);
    src.start(at);
    src.stop(at + 0.1);
  }

  // brilho mágico: um acorde agudo (Ré, Fá, Lá) que aparece e some
  [86, 89, 93].forEach((midi, i) => playChime(ctx, out, midi, t + 1.3 + i * 0.12, 2.4, 0.07));

  return autoClose(ctx, 7000);
}
