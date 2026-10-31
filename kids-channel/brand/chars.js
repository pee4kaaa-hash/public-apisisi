// Shared SVG character drawings for Sprout & Drizzle
const sprout = (x, y, s) => `
<g transform="translate(${x},${y}) scale(${s})">
  <path d="M0,-95 C-5,-120 -10,-135 -8,-150" stroke="#4f9a3a" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M-8,-150 C-60,-185 -105,-150 -95,-120 C-60,-110 -25,-125 -8,-150Z" fill="#7cc95a" stroke="#4f9a3a" stroke-width="6"/>
  <path d="M-8,-150 C30,-200 85,-180 85,-150 C55,-125 15,-130 -8,-150Z" fill="#9bdc6e" stroke="#4f9a3a" stroke-width="6"/>
  <path d="M-55,-138 C-45,-140 -30,-140 -20,-145" stroke="#4f9a3a" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M15,-155 C30,-160 50,-162 65,-158" stroke="#4f9a3a" stroke-width="4" fill="none" stroke-linecap="round"/>
  <ellipse cx="0" cy="0" rx="92" ry="100" fill="#b8e986" stroke="#4f9a3a" stroke-width="7"/>
  <ellipse cx="-30" cy="-40" rx="25" ry="15" fill="#ffffff" opacity=".45"/>
  <ellipse cx="-32" cy="-5" rx="13" ry="17" fill="#2d3a22"/>
  <ellipse cx="32" cy="-5" rx="13" ry="17" fill="#2d3a22"/>
  <circle cx="-27" cy="-11" r="5" fill="#fff"/><circle cx="37" cy="-11" r="5" fill="#fff"/>
  <ellipse cx="-58" cy="25" rx="16" ry="10" fill="#ff9fb0" opacity=".8"/>
  <ellipse cx="58" cy="25" rx="16" ry="10" fill="#ff9fb0" opacity=".8"/>
  <path d="M-25,28 Q0,58 25,28" fill="#ff6f8a" stroke="#2d3a22" stroke-width="6" stroke-linejoin="round"/>
</g>`;
const drizzle = (x, y, s) => `
<g transform="translate(${x},${y}) scale(${s})">
  <path d="M-120,40 C-165,40 -170,-25 -125,-30 C-130,-85 -60,-105 -35,-65 C-20,-115 60,-115 70,-60 C115,-80 160,-35 130,5 C170,15 160,45 120,45 Z" fill="#cfeaff" stroke="#5aa3d8" stroke-width="7" stroke-linejoin="round"/>
  <ellipse cx="-60" cy="-55" rx="28" ry="13" fill="#fff" opacity=".7"/>
  <path d="M-45,-5 Q-32,-20 -19,-5" stroke="#2a4459" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M19,-5 Q32,-20 45,-5" stroke="#2a4459" stroke-width="7" fill="none" stroke-linecap="round"/>
  <ellipse cx="-70" cy="12" rx="15" ry="9" fill="#ffb3c4" opacity=".8"/>
  <ellipse cx="70" cy="12" rx="15" ry="9" fill="#ffb3c4" opacity=".8"/>
  <path d="M-18,15 Q0,32 18,15" stroke="#2a4459" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M-60,70 q-10,16 0,24 q10,-8 0,-24Z" fill="#7cc3f2"/>
  <path d="M0,85 q-10,16 0,24 q10,-8 0,-24Z" fill="#7cc3f2"/>
  <path d="M60,70 q-10,16 0,24 q10,-8 0,-24Z" fill="#7cc3f2"/>
</g>`;
const bee = (x, y, s, r=0) => `
<g transform="translate(${x},${y}) rotate(${r}) scale(${s})">
  <ellipse cx="-8" cy="-22" rx="16" ry="22" fill="#fff" opacity=".85" stroke="#9cc" stroke-width="2"/>
  <ellipse cx="12" cy="-22" rx="14" ry="20" fill="#fff" opacity=".85" stroke="#9cc" stroke-width="2"/>
  <ellipse cx="0" cy="0" rx="34" ry="25" fill="#ffd23f" stroke="#3a2e12" stroke-width="4"/>
  <path d="M-8,-24 v48 M10,-23 v46" stroke="#3a2e12" stroke-width="8"/>
  <circle cx="24" cy="-4" r="4" fill="#3a2e12"/>
</g>`;
module.exports = { sprout, drizzle, bee };
