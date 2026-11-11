// THE SCORE — single source of truth for voice-over, SFX AND picture.
// Makharijul Huruf · Episode 02 — Al-Jauf (Al Kindi Islamic School)
// Scene lengths follow the recorded voice-over: each line starts a small gap after the previous one,
// and each scene ends a short tail after its last line.
(function () {
  const node = typeof require !== 'undefined';
  const U = node ? require('./engine/util') : globalThis.U;
  const MU = node ? require('./engine/music') : globalThis.MUSIC;
  const VO_LINES = node ? require('./vo-data') : globalThis.VO_LINES;
  const { m, makeClock } = MU;

  const FPS = 30;
  const FORMAT = U.pickFormat('9:16');
  const [W, H] = U.formatSize(FORMAT);
  const SAFE = U.safeArea(W, H);
  const STYLE = 'flat';
  const COVER = 3.5;

  // [scene, minimum length, tail after the last line, [[line id, gap before it], ...]]
  const PLAN = [
    ['s1', 18, 2.2, [['a1', 1.0], ['a2', 0.7], ['a3', 0.7], ['a4', 0.7], ['a5', 1.0], ['a6', 0.7]]],
    ['s2', 14, 2.8, [['b1', 1.2], ['b2', 0.9]]],
    ['s3', 22, 2.4, [['c1', 1.0], ['c2', 1.0], ['c3', 1.0]]],
    ['s4', 34, 2.8, [['d0', 1.0], ['d1', 1.2], ['d2', 1.8], ['d3', 1.8]]],
    ['s5', 14, 3.0, [['e1', 1.0], ['e2', 2.8]]],
    ['s6', 20, 2.4, [['f1', 1.0], ['f2', 1.0], ['f3', 1.2]]],
    ['s7', 13, 2.4, [['g1', 1.0], ['g2', 0.9]]],
    ['s8', 9, 2.6, [['h1', 1.2], ['h2', 0.9]]],
  ];
  const byId = Object.fromEntries(VO_LINES.map((l) => [l.id, l]));
  const SC = { cover: [0, COVER] };
  const VO = [];
  let t0 = COVER;
  for (const [sc, minLen, tail, lines] of PLAN) {
    let cur = t0;
    for (const [id, gap] of lines) {
      const l = byId[id];
      const at = cur + gap;
      VO.push({ id, at, end: at + l.dur, dur: l.dur, text: l.text, file: l.file, scene: sc });
      cur = at + l.dur;
    }
    const end = Math.max(t0 + minLen, cur + tail);
    SC[sc] = [t0, end];
    t0 = end;
  }
  const DURATION = t0 + 0.4;
  const S = Object.fromEntries(Object.entries(SC).map(([k, v]) => [k, [v[0], k === 's8' ? DURATION : v[1]]]));
  const vo = Object.fromEntries(VO.map((v) => [v.id, v]));
  const subtitles = VO.map((v, i) => ({ t: v.at - 0.1, end: Math.min(v.end + 0.5, VO[i + 1] ? VO[i + 1].at - 0.15 : v.end + 0.5), text: v.text }));

  // ---------- picture events (song.js puts the SFX on the same times) ----------
  const ev = {
    coverOut: COVER - 0.6,
    // scene 1: qaa / quu / qii
    say: [vo.a2.at, vo.a3.at, vo.a4.at], flow1: vo.a5.at + 0.2, question: vo.a6.at - 0.2, s1out: SC.s1[1] - 1.0,
    // scene 2: recap of the five, then Al-Jauf
    head2: SC.s2[0] + 0.2, allOn2: vo.b1.at + 0.6, focus2: vo.b2.at + 2.6, card2: vo.b2.at + 2.8,
    // scene 3: definition + airflow
    def3: vo.c1.at - 0.1, noPoint3: vo.c2.at + 0.4, flow3: vo.c3.at, s3out: SC.s3[1] - 1.0,
    // scene 4: the three mad letters
    intro4: vo.d0.at, mad: [vo.d1.at - 0.2, vo.d2.at - 0.2, vo.d3.at - 0.2],
    ex: [vo.d1.at + vo.d1.dur * 0.78, vo.d2.at + vo.d2.dur * 0.78, vo.d3.at + vo.d3.dur * 0.8], s4out: SC.s4[1] - 1.0,
    // scene 5: نُوحِيهَا and two harakat
    word5: vo.e1.at + vo.e1.dur * 0.6, chips5: [vo.e1.end + 0.3, vo.e1.end + 0.9, vo.e1.end + 1.5], beats5: [vo.e2.at + vo.e2.dur * 0.7, vo.e2.at + vo.e2.dur * 0.7 + 0.55], s5out: SC.s5[1] - 1.0,
    // scene 6: hamzah, and wau/ya with harakat
    warn6: vo.f1.at - 0.2, hamzah6: vo.f2.at, wy6: vo.f3.at + 0.3, s6out: SC.s6[1] - 1.0,
    // scene 7: teaser Al-Halq
    next7: SC.s7[0] + 0.4, halq7: vo.g1.at + vo.g1.dur * 0.75, six7: vo.g2.at + 0.6, s7out: SC.s7[1] - 0.8,
    // scene 8: closing
    title8: SC.s8[0] + 0.2, tag8: vo.h2.at - 0.2, logo8: vo.h1.at + 0.6, done8: vo.h2.end + 0.3,
  };
  const SIX = ['ء', 'ه', 'ع', 'ح', 'غ', 'خ'];
  const six7 = SIX.map((_, i) => ev.six7 + i * 0.22);

  const clock = makeClock({ bpm: 80, offset: 0 });
  const { T, BEAT } = clock;

  const markers = {
    cover: 1.5,
    qaa: { t: ev.say[0] + 0.4 }, question: ev.question + 1,
    recap: ev.allOn2 + 1.5, jauf: ev.card2 + 1.2,
    def: ev.def3 + 3, noPoint: ev.noPoint3 + 2, flow: ev.flow3 + 2,
    alif: ev.ex[0] + 1, wau: ev.ex[1] + 1, ya: ev.ex[2] + 1.2,
    word: ev.chips5[2] + 0.8, harakat: ev.beats5[1] + 0.6,
    hamzah: ev.hamzah6 + 2, wauya: ev.wy6 + 3,
    halq: ev.six7 + 2, end: ev.done8 + 0.4,
  };

  const SCORE = { FPS, FORMAT, W, H, SAFE, STYLE, DURATION, COVER, SC, S, VO, vo, subtitles, ev, SIX, six7, clock, T, BEAT, m, markers, EPISODE: 2 };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
