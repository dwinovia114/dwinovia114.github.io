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

// ---------- SFX tied to the picture ----------
const pop = (t, g = 0.35, p = 1600, seed = 28) => { fx.addMono(I.pop(p, seed), t, g); };
const whoosh = (t, len = 0.6, g = 0.22) => fx.addMono(I.noiseSweep(len, 300, 5000, { q: 0.8, pink: true }), t - len * 0.5, g);
const chime = (t, midi, g = 0.18) => { const x = I.musicBox(midi); fx.addMono(x, t, g); verb.addMono(x, t, 0.2); };

// cover
chime(0.3, m('C6'), 0.2); chime(0.55, m('F6'), 0.16);
whoosh(ev.coverOut + 0.3, 0.7, 0.2);
// scene 1
pop(ev.ba, 0.4, 1500, 31); pop(ev.mim, 0.4, 1300, 32); fx.addMono(I.thud(120, 0.06), ev.meet, 0.25);
whoosh(ev.lips, 0.5, 0.15);
chime(ev.question, m('A5'), 0.16);
whoosh(ev.s1out + 0.5, 0.8, 0.2);
// scene 2
for (const [i, t] of sc.ring2.entries()) pop(t, 0.12, 1800 + i * 60, 40 + i);
chime(ev.noEnough, m('C6'), 0.14);
whoosh(ev.headIn, 0.6, 0.14);
for (let i = 0; i < 5; i++) fx.addMono(I.woodTick(1 + i * 0.1), ev.links + i * 0.9, 0.12);
whoosh(ev.s2zoom + 0.6, 1.2, 0.22);
// scene 3
chime(ev.arabic3, m('F5'), 0.15);
for (let i = 0; i < 5; i++) fx.addMono(I.woodTick(1.2), ev.def3 + 0.5 + i * 0.25, 0.08);
pop(ev.chips3, 0.15, 1500, 51); pop(ev.chips3 + 2.6, 0.15, 1700, 52);
whoosh(ev.s3out + 0.6, 0.8, 0.18);
// scene 4: one chime per makhraj, each a step up the scale
const steps = ['F5', 'G5', 'A5', 'C6', 'D6'];
ev.m.forEach((t, i) => { chime(t, m(steps[i]), 0.17); whoosh(t, 0.4, 0.08); });
chime(ev.allOn, m('C5'), 0.1);
whoosh(ev.s4five + 0.8, 1.0, 0.2);
// scene 5
pop(ev.five, 0.3, 1200, 61);
for (const c of sc.count) fx.addMono(I.woodTick(1 + (c.n - 6) * 0.05), c.t, 0.14);
chime(ev.countB, m('C6'), 0.2); chime(ev.countB + 0.12, m('F6'), 0.14);
for (const [i, t] of sc.grid29.entries()) pop(t, 0.08, 1700 + (i % 6) * 120, 70 + i);
whoosh(ev.s5out + 0.4, 0.8, 0.18);
// scene 6
ev.mad.forEach((t, i) => pop(t, 0.3, 1300 + i * 200, 90 + i));
whoosh(ev.nextTitle, 0.6, 0.2); chime(ev.nextTitle + 0.3, m('A5'), 0.14);
whoosh(ev.s6out + 0.3, 0.8, 0.16);
// scene 7
chime(ev.title7 + 0.2, m('F5'), 0.15); chime(ev.logo7 + 0.3, m('C6'), 0.16); chime(ev.done7, m('F6'), 0.14);

// ---------- mix ----------
const music = [pad, keys, bass, dly];
MIX.duck([pad, keys, bass], voice, { depth: 0.55, attack: 0.03, release: 0.6, threshold: 0.03 });
const stems = {
  voice, pad, keys, bass, fx,
  verb: reverb(verb, { room: 0.8, damp: 0.35 }),
  dly: pingpong(dly, BEAT * 0.75, 0.3, 3000),
};
const GAIN = { voice: 1.7, pad: 1.4, keys: 0.55, bass: 0.35, fx: 0.7, verb: 0.8, dly: 0.5 };
const out = path.join(__dirname, 'out');
const mix = MIX.mixdown(stems, GAIN, { stemDir: process.env.STEMS ? out : null });
MIX.highpass(mix, 30);
MIX.fadeOut(mix, DURATION - 2.2, DURATION);
const M = MIX.master(mix, parseFloat(process.env.DRIVE || '0.8'), undefined, { lufs: process.env.LUFS ? parseFloat(process.env.LUFS) : -14 });
MIX.writeWav(path.join(out, 'music.wav'), mix);
console.log(`wrote out/music.wav (${DURATION.toFixed(2)}s${M.lufs !== undefined ? `, ${M.lufs.toFixed(1)} LUFS at drive ${M.drive.toFixed(2)}` : ''})`);
void music;
