// THE SCORE — single source of truth for music, voice-over, SFX AND picture.
// Makharijul Huruf · Episode 01 — Mengenal Makharijul Huruf (Al Kindi Islamic School)
(function () {
  const node = typeof require !== 'undefined';
  const U = node ? require('./engine/util') : globalThis.U;
  const MU = node ? require('./engine/music') : globalThis.MUSIC;
  const VO_LINES = node ? require('./vo-data') : globalThis.VO_LINES;
  const { m, makeClock, makeChords } = MU;

  const FPS = 30;
  const FORMAT = U.pickFormat('9:16');
  const [W, H] = U.formatSize(FORMAT);
  const SAFE = U.safeArea(W, H);
  const STYLE = 'flat';

  // ---------- scenes (storyboard timecodes, after a 3.5 s cover) ----------
  const COVER = 3.5;
  // scene lengths (storyboard values, stretched where the recorded voice-over needs room)
  const LEN = { s1: 22.5, s2: 25, s3: 27, s4: 40, s5: 22, s6: 16, s7: 10 };
  const SC = { cover: [0, COVER] };
  { let t0 = COVER; for (const k of Object.keys(LEN)) { SC[k] = [t0, t0 + LEN[k]]; t0 += LEN[k]; } }
  const DURATION = SC.s7[1] + 0.5;
  const S = { cover: SC.cover, s1: SC.s1, s2: SC.s2, s3: SC.s3, s4: SC.s4, s5: SC.s5, s6: SC.s6, s7: [SC.s7[0], DURATION] };

  // ---------- voice-over placement: [line id, scene, offset (s) inside the scene] ----------
  const PLACE = [
    ['a1', 's1', 2.4], ['a2', 's1', 4.9], ['a3', 's1', 10.6], ['a3b', 's1', 12.4], ['a4', 's1', 14.2], ['a5', 's1', 18.6],
    ['b1', 's2', 1.5], ['b2', 's2', 6.2], ['b3', 's2', 14.5],
    ['c1', 's3', 1.5], ['c2', 's3', 8.5], ['c3', 's3', 16.2],
    ['d0', 's4', 1.0], ['d1', 's4', 8.0], ['d2', 's4', 14.0], ['d3', 's4', 20.0], ['d4', 's4', 26.0], ['d5', 's4', 32.0],
    ['e1', 's5', 1.0], ['e2', 's5', 2.8], ['e3', 's5', 8.0], ['e4', 's5', 14.4],
    ['f1', 's6', 1.0], ['f2', 's6', 8.2],
    ['g1', 's7', 1.2], ['g2', 's7', 4.6],
  ];
  const byId = Object.fromEntries(VO_LINES.map((l) => [l.id, l]));
  let prevEnd = 0;
  const VO = PLACE.map(([id, sc, off]) => {
    const l = byId[id];
    const at = Math.max(SC[sc][0] + off, prevEnd + 0.3);
    prevEnd = at + l.dur;
    return { id, at, end: at + l.dur, dur: l.dur, text: l.text, file: l.file };
  });
  const vo = Object.fromEntries(VO.map((v) => [v.id, v]));
  // subtitles: one per voice line, held a little after it ends
  const subtitles = VO.map((v, i) => ({ t: v.at - 0.1, end: Math.min(v.end + 0.5, VO[i + 1] ? VO[i + 1].at - 0.15 : v.end + 0.5), text: v.text }));

  // ---------- picture events (the SFX in song.js read the same times) ----------
  const s = (k, off) => SC[k][0] + off;
  const ev = {
    coverOut: COVER - 0.6, // logo + title fly to the header
    // scene 1
    ba: s('s1', 0.8), mim: s('s1', 1.5), meet: s('s1', 2.4), lips: s('s1', 5.2),
    baSay: vo.a3.at, mimSay: vo.a3b.at, question: vo.a5.at - 0.2, s1out: SC.s1[1] - 1.1,
    // scene 2
    grid: s('s2', 0.2), noEnough: vo.b1.at + 1.2, headIn: s('s2', 5.4), links: vo.b2.at + 0.6, kenali: vo.b2.at + 0.2, s2zoom: s('s2', 22.5),
    // scene 3
    def3: s('s3', 0.6), arabic3: vo.c1.at - 0.2, meaning3: vo.c1.at + 3.0, chips3: vo.c2.at + 0.2, compare3: vo.c3.at + 0.4, s3out: SC.s3[1] - 1.2,
    // scene 4
    m: [vo.d1.at - 0.3, vo.d2.at - 0.3, vo.d3.at - 0.3, vo.d4.at - 0.3, vo.d5.at - 0.3],
    allOn: vo.d0.at + 1.0, s4five: s('s4', 37.0),
    // scene 5
    five: s('s4', 38.3), countA: vo.e3.at + 3.2, countB: vo.e3.at + 5.6, dots17: vo.e3.at + 2.6, grid29: vo.e4.at - 0.4, s5out: SC.s5[1] - 1.0,
    // scene 6
    dim6: vo.f1.at + 3.0, mad: [vo.f2.at + 1.0, vo.f2.at + 1.7, vo.f2.at + 2.4], nextTitle: vo.f1.at + 5.2, s6out: SC.s6[1] - 0.8,
    // scene 7
    title7: s('s7', 0.2), tag7: vo.g1.at + 0.4, logo7: vo.g2.at - 0.4, done7: vo.g2.at + 2.4,
  };

  // the 29 hijaiyah letters (with hamzah), in order
  const HIJAIYAH = ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'و', 'ه', 'ء', 'ي'];
  // when each letter of the 29-grid pops (scene 5)
  const grid29 = HIJAIYAH.map((_, i) => ev.grid29 + i * 0.11);
  // scene 2: letters pop in a ring
  const ring2 = Array.from({ length: 14 }, (_, i) => ev.grid + 0.25 + i * 0.09);
  // counting 5 -> 17: one tick per number
  const count = Array.from({ length: 12 }, (_, i) => ({ n: 6 + i, t: ev.countA + (i * (ev.countB - ev.countA)) / 11 }));

  // ---------- music: gentle, educational, 80 BPM (1 bar = 3 s) ----------
  const clock = makeClock({ bpm: 80, offset: 0 });
  const { T, BEAT } = clock;
  const PROG = ['Fmaj7', 'Am7', 'Bbmaj7', 'Csus'];
  const bars = Math.ceil(DURATION / (BEAT * 4));
  const chordList = [];
  for (let b = 0; b < bars; b++) chordList.push([b, 0, 4, b === bars - 1 || b === bars - 2 ? 'Fmaj7' : PROG[b % 4]]);
  const { chords, chordAt } = makeChords(clock, {
    Fmaj7: { notes: ['A3', 'C4', 'E4', 'F4'], bass: 'F2' },
    Am7: { notes: ['G3', 'C4', 'E4', 'A4'], bass: 'A2' },
    Bbmaj7: { notes: ['A3', 'D4', 'F4', 'Bb4'], bass: 'Bb1' },
    Csus: { notes: ['G3', 'C4', 'F4', 'G4'], bass: 'C2' },
  }, chordList);

  const markers = {
    cover: 1.5,
    header: { t: ev.coverOut + 0.6 },
    ba: { t: ev.ba, sync: 'av' },
    lips: ev.lips + 1,
    question: ev.question + 1,
    s2: SC.s2[0] + 3,
    links: ev.links + 3,
    s3: SC.s3[0] + 6,
    s3b: ev.compare3 + 2,
    jauf: ev.m[0] + 2, halq: ev.m[1] + 2, lisan: ev.m[2] + 2, syafatain: ev.m[3] + 2, khaisyum: ev.m[4] + 2,
    five: ev.s4five + 2.5,
    count: ev.countA + 1,
    s17: ev.countB + 0.5,
    grid29: ev.grid29 + 4,
    s6: ev.mad[2] + 1,
    s7: ev.done7 + 0.5,
  };

  const SCORE = { FPS, FORMAT, W, H, SAFE, STYLE, DURATION, COVER, SC, S, VO, vo, subtitles, ev, HIJAIYAH, grid29, ring2, count, clock, T, BEAT, m, chords, chordAt, markers };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
