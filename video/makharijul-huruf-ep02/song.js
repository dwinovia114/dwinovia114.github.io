// THE SOUNDTRACK — voice-over + soft educational underscore + light SFX, all placed from score.js.
//   node song.js   (STEMS=1 also writes out/stem-*.wav, LUFS=-14 masters to a loudness target)
const path = require('path');
const { SR, Bus, reverb, pingpong } = require('./engine/audio/dsp');
const I = require('./engine/audio/instruments');
const MIX = require('./engine/audio/mix');
const sc = require('./score');
const { DURATION, BEAT, ev, clock, m, VO } = sc;

const N = Math.ceil(DURATION * SR);
const bus = () => new Bus(N);
const voice = bus(), pad = bus(), keys = bus(), bass = bus(), fx = bus(), verb = bus(), dly = bus();

// ---------- voice-over ----------
for (const v of VO) {
  const b = MIX.loadAudio(path.join(__dirname, v.file), { at: v.at, length: DURATION });
  b.mixInto(voice, 1);
}

// Background music is off (voice-over + SFX only). MUSIC=1 node song.js brings it back.
const WITH_MUSIC = process.env.MUSIC === '1';
if (WITH_MUSIC) {
// ---------- pads: warm, slow ----------
for (const c of sc.chords) {
  if (c.t0 >= DURATION) continue;
  const dur = Math.min(c.t1, DURATION) - c.t0;
  for (const n of c.notes) { const { L, R } = I.padNote(n, dur, { cutoff: 900, attack: 0.9, release: 1.6 }); pad.addStereo(L, R, c.t0, 0.07); }
}

// ---------- music-box / e-piano arpeggio (sparse 8ths, rests every other bar half) ----------
clock.eachStep(0, Math.ceil(DURATION / (BEAT * 4)), 8, (t, b, st) => {
  if (t > DURATION - 3) return;
  const c = sc.chordAt(t);
  if (!c) return;
  const pattern = [0, null, 2, 1, 3, null, 2, null];
  const k = pattern[st];
  if (k === null) return;
  const midi = c.notes[k % c.notes.length] + 12;
  const x = I.epiano(midi, BEAT * 0.9, { index: 1.1, decay: 1.4 });
  keys.addMono(x, t, b % 2 ? 0.1 : 0.12, (st / 7 - 0.5) * 0.6);
  dly.addMono(x, t, 0.04);
});
// soft bass on the downbeats
for (const c of sc.chords) {
  if (c.t0 >= DURATION - 1) continue;
  bass.addMono(I.bass(c.bass + 12, BEAT * 3.2, { bright: 0.15, sub: 0.9 }), c.t0, 0.32);
}

}

// ---------- SFX tied to the picture ----------
const pop = (t, g = 0.35, p = 1600, seed = 28) => { fx.addMono(I.pop(p, seed), t, g); };
const whoosh = (t, len = 0.6, g = 0.22) => fx.addMono(I.noiseSweep(len, 300, 5000, { q: 0.8, pink: true }), t - len * 0.5, g);
const chime = (t, midi, g = 0.18) => { const x = I.musicBox(midi); fx.addMono(x, t, g); verb.addMono(x, t, 0.2); };

// cover
chime(0.3, m('C6'), 0.2); chime(0.55, m('F6'), 0.16);
whoosh(ev.coverOut + 0.3, 0.7, 0.2);
// scene 1: a soft pop as each syllable card lands, an airy sweep as the sound "flows"
ev.say.forEach((t, i) => { pop(t, 0.3, 1300 + i * 150, 31 + i); fx.addMono(I.noiseSweep(1.2, 900, 2600, { q: 0.7, pink: true }), t + 0.1, 0.05); });
chime(ev.question, m('A5'), 0.16);
whoosh(ev.s1out + 0.6, 0.8, 0.2);
// scene 2
for (let i = 0; i < 5; i++) fx.addMono(I.woodTick(1 + i * 0.1), ev.allOn2 + i * 0.3, 0.12);
chime(ev.focus2, m('F5'), 0.16); pop(ev.card2, 0.2, 1500, 41);
whoosh(sc.SC.s2[1] - 0.3, 0.8, 0.18);
// scene 3
chime(ev.def3, m('C6'), 0.14);
pop(ev.noPoint3, 0.15, 1700, 51);
fx.addMono(I.noiseSweep(2.4, 500, 3000, { q: 0.6, pink: true }), ev.flow3, 0.08); // the airflow
whoosh(ev.s3out + 0.6, 0.8, 0.18);
// scene 4: one chime per mad letter, a pop when each example word lands
chime(ev.intro4, m('F5'), 0.14);
ev.mad.forEach((t, i) => { chime(t, m(['A5', 'C6', 'D6'][i]), 0.16); whoosh(t, 0.4, 0.08); });
ev.ex.forEach((t, i) => pop(t, 0.18, 1500 + i * 150, 60 + i));
whoosh(ev.s4out + 0.6, 0.8, 0.18);
// scene 5
chime(ev.word5, m('C6'), 0.18);
ev.chips5.forEach((t, i) => pop(t, 0.2, 1400 + i * 200, 70 + i));
ev.beats5.forEach((t) => fx.addMono(I.woodTick(1.2), t, 0.22));
whoosh(ev.s5out + 0.6, 0.8, 0.18);
// scene 6
fx.addMono(I.thud(140, 0.06), ev.warn6, 0.25); chime(ev.warn6 + 0.05, m('E5'), 0.12);
pop(ev.hamzah6, 0.18, 1300, 81);
pop(ev.wy6, 0.18, 1500, 82); pop(ev.wy6 + sc.vo.f3.dur * 0.45, 0.18, 1700, 83);
whoosh(ev.s6out + 0.6, 0.8, 0.18);
// scene 7
whoosh(ev.next7, 0.6, 0.18);
chime(ev.halq7 + 0.3, m('A5'), 0.14);
sc.six7.forEach((t, i) => pop(t, 0.1, 1600 + i * 90, 90 + i));
whoosh(ev.s7out + 0.4, 0.8, 0.16);
// scene 8
chime(ev.title8 + 0.2, m('F5'), 0.15); chime(ev.logo8 + 0.3, m('C6'), 0.16); chime(ev.done8, m('F6'), 0.14);

// ---------- mix ----------
if (WITH_MUSIC) MIX.duck([pad, keys, bass], voice, { depth: 0.55, attack: 0.03, release: 0.6, threshold: 0.03 });
const stems = {
  voice, fx,
  verb: reverb(verb, { room: 0.8, damp: 0.35 }),
  ...(WITH_MUSIC ? { pad, keys, bass, dly: pingpong(dly, BEAT * 0.75, 0.3, 3000) } : {}),
};
const GAIN = { voice: 1.7, pad: 1.4, keys: 0.55, bass: 0.35, fx: 0.7, verb: 0.8, dly: 0.5 };
const out = path.join(__dirname, 'out');
const mix = MIX.mixdown(stems, GAIN, { stemDir: process.env.STEMS ? out : null });
MIX.highpass(mix, 30);
MIX.fadeOut(mix, DURATION - 2.2, DURATION);
const M = MIX.master(mix, parseFloat(process.env.DRIVE || '0.8'), undefined, { lufs: process.env.LUFS ? parseFloat(process.env.LUFS) : -14 });
MIX.writeWav(path.join(out, 'music.wav'), mix);
console.log(`wrote out/music.wav (${DURATION.toFixed(2)}s${M.lufs !== undefined ? `, ${M.lufs.toFixed(1)} LUFS at drive ${M.drive.toFixed(2)}` : ''})`);
