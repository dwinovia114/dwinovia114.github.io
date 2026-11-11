// THE FILM — Makharijul Huruf · Episode 02 (Al-Jauf). Every frame is a pure function of t, timed from score.js.
(function () {
  const U = globalThis.U, G = globalThis.G, S = globalThis.SCORE, Studio = globalThis.Studio;
  const { ev, SC, vo } = S;
  const { clamp, lerp, ease } = U;
  const W = G.W, H = G.H;

  // ---------- identity ----------
  const C = { navy: '#182338', navyDeep: '#0F1726', blue: '#3659D9', gold: '#D5A94E', white: '#FFFFFF', soft: 'rgba(255,255,255,0.72)' };
  const REG = {
    jauf: { color: '#2EC4B6', ar: 'الْجَوْفُ', lat: 'AL-JAUF', id: 'Rongga mulut' },
    halq: { color: '#FF6B6B', ar: 'الْحَلْقُ', lat: 'AL-HALQ', id: 'Tenggorokan' },
    lisan: { color: '#F78FB3', ar: 'اللِّسَانُ', lat: 'AL-LISAN', id: 'Lidah' },
    syafatain: { color: '#FFA94D', ar: 'الشَّفَتَانِ', lat: 'ASY-SYAFATAIN', id: 'Dua bibir' },
    khaisyum: { color: '#9D8DF1', ar: 'الْخَيْشُومُ', lat: 'AL-KHAISYUM', id: 'Rongga hidung' },
  };
  const ORDER = ['jauf', 'halq', 'lisan', 'syafatain', 'khaisyum'];
  const SANS = '"Poppins", "Inter", sans-serif';
  const ARAB = '"Noto Naskh Arabic", serif';
  const USER = '@alkindi.islamicschool';

  const P = (t, a, d) => clamp((t - a) / d); // 0..1 progress
  const win = (t, a, b, fi = 0.5, fo = 0.5) => Math.min(P(t, a, fi), 1 - P(t, b - fo, fo)); // fade window
  const hash = (i, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

  let logo = null, pattern = null;

  // ---------- text helpers ----------
  function text(ctx, str, x, y, { size = 40, weight = 600, color = C.white, align = 'center', font = SANS, alpha = 1, ls = 0, base = 'middle', rtl = false, shadow = 0 } = {}) {
    if (alpha <= 0.001) return;
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.font = `${weight} ${size}px ${font}`;
    ctx.textAlign = align; ctx.textBaseline = base;
    ctx.direction = rtl ? 'rtl' : 'ltr';
    if (ls) ctx.letterSpacing = `${ls}px`;
    if (shadow) { ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = shadow; ctx.shadowOffsetY = shadow / 3; }
    ctx.fillStyle = color;
    ctx.fillText(str, x, y);
    ctx.restore();
  }
  const arab = (ctx, str, x, y, o = {}) => text(ctx, str, x, y, Object.assign({ font: ARAB, weight: 700, rtl: true }, o));

  function rrect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function card(ctx, x, y, w, h, { alpha = 1, r = 32, fill = 'rgba(255,255,255,0.065)', stroke = 'rgba(255,255,255,0.14)', glow = null } = {}) {
    if (alpha <= 0.001) return;
    ctx.save(); ctx.globalAlpha *= alpha;
    if (glow) { ctx.shadowColor = glow; ctx.shadowBlur = 40; }
    rrect(ctx, x, y, w, h, r); ctx.fillStyle = fill; ctx.fill();
    ctx.shadowBlur = 0; ctx.lineWidth = 2; ctx.strokeStyle = stroke; ctx.stroke();
    ctx.restore();
  }
  function pill(ctx, str, x, y, { size = 30, color = C.navy, bg = C.gold, alpha = 1, weight = 700, ls = 2, padX = 30, h = null } = {}) {
    if (alpha <= 0.001) return;
    ctx.save(); ctx.font = `${weight} ${size}px ${SANS}`; ctx.letterSpacing = `${ls}px`;
    const w = ctx.measureText(str).width + padX * 2, hh = h || size * 1.9;
    ctx.globalAlpha *= alpha; rrect(ctx, x - w / 2, y - hh / 2, w, hh, hh / 2); ctx.fillStyle = bg; ctx.fill(); ctx.restore();
    text(ctx, str, x + ls / 2, y + 2, { size, weight, color, alpha, ls });
    return w;
  }
  function wrap(ctx, str, maxW) {
    const words = str.split(' '), lines = []; let cur = '';
    for (const w of words) { const tryS = cur ? cur + ' ' + w : w; if (ctx.measureText(tryS).width > maxW && cur) { lines.push(cur); cur = w; } else cur = tryS; }
    if (cur) lines.push(cur);
    return lines;
  }
  function glowDot(ctx, x, y, r, color, a = 1, core = true) {
    if (a <= 0.001) return;
    ctx.save(); ctx.globalAlpha *= a;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3.2);
    g.addColorStop(0, color); g.addColorStop(0.35, color + '66'); g.addColorStop(1, color + '00');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 3.2, 0, Math.PI * 2); ctx.fill();
    if (core) { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(x, y, r * 0.55, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }

  // ---------- background: navy, Islamic geometric pattern, soft light, gold dust ----------
  function buildPattern() {
    const c = document.createElement('canvas'); c.width = W; c.height = H + 240;
    const x = c.getContext('2d');
    const s = 120;
    x.strokeStyle = 'rgba(120,150,255,0.075)'; x.lineWidth = 2;
    for (let gy = -1; gy * s < c.height + s; gy++) for (let gx = -1; gx * s < W + s; gx++) {
      const cx = gx * s + (gy % 2 ? s / 2 : 0), cy = gy * s;
      // 8-point star (two rotated squares) + inner octagon
      for (const rot of [0, Math.PI / 4]) {
        x.beginPath();
        for (let k = 0; k < 4; k++) { const a = rot + k * Math.PI / 2 + Math.PI / 4; const px = cx + Math.cos(a) * s * 0.36, py = cy + Math.sin(a) * s * 0.36; k ? x.lineTo(px, py) : x.moveTo(px, py); }
        x.closePath(); x.stroke();
      }
      x.beginPath(); x.arc(cx, cy, s * 0.11, 0, Math.PI * 2); x.stroke();
    }
    return c;
  }
  function background(ctx, t) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#1B2843'); g.addColorStop(0.55, C.navy); g.addColorStop(1, '#111A2C');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // drifting pattern
    if (pattern) { const off = (t * 6) % 240; ctx.drawImage(pattern, 0, -off); }
    // soft blue light blobs
    const blobs = [[0.2, 0.25, 520, 0.18], [0.85, 0.62, 600, 0.16], [0.4, 0.95, 500, 0.12]];
    blobs.forEach(([bx, by, r, a], i) => {
      const x = bx * W + Math.sin(t * 0.15 + i * 2) * 80, y = by * H + Math.cos(t * 0.12 + i) * 70;
      const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
      rg.addColorStop(0, `rgba(54,89,217,${a})`); rg.addColorStop(1, 'rgba(54,89,217,0)');
      ctx.fillStyle = rg; ctx.fillRect(x - r, y - r, r * 2, r * 2);
    });
    // gold dust
    for (let i = 0; i < 46; i++) {
      const sp = 10 + hash(i, 1) * 25;
      const x = hash(i, 2) * W + Math.sin(t * 0.4 + i) * 14;
      const y = ((hash(i, 3) * (H + 100) - t * sp) % (H + 100) + H + 100) % (H + 100) - 50;
      const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * (1 + hash(i, 4) * 2) + i));
      ctx.fillStyle = `rgba(213,169,78,${0.35 * tw})`;
      ctx.beginPath(); ctx.arc(x, y, 1.5 + hash(i, 5) * 2.5, 0, Math.PI * 2); ctx.fill();
    }
  }

  // ---------- the anatomy: one side-view head used throughout (face to the left) ----------
  const HEAD = new Path2D('M560 905 C560 780 590 700 620 640 C700 560 725 380 660 250 C600 120 450 58 330 80 C220 100 150 180 140 280 C138 320 152 345 140 368 C120 410 82 450 70 482 C62 502 76 516 100 516 C116 516 126 521 131 530 C128 546 116 556 113 571 C108 582 113 593 131 597 C112 602 106 616 117 631 C126 643 141 646 139 661 C131 691 141 721 182 731 C242 742 300 746 330 762 C345 800 352 860 347 905 Z');
  const SHAPE = {
    khaisyum: new Path2D('M112 503 C140 452 262 424 382 431 C452 436 494 470 492 520 L470 534 C382 522 242 524 132 522 Z'),
    jauf: new Path2D('M158 566 C252 538 392 538 468 556 C492 572 500 602 494 630 C462 604 392 588 302 586 C236 586 190 594 166 604 Z'),
    lisan: new Path2D('M158 612 C198 592 298 584 390 590 C470 598 506 650 506 720 C506 782 482 822 452 842 L382 802 C332 762 262 694 202 662 C172 652 150 632 158 612 Z'),
    halq: new Path2D('M508 618 C516 700 508 782 474 852 L472 905 L550 905 C552 782 544 640 528 556 C520 586 512 604 508 618 Z'),
    syafatain: new Path2D('M131 548 C112 556 100 586 112 598 C100 614 106 640 138 648 L152 632 L152 562 Z'),
  };
  const PALATE = new Path2D('M150 560 C220 538 360 530 460 548 C490 556 506 584 500 616');
  const ANCHOR = { khaisyum: [300, 476], jauf: [326, 566], lisan: [340, 650], halq: [524, 760], syafatain: [116, 598] };
  // 17 makhraj points (illustrative): first one of each region, then the rest
  const DOTS17 = [
    [326, 566], [524, 760], [360, 588], [114, 598], [300, 476], // jauf, halq, lisan, syafatain, khaisyum
    [532, 850], [516, 668], // halq: deep + upper
    [470, 600], [430, 592], [300, 604], [262, 596], [228, 598], [198, 603], [176, 611], [160, 594], [150, 620], // lisan (+9)
    [128, 624], // syafatain: lower lip with upper teeth
  ];
  const CEN = [395, 490]; // drawing centre in local units

  function drawHead(ctx, t, x, y, s, alpha, st, { dots17 = 0, dotsAt = null } = {}) {
    if (alpha <= 0.001) return;
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.translate(x - CEN[0] * s, y - CEN[1] * s);
    ctx.scale(s, s);
    // silhouette
    ctx.save(); ctx.shadowColor = 'rgba(54,89,217,0.55)'; ctx.shadowBlur = 50;
    const hg = ctx.createLinearGradient(0, 80, 0, 905); hg.addColorStop(0, '#2A3B63'); hg.addColorStop(1, '#1F2D4C');
    ctx.fillStyle = hg; ctx.fill(HEAD); ctx.restore();
    // neck fade at the bottom
    ctx.save(); ctx.clip(HEAD);
    // inner cavities (base)
    ctx.fillStyle = '#131D33';
    ctx.fill(SHAPE.khaisyum); ctx.fill(SHAPE.jauf); ctx.fill(SHAPE.halq);
    ctx.fillStyle = '#3B4E7E'; ctx.fill(SHAPE.lisan);
    ctx.fillStyle = '#2E3F68'; ctx.fill(SHAPE.syafatain);
    // tints + glows
    for (const r of ORDER) {
      const q = st[r]; const col = REG[r].color;
      const a = q.tint * (1 - 0.72 * q.dim);
      if (a > 0.001) {
        ctx.save(); ctx.globalAlpha *= a * 0.85;
        if (q.glow > 0) { ctx.shadowColor = col; ctx.shadowBlur = 45 * q.glow; }
        ctx.fillStyle = col; ctx.fill(SHAPE[r]); ctx.restore();
      }
      if (q.glow > 0.01) {
        const pulseA = 0.55 + 0.45 * Math.sin(t * 5);
        ctx.save(); ctx.globalAlpha *= q.glow * (0.6 + 0.4 * pulseA);
        ctx.lineWidth = 5; ctx.strokeStyle = '#fff'; ctx.shadowColor = col; ctx.shadowBlur = 30; ctx.stroke(SHAPE[r]); ctx.restore();
      }
    }
    // palate, teeth, details
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#8FA6E8'; ctx.lineWidth = 7; ctx.stroke(PALATE);
    ctx.fillStyle = '#EEF2FF';
    rrect(ctx, 136, 568, 16, 28, 5); ctx.fill(); rrect(ctx, 140, 604, 15, 24, 5); ctx.fill();
    // vocal folds
    ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(478, 868); ctx.lineTo(546, 862); ctx.stroke();
    ctx.restore();
    // outline
    ctx.lineJoin = 'round'; ctx.strokeStyle = 'rgba(160,185,255,0.85)'; ctx.lineWidth = 5; ctx.stroke(HEAD);
    // eye + ear hint
    ctx.fillStyle = 'rgba(160,185,255,0.8)'; ctx.beginPath(); ctx.ellipse(205, 360, 9, 13, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(160,185,255,0.45)'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.ellipse(560, 420, 34, 55, 0.15, -1.2, 2.6); ctx.stroke();
    // 17 articulation points
    if (dots17 > 0 && dotsAt) {
      DOTS17.forEach(([dx, dy], i) => {
        const tp = dotsAt(i); if (t < tp) return;
        const k = ease.outBack(P(t, tp, 0.35), 3);
        const flash = 1 - P(t, tp, 0.6);
        ctx.save(); ctx.globalAlpha *= dots17;
        ctx.fillStyle = C.gold; ctx.shadowColor = C.gold; ctx.shadowBlur = 20 + 30 * flash;
        ctx.beginPath(); ctx.arc(dx, dy, 11 * k / Math.max(0.6, s) * 0.8, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });
    }
    ctx.restore();
  }
  const toScreen = (hk, lx, ly) => [hk[0] + (lx - CEN[0]) * hk[2], hk[1] + (ly - CEN[1]) * hk[2]];
  // ---------- header & footer (persistent identity) ----------
  const LOGO_COVER = [540, 600, 250], LOGO_HDR = [112, 138, 58], LOGO_END = [540, 1135, 120];
  function drawLogo(ctx, x, y, r, a = 1) {
    if (!logo || a <= 0.001) return;
    ctx.save(); ctx.globalAlpha *= a;
    ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = r * 0.25; ctx.shadowOffsetY = r * 0.06;
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.beginPath(); ctx.arc(x, y, r * 0.985, 0, Math.PI * 2); ctx.clip();
    const k = (r * 2) / 0.965; // the badge fills ~96.5% of the image
    ctx.drawImage(logo, x - k / 2, y - k / 2, k, k);
    ctx.restore();
  }
  function header(ctx, t) {
    // logo: cover -> corner -> (closing) centre
    const f1 = ease.inOutCubic(P(t, ev.coverOut, 0.9));
    const f2 = ease.inOutCubic(P(t, ev.logo8, 1.1));
    let L = LOGO_COVER.map((v, i) => lerp(v, LOGO_HDR[i], f1));
    if (f2 > 0) L = L.map((v, i) => lerp(v, LOGO_END[i], f2));
    // little arc on the path for a livelier move
    const arc = Math.sin(Math.PI * f1) * 60 * (1 - f2) + Math.sin(Math.PI * f2) * -80;
    drawLogo(ctx, L[0] - arc * 0.3, L[1] - arc, L[2]);
    if (f2 > 0.98) {
      // gentle breathing ring around the final logo
      const q = 0.5 + 0.5 * Math.sin(t * 2.4);
      ctx.save(); ctx.globalAlpha = P(t, ev.logo8 + 1.1, 0.6) * (0.25 + 0.25 * q);
      ctx.strokeStyle = C.gold; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(L[0], L[1], L[2] + 14 + 6 * q, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    }
    // header title (top-right) slides in after the cover, leaves for the closing title
    const ha = ease.outCubic(P(t, ev.coverOut + 0.35, 0.8)) * (1 - P(t, ev.title8 - 0.2, 0.6));
    if (ha > 0.001) {
      const dx = (1 - ease.outCubic(P(t, ev.coverOut + 0.35, 0.8))) * 120;
      const xR = 1020 + dx;
      text(ctx, 'BELAJAR MAKHARIJUL HURUF', xR, 118, { size: 33, weight: 800, align: 'right', alpha: ha, ls: 1 });
      ctx.save(); ctx.globalAlpha = ha; ctx.fillStyle = C.gold; ctx.fillRect(xR - 70, 142, 70, 4); ctx.restore();
      text(ctx, 'Episode 2: Al-Jauf (Rongga Mulut)', xR, 172, { size: 25, weight: 500, align: 'right', alpha: ha, color: C.gold });
    }
  }
  function footer(ctx, t) {
    const y = 1812;
    ctx.save(); ctx.font = `600 34px ${SANS}`; ctx.letterSpacing = '1px';
    const w = ctx.measureText(USER).width + 70; ctx.restore();
    const a = P(t, 0.25, 0.6);
    card(ctx, 540 - w / 2, y - 34, w, 68, { r: 34, alpha: a, fill: 'rgba(15,23,38,0.55)', stroke: 'rgba(213,169,78,0.55)' });
    text(ctx, USER, 540, y + 2, { size: 34, weight: 600, alpha: a, ls: 1 });
  }

  // ---------- subtitles ----------
  function subtitles(ctx, t) {
    if (t < SC.s1[0]) return;
    const s = S.subtitles.find((q) => t >= q.t && t < q.end);
    if (!s) return;
    const a = Math.min(P(t, s.t, 0.15), 1 - P(t, s.end - 0.15, 0.15));
    ctx.save(); ctx.font = `500 37px ${SANS}`;
    const lines = wrap(ctx, s.text, 900);
    const lw = Math.max(...lines.map((l) => ctx.measureText(l).width));
    ctx.restore();
    const lh = 52, h = lines.length * lh + 34, y0 = 1532 - h / 2;
    card(ctx, 540 - lw / 2 - 34, y0, lw + 68, h, { r: 24, alpha: a, fill: 'rgba(11,17,31,0.78)', stroke: 'rgba(255,255,255,0.10)' });
    lines.forEach((l, i) => text(ctx, l, 540, y0 + 17 + lh / 2 + i * lh + 2, { size: 37, weight: 500, alpha: a }));
  }

  // ---------- COVER ----------
  function cover(ctx, t) {
    const a = 1 - P(t, ev.coverOut, 0.6);
    if (a <= 0) return;
    const k = ease.outCubic(P(t, 0.1, 0.9));
    // rays behind logo
    ctx.save(); ctx.globalAlpha = a * 0.5 * k; ctx.translate(540, 600); ctx.rotate(t * 0.15);
    for (let i = 0; i < 16; i++) { ctx.rotate(Math.PI / 8); const g = ctx.createLinearGradient(0, 0, 0, -520); g.addColorStop(0, 'rgba(213,169,78,0.35)'); g.addColorStop(1, 'rgba(213,169,78,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(18, 0); ctx.lineTo(60, -520); ctx.lineTo(-60, -520); ctx.fill(); }
    ctx.restore();
    const up = (1 - k) * 40;
    pill(ctx, 'SERI TAJWID  •  EPISODE 02', 540, 948 + up, { size: 26, alpha: a * P(t, 0.4, 0.5), ls: 3 });
    text(ctx, 'BELAJAR', 540, 1052 + up, { size: 58, weight: 600, color: C.gold, alpha: a * P(t, 0.5, 0.5), ls: 18 });
    text(ctx, 'MAKHARIJUL', 540, 1160 + up, { size: 118, weight: 800, alpha: a * P(t, 0.65, 0.5), ls: 2, shadow: 20 });
    text(ctx, 'HURUF', 540, 1285 + up, { size: 118, weight: 800, alpha: a * P(t, 0.8, 0.5), ls: 10, shadow: 20 });
    arab(ctx, 'مَخَارِجُ الْحُرُوفِ', 540, 1420 + up, { size: 72, color: C.gold, alpha: a * P(t, 1.0, 0.6) });
    text(ctx, 'Episode 2: Al-Jauf (Rongga Mulut)', 540, 1545 + up, { size: 34, weight: 500, color: C.soft, alpha: a * P(t, 1.2, 0.6) });
  }

  function waves(ctx, x, y, t0, t, color, { dir = 0, spread = 0.9, n = 3, r0 = 60, len = 1.2 } = {}) {
    const age = t - t0; if (age < 0 || age > len + 0.6) return;
    for (let i = 0; i < n; i++) {
      const q = (age - i * 0.18) / len; if (q < 0 || q > 1) continue;
      ctx.save(); ctx.globalAlpha = (1 - q) * 0.9; ctx.strokeStyle = color; ctx.lineWidth = 7 * (1 - q) + 2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(x, y, r0 + q * 160, dir - spread, dir + spread); ctx.stroke(); ctx.restore();
    }
  }


  // ---------- head placement over time (keyframes): x, y, scale, alpha ----------
  function headKey(t) {
    const k = [];
    const add = (t0, v) => k.push([t0, v]);
    add(0, [540, 700, 0.8, 0]);
    add(SC.s2[0], [540, 700, 0.8, 0]);
    add(SC.s2[0] + 0.9, [540, 690, 0.85, 1]);
    add(SC.s2[1] - 0.6, [540, 690, 0.85, 1]);
    add(SC.s3[0] + 1.0, [560, 690, 1.05, 1]);
    add(ev.s3out, [560, 690, 1.05, 1]);
    add(ev.s3out + 0.9, [560, 690, 1.1, 0]);
    add(SC.s7[0] - 0.2, [540, 700, 0.8, 0]);
    add(SC.s7[0] + 0.7, [540, 690, 0.85, 1]);
    add(ev.halq7 - 0.4, [540, 690, 0.85, 1]);
    add(ev.halq7 + 1.4, [430, 640, 1.15, 1]); // zoom toward the throat
    add(ev.s7out, [430, 640, 1.15, 1]);
    add(ev.s7out + 0.8, [430, 640, 1.2, 0]);
    let a = k[0], b = k[k.length - 1];
    if (t >= k[k.length - 1][0]) return k[k.length - 1][1];
    for (let i = 0; i < k.length - 1; i++) if (t >= k[i][0] && t < k[i + 1][0]) { a = k[i]; b = k[i + 1]; break; }
    const f = ease.inOutCubic(clamp((t - a[0]) / Math.max(1e-6, b[0] - a[0])));
    return a[1].map((v, i) => lerp(v, b[1][i], f));
  }
  function regionState(t) {
    const st = {};
    for (const r of ORDER) st[r] = { tint: 0, glow: 0, dim: 0 };
    // scene 2: the five again, then only Al-Jauf
    if (t < SC.s3[1] + 1) {
      ORDER.forEach((r, i) => { st[r].tint = P(t, ev.allOn2 + i * 0.3, 0.5); });
      ORDER.forEach((r) => { if (r === 'jauf') st[r].glow = P(t, ev.focus2, 0.6); else st[r].dim = P(t, ev.focus2, 0.8); });
    }
    // scene 3: Al-Jauf reaches down into the throat cavity too
    if (t >= SC.s3[0] - 0.5 && t < SC.s4[0]) {
      st.halq.tint = 0; st.halq.dim = 0; st.halq.glow = 0;
      st.jauf.tint = 1; st.jauf.glow = 1;
    }
    // scene 7: the five, then only Al-Halq
    if (t >= SC.s7[0] - 1) {
      ORDER.forEach((r) => { st[r].tint = P(t, SC.s7[0] + 0.4, 0.8); st[r].glow = 0; st[r].dim = 0; });
      ORDER.forEach((r) => { if (r === 'halq') st[r].glow = P(t, ev.halq7, 0.6); else st[r].dim = P(t, ev.halq7, 0.8); });
    }
    return st;
  }
  // the throat part of the cavity (drawn in teal during scene 3 so Al-Jauf reads as mouth + throat space)
  function throatCavity(ctx, t, hk, a) {
    if (a <= 0.001) return;
    ctx.save(); ctx.globalAlpha = a;
    ctx.translate(hk[0] - CEN[0] * hk[2], hk[1] - CEN[1] * hk[2]); ctx.scale(hk[2], hk[2]);
    ctx.clip(HEAD);
    ctx.fillStyle = REG.jauf.color; ctx.globalAlpha *= 0.55; ctx.shadowColor = REG.jauf.color; ctx.shadowBlur = 30;
    ctx.fill(SHAPE.halq);
    ctx.restore();
  }
  // airflow: particles rising from the voice box through the throat and mouth, out past the lips
  const FLOW = [[505, 880], [520, 770], [515, 650], [478, 578], [380, 562], [262, 574], [160, 598], [40, 604], [-60, 606]];
  const FLOWLEN = FLOW.slice(1).reduce((acc, p, i) => acc + Math.hypot(p[0] - FLOW[i][0], p[1] - FLOW[i][1]), 0);
  function flowAt(d) {
    for (let i = 1; i < FLOW.length; i++) {
      const seg = Math.hypot(FLOW[i][0] - FLOW[i - 1][0], FLOW[i][1] - FLOW[i - 1][1]);
      if (d <= seg) { const q = d / seg; return [lerp(FLOW[i - 1][0], FLOW[i][0], q), lerp(FLOW[i - 1][1], FLOW[i][1], q)]; }
      d -= seg;
    }
    return FLOW[FLOW.length - 1];
  }
  function airflow(ctx, t, hk, a, color = '#BFFCF6') {
    if (a <= 0.001) return;
    ctx.save(); ctx.globalAlpha = a;
    for (let i = 0; i < 46; i++) {
      const speed = 260 + hash(i, 7) * 80;
      const d = ((t * speed + hash(i, 8) * FLOWLEN) % FLOWLEN);
      const [lx, ly] = flowAt(d);
      const wob = Math.sin(t * 3 + i) * 7;
      const [x, y] = toScreen(hk, lx, ly + wob);
      const fade = Math.min(1, d / 80, (FLOWLEN - d) / 120);
      ctx.globalAlpha = a * fade * (0.5 + 0.5 * hash(i, 9));
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, (3 + 4 * hash(i, 10)) * hk[2], 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  // ---------- SCENE 1: qaa / quu / qii ----------
  const SAY = [{ ar: 'قَا', lat: 'QĀ' }, { ar: 'قُو', lat: 'QŪ' }, { ar: 'قِي', lat: 'QĪ' }];
  function scene1(ctx, t) {
    const a = win(t, SC.s1[0], ev.s1out + 0.8, 0.4, 0.8);
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    // the three syllables, each with a long, flowing sound ribbon
    SAY.forEach((s, i) => {
      const t0 = ev.say[i]; if (t < t0 - 0.05) return;
      const k = ease.outBack(P(t, t0, 0.45), 2.2);
      const y = 430 + i * 250;
      const x = 330;
      const lit = 1 - 0.55 * P(t, t0 + 1.6, 0.6);
      card(ctx, 110, y - 95, 860, 190, { alpha: k, r: 40, fill: 'rgba(15,23,38,0.75)', stroke: 'rgba(46,196,182,' + (0.25 + 0.6 * lit) + ')' });
      arab(ctx, s.ar, x - 90, y - 18, { size: 150 * k, alpha: k, shadow: 20 });
      text(ctx, s.lat, x - 90, y + 64, { size: 30, weight: 700, color: C.gold, alpha: k, ls: 6 });
      // ribbon: grows while the vowel is held
      const grow = ease.outCubic(P(t, t0 + 0.1, 1.2));
      if (grow > 0) {
        ctx.save(); ctx.globalAlpha *= k * (0.35 + 0.65 * lit);
        const x0 = x + 30, x1 = x0 + 560 * grow;
        const g = ctx.createLinearGradient(x0, 0, x0 + 560, 0); g.addColorStop(0, REG.jauf.color); g.addColorStop(1, 'rgba(46,196,182,0.1)');
        ctx.strokeStyle = g; ctx.lineWidth = 8; ctx.lineCap = 'round';
        for (let w = 0; w < 3; w++) {
          ctx.globalAlpha = (ctx.globalAlpha || 1) * (w ? 0.5 : 1);
          ctx.beginPath();
          for (let xx = x0; xx <= x1; xx += 6) {
            const amp = 26 * (1 - (xx - x0) / 600) * (w === 1 ? -0.6 : w === 2 ? 0.4 : 1);
            const yy = y + Math.sin((xx - x0) * 0.035 - t * 6 + w) * amp;
            xx === x0 ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy);
          }
          ctx.stroke();
        }
        ctx.restore();
      }
    });
    // "no single point" hint
    const fa = ease.outCubic(P(t, ev.flow1 + 1.2, 0.5)) * (1 - P(t, ev.question - 0.3, 0.4));
    if (fa > 0) pill(ctx, 'MENGALIR • TANPA TITIK TERTAHAN', 540, 1210, { size: 26, alpha: fa, bg: REG.jauf.color, color: C.navy, ls: 2 });
    // the question
    const qa = ease.outCubic(P(t, ev.question, 0.5)) * (1 - P(t, ev.s1out - 0.3, 0.5));
    if (qa > 0) {
      const dy = (1 - qa) * 30;
      text(ctx, 'DARI MANA', 540, 1185 + dy, { size: 58, weight: 800, color: C.gold, alpha: qa, ls: 4 });
      text(ctx, 'BUNYI PANJANG ITU?', 540, 1255 + dy, { size: 58, weight: 800, alpha: qa, ls: 2 });
    }
    ctx.restore();
  }

  // ---------- SCENE 2: recap, then Al-Jauf ----------
  function scene2(ctx, t, hk) {
    const a = win(t, SC.s2[0] - 0.2, SC.s2[1] + 0.3, 0.5, 0.8);
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    // the five as chips under the head
    ORDER.forEach((r, i) => {
      const on = P(t, ev.allOn2 + i * 0.3, 0.4);
      if (on <= 0) return;
      const focus = P(t, ev.focus2, 0.6);
      const isJ = r === 'jauf';
      const x = 540 + (i - 2) * 92, y = 1072;
      ctx.save(); ctx.globalAlpha *= on * (isJ ? 1 : 1 - 0.55 * focus);
      ctx.fillStyle = REG[r].color; if (isJ && focus) { ctx.shadowColor = REG[r].color; ctx.shadowBlur = 25 * focus; }
      ctx.beginPath(); ctx.arc(x, y, 30 + (isJ ? 8 * focus : 0), 0, Math.PI * 2); ctx.fill(); ctx.restore();
      text(ctx, String(i + 1), x, y + 2, { size: 28 + (isJ ? 6 * focus : 0), weight: 800, color: C.navy, alpha: on });
    });
    text(ctx, '5 MAKHRAJ UTAMA', 540, 300, { size: 46, weight: 800, alpha: P(t, ev.allOn2, 0.5) * (1 - P(t, ev.focus2 - 0.2, 0.4)), ls: 3 });
    // focus card
    const ca = ease.outCubic(P(t, ev.card2, 0.5));
    if (ca > 0) {
      pill(ctx, 'MAKHRAJ PERTAMA', 540, 300, { size: 28, alpha: ca, bg: REG.jauf.color, color: C.navy, ls: 4 });
      const y0 = 1130 + (1 - ca) * 40;
      card(ctx, 110, y0, 860, 230, { alpha: ca, r: 36, fill: 'rgba(15,23,38,0.86)', stroke: REG.jauf.color, glow: REG.jauf.color + '66' });
      ctx.save(); ctx.globalAlpha *= ca; ctx.fillStyle = REG.jauf.color; ctx.beginPath(); ctx.arc(215, y0 + 115, 62, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      text(ctx, '1', 215, y0 + 119, { size: 70, weight: 800, color: C.navy, alpha: ca });
      arab(ctx, 'الْجَوْفُ', 925, y0 + 70, { size: 76, alpha: ca, align: 'right' });
      text(ctx, 'AL-JAUF', 315, y0 + 140, { size: 54, weight: 800, color: REG.jauf.color, align: 'left', alpha: ca, ls: 2 });
      text(ctx, 'Rongga mulut', 315, y0 + 192, { size: 34, weight: 500, color: C.soft, align: 'left', alpha: ca });
    }
    ctx.restore();
  }

  // ---------- SCENE 3: what Al-Jauf is ----------
  function scene3(ctx, t, hk) {
    const a = win(t, SC.s3[0] - 0.4, ev.s3out + 0.8, 0.6, 0.8);
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    throatCavity(ctx, t, hk, a * P(t, ev.def3 + 1.6, 0.8));
    // label pills on the cavity
    const la = ease.outCubic(P(t, ev.def3 + 1.0, 0.5));
    const [mx, my] = toScreen(hk, 330, 568), [tx, ty] = toScreen(hk, 524, 760);
    const lab = (txt, x0, y0, ax, ay, q) => {
      if (q <= 0) return;
      glowDot(ctx, ax, ay, 11, REG.jauf.color, q);
      ctx.save(); ctx.globalAlpha *= q; ctx.strokeStyle = REG.jauf.color; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(x0, y0); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.font = `600 30px ${SANS}`; const tw = ctx.measureText(txt).width; ctx.restore();
      const bx = x0 > 540 ? x0 - tw - 40 : x0;
      card(ctx, bx, y0 - 28, tw + 40, 56, { r: 28, alpha: q, fill: 'rgba(15,23,38,0.88)', stroke: REG.jauf.color });
      text(ctx, txt, bx + 20, y0 + 2, { size: 30, weight: 600, align: 'left', alpha: q });
    };
    const out = 1 - P(t, ev.noPoint3 - 0.4, 0.4);
    lab('Rongga mulut', 1010, 330, mx, my, la * out);
    lab('Rongga tenggorokan', 1010, 1010, tx, ty, ease.outCubic(P(t, ev.def3 + 1.6, 0.5)) * out);
    // "no fixed touch point": a target that does not land
    const np = ease.outCubic(P(t, ev.noPoint3, 0.5)) * (1 - P(t, ev.flow3 - 0.3, 0.4));
    if (np > 0) {
      const [cx, cy] = toScreen(hk, 330, 568);
      const r = 46 + 6 * Math.sin(t * 4);
      ctx.save(); ctx.globalAlpha *= np; ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.setLineDash([10, 10]); ctx.lineDashOffset = -t * 30;
      ctx.beginPath(); ctx.arc(cx + Math.sin(t * 2.2) * 40, cy + Math.cos(t * 1.7) * 14, r, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      pill(ctx, 'TIDAK ADA TITIK SENTUH PASTI', 540, 300, { size: 26, alpha: np, bg: C.gold, ls: 2 });
    }
    // airflow
    const fa = P(t, ev.flow3, 0.6) * (1 - P(t, ev.s3out - 0.2, 0.6));
    airflow(ctx, t, hk, fa);
    if (fa > 0) pill(ctx, 'MENGALIR BERSAMA UDARA', 540, 300, { size: 26, alpha: fa, bg: REG.jauf.color, color: C.navy, ls: 2 });
    // definition card
    const ca = ease.outCubic(P(t, ev.def3, 0.6)) * (1 - P(t, ev.s3out - 0.2, 0.6));
    if (ca > 0) {
      const y0 = 1150 + (1 - ca) * 40;
      card(ctx, 90, y0, 900, 210, { alpha: ca, r: 36, fill: 'rgba(15,23,38,0.86)', stroke: 'rgba(213,169,78,0.5)' });
      arab(ctx, 'الْجَوْفُ', 540, y0 + 66, { size: 74, color: C.gold, alpha: ca });
      text(ctx, 'AL-JAUF  =  RONGGA', 540, y0 + 148, { size: 44, weight: 800, alpha: ca, ls: 3 });
      text(ctx, 'ruang kosong di mulut & tenggorokan', 540, y0 + 188, { size: 26, weight: 500, color: C.soft, alpha: ca });
    }
    ctx.restore();
  }

  // ---------- SCENE 4: the three mad letters ----------
  const MAD = [
    { ch: 'ا', name: 'ALIF SUKUN', rule: 'didahului fathah', mark: 'ـَ', word: 'قَالَ', lat: 'qāla' },
    { ch: 'وْ', name: 'WAU SUKUN', rule: 'didahului dhammah', mark: 'ـُ', word: 'يَقُولُ', lat: 'yaqūlu' },
    { ch: 'يْ', name: 'YA SUKUN', rule: 'didahului kasrah', mark: 'ـِ', word: 'قِيلَ', lat: 'qīla' },
  ];
  function scene4(ctx, t) {
    const a = win(t, SC.s4[0] - 0.2, ev.s4out + 0.8, 0.5, 0.8);
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const ta = ease.outCubic(P(t, ev.intro4, 0.5));
    text(ctx, 'TIGA HURUF MAD', 540, 300, { size: 54, weight: 800, alpha: ta, ls: 4 });
    text(ctx, 'yang keluar dari Al-Jauf', 540, 355, { size: 30, weight: 500, color: REG.jauf.color, alpha: ta });
    const cur = ev.mad.findIndex((t0, i) => t >= t0 && t < (ev.mad[i + 1] || ev.s4out + 5));
    MAD.forEach((d, i) => {
      const t0 = ev.mad[i]; if (t < t0) return;
      const k = ease.outCubic(P(t, t0, 0.5));
      const y = 420 + i * 300;
      const act = i === cur ? 1 : 0.55;
      ctx.save(); ctx.translate((1 - k) * 160, 0);
      card(ctx, 70, y, 940, 270, { alpha: k * act + (1 - act) * 0, r: 36, fill: 'rgba(15,23,38,0.86)', stroke: i === cur ? REG.jauf.color : 'rgba(255,255,255,0.14)', glow: i === cur ? REG.jauf.color + '55' : null });
      if (act < 1) card(ctx, 70, y, 940, 270, { alpha: k * 0.6, r: 36, fill: 'rgba(15,23,38,0.6)', stroke: 'rgba(255,255,255,0.1)' });
      const al = k * act;
      // mad letter badge
      ctx.save(); ctx.globalAlpha *= al; ctx.fillStyle = REG.jauf.color; ctx.beginPath(); ctx.arc(185, y + 135, 78, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      arab(ctx, d.ch, 185, y + 120, { size: 104, color: C.navy, alpha: al });
      // rule
      text(ctx, d.name, 300, y + 72, { size: 40, weight: 800, align: 'left', alpha: al, ls: 2 });
      text(ctx, d.rule, 300, y + 120, { size: 30, weight: 500, align: 'left', color: C.soft, alpha: al });
      // formula: harakat + letter
      arab(ctx, d.mark, 325, y + 178, { size: 84, color: C.gold, alpha: al });
      text(ctx, '+', 395, y + 200, { size: 40, weight: 700, color: C.soft, alpha: al });
      arab(ctx, d.ch, 455, y + 178, { size: 72, color: REG.jauf.color, alpha: al });
      // example
      const ex = ease.outBack(P(t, ev.ex[i], 0.45), 2);
      if (ex > 0) {
        ctx.save(); ctx.globalAlpha *= al * Math.min(1, ex); ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(620, y + 40); ctx.lineTo(620, y + 230); ctx.stroke(); ctx.restore();
        arab(ctx, d.word, 815, y + 112, { size: 96 * Math.max(0.01, ex), alpha: al * Math.min(1, ex) });
        text(ctx, d.lat, 815, y + 210, { size: 34, weight: 600, color: C.gold, alpha: al * Math.min(1, ex), ls: 1 });
        // the vowel being held: a short flow under the word
        waves(ctx, 815, y + 112, ev.ex[i], t, REG.jauf.color, { dir: Math.PI / 2, spread: 0.6, r0: 70, len: 1.0 });
      }
      ctx.restore();
    });
    ctx.restore();
  }

  // ---------- SCENE 5: نُوحِيهَا + two harakat ----------
  function scene5(ctx, t) {
    const a = win(t, SC.s5[0] - 0.2, ev.s5out + 0.8, 0.5, 0.8);
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const w = ease.outBack(P(t, ev.word5, 0.6), 1.8);
    if (w > 0) {
      glowDot(ctx, 540, 520, 150 * w, REG.jauf.color, 0.35, false);
      arab(ctx, 'نُوحِيهَا', 540, 500, { size: 190 * Math.max(0.01, w), alpha: Math.min(1, w), shadow: 30 });
      text(ctx, 'nūḥīhā', 540, 660, { size: 40, weight: 600, color: C.gold, alpha: Math.min(1, w), ls: 3 });
    }
    // the three mad letters in the word, in the order they appear
    const chips = [{ ch: 'و', note: 'setelah dhammah' }, { ch: 'ي', note: 'setelah kasrah' }, { ch: 'ا', note: 'setelah fathah' }];
    chips.forEach((c, i) => {
      const k = ease.outBack(P(t, ev.chips5[i], 0.4), 2.4); if (k <= 0) return;
      const x = 540 + (1 - i) * 300, y = 830; // right-to-left: و first on the right
      card(ctx, x - 125, y - 85, 250, 170, { alpha: Math.min(1, k), r: 30, fill: 'rgba(15,23,38,0.86)', stroke: REG.jauf.color });
      arab(ctx, c.ch, x, y - 25, { size: 84 * k, color: REG.jauf.color, alpha: Math.min(1, k) });
      text(ctx, c.note, x, y + 52, { size: 24, weight: 500, color: C.soft, alpha: Math.min(1, k) });
    });
    // two harakat: a bar with two beats
    const ba = ease.outCubic(P(t, vo.e2.at, 0.5));
    if (ba > 0) {
      const y = 1110;
      text(ctx, 'DIBACA PANJANG', 540, y - 70, { size: 34, weight: 700, alpha: ba, ls: 4 });
      card(ctx, 240, y - 26, 600, 52, { alpha: ba, r: 26, fill: 'rgba(255,255,255,0.08)' });
      const fill = clamp((t - ev.beats5[0] + 0.25) / (ev.beats5[1] - ev.beats5[0] + 0.25));
      ctx.save(); ctx.globalAlpha *= ba; rrect(ctx, 246, y - 20, Math.max(40, 588 * fill), 40, 20); ctx.fillStyle = REG.jauf.color; ctx.fill(); ctx.restore();
      ev.beats5.forEach((tb, i) => {
        const p = ease.outBack(P(t, tb, 0.3), 3); if (p <= 0) return;
        const x = 240 + 300 * (i + 1) - 30;
        ctx.save(); ctx.globalAlpha *= ba; ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(x, y, 34 * p, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        text(ctx, String(i + 1), x, y + 2, { size: 32 * p, weight: 800, color: C.navy, alpha: ba });
      });
      text(ctx, '2 HARAKAT', 540, y + 85, { size: 46, weight: 800, color: C.gold, alpha: P(t, ev.beats5[1], 0.4), ls: 3 });
    }
    ctx.restore();
  }

  // ---------- SCENE 6: careful — hamzah, and wau/ya with harakat ----------
  function compare(ctx, y, left, right, a) {
    if (a <= 0) return;
    // left: the letter; right: where it really comes from
    card(ctx, 70, y, 940, 210, { alpha: a, r: 34, fill: 'rgba(15,23,38,0.86)', stroke: right.color });
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = right.color; ctx.beginPath(); ctx.arc(190, y + 105, 70, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    arab(ctx, left.ch, 190, y + 90, { size: 96, color: C.navy, alpha: a });
    text(ctx, left.label, 300, y + 62, { size: 34, weight: 800, align: 'left', alpha: a, ls: 1 });
    text(ctx, '→ ' + right.where, 300, y + 115, { size: 38, weight: 800, align: 'left', color: right.color, alpha: a, ls: 1 });
    text(ctx, right.sub, 300, y + 162, { size: 28, weight: 500, align: 'left', color: C.soft, alpha: a });
  }
  function scene6(ctx, t) {
    const a = win(t, SC.s6[0] - 0.2, ev.s6out + 0.8, 0.5, 0.8);
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const wa = ease.outBack(P(t, ev.warn6, 0.5), 2);
    if (wa > 0) {
      ctx.save(); ctx.translate(540, 310); ctx.scale(wa, wa);
      ctx.fillStyle = C.gold; ctx.beginPath(); ctx.moveTo(0, -46); ctx.lineTo(50, 40); ctx.lineTo(-50, 40); ctx.closePath(); ctx.fill();
      ctx.restore();
      text(ctx, '!', 540, 325, { size: 54, weight: 800, color: C.navy, alpha: Math.min(1, wa) });
      text(ctx, 'HATI-HATI!', 540, 410, { size: 60, weight: 800, alpha: Math.min(1, wa), ls: 4 });
    }
    // alif mad vs hamzah
    const k1 = ease.outCubic(P(t, vo.f1.at + 1.0, 0.5));
    if (k1 > 0) {
      card(ctx, 70, 480, 455, 200, { alpha: k1, r: 34, fill: 'rgba(15,23,38,0.86)', stroke: REG.jauf.color });
      arab(ctx, 'ا', 175, 575, { size: 120, color: REG.jauf.color, alpha: k1 });
      text(ctx, 'Alif mad', 365, 555, { size: 32, weight: 700, alpha: k1 });
      text(ctx, 'Al-Jauf', 365, 600, { size: 28, weight: 600, color: REG.jauf.color, alpha: k1 });
      ctx.save(); ctx.globalAlpha *= k1; ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(540, 580, 34, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      text(ctx, '≠', 540, 582, { size: 48, weight: 800, color: C.navy, alpha: k1 });
      card(ctx, 555, 480, 455, 200, { alpha: k1, r: 34, fill: 'rgba(15,23,38,0.86)', stroke: REG.halq.color });
      arab(ctx, 'ء', 665, 570, { size: 130, color: REG.halq.color, alpha: k1 });
      text(ctx, 'Hamzah', 865, 555, { size: 32, weight: 700, alpha: k1 });
      const h2 = P(t, ev.hamzah6, 0.5);
      text(ctx, 'Al-Jauf?', 865, 600, { size: 28, weight: 600, color: C.soft, alpha: k1 * (1 - h2) });
      text(ctx, 'Tenggorokan', 865, 600, { size: 28, weight: 600, color: REG.halq.color, alpha: k1 * h2 });
    }
    // wau and ya with harakat
    const k2 = ease.outCubic(P(t, ev.wy6, 0.5)), k3 = ease.outCubic(P(t, ev.wy6 + vo.f3.dur * 0.45, 0.5));
    const y2 = 730 + (1 - k2) * 30, y3 = 970 + (1 - k3) * 30;
    compare(ctx, y2, { ch: 'وَ', label: 'Wau berharakat' }, { where: 'Dua bibir', sub: 'Asy-Syafatain', color: REG.syafatain.color }, k2);
    compare(ctx, y3, { ch: 'يَ', label: 'Ya berharakat' }, { where: 'Tengah lidah', sub: 'Al-Lisan', color: REG.lisan.color }, k3);
    ctx.restore();
  }

  // ---------- SCENE 7: next episode — Al-Halq ----------
  function scene7(ctx, t, hk) {
    const a = win(t, SC.s7[0] - 0.2, ev.s7out + 0.8, 0.5, 0.8);
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const sl = ease.outCubic(P(t, ev.next7, 0.6));
    pill(ctx, 'NEXT EPISODE  ▶', lerp(-200, 540, sl), 300, { size: 30, alpha: sl, ls: 4 });
    const ca = ease.outCubic(P(t, ev.halq7 + 0.3, 0.6));
    if (ca > 0) {
      const y0 = 1060 + (1 - ca) * 50;
      card(ctx, 90, y0, 900, 330, { alpha: ca, r: 36, fill: 'rgba(15,23,38,0.88)', stroke: REG.halq.color, glow: REG.halq.color + '77' });
      text(ctx, 'EPISODE 03', 540, y0 + 44, { size: 32, weight: 700, color: C.gold, alpha: ca, ls: 8 });
      arab(ctx, 'الْحَلْقُ', 540, y0 + 128, { size: 84, alpha: ca * P(t, ev.halq7 + 0.6, 0.5) });
      text(ctx, 'AL-HALQ — TENGGOROKAN', 540, y0 + 222, { size: 44, weight: 800, color: REG.halq.color, alpha: ca * P(t, ev.halq7 + 0.9, 0.5), ls: 2 });
      // six throat letters
      S.SIX.forEach((ch, i) => {
        const k = ease.outBack(P(t, S.six7[i], 0.35), 2.6); if (k <= 0) return;
        const x = 540 + (2.5 - i) * 118, y = y0 + 290; // right-to-left order
        ctx.save(); ctx.globalAlpha *= Math.min(1, k); ctx.fillStyle = 'rgba(255,107,107,0.22)'; ctx.beginPath(); ctx.arc(x, y, 40 * k, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        arab(ctx, ch, x, y - 8, { size: 54 * k, alpha: Math.min(1, k) });
      });
    }
    ctx.restore();
  }

  // ---------- SCENE 8: closing ----------
  function scene8(ctx, t) {
    const a = P(t, ev.title8, 0.8);
    if (a <= 0) return;
    const k = ease.outCubic(a);
    arab(ctx, 'الْجَوْفُ', 540, 330 + (1 - k) * 30, { size: 74, color: REG.jauf.color, alpha: k });
    text(ctx, 'MAKHARIJUL', 540, 470 + (1 - k) * 30, { size: 112, weight: 800, alpha: k, ls: 2, shadow: 20 });
    text(ctx, 'HURUF', 540, 590 + (1 - k) * 30, { size: 112, weight: 800, alpha: k, ls: 10, shadow: 20 });
    const ta = P(t, ev.tag8, 0.6), tb = P(t, ev.tag8 + 0.6, 0.6);
    ctx.save(); ctx.globalAlpha = ta; ctx.fillStyle = C.gold; ctx.fillRect(540 - 60 * ta, 672, 120 * ta, 5); ctx.restore();
    text(ctx, 'KENALI HURUFNYA.', 540, 750 + (1 - ta) * 20, { size: 52, weight: 700, alpha: ta, ls: 3 });
    text(ctx, 'BENARKAN BACAANNYA.', 540, 822 + (1 - tb) * 20, { size: 52, weight: 700, color: C.gold, alpha: tb, ls: 3 });
    const d = ease.outBack(P(t, ev.done8, 0.5), 2);
    if (d > 0) pill(ctx, 'EPISODE 02 — SELESAI', 540, 1330, { size: 30 * Math.max(0.01, d), alpha: Math.min(1, d), ls: 3 });
  }

  // ---------- frame ----------
  Studio.film({
    post: { paper: 0, grain: 0.025, vignette: 0.28 },
    fadeOut: 1.2,
    async init() {
      const fonts = [['400', 'poppins-latin-400-normal'], ['500', 'poppins-latin-500-normal'], ['600', 'poppins-latin-600-normal'], ['700', 'poppins-latin-700-normal'], ['800', 'poppins-latin-800-normal']];
      for (const [w, f] of fonts) { try { await Studio.loadFont('Poppins', `assets/fonts/${f}.woff2`, w); } catch (e) { console.error('font', f, String(e)); } }
      logo = await Studio.loadImage('assets/logo.png');
      pattern = buildPattern();
    },
    draw(ctx, t) {
      background(ctx, t);
      const hk = headKey(t);
      drawHead(ctx, t, hk[0], hk[1], hk[2], hk[3], regionState(t));
      cover(ctx, t);
      scene1(ctx, t);
      scene2(ctx, t, hk);
      scene3(ctx, t, hk);
      scene4(ctx, t);
      scene5(ctx, t);
      scene6(ctx, t);
      scene7(ctx, t, hk);
      scene8(ctx, t);
      header(ctx, t);
      subtitles(ctx, t);
      footer(ctx, t);
    },
  });
})();
