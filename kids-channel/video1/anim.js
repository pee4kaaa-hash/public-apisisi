// Brush Brush, Shiny Teeth — frame-by-frame animation. Runs inside the page; draw(t) returns SVG markup.
const W = 1080, H = 1920;
let BEAT = 0.5;
let TL; // timeline injected from timeline_<lang>.json
const TEXT = {
  en: { title: 'BRUSH BRUSH!', titleSize: 140, sub: 'Shiny Teeth 🦷', brand: 'Sprout &amp; Drizzle', more: 'More songs every day! 🌱', moreSize: 64 },
  ru: { title: 'ЧИСТИМ ЗУБКИ!', titleSize: 118, sub: 'Песенка для малышей 🦷', brand: 'Росток и Тучка', more: 'Новые песенки каждый день! 🌱', moreSize: 52 },
};
const T_ = () => TEXT[TL.lang];
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const elastic = x => { x = clamp(x); return x === 1 ? 1 : 1 - Math.pow(2, -10 * x) * Math.cos(x * 10.5); };
// current line = last line that has started; works with gaps (instrumental breaks) between lines
const lineAt = t => { let c = null; for (const l of TL.lines) if (l.start <= t + 0.15) c = l; return c; };
// karaoke shows a line while it is sung (plus a short tail) and the next one slightly early
const karaokeLine = t => {
  const i = TL.lines.indexOf(lineAt(t + 0.5));
  if (i < 0) return null;
  const l = TL.lines[i];
  if (l.sung === false) return null;
  return t <= l.wordTimes[l.wordTimes.length - 1] + 1.6 || l.start - t > 0 ? l : null;
};
const S = (role, n = 0) => { const ls = TL.lines.filter(l => l.role === role); return (ls[n] || ls[0]).start; };

