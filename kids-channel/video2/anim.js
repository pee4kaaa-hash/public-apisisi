// Wash Your Hands — frame-by-frame animation. Runs inside the page; draw(t) returns SVG markup.
const W = 1080, H = 1920;
let BEAT = 0.5;
let TL; // timeline injected from timeline_<lang>.json
const TEXT = {
  en: { title: 'WASH YOUR HANDS!', titleSize: 112, sub: 'Bubble Song 🧼', brand: 'Sprout &amp; Drizzle', more: 'More songs every day! 🌱', moreSize: 64 },
  ru: { title: 'МОЕМ РУЧКИ!', titleSize: 124, sub: 'Песенка для малышей 🧼', brand: 'Росток и Тучка', more: 'Новые песенки каждый день! 🌱', moreSize: 52 },
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
`;
}


// ---------- video #2 scene: hands, sink, faucet, soap, towel ----------
function hand(x, y, rot, flip, mud, foam, t) {
  let s = `<g transform="translate(${x},${y}) rotate(${rot}) scale(${flip ? -1.25 : 1.25},1.25)">
  <circle cx="-34" cy="-18" r="20" fill="#b8e986" stroke="#4f9a3a" stroke-width="6"/>
  <ellipse cx="0" cy="0" rx="50" ry="56" fill="#b8e986" stroke="#4f9a3a" stroke-width="6"/>
  <path d="M-18,-40 v22 M0,-44 v24 M18,-40 v22" stroke="#4f9a3a" stroke-width="4" stroke-linecap="round" opacity=".6"/>`;
  if (mud > 0) s += `<g opacity="${mud}" fill="#8a5a2b"><circle cx="-14" cy="10" r="16"/><circle cx="18" cy="-8" r="11"/><circle cx="10" cy="28" r="9"/><circle cx="-34" cy="-20" r="8"/><circle cx="26" cy="22" r="6"/></g>`;
  if (foam > 0) {
    s += `<g opacity="${Math.min(1, foam)}">`;
    for (let i = 0; i < 9; i++) {
      const a = i * 0.7 + t * 0.6, r = 14 + (i % 3) * 6;
      s += `<circle cx="${Math.cos(a) * 30 * (0.4 + (i % 4) * 0.2)}" cy="${Math.sin(a * 1.3) * 34 * (0.4 + (i % 3) * 0.25)}" r="${r * foam}" fill="#fff" stroke="#cfeaff" stroke-width="3"/>`;
    }
    s += `</g>`;
  }
  return s + `</g>`;
}
function sinkFront() {
  return `<rect x="200" y="1100" width="680" height="330" rx="20" fill="#f6e7c8" stroke="#d9c08f" stroke-width="8"/>
  <path d="M540,1110 V1420" stroke="#d9c08f" stroke-width="6"/><circle cx="500" cy="1250" r="10" fill="#d9c08f"/><circle cx="580" cy="1250" r="10" fill="#d9c08f"/>
  <rect x="150" y="1000" width="780" height="115" rx="34" fill="#ffffff" stroke="#9fc9e6" stroke-width="10"/>
  <ellipse cx="540" cy="1014" rx="300" ry="24" fill="#dff1fb"/>`;
}
function faucet(open) {
  return `<rect x="768" y="972" width="64" height="34" rx="10" fill="#c9d6de" stroke="#9fb3bf" stroke-width="4"/>
  <path d="M800,985 V880 Q800,840 760,840 Q730,840 730,872" fill="none" stroke="#9fb3bf" stroke-width="34" stroke-linecap="round"/>
  <path d="M800,985 V880 Q800,840 760,840 Q730,840 730,872" fill="none" stroke="#d6e2e9" stroke-width="24" stroke-linecap="round"/>
  <ellipse cx="730" cy="888" rx="15" ry="7" fill="#7f97a5"/>
  <g transform="translate(870,986) rotate(${-open * 70})"><rect x="-8" y="-34" width="16" height="40" rx="8" fill="#9fd4ff" stroke="#5aa3d8" stroke-width="3"/><circle cy="-34" r="12" fill="#9fd4ff" stroke="#5aa3d8" stroke-width="3"/></g>`;
}
function water(t, k) {
  if (k <= 0) return '';
  const len = 125 * Math.min(1, k * 3);
  let s = `<rect x="${718 + Math.sin(t * 30) * 2}" y="892" width="24" height="${len}" rx="12" fill="#a6e3ff" opacity=".85"/>`;
  for (let i = 0; i < 5; i++) { const ph = (t * 2.5 + i / 5) % 1; s += `<circle cx="${730 + (i - 2) * 8}" cy="${896 + ph * len}" r="4" fill="#fff" opacity=".8"/>`; }
  return s;
}
function soapBottle(press) {
  return `<g transform="translate(260,930)">
  <rect x="-40" y="-70" width="80" height="130" rx="22" fill="#c9a7ff" stroke="#9b7fd6" stroke-width="5"/>
  <ellipse cx="-14" cy="-30" rx="10" ry="24" fill="#fff" opacity=".45"/>
  <rect x="-9" y="${-108 + press * 14}" width="18" height="40" fill="#e9e2ff" stroke="#9b7fd6" stroke-width="4"/>
  <rect x="-47" y="${-114 + press * 14}" width="56" height="16" rx="7" fill="#e9e2ff" stroke="#9b7fd6" stroke-width="4"/>
  <circle cx="0" cy="0" r="16" fill="#fff" opacity=".7"/><circle cx="14" cy="18" r="9" fill="#fff" opacity=".7"/></g>`;
}
function towel(x, y) {
  return `<g transform="translate(${x},${y}) rotate(-6)"><rect x="-150" y="-80" width="300" height="160" rx="26" fill="#ffb3c4" stroke="#e07a8e" stroke-width="6"/>
  <path d="M-150,40 H150 M-150,58 H150" stroke="#fff" stroke-width="8"/></g>`;
}
const NUMWORD = /^(one|two|three|раз|два|три)/i;
function numberPops(t) {
  let s = '', n = 0;
  for (const l of TL.lines) {
    if (l.sung === false) continue;
    l.words.forEach((w, i) => {
      if (!NUMWORD.test(w)) return;
      n++;
      const k = t - l.wordTimes[i];
      if (k >= 0 && k < 1.8) {
        const sc = elastic(k / 0.5) * (k > 1.4 ? (1.8 - k) / 0.4 : 1);
        const x = [300, 540, 780][(n - 1) % 3];
        s += `<g transform="translate(${x},330) scale(${sc})"><circle r="80" fill="${['#ff9fb0', '#ffe27a', '#9fd4ff'][(n - 1) % 3]}" stroke="#fff" stroke-width="10"/>
        <text y="38" text-anchor="middle" font-size="110" fill="#2f6b2a">${(n - 1) % 3 + 1}</text></g>`;
      }
    });
  }
  return s;
}

function draw(t) {
  BEAT = 60 / (TL.bpm || 120);
  const END = TL.endCard ?? TL.total - 3;
  if (t >= END) return endCard(t - END);
  const tMud = S('mud'), tLook = S('look'), tWater = S('water'), tSoap = S('soap'), tRub = S('rub'),
        tCount = S('count'), tRinse = S('rinse'), tDry = S('dry'), tRub2 = S('rub', 1), tOutro = S('outro');
  const titleEnd = Math.max(3.5, tMud - 0.2);
  const line = lineAt(t), role = line ? line.role : 'intro', sec = line ? line.section : 'intro';
  const beatPh = (t / BEAT) % 1, live = t > titleEnd - 0.5;
  const bounce = live ? -Math.abs(Math.sin(Math.PI * beatPh)) * 14 : 0;
  let sx = 540, sy = 760 + bounce, ss = 2.1 * (t < titleEnd ? elastic((t - 0.4) / 1.0) : 1);
  let eye = 'happy', m = 'smile', fx = '';
  // dirt and foam on the hands
  let mud = clamp((t - tMud) / 3) * (1 - clamp((t - tRub) / 6));
  let foam = t < tSoap + 1 ? 0 : clamp((t - tSoap - 1) / 1.5);
  if (t >= tRinse) foam *= 1 - clamp((t - tRinse) / 3);
  if (t >= tRub2) foam = clamp((t - tRub2) / 1.0);
  if (t >= tOutro) foam = 1 - clamp((t - tOutro) / 1.5);
  const waterOn = (t >= tWater + 0.8 && t < tSoap + 0.5) ? t - tWater - 0.8 : (t >= tRinse && t < tDry) ? t - tRinse : 0;
  const tapOpen = waterOn > 0 ? clamp(waterOn * 3) : 0;
  // hand positions
  const sway = Math.sin(t * Math.PI) * 10;
  let L = { x: 400, y: 1010 + sway, r: -10 }, R = { x: 680, y: 1010 - sway, r: 10 };
  let press = 0;
  if (role === 'mud') { m = 'wide'; L = { x: 320, y: 860 + Math.sin(t * 8) * 30, r: -20 }; R = { x: 760, y: 860 - Math.sin(t * 8) * 30, r: 20 }; }
  if (role === 'look') { eye = 'open'; m = 'o'; L = { x: 380, y: 800, r: -5 }; R = { x: 700, y: 800, r: 5 }; }
  if (role === 'water') { m = 'smile'; eye = 'open';
    if (t < tWater + 0.8) R = { x: 880, y: 930, r: 0 }; else { L = { x: 680, y: 990, r: -15 }; R = { x: 780, y: 990, r: 15 }; } }
  if (role === 'soap') { const k = t - tSoap; press = k > 0.4 && k < 1.2 ? Math.sin(Math.PI * (k - 0.4) / 0.8) : 0;
    L = { x: 250, y: 800 + press * 14, r: 0 }; R = { x: 560, y: 1010, r: 10 }; }
  if (role === 'rub') { const a = t * 7; L = { x: 490 + Math.cos(a) * 22, y: 1000 + Math.sin(a) * 18, r: 20 }; R = { x: 590 - Math.cos(a) * 22, y: 1000 - Math.sin(a) * 18, r: -20 }; }
  if (role === 'backs') { const top = Math.floor(t / BEAT) % 2; const dx = Math.sin(t * 9) * 25;
    L = { x: 540 + dx, y: 1010, r: 0 }; R = { x: 540 - dx, y: 975, r: 0 }; if (top) [L, R] = [R, L]; }
  if (role === 'fingers') { L = { x: 490, y: 1000, r: Math.sin(t * 14) * 18 }; R = { x: 590, y: 1000, r: -Math.sin(t * 14) * 18 }; }
  if (role === 'clean' || role === 'count') { L = { x: 320, y: 820 + Math.sin(t * 6) * 15, r: -25 }; R = { x: 760, y: 820 - Math.sin(t * 6) * 15, r: 25 }; m = 'wide'; eye = role === 'count' ? 'open' : 'happy'; }
  if (role === 'clean') fx += sparkles(t, line.start + 0.3, 540, 850, 330);
  if (role === 'thumbs') { L = { x: 490, y: 1000, r: Math.sin(t * 10) * 35 }; R = { x: 590, y: 1000, r: -Math.sin(t * 10) * 35 }; m = 'wide'; }
  if (role === 'rinse') { L = { x: 680, y: 995 + Math.sin(t * 8) * 10, r: -15 }; R = { x: 780, y: 995 - Math.sin(t * 8) * 10, r: 15 }; m = 'smile'; }
  if (role === 'dry') { L = { x: 460, y: 990, r: -10 }; R = { x: 620, y: 990, r: 10 }; m = 'smile'; }
  if (sec === 'chorus' || sec === 'chorus2') { m = 'wide'; eye = 'happy'; }
  if (t >= tOutro) { m = 'wide'; eye = 'happy'; L = { x: 300, y: 800 + Math.sin(t * 9) * 25, r: -30 }; R = { x: 780, y: 800 - Math.sin(t * 9) * 25, r: 30 };
    fx += sparkles(t, tOutro + 0.2, 540, 800, 320) + sparkles(t, tOutro + 1.8, 540, 800, 360); }
  if (t < titleEnd) { L.y += 500 * (1 - ease((t - 0.6) / 0.8)); R.y += 500 * (1 - ease((t - 0.6) / 0.8)); }

  const dz = t >= tOutro ? clamp((t - tOutro) / 1.2) : 0;
  let svg = background(t, clamp((t - 0.5) / 2.5), dz);
  svg += sprout({ x: sx, y: sy, s: ss, rot: live ? Math.sin(t * Math.PI) * 3 : 0, eye, m });
  svg += sinkFront() + faucet(tapOpen) + water(t, waterOn) + soapBottle(press);
  svg += hand(L.x, L.y, L.r, false, mud, foam, t) + hand(R.x, R.y, R.r, true, mud, foam, t + 1.3);
  if (foam > 0.3) svg += bubbles(t, Math.round(4 + foam * 6), (L.x + R.x) / 2, (L.y + R.y) / 2 - 40);
  if (role === 'dry') svg += towel(540 + Math.sin(t * 5) * 110, 1000);
  svg += fx + numberPops(t);
  if (t < titleEnd + 0.5 || sec === 'chorus2' || t >= tOutro - 2) {
    for (let i = 0; i < 3; i++) {
      const p = t * 0.9 + i * 2.1;
      const enter = t < titleEnd + 0.5 ? clamp((t - i * 0.25) / 1.0) : 1;
      svg += bee(540 + Math.sin(p) * 380 + (1 - ease(enter)) * 700, 470 + Math.sin(p * 2) * 70 + i * 30, 1.1, Math.cos(p) * 15, t);
    }
  }
  if (t < titleEnd) {
    const k = elastic((t - 0.1) / 0.9), o = t > titleEnd - 0.6 ? (titleEnd - t) / 0.6 : 1;
    svg += `<g opacity="${o}" transform="translate(540,300) scale(${k})"><text x="0" y="0" text-anchor="middle" font-size="${T_().titleSize}" fill="#2f6b2a" stroke="#fff" stroke-width="20" paint-order="stroke">${T_().title}</text>
    <text x="0" y="110" text-anchor="middle" font-size="80" fill="#3d7fb3" stroke="#fff" stroke-width="12" paint-order="stroke">${T_().sub}</text></g>`;
  } else svg += `<text x="1040" y="90" text-anchor="end" font-size="40" fill="#5aa3d8" opacity=".75">${T_().brand}</text>`;
  svg += karaoke(t, karaokeLine(t));
  return svg;
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
