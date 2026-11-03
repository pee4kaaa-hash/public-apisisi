// Учебная схема: щитовидная железа — норма, диффузный зоб, узел, подозрение на рак. Рендер: node thyroid_render.js
const { chromium } = require('playwright');
const fs = require('fs');

const PW = 560, PH = 1010;
function neck(bulge) {
  // контур шеи; bulge — выпячивание в нижней трети (зоб)
  const b = bulge;
  return `<path d="M110,30 Q200,120 280,118 Q360,120 450,30" fill="none" stroke="#c99f86" stroke-width="5"/>
  <path d="M178,100 C172,180 ${168 - b},230 ${166 - b * 1.2},280 C164,320 160,340 150,360 Q90,395 10,420 L10,440 L550,440 L550,420 Q470,395 410,360
           C400,340 396,320 ${394 + b * 1.2},280 C${392 + b},230 388,180 382,100" fill="#fbe3d4" stroke="#c99f86" stroke-width="5"/>
  <path d="M60,420 Q170,385 262,402 M498,420 Q390,385 298,402" fill="none" stroke="#d9b49e" stroke-width="5" stroke-linecap="round"/>`;
}
function airway() {
  let rings = '';
  for (let y = 246; y < 400; y += 14) rings += `<path d="M262,${y} H298" stroke="#9fb3c8" stroke-width="3"/>`;
  return `<rect x="262" y="236" width="36" height="170" rx="6" fill="#dfe9f3" stroke="#9fb3c8" stroke-width="3"/>${rings}
  <path d="M248,140 L312,140 L302,200 L280,216 L258,200 Z" fill="#e8eef5" stroke="#8fa3b8" stroke-width="4"/>
  <path d="M272,140 L280,152 L288,140" fill="none" stroke="#8fa3b8" stroke-width="3"/>
  <rect x="256" y="220" width="48" height="16" rx="6" fill="#e8eef5" stroke="#8fa3b8" stroke-width="3"/>`;
}
function gland(k, fill = '#e98a8a') {
  // k — коэффициент увеличения долей
  const rx = 22 * k, ry = 44 * k;
  return `<g fill="${fill}" stroke="#b5525a" stroke-width="4" opacity=".93">
  <ellipse cx="${282 - 36 - (k - 1) * 16}" cy="${272}" rx="${rx}" ry="${ry}" transform="rotate(-10 ${282 - 36 - (k - 1) * 16} 272)"/>
  <ellipse cx="${278 + 36 + (k - 1) * 16}" cy="${272}" rx="${rx}" ry="${ry}" transform="rotate(10 ${278 + 36 + (k - 1) * 16} 272)"/>
  <rect x="250" y="${262 - 4 * (k - 1)}" width="60" height="${22 + 10 * (k - 1)}" rx="10"/></g>`;
}
function label(x1, y1, x2, y2, text, anchor = 'start') {
  // '|' в тексте — перенос строки
  const lines = text.split('|'), tx = x2 + (anchor === 'start' ? 8 : -8);
  return `<path d="M${x1},${y1} L${x2},${y2}" stroke="#4a5563" stroke-width="2.5"/><circle cx="${x1}" cy="${y1}" r="5" fill="#4a5563"/>
  <text x="${tx}" y="${y2 + 8 - (lines.length - 1) * 12}" text-anchor="${anchor}" font-size="22" fill="#1f2933">${lines.map((l, i) => `<tspan x="${tx}" dy="${i ? 25 : 0}">${l}</tspan>`).join('')}</text>`;
}
function bullets(items, y0) {
  let s = '', y = y0;
  for (const it of items) {
    const [head, ...rest] = it;
    s += `<text x="24" y="${y}" font-size="23" fill="#1f2933"><tspan font-weight="800">${head}</tspan></text>`; y += 32;
    for (const r of rest) { s += `<text x="40" y="${y}" font-size="21" fill="#334155">• ${r}</text>`; y += 29; }
    y += 12;
  }
  return s;
}

