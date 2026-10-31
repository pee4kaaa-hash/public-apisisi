const { chromium } = require('playwright');
const { sprout, drizzle, bee } = require('./chars.js');
const font = `<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&display=block" rel="stylesheet">
<style>html,body{margin:0}text{font-family:Fredoka,'DejaVu Sans',sans-serif;font-weight:700}</style>`;
const sky = `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe6ff"/><stop offset="1" stop-color="#fff6d8"/></linearGradient></defs>`;
const hills = (w,h) => `<path d="M0,${h*.78} C${w*.2},${h*.68} ${w*.35},${h*.74} ${w*.5},${h*.76} C${w*.7},${h*.8} ${w*.85},${h*.68} ${w},${h*.74} V${h} H0Z" fill="#a6dd7c"/>
<path d="M0,${h*.88} C${w*.25},${h*.82} ${w*.6},${h*.9} ${w},${h*.84} V${h} H0Z" fill="#86c95d"/>`;
const flower = (x,y,s,c) => `<g transform="translate(${x},${y}) scale(${s})"><path d="M0,0 v40" stroke="#4f9a3a" stroke-width="5"/>${[0,72,144,216,288].map(a=>`<ellipse cx="0" cy="-14" rx="9" ry="14" fill="${c}" transform="rotate(${a})"/>`).join('')}<circle r="8" fill="#ffd23f"/></g>`;

const avatar = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">${sky}
<rect width="800" height="800" fill="url(#sky)"/>
<circle cx="640" cy="150" r="70" fill="#ffe27a"/>
${hills(800,800)}
${drizzle(560,250,1.05)}
${sprout(330,500,1.75)}
${flower(120,640,1.2,'#ff9fb0')}${flower(690,660,1,'#c9a7ff')}
</svg>`;

const W=2560,H=1440;
const banner = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${sky}
<rect width="${W}" height="${H}" fill="url(#sky)"/>
<circle cx="2250" cy="260" r="120" fill="#ffe27a"/>
<path d="M300,1000 a720,720 0 0 1 1960,0" fill="none" stroke="#ffb3c4" stroke-width="40" opacity=".55"/>
<path d="M340,1000 a680,680 0 0 1 1880,0" fill="none" stroke="#ffe27a" stroke-width="40" opacity=".55"/>
<path d="M380,1000 a640,640 0 0 1 1800,0" fill="none" stroke="#a6dd7c" stroke-width="40" opacity=".55"/>
<path d="M420,1000 a600,600 0 0 1 1720,0" fill="none" stroke="#9fd4ff" stroke-width="40" opacity=".55"/>
${hills(W,H)}
${[200,450,2150,2400].map((x,i)=>flower(x,1250+(i%2)*40,1.6,['#ff9fb0','#c9a7ff','#ffb36b','#ff9fb0'][i])).join('')}
${sprout(640,800,0.82)}
${drizzle(1930,700,0.6)}
${bee(1850,570,0.8,-10)}${bee(1990,560,0.7,8)}
<text x="1280" y="700" text-anchor="middle" font-size="132" fill="#2f6b2a" stroke="#fff" stroke-width="18" paint-order="stroke">Sprout &amp; Drizzle</text>
<text x="1280" y="790" text-anchor="middle" font-size="58" fill="#3d7fb3" stroke="#fff" stroke-width="10" paint-order="stroke">Little songs for growing hearts 🌱</text>
<text x="1280" y="870" text-anchor="middle" font-size="44" fill="#7a5a2a">New songs every day!</text>
</svg>`;

// Thumbnail / first frame for video #1 (vertical 1080x1920)
const thumb = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">${sky}
<rect width="1080" height="1920" fill="url(#sky)"/>
${hills(1080,1920)}
<rect x="140" y="420" width="800" height="760" rx="60" fill="#e9f6ff" stroke="#9fc9e6" stroke-width="14"/>
<rect x="175" y="455" width="730" height="690" rx="40" fill="#f7fcff"/>
${sprout(540,920,2.1)}
<g transform="translate(790,980) rotate(-35)"><rect x="-18" y="-10" width="36" height="230" rx="18" fill="#5aa3d8"/><rect x="-28" y="-80" width="56" height="80" rx="14" fill="#fff" stroke="#5aa3d8" stroke-width="8"/><rect x="-22" y="-74" width="44" height="30" rx="8" fill="#a6e3ff"/></g>
${[ [300,560],[820,620],[260,1060],[860,1120] ].map(([x,y])=>`<g transform="translate(${x},${y})"><path d="M0,-30 L8,-8 L30,0 L8,8 L0,30 L-8,8 L-30,0 L-8,-8Z" fill="#ffe27a"/></g>`).join('')}
<text x="540" y="300" text-anchor="middle" font-size="140" fill="#2f6b2a" stroke="#fff" stroke-width="20" paint-order="stroke">BRUSH BRUSH!</text>
<text x="540" y="1420" text-anchor="middle" font-size="96" fill="#3d7fb3" stroke="#fff" stroke-width="14" paint-order="stroke">Shiny Teeth 🦷</text>
</svg>`;

(async () => {
  const b = await chromium.launch();
  for (const [name, svg, w, h] of [['avatar', avatar, 800, 800], ['banner', banner, W, H], ['video1-thumbnail', thumb, 1080, 1920]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.setContent(font + svg, { waitUntil: 'networkidle' }).catch(()=>{});
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: `${name}.png` });
    require('fs').writeFileSync(`${name}.svg`, svg);
  }
  await b.close();
})();
