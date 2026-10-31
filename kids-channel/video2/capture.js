const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const FPS = 30;
const LANG = process.env.SONG_LANG || 'en';
const tl = JSON.parse(fs.readFileSync(`timeline_${LANG}.json`));
const OUT = { en: 'Wash_Your_Hands.mp4', ru: 'Moem_Ruchki_RU.mp4' }[LANG];
const only = process.argv[2] ? process.argv[2].split(',').map(Number) : null; // preview times
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.setContent(`<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Nunito:wght@900&display=block" rel="stylesheet">
  <style>html,body{margin:0}text{font-family:${LANG === 'ru' ? 'Nunito' : 'Fredoka'},'DejaVu Sans',sans-serif;font-weight:${LANG === 'ru' ? 900 : 700}}</style>
  <svg id="s" xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"></svg>
  <script>${fs.readFileSync('anim.js', 'utf8')}; TL = ${JSON.stringify(tl)};
  window.go = t => { document.getElementById('s').innerHTML = draw(t); };</script>`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  if (only) {
    for (const t of only) { await p.evaluate(t => go(t), t); await p.screenshot({ path: `preview_${LANG}_${t}.png` }); }
    return b.close();
  }
  const ff = spawn('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-i', `mix_${LANG}.wav`, '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', OUT], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round(tl.total * FPS);
  for (let i = 0; i < n; i++) {
    await p.evaluate(t => go(t), i / FPS);
    const buf = await p.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 300 === 0) console.log(`frame ${i}/${n}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await b.close();
})();