const panels = [
 { title: '1. Норма', color: '#2e9d5b', fig: neck(0) + airway() + gland(1) +
     label(258, 150, 160, 150, 'щитовидный|хрящ', 'end') + label(304, 228, 420, 205, 'перстневидный|хрящ') +
     label(300, 272, 420, 262, 'перешеек') + label(230, 300, 120, 330, 'правая доля', 'end') + label(282, 380, 420, 360, 'трахея'),
   text: [['Осмотр', 'железа не видна, контур шеи ровный'],
          ['Пальпация', 'мягкая, безболезненная, однородная', 'смещается вверх при глотании'],
          ['Анатомия', 'перешеек на уровне II–IV колец трахеи', 'доли по бокам от гортани и трахеи'],
          ['УЗИ', 'объём: мужчины ≤ 25 мл, женщины ≤ 18 мл']] },
 { title: '2. Диффузный зоб', color: '#c99400', fig: neck(26) + airway() + gland(1.75) +
     label(214, 250, 110, 225, 'обе доли|увеличены', 'end') + label(282, 262, 420, 222, 'утолщённый|перешеек') +
     label(170, 300, 120, 350, 'сглажен|контур', 'end'),
   text: [['Осмотр', 'равномерно «полная» шея, контур сглажен'],
          ['Пальпация', 'обе доли увеличены равномерно', 'мягко-эластичная, безболезненная', 'смещается при глотании'],
          ['Частые причины', 'дефицит йода', 'болезнь Грейвса (+ тиреотоксикоз)', 'тиреоидит Хашимото'],
          ['Обследование', 'ТТГ, свободный Т4, антитела к ТПО', 'УЗИ щитовидной железы']] },
 { title: '3. Одиночный узел', color: '#d9731a', fig: neck(4) + airway() + gland(1.05) +
     `<circle cx="238" cy="288" r="18" fill="#f6c3a8" stroke="#8a4b2a" stroke-width="4"/>` +
     label(226, 296, 110, 330, 'узел в доле', 'end') + label(320, 272, 425, 262, 'здоровая|доля'),
   text: [['Осмотр', 'ограниченное выбухание с одной стороны', 'часто не виден, находка на УЗИ'],
          ['Пальпация', 'гладкий, эластичный, подвижный', 'смещается вместе с железой'],
          ['Важно', 'большинство узлов (> 90 %) доброкачественные'],
          ['Тактика', 'ТТГ + УЗИ с оценкой по TI-RADS', 'ТАБ по размеру и категории (ACR):', 'TR3 ≥ 2,5 см · TR4 ≥ 1,5 см · TR5 ≥ 1 см']] },
 { title: '4. Подозрение на рак', color: '#c62828', fig: neck(10) + airway() + gland(1.08) +
     `<path d="M300,250 L318,238 L332,252 L348,246 L346,266 L358,280 L342,292 L346,310 L326,304 L312,316 L304,298 L292,288 L300,272 Z" fill="#9b2335" stroke="#5c0f1c" stroke-width="4"/>
      <g fill="#8e6bbf" stroke="#4b2f78" stroke-width="3"><ellipse cx="400" cy="230" rx="14" ry="10"/><ellipse cx="410" cy="268" rx="16" ry="11"/><ellipse cx="404" cy="306" rx="14" ry="10"/></g>` +
     label(338, 262, 438, 170, 'плотный|бугристый|узел') +
     label(422, 270, 445, 315, 'шейные|лимфоузлы') + label(300, 258, 180, 175, 'возвратный|гортанный нерв|→ осиплость', 'end'),
   text: [['Тревожные признаки', 'плотный, бугристый, малоподвижный узел', 'быстрый рост за недели–месяцы', 'увеличенные плотные шейные лимфоузлы', 'осиплость, дисфагия, стридор'],
          ['УЗИ (подозрительно)', 'гипоэхогенность, неровный край', 'микрокальцинаты, «выше чем шире»', 'выход за капсулу'],
          ['Типы рака', 'папиллярный (~80 %), фолликулярный', 'медуллярный (кальцитонин), анапластический'],
          ['Диагноз', 'только ТАБ + цитология (Bethesda)']] },
];

let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1220" viewBox="0 0 2400 1220">
<rect width="2400" height="1220" fill="#f7f9fc"/>
<text x="1200" y="70" text-anchor="middle" font-size="46" font-weight="900" fill="#1f2933">Щитовидная железа: от нормы до подозрения на рак</text>
<text x="1200" y="112" text-anchor="middle" font-size="24" fill="#52606d">Учебная схема на условной модели шеи, вид спереди («просвечивание»). Не для диагностики.</text>`;
panels.forEach((p, i) => {
  const x = 35 + i * (PW + 30), y = 140;
  svg += `<g transform="translate(${x},${y})">
  <rect width="${PW}" height="${PH}" rx="26" fill="#fff" stroke="#e2e8f0" stroke-width="3"/>
  <rect x="0" y="0" width="${PW}" height="66" rx="26" fill="${p.color}"/><rect x="0" y="40" width="${PW}" height="26" fill="${p.color}"/>
  <text x="${PW / 2}" y="45" text-anchor="middle" font-size="32" font-weight="900" fill="#fff">${p.title}</text>
  <g transform="translate(0,80)">${p.fig}</g>
  ${bullets(p.text, 575)}</g>`;
});
svg += `<text x="1200" y="1195" text-anchor="middle" font-size="20" fill="#52606d">Пороги ТАБ — ACR TI-RADS (2017). Окончательный диагноз ставится только по цитологии/гистологии.</text></svg>`;

(async () => {
  fs.writeFileSync('thyroid_stages.svg', svg);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 2400, height: 1220 } });
  await p.setContent(`<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;800;900&display=block" rel="stylesheet">
  <style>html,body{margin:0}text{font-family:Nunito,'DejaVu Sans',sans-serif}</style>${svg}`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: 'thyroid_stages.png' });
  await b.close();
})();
