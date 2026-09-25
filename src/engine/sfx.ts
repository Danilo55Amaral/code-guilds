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
 * O Mago Danilo lê a fala em voz alta. Emojis saem do texto (a voz leria o
 * nome deles). Devolve a função que interrompe a fala.
 */
export function speakWizard(text: string): () => void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return () => {};
  const synth = window.speechSynthesis;
  const ptVoices = synth.getVoices().filter((v) => v.lang.toLowerCase().startsWith("pt"));
  const voice = ptVoices.find((v) => /daniel|ricardo|antonio|felipe|male|masculin/i.test(v.name)) ?? ptVoices[0];
  const clean = text.replace(/\p{Extended_Pictographic}|️/gu, "").replace(/\s+/g, " ").trim();

  synth.cancel();
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = "pt-BR";
  if (voice) u.voice = voice;
  u.pitch = 0.8; // um pouco grave: voz de mago sábio
  u.rate = 1.05;
  u.volume = 1;
  synth.speak(u);
  return () => synth.cancel();
}
