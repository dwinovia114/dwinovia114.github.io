// THE FILM — Makharijul Huruf · Episode 01. Every frame is a pure function of t, timed from score.js.
(function () {
  const U = globalThis.U, G = globalThis.G, S = globalThis.SCORE, Studio = globalThis.Studio;
  const { ev, SC, vo, HIJAIYAH } = S;
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

  // head placement over time (keyframes): x, y, scale, alpha
  function headKey(t) {
    const k = [];
    const add = (t0, v) => k.push([t0, v]);
    add(0, [540, 905, 0.5, 0]);
    add(ev.headIn, [540, 905, 0.5, 0]);
    add(ev.headIn + 0.9, [540, 905, 0.55, 1]);
    add(ev.s2zoom, [540, 905, 0.55, 1]);
    add(ev.s2zoom + 2.2, [540, 700, 1.0, 1]);
    add(ev.s3out, [540, 700, 1.0, 1]);
    add(ev.s3out + 1.4, [540, 660, 0.85, 1]);
    add(ev.s4five, [540, 660, 0.85, 1]);
    add(ev.s4five + 1.2, [540, 660, 0.85, 0]);
    add(SC.s6[0] - 0.2, [540, 700, 0.8, 0]);
    add(SC.s6[0] + 0.8, [540, 700, 0.85, 1]);
    add(ev.dim6 + 0.4, [540, 700, 0.85, 1]);
    add(ev.dim6 + 2.2, [690, 820, 1.25, 1]); // zoom toward the oral cavity
    add(ev.s6out, [690, 820, 1.25, 1]);
    add(ev.s6out + 0.8, [690, 820, 1.3, 0]);
    let a = k[0], b = k[k.length - 1];
    for (let i = 0; i < k.length - 1; i++) if (t >= k[i][0] && t < k[i + 1][0]) { a = k[i]; b = k[i + 1]; break; }
    if (t >= k[k.length - 1][0]) return k[k.length - 1][1];
    const f = ease.inOutCubic(clamp((t - a[0]) / Math.max(1e-6, b[0] - a[0])));
    return a[1].map((v, i) => lerp(v, b[1][i], f));
  }

  // region looks: tint (colour on), glow (emphasis), dim
  function regionState(t) {
    const st = {};
    for (const r of ORDER) st[r] = { tint: 0, glow: 0, dim: 0 };
    // scene 2: a few links glow the region they point to
    LINKS.forEach((l, i) => { const t0 = ev.links + i * 0.9; const g = win(t, t0 + 0.5, t0 + 2.2, 0.3, 0.6); st[l.reg].glow = Math.max(st[l.reg].glow, g); st[l.reg].tint = Math.max(st[l.reg].tint, g * 0.8); });
    // scene 3: soft dots only (handled in overlay)
    // scene 4: all on, then one at a time
    if (t >= SC.s4[0] - 1 && t < SC.s5[0]) {
      ORDER.forEach((r, i) => { st[r].tint = Math.max(st[r].tint, P(t, ev.allOn + i * 0.35, 0.5)); });
      const cur = ev.m.findIndex((t0, i) => t >= t0 && t < (ev.m[i + 1] || vo.d5.end + 0.8));
      const dimA = win(t, ev.m[0], vo.d5.end + 0.8, 0.4, 0.6);
      ORDER.forEach((r, i) => {
        if (i === cur) st[r].glow = Math.max(st[r].glow, P(t, ev.m[i], 0.4));
        else st[r].dim = Math.max(st[r].dim, dimA);
      });
    }
    // scene 6: all on, then only Al-Jauf
    if (t >= SC.s6[0] - 1) {
      ORDER.forEach((r) => { st[r].tint = Math.max(st[r].tint, P(t, SC.s6[0] + 0.4, 0.8)); });
      ORDER.forEach((r) => { if (r === 'jauf') st[r].glow = P(t, ev.dim6, 0.6); else st[r].dim = P(t, ev.dim6, 0.8); });
    }
    return st;
  }

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
    const f2 = ease.inOutCubic(P(t, ev.logo7, 1.1));
    let L = LOGO_COVER.map((v, i) => lerp(v, LOGO_HDR[i], f1));
    if (f2 > 0) L = L.map((v, i) => lerp(v, LOGO_END[i], f2));
    // little arc on the path for a livelier move
    const arc = Math.sin(Math.PI * f1) * 60 * (1 - f2) + Math.sin(Math.PI * f2) * -80;
    drawLogo(ctx, L[0] - arc * 0.3, L[1] - arc, L[2]);
    if (f2 > 0.98) {
      // gentle breathing ring around the final logo
      const q = 0.5 + 0.5 * Math.sin(t * 2.4);
      ctx.save(); ctx.globalAlpha = P(t, ev.logo7 + 1.1, 0.6) * (0.25 + 0.25 * q);
      ctx.strokeStyle = C.gold; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(L[0], L[1], L[2] + 14 + 6 * q, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    }
    // header title (top-right) slides in after the cover, leaves for the closing title
    const ha = ease.outCubic(P(t, ev.coverOut + 0.35, 0.8)) * (1 - P(t, ev.title7 - 0.2, 0.6));
    if (ha > 0.001) {
      const dx = (1 - ease.outCubic(P(t, ev.coverOut + 0.35, 0.8))) * 120;
      const xR = 1020 + dx;
      text(ctx, 'BELAJAR MAKHARIJUL HURUF', xR, 118, { size: 33, weight: 800, align: 'right', alpha: ha, ls: 1 });
      ctx.save(); ctx.globalAlpha = ha; ctx.fillStyle = C.gold; ctx.fillRect(xR - 70, 142, 70, 4); ctx.restore();
      text(ctx, 'Episode 1: Mengenal Makharijul Huruf', xR, 172, { size: 25, weight: 500, align: 'right', alpha: ha, color: C.gold });
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
    pill(ctx, 'SERI TAJWID  •  EPISODE 01', 540, 948 + up, { size: 26, alpha: a * P(t, 0.4, 0.5), ls: 3 });
    text(ctx, 'BELAJAR', 540, 1052 + up, { size: 58, weight: 600, color: C.gold, alpha: a * P(t, 0.5, 0.5), ls: 18 });
    text(ctx, 'MAKHARIJUL', 540, 1160 + up, { size: 118, weight: 800, alpha: a * P(t, 0.65, 0.5), ls: 2, shadow: 20 });
    text(ctx, 'HURUF', 540, 1285 + up, { size: 118, weight: 800, alpha: a * P(t, 0.8, 0.5), ls: 10, shadow: 20 });
    arab(ctx, 'مَخَارِجُ الْحُرُوفِ', 540, 1420 + up, { size: 72, color: C.gold, alpha: a * P(t, 1.0, 0.6) });
    text(ctx, 'Kenali Hurufnya. Benarkan Bacaannya.', 540, 1545 + up, { size: 34, weight: 500, color: C.soft, alpha: a * P(t, 1.2, 0.6) });
  }

  // ---------- SCENE 1: Ba vs Mim ----------
  function drawLips(ctx, cx, cy, sc, open, a) {
    if (a <= 0.001) return;
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(cx, cy); ctx.scale(sc, sc);
    // mouth interior
    if (open > 0.01) { ctx.fillStyle = '#3A0F1F'; ctx.beginPath(); ctx.ellipse(0, 8, 140 * (0.7 + 0.3 * open), 50 * open, 0, 0, Math.PI * 2); ctx.fill(); }
    const up = -26 * open, dn = 34 * open;
    const lg = ctx.createLinearGradient(0, -80, 0, 100); lg.addColorStop(0, '#F29C9C'); lg.addColorStop(1, '#C9606C');
    ctx.fillStyle = lg; ctx.strokeStyle = '#7A2E3B'; ctx.lineWidth = 4;
    ctx.beginPath(); // upper lip
    ctx.moveTo(-190, 4); ctx.bezierCurveTo(-130, -26, -70, -76 + up, -24, -60 + up); ctx.quadraticCurveTo(0, -48 + up, 24, -60 + up);
    ctx.bezierCurveTo(70, -76 + up, 130, -26, 190, 4); ctx.bezierCurveTo(100, 8 + up, 40, 12 + up, 0, 10 + up); ctx.bezierCurveTo(-40, 12 + up, -100, 8 + up, -190, 4); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); // lower lip
    ctx.moveTo(-190, 4); ctx.bezierCurveTo(-100, 12 + dn, -40, 14 + dn, 0, 14 + dn); ctx.bezierCurveTo(40, 14 + dn, 100, 12 + dn, 190, 4);
    ctx.bezierCurveTo(130, 66 + dn, 60, 92 + dn, 0, 92 + dn); ctx.bezierCurveTo(-60, 92 + dn, -130, 66 + dn, -190, 4); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.ellipse(-50, 52 + dn, 40, 9, -0.1, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  function waves(ctx, x, y, t0, t, color, { dir = 0, spread = 0.9, n = 3, r0 = 60, len = 1.2 } = {}) {
    const age = t - t0; if (age < 0 || age > len + 0.6) return;
    for (let i = 0; i < n; i++) {
      const q = (age - i * 0.18) / len; if (q < 0 || q > 1) continue;
      ctx.save(); ctx.globalAlpha = (1 - q) * 0.9; ctx.strokeStyle = color; ctx.lineWidth = 7 * (1 - q) + 2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(x, y, r0 + q * 160, dir - spread, dir + spread); ctx.stroke(); ctx.restore();
    }
  }
  function scene1(ctx, t) {
    const a = win(t, SC.s1[0], ev.s1out + 0.6, 0.4, 0.6);
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const exitK = ease.inCubic(P(t, ev.s1out - 0.2, 0.8)); // letters shrink into the hijaiyah cloud
    // Ba from left, Mim from right; meet in the middle
    const meet = ease.inOutCubic(P(t, ev.meet - 0.6, 0.9));
    const baIn = ease.outBack(P(t, ev.ba, 0.45), 2.2), mimIn = ease.outBack(P(t, ev.mim, 0.45), 2.2);
    const yL = 560;
    const bx = lerp(-200, lerp(250, 300, meet), ease.outCubic(P(t, ev.ba, 0.5)));
    const mx = lerp(W + 200, lerp(830, 780, meet), ease.outCubic(P(t, ev.mim, 0.5)));
    const say = (t0) => 1 + 0.12 * Math.max(0, 1 - Math.abs(t - t0 - 0.15) / 0.3);
    const sc = 1 - exitK * 0.85;
    // glow plates
    glowDot(ctx, bx, yL, 70 * baIn, C.blue, 0.6 * baIn, false); glowDot(ctx, mx, yL, 70 * mimIn, C.blue, 0.6 * mimIn, false);
    waves(ctx, bx, yL, ev.baSay, t, C.gold, { dir: Math.PI, spread: 0.8 });
    waves(ctx, mx, yL, ev.mimSay, t, C.gold, { dir: 0, spread: 0.8 });
    arab(ctx, 'بَ', bx, yL - 20, { size: 260 * baIn * sc * say(ev.baSay), color: C.white, shadow: 30 });
    arab(ctx, 'مَ', mx, yL - 20, { size: 260 * mimIn * sc * say(ev.mimSay), color: C.white, shadow: 30 });
    // VS badge
    const vs = ease.outBack(P(t, ev.meet, 0.4), 3) * (1 - exitK);
    if (vs > 0) { ctx.save(); ctx.translate(540, yL); ctx.scale(vs, vs); ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(0, 0, 62, 0, Math.PI * 2); ctx.fill(); ctx.restore(); text(ctx, 'VS', 540, yL + 3, { size: 48 * vs, weight: 800, color: C.navy }); }
    text(ctx, 'BA', bx, yL + 170, { size: 34, weight: 600, color: C.gold, alpha: P(t, ev.meet, 0.5) * (1 - exitK), ls: 6 });
    text(ctx, 'MIM', mx, yL + 170, { size: 34, weight: 600, color: C.gold, alpha: P(t, ev.meet, 0.5) * (1 - exitK), ls: 6 });
    // lips card (zooms in)
    const lipA = ease.outCubic(P(t, ev.lips, 0.6)) * (1 - P(t, ev.s1out - 0.6, 0.6));
    if (lipA > 0) {
      const z = lerp(0.6, 1, ease.outBack(P(t, ev.lips, 0.7), 1.4));
      ctx.save(); ctx.translate(540, 1000); ctx.scale(z, z); ctx.translate(-540, -1000);
      card(ctx, 160, 820, 760, 380, { alpha: lipA, r: 40 });
      // lip motion: Ba = pressed then burst open; Mim = closed + humming
      let open = 0.15 + 0.08 * Math.sin(t * 2);
      const tb = t - ev.baSay, tm = t - ev.mimSay;
      if (tb > -0.3 && tb < 0.9) open = tb < 0 ? 0 : tb < 0.08 ? 0 : ease.outCubic(clamp((tb - 0.08) / 0.18)) * (1 - clamp((tb - 0.5) / 0.4)) * 0.9 + 0.1 * clamp((tb - 0.5) / 0.4);
      if (tm > -0.3 && tm < 1.1) open = tm < 0.55 ? 0 : ease.outCubic(clamp((tm - 0.55) / 0.2)) * 0.5;
      drawLips(ctx, 540, 990, 1, open, lipA);
      // Ba: a puff of air bursting out; Mim: hum vibration lines
      if (tb > 0.05 && tb < 0.8) for (let i = 0; i < 7; i++) { const q = (tb - 0.05) / 0.75; const ang = -0.9 + i * 0.3; ctx.save(); ctx.globalAlpha = lipA * (1 - q); ctx.strokeStyle = C.gold; ctx.lineWidth = 5; ctx.lineCap = 'round'; const r1 = 120 + q * 120; ctx.beginPath(); ctx.moveTo(540 + Math.sin(ang) * r1 * 1.6, 1010 + Math.cos(ang) * r1 * 0.2 + 60); ctx.lineTo(540 + Math.sin(ang) * (r1 + 40) * 1.6, 1010 + Math.cos(ang) * (r1 + 40) * 0.2 + 70); ctx.stroke(); ctx.restore(); }
      if (tm > 0 && tm < 0.9) for (let i = 0; i < 3; i++) { ctx.save(); ctx.globalAlpha = lipA * (1 - tm / 0.9) * 0.9; ctx.strokeStyle = C.gold; ctx.lineWidth = 4; ctx.beginPath(); for (let x = -160; x <= 160; x += 8) { const yy = 880 - i * 18 + Math.sin(x * 0.12 + t * 40) * 6; x === -160 ? ctx.moveTo(540 + x, yy) : ctx.lineTo(540 + x, yy); } ctx.stroke(); ctx.restore(); }
      const lab = tb > -0.2 && tb < 1.0 ? 'بَ' : tm > -0.2 && tm < 1.2 ? 'مَ' : null;
      if (lab) arab(ctx, lab, 840, 900, { size: 80, color: C.gold, alpha: lipA });
      text(ctx, 'Sama-sama menggunakan bibir', 540, 1160, { size: 30, weight: 500, color: C.soft, alpha: lipA });
      ctx.restore();
    }
    // the question
    const qa = ease.outCubic(P(t, ev.question, 0.5)) * (1 - P(t, ev.s1out - 0.4, 0.5));
    if (qa > 0) {
      const dy = (1 - qa) * 30;
      text(ctx, 'MENGAPA', 540, 1280 + dy, { size: 58, weight: 800, color: C.gold, alpha: qa, ls: 4 });
      text(ctx, 'BUNYINYA BERBEDA?', 540, 1350 + dy, { size: 58, weight: 800, color: C.white, alpha: qa, ls: 2 });
    }
    // hijaiyah cloud forming as the letters shrink
    if (exitK > 0) cloud(ctx, t, exitK);
    ctx.restore();
  }
  function cloud(ctx, t, k) {
    for (let i = 0; i < 18; i++) {
      const ang = (i / 18) * Math.PI * 2 + t * 0.2, r = 80 + 360 * k * (0.6 + 0.4 * hash(i, 9));
      arab(ctx, HIJAIYAH[(i * 5) % 29], 540 + Math.cos(ang) * r, 760 + Math.sin(ang) * r * 1.1, { size: 70, color: i % 4 ? C.white : C.gold, alpha: k * 0.8 });
    }
  }

  // ---------- SCENE 2: knowing the shapes is not enough ----------
  const RING = ['أ', 'ب', 'ت', 'ح', 'خ', 'د', 'ع', 'ق', 'ك', 'ل', 'م', 'ف', 'س', 'ي'];
  const LINKS = [
    { letter: 6, reg: 'halq', to: [520, 720] },
    { letter: 3, reg: 'halq', to: [526, 800] },
    { letter: 7, reg: 'lisan', to: [450, 610] },
    { letter: 9, reg: 'lisan', to: [230, 610] },
    { letter: 1, reg: 'syafatain', to: [116, 598] },
    { letter: 11, reg: 'syafatain', to: [128, 624] },
  ];
  const ringPos = (i, t) => {
    const ang = -Math.PI / 2 + (i / RING.length) * Math.PI * 2 + 0.11;
    return [540 + Math.cos(ang) * 410, 905 + Math.sin(ang) * 368];
  };
  function scene2(ctx, t, hk) {
    const a = win(t, SC.s2[0] - 0.3, SC.s2[1] + 0.2, 0.6, 0.8);
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const ringOut = P(t, ev.s2zoom - 0.3, 1.0);
    // title
    const ta = ease.outCubic(P(t, ev.noEnough - 0.2, 0.5)) * (1 - P(t, ev.s2zoom, 0.6));
    if (ta > 0) {
      const s = lerp(1.25, 1, ease.outBack(P(t, ev.noEnough - 0.2, 0.5), 2));
      ctx.save(); ctx.translate(540, 300); ctx.scale(s, s);
      text(ctx, 'MENGENAL HURUF SAJA', 0, -2, { size: 50, weight: 800, alpha: ta, ls: 1 });
      text(ctx, 'TIDAK CUKUP!', 0, 62, { size: 64, weight: 800, color: C.gold, alpha: ta, ls: 3 });
      ctx.restore();
      text(ctx, 'Kenali juga tempat keluarnya.', 540, 412, { size: 34, weight: 500, color: C.soft, alpha: ta * P(t, ev.kenali, 0.6) });
    }
    // connecting lines (motion-tracked to the head)
    LINKS.forEach((l, i) => {
      const t0 = ev.links + i * 0.9; const q = ease.inOutCubic(P(t, t0, 0.55));
      const la = q * (1 - ringOut) * (1 - P(t, t0 + 3.2, 0.8) * 0.6);
      if (la <= 0) return;
      const [x0, y0] = ringPos(l.letter, t); const [x1, y1] = toScreen(hk, l.to[0], l.to[1]);
      const col = REG[l.reg].color;
      ctx.save(); ctx.globalAlpha = a * la; ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.setLineDash([12, 10]); ctx.lineDashOffset = -t * 40;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(lerp(x0, x1, q), lerp(y0, y1, q)); ctx.stroke(); ctx.restore();
      if (q >= 1) glowDot(ctx, x1, y1, 10, col, la);
    });
    // ring of letters
    RING.forEach((ch, i) => {
      const t0 = S.ring2[i]; if (t < t0) return;
      const k = ease.outBack(P(t, t0, 0.4), 2.5);
      const [x, y] = ringPos(i, t);
      const link = LINKS.findIndex((l) => l.letter === i);
      const lit = link >= 0 ? win(t, ev.links + link * 0.9, ev.links + link * 0.9 + 3.6, 0.3, 0.8) : 0;
      const col = link >= 0 ? REG[LINKS[link].reg].color : C.blue;
      const r = 54 * k;
      const ox = lerp(x, 540, ease.inCubic(ringOut)), oy = lerp(y, 905, ease.inCubic(ringOut));
      const ra = 1 - ringOut;
      ctx.save(); ctx.globalAlpha *= ra;
      ctx.fillStyle = lit > 0 ? col : 'rgba(54,89,217,0.35)'; ctx.globalAlpha *= lit > 0 ? 0.25 + 0.6 * lit : 1;
      ctx.beginPath(); ctx.arc(ox, oy, r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      ctx.save(); ctx.globalAlpha *= ra; ctx.strokeStyle = lit > 0 ? col : 'rgba(255,255,255,0.25)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(ox, oy, r, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      arab(ctx, ch, ox, oy - 8, { size: 62 * k, alpha: ra });
    });
    ctx.restore();
  }

  // ---------- SCENE 3: what is Makharijul Huruf ----------
  const LABELS3 = [
    { reg: 'khaisyum', txt: 'Rongga hidung', side: -1, dy: -150 },
    { reg: 'syafatain', txt: 'Bibir', side: -1, dy: 60 },
    { reg: 'jauf', txt: 'Rongga mulut', side: 1, dy: -235 },
    { reg: 'lisan', txt: 'Lidah', side: -1, dy: 190 },
    { reg: 'halq', txt: 'Tenggorokan', side: 1, dy: 60 },
  ];
  function scene3(ctx, t, hk) {
    const a = win(t, SC.s3[0] - 0.4, ev.s3out + 0.8, 0.6, 0.8);
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    // pointer labels (motion-tracked)
    LABELS3.forEach((L, i) => {
      const t0 = ev.def3 + 0.5 + i * 0.25;
      const q = ease.outCubic(P(t, t0, 0.5)) * (1 - P(t, ev.s3out - 0.2, 0.5));
      if (q <= 0) return;
      const [ax, ay] = toScreen(hk, ...ANCHOR[L.reg]);
      const lx = L.side < 0 ? 70 : 1010, ly = ay + L.dy;
      const col = REG[L.reg].color;
      glowDot(ctx, ax, ay, 12, col, q);
      ctx.save(); ctx.globalAlpha *= q; ctx.strokeStyle = col; ctx.lineWidth = 3;
      const ex = L.side < 0 ? lx + 40 : lx - 40;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(lerp(ax, ex, q), lerp(ay, ly, q)); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.font = `600 30px ${SANS}`; const tw = ctx.measureText(L.txt).width; ctx.restore();
      const bx = L.side < 0 ? lx : lx - tw - 40;
      card(ctx, bx, ly - 28, tw + 40, 56, { r: 28, alpha: q, fill: 'rgba(15,23,38,0.88)', stroke: col });
      text(ctx, L.txt, bx + 20, ly + 2, { size: 30, weight: 600, align: 'left', alpha: q });
    });
    // definition card
    const ca = ease.outCubic(P(t, ev.arabic3, 0.6)) * (1 - P(t, ev.s3out - 0.2, 0.6));
    if (ca > 0) {
      const y0 = 1092 + (1 - ca) * 40;
      card(ctx, 70, y0, 940, 305, { alpha: ca, r: 36, fill: 'rgba(15,23,38,0.82)', stroke: 'rgba(213,169,78,0.45)' });
      arab(ctx, 'مَخَارِجُ الْحُرُوفِ', 540, y0 + 72, { size: 76, color: C.gold, alpha: ca * P(t, ev.arabic3, 0.5) });
      text(ctx, 'MAKHARIJUL HURUF', 540, y0 + 150, { size: 50, weight: 800, alpha: ca * P(t, ev.arabic3 + 0.6, 0.5), ls: 3 });
      // content phases: meaning -> word chips -> similar pairs
      const ph1 = P(t, ev.meaning3, 0.6) * (1 - P(t, ev.chips3 - 0.3, 0.4));
      const ph2 = P(t, ev.chips3, 0.5) * (1 - P(t, ev.compare3 - 0.3, 0.4));
      const ph3 = P(t, ev.compare3, 0.5);
      text(ctx, 'Tempat keluarnya bunyi huruf hijaiyah.', 540, y0 + 240, { size: 34, weight: 500, color: C.soft, alpha: ca * ph1 });
      if (ph2 > 0) {
        const c1 = ease.outBack(P(t, ev.chips3, 0.4), 2), c2 = ease.outBack(P(t, ev.chips3 + 2.6, 0.4), 2);
        chip(ctx, 300, y0 + 240, 'مَخَارِج', 'tempat-tempat keluar', ca * ph2 * c1);
        chip(ctx, 780, y0 + 240, 'مَخْرَج', 'satu tempat keluar', ca * ph2 * c2);
      }
      if (ph3 > 0) {
        const pairs = [['ث', 'س'], ['ح', 'ه'], ['ذ', 'ز'], ['ق', 'ك']];
        pairs.forEach((p, i) => {
          const k = ease.outBack(P(t, ev.compare3 + 0.3 + i * 0.45, 0.4), 2) * ca;
          const cx = 540 + (i - 1.5) * 225;
          card(ctx, cx - 95, y0 + 207, 190, 66, { r: 33, alpha: k, fill: 'rgba(54,89,217,0.35)', stroke: 'rgba(255,255,255,0.2)' });
          arab(ctx, p[0], cx - 52, y0 + 234, { size: 44, alpha: k });
          text(ctx, '≠', cx, y0 + 242, { size: 34, weight: 700, color: C.gold, alpha: k });
          arab(ctx, p[1], cx + 52, y0 + 234, { size: 44, alpha: k });
        });
      }
    }
    ctx.restore();
  }
  function chip(ctx, x, y, ar, idn, a) {
    if (a <= 0) return;
    card(ctx, x - 215, y - 34, 430, 68, { r: 34, alpha: a, fill: 'rgba(54,89,217,0.38)', stroke: 'rgba(255,255,255,0.2)' });
    arab(ctx, ar, x - 145, y - 6, { size: 36, color: C.gold, alpha: a });
    text(ctx, "= " + idn, x - 92, y + 2, { size: 26, weight: 500, align: 'left', alpha: a });
  }

  // ---------- SCENE 4: the five main makhraj ----------
  function scene4(ctx, t, hk) {
    const a = win(t, SC.s4[0] - 0.6, ev.s4five + 0.6, 0.6, 0.6);
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const cur = ev.m.findIndex((t0, i) => t >= t0 && t < (ev.m[i + 1] || ev.s4five));
    // intro title before the first one
    const ia = ease.outCubic(P(t, vo.d0.at + 0.3, 0.5)) * (1 - P(t, ev.m[0] - 0.5, 0.5));
    if (ia > 0) {
      card(ctx, 110, 1130, 860, 240, { alpha: ia, r: 36, fill: 'rgba(15,23,38,0.82)', stroke: 'rgba(213,169,78,0.45)' });
      text(ctx, '5', 260, 1252, { size: 170, weight: 800, color: C.gold, alpha: ia });
      text(ctx, 'MAKHRAJ', 360, 1212, { size: 60, weight: 800, align: 'left', alpha: ia, ls: 3 });
      text(ctx, 'UTAMA', 360, 1282, { size: 60, weight: 800, align: 'left', alpha: ia, color: C.gold, ls: 3 });
    }
    // progress chips under the head
    ORDER.forEach((r, i) => {
      const x = 540 + (i - 2) * 92, y = 1072;
      const on = P(t, ev.allOn + i * 0.35, 0.4) * (1 - P(t, ev.s4five - 0.3, 0.4));
      const act = i === cur ? 1 : 0;
      const sz = 30 + 8 * act;
      if (on <= 0) return;
      ctx.save(); ctx.globalAlpha *= on * (cur >= 0 && !act ? 0.45 : 1);
      ctx.fillStyle = REG[r].color; if (act) { ctx.shadowColor = REG[r].color; ctx.shadowBlur = 25; }
      ctx.beginPath(); ctx.arc(x, y, sz, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      text(ctx, String(i + 1), x, y + 2, { size: 28 + 6 * act, weight: 800, color: C.navy, alpha: on * (cur >= 0 && !act ? 0.6 : 1) });
    });
    // one card per makhraj
    ev.m.forEach((t0, i) => {
      const t1 = ev.m[i + 1] || ev.s4five - 0.2;
      const q = Math.min(ease.outCubic(P(t, t0, 0.45)), 1 - ease.inCubic(P(t, t1 - 0.35, 0.35)));
      if (q <= 0) return;
      const r = ORDER[i], R = REG[r];
      const dx = (1 - ease.outCubic(P(t, t0, 0.45))) * 140 - ease.inCubic(P(t, t1 - 0.35, 0.35)) * 140;
      ctx.save(); ctx.translate(dx, 0);
      card(ctx, 70, 1128, 940, 250, { alpha: q, r: 36, fill: 'rgba(15,23,38,0.86)', stroke: R.color });
      // number badge
      ctx.save(); ctx.globalAlpha *= q; ctx.fillStyle = R.color; ctx.beginPath(); ctx.arc(170, 1253, 62, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      text(ctx, String(i + 1), 170, 1257, { size: 70, weight: 800, color: C.navy, alpha: q });
      arab(ctx, R.ar, 960, 1196, { size: 72, color: C.white, alpha: q * P(t, t0 + 0.1, 0.4), align: 'right' });
      text(ctx, R.lat, 270, 1278, { size: 50, weight: 800, color: R.color, align: 'left', alpha: q * P(t, t0 + 0.3, 0.4), ls: 2 });
      text(ctx, R.id + '.', 270, 1334, { size: 34, weight: 500, color: C.soft, align: 'left', alpha: q * P(t, t0 + 0.5, 0.4) });
      ctx.restore();
      // pointer from region to the card edge
      const [ax, ay] = toScreen(hk, ...ANCHOR[r]);
      glowDot(ctx, ax, ay, 13, R.color, q);
    });
    // transition: five dots gather into the number 5
    const g = P(t, ev.s4five, 1.4);
    if (g > 0) {
      ORDER.forEach((r, i) => {
        const [ax, ay] = toScreen(hk, ...ANCHOR[r]);
        const k = ease.inOutCubic(g);
        const tx = 540 + Math.cos(i * 1.256 + k * 3) * 120 * (1 - k), ty = 700 + Math.sin(i * 1.256 + k * 3) * 120 * (1 - k);
        glowDot(ctx, lerp(ax, tx, k), lerp(ay, ty, k), 16, REG[r].color, 1 - P(t, ev.s4five + 1.2, 0.3));
      });
    }
    ctx.restore();
  }

  // ---------- SCENE 5: from 5 to 17 (and 29 letters) ----------
  function scene5(ctx, t) {
    const a = win(t, ev.s4five + 1.0, ev.s5out + 0.8, 0.4, 0.8);
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    const partA = 1 - P(t, ev.grid29 - 0.6, 0.6);
    if (partA > 0) {
      const n = t < ev.countA ? 5 : (S.count.filter((c) => t >= c.t).pop() || { n: 5 }).n;
      const tick = S.count.reduce((acc, c) => (t >= c.t ? c.t : acc), ev.five + 0.9);
      const bump = 1 + 0.12 * (1 - P(t, tick, 0.18));
      const intro = ease.outBack(P(t, ev.five, 0.6), 2);
      const big = lerp(1, 0.7, ease.inOutCubic(P(t, ev.dots17 - 0.6, 0.8)));
      const ny = lerp(700, 470, ease.inOutCubic(P(t, ev.dots17 - 0.6, 0.8)));
      const col = n >= 17 ? C.gold : C.white;
      ctx.save(); ctx.globalAlpha *= partA;
      glowDot(ctx, 540, ny, 120 * intro * big, n >= 17 ? C.gold : C.blue, 0.5, false);
      ctx.restore();
      text(ctx, String(n), 540, ny + 20, { size: 330 * intro * big * bump, weight: 800, color: col, alpha: partA, shadow: 30 });
      const lab1 = 1 - P(t, ev.countA - 0.1, 0.3), lab2 = P(t, ev.countB, 0.4);
      const ly = ny + 210 * big;
      text(ctx, 'MAKHRAJ UTAMA', 540, ly, { size: 52, weight: 800, alpha: partA * lab1 * P(t, ev.five + 0.4, 0.5), ls: 4 });
      text(ctx, 'MAKHRAJ KHUSUS', 540, ly, { size: 52, weight: 800, color: C.gold, alpha: partA * lab2, ls: 4 });
      // the head with articulation points, one per count
      const ha = P(t, ev.dots17 - 0.4, 0.6) * partA;
      const dotsAt = (i) => (i < 5 ? ev.dots17 + i * 0.12 : S.count[i - 5].t);
      drawHead(ctx, t, 540, 1050, 0.52, ha, ghostState(), { dots17: 1, dotsAt });
      if (ha > 0) text(ctx, 'Titik-titik artikulasi', 540, 1340, { size: 28, weight: 500, color: C.soft, alpha: ha });
    }
    // stats + 29 grid
    const ga = P(t, ev.grid29 - 0.3, 0.5);
    if (ga > 0) {
      const merge = ease.inCubic(P(t, ev.s5out - 0.2, 0.9));
      const stats = [['5', 'MAKHRAJ\nUTAMA', C.white], ['17', 'MAKHRAJ\nKHUSUS', C.gold], ['29', 'HURUF\nHIJAIYAH', '#7FA2FF']];
      stats.forEach(([nn, lab, col], i) => {
        const k = ease.outBack(P(t, ev.grid29 - 0.3 + i * 0.15, 0.5), 2) * (1 - merge);
        const x = 220 + i * 320;
        card(ctx, x - 140, 260, 280, 190, { alpha: k, r: 28 });
        text(ctx, nn, x, 325, { size: 82, weight: 800, color: col, alpha: k });
        lab.split('\n').forEach((l, j) => text(ctx, l, x, 395 + j * 32, { size: 24, weight: 600, color: C.soft, alpha: k, ls: 2 }));
      });
      const cols = 6, tile = 138, gap = 16, gx0 = 540 + ((cols * tile + (cols - 1) * gap) / 2) - tile / 2;
      HIJAIYAH.forEach((ch, i) => {
        const t0 = S.grid29[i]; if (t < t0) return;
        const k = ease.outBack(P(t, t0, 0.35), 2.4);
        const row = Math.floor(i / cols), c = i % cols;
        let x = gx0 - c * (tile + gap), y = 560 + row * (tile + gap) + tile / 2;
        x = lerp(x, 540, merge); y = lerp(y, 860, merge);
        const s = k * (1 - merge * 0.7);
        ctx.save(); ctx.globalAlpha *= 1 - merge * 0.9; ctx.translate(x, y); ctx.scale(s, s);
        rrect(ctx, -tile / 2, -tile / 2, tile, tile, 26); ctx.fillStyle = i % 2 ? 'rgba(54,89,217,0.32)' : 'rgba(255,255,255,0.08)'; ctx.fill();
        ctx.strokeStyle = 'rgba(213,169,78,0.5)'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
        arab(ctx, ch, x, y - 10 * s, { size: 74 * s, alpha: 1 - merge * 0.9 });
      });
    }
    ctx.restore();
  }
  const ghostState = () => { const st = {}; for (const r of ORDER) st[r] = { tint: 0, glow: 0, dim: 0 }; return st; };

  // ---------- SCENE 6: next episode teaser ----------
  function scene6(ctx, t, hk) {
    const a = win(t, SC.s6[0] - 0.2, ev.s6out + 0.8, 0.5, 0.8);
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    // NEXT EPISODE slides in
    const sl = ease.outCubic(P(t, SC.s6[0] + 0.5, 0.6));
    pill(ctx, 'NEXT EPISODE  ▶', lerp(-200, 540, sl), 300, { size: 30, alpha: sl, ls: 4 });
    // mad letters pop inside the oral cavity
    const madPos = [[205, 572], [325, 562], [445, 572]];
    ['ا', 'و', 'ي'].forEach((ch, i) => {
      const t0 = ev.mad[i]; if (t < t0) return;
      const k = ease.outBack(P(t, t0, 0.45), 2.6);
      const [x, y] = toScreen(hk, ...madPos[i]);
      glowDot(ctx, x, y - 70, 40 * k, REG.jauf.color, 0.7 * k, false);
      card(ctx, x - 52 * k, y - 125 * k - 70 + 70 * k, 104 * k, 110 * k, { alpha: k, r: 24, fill: 'rgba(15,23,38,0.9)', stroke: REG.jauf.color });
      arab(ctx, ch, x, y - 80 - 6 * k, { size: 70 * k, alpha: k });
    });
    // next title card
    const ca = ease.outCubic(P(t, ev.nextTitle, 0.6));
    if (ca > 0) {
      const y0 = 1095 + (1 - ca) * 50;
      // light sweep
      card(ctx, 90, y0, 900, 300, { alpha: ca, r: 36, fill: 'rgba(15,23,38,0.86)', stroke: REG.jauf.color, glow: REG.jauf.color + '88' });
      text(ctx, 'EPISODE 02', 540, y0 + 44, { size: 32, weight: 700, color: C.gold, alpha: ca, ls: 8 });
      arab(ctx, 'الْجَوْفُ', 540, y0 + 140, { size: 84, alpha: ca * P(t, ev.nextTitle + 0.3, 0.5) });
      text(ctx, 'AL-JAUF — RONGGA MULUT', 540, y0 + 252, { size: 44, weight: 800, color: REG.jauf.color, alpha: ca * P(t, ev.nextTitle + 0.6, 0.5), ls: 2 });
      const sw = P(t, ev.nextTitle + 0.4, 1.2);
      if (sw > 0 && sw < 1) {
        ctx.save(); rrect(ctx, 90, y0, 900, 300, 36); ctx.clip();
        const sx = lerp(0, 1100, sw); const g = ctx.createLinearGradient(sx - 160, 0, sx + 160, 0);
        g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,0.18)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g; ctx.fillRect(sx - 160, y0, 320, 300); ctx.restore();
      }
    }
    ctx.restore();
  }

  // ---------- SCENE 7: closing ----------
  function scene7(ctx, t) {
    const a = P(t, ev.title7, 0.8);
    if (a <= 0) return;
    const k = ease.outCubic(a);
    arab(ctx, 'مَخَارِجُ الْحُرُوفِ', 540, 330 + (1 - k) * 30, { size: 70, color: C.gold, alpha: k });
    text(ctx, 'MAKHARIJUL', 540, 470 + (1 - k) * 30, { size: 112, weight: 800, alpha: k, ls: 2, shadow: 20 });
    text(ctx, 'HURUF', 540, 590 + (1 - k) * 30, { size: 112, weight: 800, alpha: k, ls: 10, shadow: 20 });
    const ta = P(t, ev.tag7, 0.6), tb = P(t, ev.tag7 + 0.6, 0.6);
    ctx.save(); ctx.globalAlpha = ta; ctx.fillStyle = C.gold; ctx.fillRect(540 - 60 * ta, 672, 120 * ta, 5); ctx.restore();
    text(ctx, 'KENALI HURUFNYA.', 540, 750 + (1 - ta) * 20, { size: 52, weight: 700, alpha: ta, ls: 3 });
    text(ctx, 'BENARKAN BACAANNYA.', 540, 822 + (1 - tb) * 20, { size: 52, weight: 700, color: C.gold, alpha: tb, ls: 3 });
    const d = ease.outBack(P(t, ev.done7, 0.5), 2);
    if (d > 0) pill(ctx, 'EPISODE 01 — SELESAI', 540, 1330, { size: 30 * Math.max(0.01, d), alpha: Math.min(1, d), ls: 3 });
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
      const st = regionState(t);
      // keep the head where scenes 2-4 and 6 need it
      drawHead(ctx, t, hk[0], hk[1], hk[2], hk[3], st);
      cover(ctx, t);
      scene1(ctx, t);
      scene2(ctx, t, hk);
      scene3(ctx, t, hk);
      scene4(ctx, t, hk);
      scene5(ctx, t);
      scene6(ctx, t, hk);
      scene7(ctx, t);
      header(ctx, t);
      subtitles(ctx, t);
      footer(ctx, t);
    },
  });
})();