function eyes(kind) {
  if (kind === 'closed') return `<path d="M-45,-5 Q-32,5 -19,-5 M19,-5 Q32,5 45,-5" stroke="#2d3a22" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  if (kind === 'happy') return `<path d="M-45,0 Q-32,-20 -19,0 M19,0 Q32,-20 45,0" stroke="#2d3a22" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  return `<ellipse cx="-32" cy="-5" rx="13" ry="17" fill="#2d3a22"/><ellipse cx="32" cy="-5" rx="13" ry="17" fill="#2d3a22"/>
  <circle cx="-27" cy="-11" r="5" fill="#fff"/><circle cx="37" cy="-11" r="5" fill="#fff"/>`;
}
function mouth(kind) {
  switch (kind) {
    case 'yawn': return `<ellipse cx="0" cy="40" rx="16" ry="20" fill="#7a2b3a" stroke="#2d3a22" stroke-width="6"/>`;
    case 'o': return `<ellipse cx="0" cy="38" rx="14" ry="14" fill="#7a2b3a" stroke="#2d3a22" stroke-width="6"/>`;
    case 'wide': return `<path d="M-34,26 Q0,78 34,26 Z" fill="#7a2b3a" stroke="#2d3a22" stroke-width="6" stroke-linejoin="round"/>
      <path d="M-30,28 L30,28 L26,38 L-26,38 Z" fill="#fff"/><path d="M-10,28 v10 M10,28 v10" stroke="#dfe8ee" stroke-width="2"/>`;
    case 'tongue': return `<path d="M-28,28 Q0,60 28,28" fill="#7a2b3a" stroke="#2d3a22" stroke-width="6" stroke-linejoin="round"/>
      <path d="M-12,38 Q-14,66 0,66 Q14,66 12,38 Z" fill="#ff6f8a" stroke="#2d3a22" stroke-width="4"/>`;
    case 'puff': return `<ellipse cx="0" cy="38" rx="8" ry="6" fill="#2d3a22"/>`;
    default: return `<path d="M-25,28 Q0,58 25,28" fill="#ff6f8a" stroke="#2d3a22" stroke-width="6" stroke-linejoin="round"/>`;
  }
}
function sprout({ x, y, s, rot = 0, eye = 'open', m = 'smile', extra = '' }) {
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">
  <path d="M0,-95 C-5,-120 -10,-135 -8,-150" stroke="#4f9a3a" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M-8,-150 C-60,-185 -105,-150 -95,-120 C-60,-110 -25,-125 -8,-150Z" fill="#7cc95a" stroke="#4f9a3a" stroke-width="6"/>
  <path d="M-8,-150 C30,-200 85,-180 85,-150 C55,-125 15,-130 -8,-150Z" fill="#9bdc6e" stroke="#4f9a3a" stroke-width="6"/>
  <ellipse cx="0" cy="0" rx="92" ry="100" fill="#b8e986" stroke="#4f9a3a" stroke-width="7"/>
  <ellipse cx="-30" cy="-40" rx="25" ry="15" fill="#fff" opacity=".45"/>
  ${eyes(eye)}
  <ellipse cx="-58" cy="25" rx="16" ry="10" fill="#ff9fb0" opacity=".8"/><ellipse cx="58" cy="25" rx="16" ry="10" fill="#ff9fb0" opacity=".8"/>
  ${mouth(m)}${extra}</g>`;
}
function brush(x, y, ang, paste = 0) {
  return `<g transform="translate(${x},${y}) rotate(${ang}) scale(0.62)">
  <rect x="0" y="-9" width="190" height="18" rx="9" fill="#5aa3d8" stroke="#3c7fb0" stroke-width="3"/>
  <rect x="-46" y="-16" width="52" height="24" rx="7" fill="#fff" stroke="#5aa3d8" stroke-width="5"/>
  <rect x="-42" y="-36" width="44" height="22" rx="5" fill="#a6e3ff" stroke="#7cc3f2" stroke-width="3"/>
  ${paste > 0 ? `<g transform="translate(-20,-42) scale(${paste})"><path d="M-18,6 Q-20,-14 0,-16 Q22,-14 18,6 Z" fill="#fff" stroke="#bfe6e0" stroke-width="3"/><path d="M-10,-2 Q0,-10 10,-2" stroke="#7fd6c8" stroke-width="5" fill="none"/></g>` : ''}
  </g>`;
}
function bee(x, y, s, r = 0, t = 0) {
  const flap = 0.75 + 0.25 * Math.sin(t * 60);
  return `<g transform="translate(${x},${y}) rotate(${r}) scale(${s})">
  <ellipse cx="-8" cy="-22" rx="16" ry="${22 * flap}" fill="#fff" opacity=".85" stroke="#9cc" stroke-width="2"/>
  <ellipse cx="12" cy="-22" rx="14" ry="${20 * flap}" fill="#fff" opacity=".85" stroke="#9cc" stroke-width="2"/>
  <ellipse cx="0" cy="0" rx="34" ry="25" fill="#ffd23f" stroke="#3a2e12" stroke-width="4"/>
  <path d="M-8,-24 v48 M10,-23 v46" stroke="#3a2e12" stroke-width="8"/><circle cx="24" cy="-4" r="4" fill="#3a2e12"/></g>`;
}
function drizzle(x, y, s) {
  return `<g transform="translate(${x},${y}) scale(${s})">
  <path d="M-120,40 C-165,40 -170,-25 -125,-30 C-130,-85 -60,-105 -35,-65 C-20,-115 60,-115 70,-60 C115,-80 160,-35 130,5 C170,15 160,45 120,45 Z" fill="#cfeaff" stroke="#5aa3d8" stroke-width="7" stroke-linejoin="round"/>
  <path d="M-45,0 Q-32,-20 -19,0 M19,0 Q32,-20 45,0" stroke="#2a4459" stroke-width="7" fill="none" stroke-linecap="round"/>
  <ellipse cx="-70" cy="12" rx="15" ry="9" fill="#ffb3c4" opacity=".8"/><ellipse cx="70" cy="12" rx="15" ry="9" fill="#ffb3c4" opacity=".8"/>
  <path d="M-18,15 Q0,32 18,15" stroke="#2a4459" stroke-width="6" fill="none" stroke-linecap="round"/></g>`;
}
const star = (x, y, s, o = 1) => `<g transform="translate(${x},${y}) scale(${s})" opacity="${o}"><path d="M0,-30 L8,-8 L30,0 L8,8 L0,30 L-8,8 L-30,0 L-8,-8Z" fill="#ffe27a" stroke="#f3c640" stroke-width="2"/></g>`;
function sparkles(t, t0, cx, cy, r) {
  let s = '';
  for (let i = 0; i < 7; i++) {
    const a = i * 0.9 + 0.3, k = (t - t0 - i * 0.07);
    if (k < 0 || k > 1.6) continue;
    const sc = Math.sin(Math.PI * clamp(k / 1.6)) * (1 + 0.3 * (i % 3));
    s += star(cx + Math.cos(a) * r * (1 + 0.15 * (i % 2)), cy + Math.sin(a) * r * 0.8, sc, 1);
  }
  return s;
}
function bubbles(t, n, cx, cy) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const ph = (t * 0.6 + i * 0.37) % 1, a = i * 2.4;
    const x = cx + Math.cos(a) * (60 + 40 * (i % 3)) + Math.sin(t * 3 + i) * 8;
    const y = cy + Math.sin(a) * 40 - ph * 140;
    s += `<circle cx="${x}" cy="${y}" r="${10 + 8 * (i % 3)}" fill="#fff" fill-opacity=".55" stroke="#a6e3ff" stroke-width="3" opacity="${1 - ph}"/>`;
  }
  return s;
}

function background(t, sunUp, showDrizzle) {
  let tiles = '';
  for (let y = 0; y < 1300; y += 120) tiles += `<path d="M0,${y} H${W}" stroke="#cbe6f2" stroke-width="3"/>`;
  for (let x = 0; x < W; x += 120) tiles += `<path d="M${x},0 V1300" stroke="#cbe6f2" stroke-width="3"/>`;
  const sunY = 380 - 160 * ease(sunUp);
  return `<rect width="${W}" height="${H}" fill="#e6f5fb"/>${tiles}
  <g><rect x="60" y="150" width="300" height="300" rx="30" fill="#bfe6ff" stroke="#fff" stroke-width="16"/>
   <clipPath id="win"><rect x="68" y="158" width="284" height="284" rx="24"/></clipPath>
   <g clip-path="url(#win)"><circle cx="230" cy="${sunY}" r="60" fill="#ffe27a"/>
    <path d="M60,420 C140,380 260,400 360,370 V460 H60Z" fill="#a6dd7c"/>
    ${showDrizzle > 0 ? drizzle(210, 300 + (1 - ease(showDrizzle)) * 220, 0.75) : ''}</g>
   <path d="M210,150 V450 M60,300 H360" stroke="#fff" stroke-width="12"/></g>
  <rect x="0" y="1300" width="${W}" height="${H - 1300}" fill="#fff6d8"/>
  <rect x="0" y="1300" width="${W}" height="24" fill="#f0dfb0"/>
  <rect x="190" y="1180" width="700" height="150" rx="40" fill="#ffffff" stroke="#9fc9e6" stroke-width="10"/>
  <ellipse cx="540" cy="1200" rx="260" ry="34" fill="#dff1fb"/>
  <rect x="520" y="1130" width="40" height="60" rx="12" fill="#c9d6de"/><rect x="520" y="1130" width="110" height="26" rx="12" fill="#c9d6de"/>`;
}

function karaoke(t, line) {
  if (!line) return '';
  const words = line.words, n = words.length;
  const len = line.text.length;
  let rows = [words];
  if (len > 21) { // split into two rows of balanced length
    let best = 1, bestW = 1e9;
    for (let i = 1; i < n; i++) {
      const w = Math.max(words.slice(0, i).join(' ').length, words.slice(i).join(' ').length);
      if (w < bestW) { bestW = w; best = i; }
    }
    rows = [words.slice(0, best), words.slice(best)];
  }
  const fs = 70;
  let out = `<rect x="60" y="1500" width="960" height="${rows.length === 2 ? 290 : 200}" rx="50" fill="#fff" stroke="#b8e986" stroke-width="8" opacity=".96"/>`;
  let idx = 0;
  rows.forEach((row, ri) => {
    const y = 1500 + (rows.length === 2 ? 115 + ri * 100 : 125);
    out += `<text x="540" y="${y}" text-anchor="middle" font-size="${fs}">`;
    row.forEach((w, wi) => {
      const sung = t >= line.wordTimes[idx];
      const now = sung && (idx === n - 1 || t < line.wordTimes[idx + 1]);
      out += `<tspan fill="${sung ? (now ? '#2f9a3a' : '#2f6b2a') : '#9aaab5'}">${w}${wi < row.length - 1 ? ' ' : ''}</tspan>`;
      idx++;
    });
    out += `</text>`;
  });
  return out;
}

function draw(t) {
  BEAT = 60 / (TL.bpm || 120);
  const END = TL.endCard ?? TL.total - 3;
  if (t >= END) return endCard(t - END);
  const tWake = S('wake'), tGrab = S('grab'), tPaste = S('paste'), tSmile = S('smile'), tTop = S('top'), tOutro = S('outro');
  const titleEnd = Math.max(3.5, tWake - 0.2);
  const line = lineAt(t);
  const sec = line ? line.section : 'intro';
  const beatPh = (t / BEAT) % 1;
  const live = t > titleEnd - 0.5;
  const bounce = live ? -Math.abs(Math.sin(Math.PI * beatPh)) * 16 : 0;
  const rot = live ? Math.sin(t * Math.PI) * 3 : 0;
  let sx = 540, sy = 860 + bounce, ss = 2.4;
  let eye = 'open', m = 'smile', extra = '', fx = '';
  let br = null; // {x,y,ang,paste} in sprout-local coords
  const P = t >= tPaste + 0.8 ? elastic((t - tPaste - 0.8) / 0.6) : 0;

  // intro: pop in
  if (t < tWake) { ss = 2.4 * elastic((t - 0.4) / 1.0); eye = 'happy'; }
  // verse 1
  if (t >= tWake && t < tTop) {
    if (t < tWake + 1.6) { eye = 'closed'; m = t < tWake + 1.0 ? 'yawn' : 'smile'; }
    if (t >= tGrab) {
      const k = ease((t - tGrab) / 0.8);
      br = { x: 140 + 300 * (1 - k), y: 40 + Math.sin(t * 6) * 12 * (t < tPaste ? 1 : 0), ang: -30, paste: P };
    }
    if (t >= tSmile) { m = 'wide'; eye = 'happy'; fx += sparkles(t, tSmile + 0.2, sx, sy, 280); }
  }
  // brushing sections
  const brushing = (sec === 'chorus' || sec === 'chorus2');
  if (brushing) {
    const k = (t - line.start);
    m = 'wide'; eye = 'happy';
    let bx = 60 + Math.sin(t * Math.PI * 4) * 28, by = 30;
    if (line.role === 'bottom') by = 48;
    if (line.role === 'round') {
      if (k < 2) { bx = 60 + Math.cos(t * 9) * 25; by = 38 + Math.sin(t * 9) * 12; }
      else { bx = 60 + Math.sin(t * Math.PI * 2) * 45; by = 38; }
    }
    if (line.role === 'shiny') { br = { x: 150, y: -10, ang: -50, paste: 0 }; fx += sparkles(t, line.start + 0.2, sx, sy, 280); }
    else br = { x: bx + 10, y: by, ang: 20, paste: 0 };
    extra += bubbles(t, 5 + Math.min(6, Math.floor(k * 2)), 0, 30).replace(/r="(\d+)"/g, (_, r) => `r="${r / 2.4}"`);
  }
  // verse 2
  if (sec === 'verse2') {
    m = 'wide'; eye = 'open';
    br = { x: 70 + Math.sin(t * Math.PI * 4) * 25, y: 36, ang: 20, paste: 0 };
    if (line.role === 'circles') br = { x: 70 + Math.cos(t * 10) * 14, y: 36 + Math.sin(t * 10) * 10, ang: 20, paste: 0 };
    if (line.role === 'tongue') {
      const tt = TL.events.tongue;
      if (t >= tt) { m = 'tongue'; eye = 'happy'; br = { x: 85, y: 52, ang: 25, paste: 0 }; }
    }
    if (line.role === 'spit') {
      const tp = TL.events.spit;
      if (t < tp) { m = 'puff'; br = { x: 140, y: 20, ang: -35, paste: 0 }; }
      else {
        m = 'wide'; eye = 'happy'; br = { x: 150, y: -50, ang: -60, paste: 0 };
        const k = t - tp;
        for (let d = 0; d < 6; d++) {
          const dx = (d - 2.5) * 22, dy = 70 + k * 600 + d * 8;
          if (sy + dy < 1210) fx += `<path transform="translate(${sx + dx},${sy + dy})" d="M0,-14 q-10,16 0,24 q10,-8 0,-24Z" fill="#a6e3ff"/>`;
        }
        if (k > 0.5) fx += sparkles(t, tp + 0.6, sx, sy, 280);
      }
    }
    if (line.role === 'frontback' && t > line.start + 2) br.x += 30;
  }
  // outro
  let dz = 0;
  if (t >= tOutro) {
    m = 'wide'; eye = 'happy'; dz = clamp((t - tOutro) / 1.2);
    br = { x: 150, y: -10, ang: -50, paste: 0 };
    fx += sparkles(t, tOutro + 0.2, sx, sy, 300) + sparkles(t, tOutro + 1.8, sx, sy, 330);
  }

  if (br) extra += brush(br.x, br.y, br.ang, br.paste);
  const sunUp = t < tWake ? 0 : (t - tWake) / 2.5;
  let svg = background(t, sunUp, dz);
  // mirror
  svg += `<rect x="170" y="430" width="740" height="720" rx="70" fill="#f7fcff" stroke="#9fc9e6" stroke-width="16"/>
          <path d="M240,520 L330,470 M240,580 L400,480" stroke="#fff" stroke-width="18" stroke-linecap="round" opacity=".8"/>`;
  svg += sprout({ x: sx, y: sy, s: ss, rot, eye, m, extra }) + fx;
  // bees
  if (t < titleEnd + 0.5 || sec === 'chorus2' || t >= tOutro - 2) {
    for (let i = 0; i < 3; i++) {
      const p = t * 0.9 + i * 2.1;
      const bx = 540 + Math.sin(p) * 380, by = 520 + Math.sin(p * 2) * 80 + i * 30;
      const enter = t < titleEnd + 0.5 ? clamp((t - i * 0.25) / 1.0) : 1;
      svg += bee(bx + (1 - ease(enter)) * 700, by, 1.1, Math.cos(p) * 15, t);
    }
  }
  // title
  if (t < titleEnd) {
    const k = elastic((t - 0.1) / 0.9), o = t > titleEnd - 0.6 ? (titleEnd - t) / 0.6 : 1;
    svg += `<g opacity="${o}" transform="translate(540,300) scale(${k})"><text x="0" y="0" text-anchor="middle" font-size="${T_().titleSize}" fill="#2f6b2a" stroke="#fff" stroke-width="20" paint-order="stroke">${T_().title}</text>
    <text x="0" y="110" text-anchor="middle" font-size="80" fill="#3d7fb3" stroke="#fff" stroke-width="12" paint-order="stroke">${T_().sub}</text></g>`;
  } else {
    svg += `<text x="1040" y="90" text-anchor="end" font-size="40" fill="#5aa3d8" opacity=".75">${T_().brand}</text>`;
  }
  svg += karaoke(t, karaokeLine(t));
  return svg;
}

function endCard(k) {
  const a = elastic(k / 0.8);
  let s = `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe6ff"/><stop offset="1" stop-color="#fff6d8"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <path d="M0,1500 C300,1420 600,1480 1080,1430 V1920 H0Z" fill="#a6dd7c"/><path d="M0,1650 C400,1600 700,1680 1080,1620 V1920 H0Z" fill="#86c95d"/>
  <circle cx="900" cy="260" r="90" fill="#ffe27a"/>`;
  s += drizzle(780, 520, 1.1 * a) + sprout({ x: 400, y: 880, s: 2.2 * a, eye: 'happy', m: 'wide' });
  s += `<text x="540" y="1330" text-anchor="middle" font-size="110" fill="#2f6b2a" stroke="#fff" stroke-width="18" paint-order="stroke" opacity="${clamp(k * 2)}">${T_().brand}</text>
  <text x="540" y="1430" text-anchor="middle" font-size="${T_().moreSize}" fill="#3d7fb3" stroke="#fff" stroke-width="10" paint-order="stroke" opacity="${clamp(k * 2 - 0.5)}">${T_().more}</text>`;
  return s;
}
