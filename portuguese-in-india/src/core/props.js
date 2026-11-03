// Props and places for the story, all cut paper. Ships: caravel / nau (Portugal: white sails, royal-blue cross),
// dhow (lateen sail; colour = the power), English and Dutch ships (flag), plus spice, coins, passes, forts and buildings.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eob, rnd, rr, circle, ell, line } from './lib.js';
import { P, cut, P_rr, P_poly, P_circ, seal, slip } from './paper.js';
import { flag, glow } from './scene.js';

// ═════════════════════════ SHIPS ═════════════════════════
/** Portuguese caravel / nau. s scale, rot tilt, sink 0..1 (slides under, for silhouettes), sil = silhouette colour (night) */
export function caravel(x, y, s = 1, t = 0, { rot = 0, sink = 0, sil = null, sails = 'white', cross = P.royal, pennant = P.royal } = {}) {
  ctx.save(); ctx.translate(x, y + sink * 260 * s); ctx.rotate(rot + sink * 0.35); ctx.scale(s, s);
  const c = (k) => sil || k, sailC = sil || (sails === 'torn' ? P.white : P.white);
  // hull with raised castles
  cut(P_poly([[-300, -70], [-250, -130], [-170, -130], [-150, -80], [150, -80], [190, -150], [300, -150], [270, -60], [200, 50], [-220, 50]]), c(P.sepia), { shadow: sil ? 0 : 0.7, edge: sil ? 0 : 5 });
  if (!sil) { line([[-240, -20], [230, -20]], 'rgba(62,44,30,0.45)', 5); for (let i = 0; i < 5; i++) circle(-150 + i * 70, 0, 9, P.ink); }
  // masts
  for (const [mx, mh] of [[-160, 430], [20, 560], [210, 380]]) cut(P_rr(mx - 9, -80 - mh, 18, mh, 5), c(P.ink), { shadow: sil ? 0 : 0.4, edge: sil ? 0 : 3 });
  // square sails (main + fore) and a lateen mizzen
  const sw = (u) => Math.sin(t * 1.6 + u) * 6;
  const sq = (mx, top, w, h, k) => { cut(() => { ctx.beginPath(); ctx.moveTo(mx - w / 2, top); ctx.lineTo(mx + w / 2, top); ctx.quadraticCurveTo(mx + w / 2 + 24 + sw(k), top + h / 2, mx + w / 2, top + h); ctx.lineTo(mx - w / 2, top + h); ctx.quadraticCurveTo(mx - w / 2 + 24 + sw(k), top + h / 2, mx - w / 2, top); ctx.closePath(); }, sailC, { shadow: sil ? 0 : 0.5, edge: sil ? 0 : 4 });
    if (!sil && cross) { const cx = mx + 12, cy = top + h / 2; cut(P_rr(cx - 12, cy - h * 0.32, 24, h * 0.64, 3), cross, { shadow: 0, edge: 0 }); cut(P_rr(cx - w * 0.3, cy - 12, w * 0.6, 24, 3), cross, { shadow: 0, edge: 0 }); } };
  sq(20, -580, 300, 260, 0); sq(20, -300, 340, 190, 1); sq(-160, -470, 220, 210, 2);
  cut(P_poly([[210, -450], [210, -110], [340, -150]]), sailC, { shadow: sil ? 0 : 0.4, edge: sil ? 0 : 4 });
  if (!sil) cut(P_poly([[29, -640], [130 + sw(3) * 2, -620], [29, -600]]), pennant, { shadow: 0.3, edge: 3 });
  ctx.restore();
}
/** dhow with a lateen sail. sail colour = power: Arab white (ink hull), Gujarat/Egypt brown, others sepia/forest/stone */
export function dhow(x, y, s = 1, t = 0, { sail = P.white, hull = P.ink, rot = 0, sink = 0, sil = null, fall = 0, chain = 0 } = {}) {
  ctx.save(); ctx.translate(x, y + sink * 200 * s); ctx.rotate(rot + sink * 0.3); ctx.scale(s, s);
  cut(P_poly([[-230, -50], [240, -90], [170, 40], [-170, 40]]), sil || hull, { shadow: sil ? 0 : 0.6, edge: sil ? 0 : 4 });
  cut(P_rr(-12, -420, 18, 380, 5), sil || P.sepia, { shadow: 0, edge: sil ? 0 : 3 });
  if (fall < 1) { ctx.save(); ctx.translate(0, fall * 300); ctx.rotate(fall * 1.2); ctx.globalAlpha = 1 - fall * 0.6;
    cut(() => { ctx.beginPath(); ctx.moveTo(-200, -60); ctx.lineTo(160, -470); ctx.quadraticCurveTo(150 + Math.sin(t * 1.5) * 8, -220, 40, -70); ctx.closePath(); }, sil || sail, { shadow: sil ? 0 : 0.5, edge: sil ? 0 : 4 }); ctx.restore(); }
  if (chain > 0) chainLink(-240, -20, chain);
  ctx.restore();
}
/** a ship flying a flag (England, Holland): smaller hull + 2 square sails + flag at the stern */
export function flagShip(x, y, s = 1, t = 0, kind = 'england', { tearSails = 0, sail = P.white } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_poly([[-240, -70], [240, -110], [200, 40], [-190, 40]]), P.sepia, { shadow: 0.6, edge: 4 });
  for (const mx of [-70, 90]) { cut(P_rr(mx - 8, -520, 16, 450, 5), P.ink, { shadow: 0.3, edge: 3 }); cut(P_poly([[mx - 120, -470], [mx + 120, -470], [mx + 130 - tearSails * 60, -260], [mx - 110, -240 + tearSails * 60]]), sail, { shadow: 0.5, edge: 4 }); }
  flag(220, -110, kind, t, 0.55, { h: 300 });
  ctx.restore();
}
function chainLink(x, y, p) { ctx.save(); ctx.globalAlpha = clamp(p * 2); for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.ellipse(x - i * 36 * p, y + Math.sin(i) * 4, 20, 11, 0, 0, TAU); ctx.strokeStyle = P.ink; ctx.lineWidth = 7; ctx.stroke(); } ctx.restore(); }

// ═════════════════════════ SPICE + MONEY ═════════════════════════
/** a climbing pepper vine on a pole with hanging spikes of peppercorns */
export function pepperVine(x, y, s = 1, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-14, -900, 28, 900, 8), P.sepia, { shadow: 0.6, edge: 4 });
  for (let i = 0; i < 9; i++) { const yy = -120 - i * 90, side = i % 2 ? 1 : -1, sw = Math.sin(t * 1.2 + i) * 0.06;
    ctx.save(); ctx.translate(side * 10, yy); ctx.rotate(side * (0.5 + sw)); cut(() => { ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(side * 70, -60, side * 150, -10); ctx.quadraticCurveTo(side * 70, 40, 0, 0); ctx.closePath(); }, P.forest, { shadow: 0.4, edge: 3 }); ctx.restore();
    if (i % 2 === 0 && i < 8) { for (let k = 0; k < 9; k++) circle(side * -40 + Math.sin(k) * 4, yy + 20 + k * 15, 10 - k * 0.5, k < 4 ? P.crimson : P.wine); } }
  ctx.restore();
}
export function peppercorn(x, y, r = 16) { circle(x, y, r + 3, P.edge); circle(x, y, r, '#2E2620'); circle(x - r * 0.3, y - r * 0.3, r * 0.3, 'rgba(255,255,255,0.18)'); }
/** a burlap sack of pepper. open = mouth open with corns showing */
export function sack(x, y, s = 1, { open = true, label: lb = null } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(() => { ctx.beginPath(); ctx.moveTo(-150, 0); ctx.quadraticCurveTo(-190, -160, -110, -280); ctx.lineTo(110, -280); ctx.quadraticCurveTo(190, -160, 150, 0); ctx.closePath(); }, '#B08B5E', { shadow: 0.8, edge: 5 });
  line([[-100, -250], [-120, -40]], 'rgba(62,44,30,0.25)', 4); line([[60, -250], [80, -30]], 'rgba(62,44,30,0.25)', 4);
  if (open) { ell(0, -280, 112, 30, '#7A5A36'); for (let i = 0; i < 16; i++) circle(-80 + (i % 8) * 22, -284 - Math.floor(i / 8) * 14 + Math.sin(i) * 4, 10, '#2E2620'); }
  if (lb) { ctx.font = '700 40px Caladea'; ctx.textAlign = 'center'; ctx.fillStyle = P.ink; ctx.fillText(lb, 0, -120); }
  ctx.restore();
}
export function coin(x, y, r = 30) { circle(x, y + 5, r, '#A87A22'); circle(x, y, r, P.gold); ctx.beginPath(); ctx.arc(x, y, r * 0.68, 0, TAU); ctx.strokeStyle = '#A87A22'; ctx.lineWidth = 4; ctx.stroke(); }
/** a stack of n coins (grows with n, can be fractional) */
export function coinStack(x, y, n, r = 46) { const k = Math.floor(n), f = n - k; for (let i = 0; i < k; i++) { ell(x, y - i * 16 + 6, r, r * 0.34, '#A87A22'); ell(x, y - i * 16, r, r * 0.34, P.gold); } if (f > 0) { ctx.save(); ctx.globalAlpha = f; ell(x, y - k * 16 - (1 - f) * 40, r, r * 0.34, P.gold); ctx.restore(); } }
/** a hanging spice scale. tilt -1..1 (positive = right pan down); left(), right() draw what sits in each pan */
export function spiceScale(x, y, s = 1, tilt = 0, left = null, right = null) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-16, -520, 32, 520, 6), P.sepia, { shadow: 0.6, edge: 4 }); cut(P_rr(-120, -10, 240, 30, 10), P.sepia, { shadow: 0.6, edge: 4 });
  const a = tilt * 0.28; ctx.save(); ctx.translate(0, -500); ctx.rotate(a); cut(P_rr(-330, -12, 660, 24, 12), P.ink, { shadow: 0.5, edge: 3 }); ctx.restore();
  for (const sd of [-1, 1]) { const px = Math.cos(a) * 320 * sd, py = -500 + Math.sin(a) * 320 * sd;
    line([[px, py], [px - 100, py + 260]], P.ink, 3); line([[px, py], [px + 100, py + 260]], P.ink, 3);
    cut(() => { ctx.beginPath(); ctx.moveTo(px - 130, py + 260); ctx.quadraticCurveTo(px, py + 340, px + 130, py + 260); ctx.closePath(); }, P.sepia, { shadow: 0.5, edge: 4 });
    ctx.save(); ctx.translate(px, py + 262); (sd < 0 ? left : right)?.(); ctx.restore(); }
  cut(P_circ(0, -500, 20), P.gold, { shadow: 0.3, edge: 3 });
  ctx.restore();
}

// ═════════════════════════ PAPERS ═════════════════════════
/** the cartaz: a Portuguese sea pass. stamp 0..1 brings the seal down */
export function cartaz(x, y, s = 1, stamp = 1, rot = -0.04) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  cut(P_rr(-260, -340, 520, 680, 8), P.edge, { shadow: 0.9, edge: 0 });
  ctx.font = '700 64px Caladea'; ctx.textAlign = 'center'; ctx.fillStyle = P.ink; ctx.fillText('CARTAZ', 0, -240);
  line([[-180, -200], [180, -200]], P.sepia, 3); for (let i = 0; i < 7; i++) line([[-190, -140 + i * 46], [150 - (i % 3) * 40, -140 + i * 46]], 'rgba(62,44,30,0.45)', 6);
  caravelMini(-150, 250, 0.9);
  if (stamp > 0) { const k = eo(clamp(stamp)); ctx.save(); ctx.globalAlpha = clamp(stamp * 3); seal(130, 220, lerp(2.2, 1, k), 'P'); ctx.restore(); }
  ctx.restore();
}
function caravelMini(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_poly([[-50, -10], [50, -10], [36, 14], [-36, 14]]), P.sepia, { shadow: 0, edge: 2 }); cut(P_poly([[-30, -80], [30, -80], [26, -16], [-26, -16]]), P.white, { shadow: 0, edge: 2 }); line([[0, -76], [0, -20]], P.royal, 6); line([[-20, -48], [20, -48]], P.royal, 6); ctx.restore(); }
/** a ledger page; chain 0..1 draws a broken chain across it (the symbol for the slave trade) */
export function ledger(x, y, s = 1, chain = 0, rot = 0.03) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  cut(P_rr(-300, -380, 600, 760, 6), P.edge, { shadow: 0.9, edge: 0 }); line([[-230, -380], [-230, 380]], 'rgba(168,50,45,0.45)', 3);
  for (let i = 0; i < 14; i++) { line([[-210, -320 + i * 50], [-40 - (i % 4) * 30, -320 + i * 50]], 'rgba(62,44,30,0.5)', 5); line([[150, -320 + i * 50], [250, -320 + i * 50]], 'rgba(62,44,30,0.5)', 5); }
  if (chain > 0) { ctx.save(); ctx.globalAlpha = clamp(chain * 2);
    for (let i = 0; i < 9; i++) { const gap = i === 4 ? 34 * chain : 0, cx = -240 + i * 60 + (i >= 4 ? gap : 0), cy = 30 + Math.sin(i * 0.9) * 10, ang = i % 2 ? 0 : 0.0; ctx.beginPath(); ctx.ellipse(cx, cy, 30, 17, ang, i === 4 ? 0.5 : 0, i === 4 ? TAU - 0.5 : TAU); ctx.strokeStyle = P.ink; ctx.lineWidth = 11; ctx.stroke(); }
    ctx.restore(); }
  ctx.restore();
}
/** a law scroll with a seal (the sati ban) */
export function lawScroll(x, y, s = 1, sealP = 1, title = 'DECREE') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-240, -360, 480, 720, 10), P.edge, { shadow: 0.9, edge: 0 }); cut(P_rr(-270, -390, 540, 50, 25), P.sepia); cut(P_rr(-270, 340, 540, 50, 25), P.sepia);
  ctx.font = '700 58px Caladea'; ctx.textAlign = 'center'; ctx.fillStyle = P.ink; ctx.fillText(title, 0, -250);
  for (let i = 0; i < 8; i++) line([[-180, -170 + i * 50], [180 - (i % 3) * 50, -170 + i * 50]], 'rgba(62,44,30,0.45)', 6);
  if (sealP > 0) { ctx.save(); ctx.globalAlpha = clamp(sealP * 3); seal(120, 250, lerp(2, 0.9, eo(clamp(sealP))), 'P'); ctx.restore(); }
  ctx.restore();
}
/** a calendar block; flip = how many pages have torn off (fractional = mid-flip) */
export function calendar(x, y, s, labels, flip = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const i = Math.min(labels.length - 1, Math.floor(flip)), f = flip - Math.floor(flip);
  cut(P_rr(-170, -200, 340, 400, 12), P.edge, { shadow: 0.9, edge: 0 }); cut(P_rr(-170, -200, 340, 90, 12), P.crimson, { shadow: 0, edge: 0 });
  ctx.font = '700 84px Caladea'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = P.ink; ctx.fillText(labels[i], 0, 40);
  if (f > 0 && i < labels.length - 1) { ctx.save(); ctx.translate(0, -110); ctx.rotate(-f * 1.6); ctx.globalAlpha = 1 - f; cut(P_rr(-170, 0, 340, 310, 8), P.edge, { shadow: 0.5, edge: 0 }); ctx.restore(); }
  ctx.restore();
}
export function hourglass(x, y, s = 1, p = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-120, -260, 240, 30, 8), P.sepia); cut(P_rr(-120, 230, 240, 30, 8), P.sepia);
  ctx.save(); ctx.globalAlpha = 0.6; cut(() => { ctx.beginPath(); ctx.moveTo(-90, -230); ctx.lineTo(90, -230); ctx.quadraticCurveTo(80, -60, 12, 0); ctx.quadraticCurveTo(80, 60, 90, 230); ctx.lineTo(-90, 230); ctx.quadraticCurveTo(-80, 60, -12, 0); ctx.quadraticCurveTo(-80, -60, -90, -230); ctx.closePath(); }, P.edge, { shadow: 0, edge: 3 }); ctx.restore();
  const top = lerp(150, 10, p), bot = lerp(10, 160, p); cut(P_poly([[-60 * top / 150, -top * 0.9], [60 * top / 150, -top * 0.9], [0, -8]]), P.dusk, { shadow: 0, edge: 0 }); cut(P_poly([[-80 * bot / 160, 225], [80 * bot / 160, 225], [0, 225 - bot]]), P.dusk, { shadow: 0, edge: 0 });
  ctx.restore();
}
export function padlock(x, y, s = 1, open = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.arc(0, -60 - open * 30, 48, Math.PI, 0); ctx.strokeStyle = P.stoneDark; ctx.lineWidth = 18; ctx.stroke();
  cut(P_rr(-70, -60, 140, 120, 14), P.ink, { shadow: 0.7, edge: 4 }); circle(0, -10, 12, P.parch); cut(P_rr(-5, -10, 10, 34, 4), P.parch, { shadow: 0, edge: 0 });
  ctx.restore();
}
/** quill writing: nib at (x, y) */
export function quill(x, y, s = 1, t = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(-0.7 + Math.sin(t * 8) * 0.05); ctx.scale(s, s); cut(() => { ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(40, -180, 20, -420); ctx.quadraticCurveTo(-60, -260, -10, -40); ctx.closePath(); }, P.white, { shadow: 0.6, edge: 3 }); line([[0, 0], [16, -400]], P.stoneDark, 3); ctx.restore(); }
export function thoughtBubble(x, y, r, sc = 1, fill = P.edge) { if (sc <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); cut(() => { ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; ctx.moveTo(Math.cos(a) * r * 0.82 + r * 0.24, Math.sin(a) * r * 0.62); ctx.arc(Math.cos(a) * r * 0.82, Math.sin(a) * r * 0.62, r * 0.24, 0, TAU); } ctx.moveTo(r * 0.86, 0); ctx.ellipse(0, 0, r * 0.86, r * 0.66, 0, 0, TAU); }, fill, { shadow: 0.7, edge: 0 }); cut(P_circ(-r * 0.5, r * 0.85, r * 0.1), fill); cut(P_circ(-r * 0.7, r * 1.05, r * 0.06), fill); ctx.restore(); }

// ═════════════════════════ CANNON + SMOKE ═════════════════════════
/** a muzzle puff tinted crimson (no fire, no impact). p 0..1 life of the puff */
export function smokePuff(x, y, s, p, tint = true) { if (p <= 0 || p >= 1) return; ctx.save(); ctx.globalAlpha = (1 - p) * 0.9; ctx.translate(x + p * 60, y - p * 40); ctx.scale(s * (0.5 + p), s * (0.5 + p)); cut(() => { ctx.beginPath(); for (const [dx, dy, r] of [[-60, 0, 60], [0, -30, 75], [60, 0, 58], [0, 25, 60]]) { ctx.moveTo(dx + r, dy); ctx.arc(dx, dy, r, 0, TAU); } }, tint ? '#B08A86' : '#8F8578', { shadow: 0.3, edge: 3 }); ctx.restore(); }
export function smokeColumn(x, y, s, t, a = 1) { for (let k = 0; k < 5; k++) { const p = ((t * 0.25 + k / 5) % 1); ctx.save(); ctx.globalAlpha = a * (1 - p) * 0.8; ctx.translate(x + Math.sin(p * 4 + k) * 20 * s, y - p * 420 * s); ctx.scale(s * (0.4 + p), s * (0.4 + p)); cut(P_circ(0, 0, 70), '#7D7468', { shadow: 0, edge: 3 }); ctx.restore(); } }
export function cannon(x, y, s = 1, dir = 1, puff = -1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s);
  cut(P_poly([[-110, -40], [140, -28], [150, 28], [-110, 40]]), P.ink, { shadow: 0.6, edge: 4 }); cut(P_circ(-120, 0, 40), P.ink); cut(P_circ(-20, 50, 44), P.sepia); circle(-20, 50, 12, P.ink);
  ctx.restore(); if (puff >= 0) smokePuff(x + 190 * s * dir, y - 10 * s, s * 0.8, puff);
}

// ═════════════════════════ PLACES ═════════════════════════
/** coconut palm */
export function palm(x, y, s = 1, t = 0, col = P.forest) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); ctx.moveTo(-14, 0); ctx.quadraticCurveTo(-40, -300, 10, -560); ctx.lineTo(34, -556); ctx.quadraticCurveTo(-10, -300, 16, 0); ctx.closePath(); }, P.sepia, { shadow: 0.5, edge: 3 }); for (let i = 0; i < 7; i++) { ctx.save(); ctx.translate(20, -560); ctx.rotate(-Math.PI + i * Math.PI / 6 + Math.sin(t + i) * 0.05); cut(() => { ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(120, -50, 240, 30); ctx.quadraticCurveTo(120, 10, 0, 0); ctx.closePath(); }, col, { shadow: 0.4, edge: 3 }); ctx.restore(); } ctx.restore(); }
/** Kerala palace court (Calicut): tiled sloping roofs, wooden pillars, forest hangings, a raised seat */
export function calicutCourt(t = 0) {
  ctx.fillStyle = P.parch; ctx.fillRect(-400, -400, W + 800, H + 800);
  cut(P_rr(-200, 300, W + 400, 1200, 0), '#C9A878', { shadow: 0, edge: 0 });
  for (const [x, w, y] of [[540, 1300, 320], [540, 900, 160]]) cut(P_poly([[x - w / 2, y + 220], [x - w / 2 + 160, y], [x + w / 2 - 160, y], [x + w / 2, y + 220]]), P.wine, { shadow: 0.6, edge: 5 });
  for (let i = 0; i < 12; i++) line([[-60 + i * 110, 540], [60 + i * 100, 330]], 'rgba(62,44,30,0.25)', 4);
  for (const x of [60, 290, 790, 1020]) { cut(P_rr(x - 26, 540, 52, 900, 6), P.sepia, { shadow: 0.6, edge: 4 }); cut(P_rr(x - 40, 540, 80, 34, 6), '#6E4E30', { shadow: 0, edge: 3 }); }
  for (const x of [175, 905]) cut(P_poly([[x - 70, 560], [x + 70, 560], [x + 70, 1000], [x, 940], [x - 70, 1000]]), P.forest);
  cut(P_rr(-200, 1440, W + 400, 600, 0), '#8C6B4A', { shadow: 0, edge: 0 }); cut(P_rr(380, 1300, 320, 160, 14), P.forest); cut(P_rr(360, 1280, 360, 40, 14), P.gold);
}
/** the Portuguese factory that becomes a fort: grow 0 = thatched hut + flag, 1 = stone walls, 2 = towers + gate */
export function factoryFort(x, y, s = 1, grow = 0, t = 0, { flagOn = true, door = 0, tornFlag = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const g1 = clamp(grow), g2 = clamp(grow - 1);
  if (g2 > 0) for (const sx of [-1, 1]) { const h = 520 * eob(g2); cut(P_rr(sx * 360 - 90, -h, 180, h, 6), P.stone, { shadow: 0.7, edge: 5 }); for (let i = 0; i < 4; i++) cut(P_rr(sx * 360 - 90 + i * 48, -h - 40, 36, 44, 3), P.stone, { shadow: 0, edge: 3 }); rr(sx * 360 - 24, -h + 80, 48, 70, 24); ctx.fillStyle = P.ink; ctx.fill(); }
  if (g1 > 0) { const h = 320 * eo(g1); cut(P_rr(-380, -h, 760, h, 4), P.stone, { shadow: 0.7, edge: 5 }); for (let i = 0; i < 12; i++) cut(P_rr(-380 + i * 66, -h - 34, 44, 38, 3), P.stone, { shadow: 0, edge: 3 }); for (let i = 0; i < 4; i++) line([[-380, -h + 60 + i * 64], [380, -h + 60 + i * 64]], 'rgba(62,44,30,0.15)', 3); }
  if (g1 < 1) { ctx.save(); ctx.globalAlpha = 1 - g1 * 0.9;
    cut(P_rr(-220, -300, 440, 300, 6), '#B68A5C', { shadow: 0.7, edge: 5 }); cut(P_poly([[-270, -290], [0, -470], [270, -290]]), '#C9A060', { shadow: 0.6, edge: 5 });
    for (let i = 0; i < 9; i++) line([[-250 + i * 60, -300], [-230 + i * 55, -280]], 'rgba(62,44,30,0.3)', 3);
    const dw = 120; ctx.fillStyle = P.ink; ctx.fillRect(-dw / 2, -190, dw, 190); cut(P_rr(-dw / 2, -190, dw * (1 - door * 0) * (door > 0 ? 1 : 0.15), 190, 2), P.sepia, { shadow: 0, edge: 2 });
    ctx.restore(); }
  if (g1 >= 1) { rr(-70, -200, 140, 200, 70); ctx.fillStyle = P.ink; ctx.fill(); }
  if (flagOn) flag(g2 > 0 ? 360 : 140, g2 > 0 ? -560 : (g1 > 0.5 ? -330 : -440), 'portugal', t, 0.6, { torn: tornFlag, h: 380 });
  ctx.restore();
}
/** Goa skyline: a white baroque church facade, houses, palms, the river */
export function goaSkyline(t = 0, ground = 1400) {
  for (let i = 0; i < 6; i++) palm(60 + i * 200 + (i % 2) * 40, ground - 40, 0.6 + (i % 3) * 0.1, t + i);
  for (let i = 0; i < 6; i++) { const x = 30 + i * 190, h = 220 + (i % 3) * 50; cut(P_rr(x, ground - h, 160, h, 4), i % 2 ? '#E8DCC4' : '#D9B98E', { shadow: 0.6, edge: 4 }); cut(P_poly([[x - 14, ground - h], [x + 80, ground - h - 70], [x + 174, ground - h]]), P.wine, { shadow: 0.5, edge: 4 }); }
  church(540, ground, 1.15);
  cut(P_rr(-300, ground, W + 600, 700, 0), P.sea, { shadow: 0.4, edge: 4 });
}
export function church(x, y, s = 1, { door = 0 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-220, -520, 440, 520, 4), P.white, { shadow: 0.7, edge: 5 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-160, -520); ctx.quadraticCurveTo(-150, -640, -60, -660); ctx.lineTo(0, -740); ctx.lineTo(60, -660); ctx.quadraticCurveTo(150, -640, 160, -520); ctx.closePath(); }, P.white, { shadow: 0.6, edge: 5 });
  line([[0, -740], [0, -820]], P.ink, 9); line([[-26, -792], [26, -792]], P.ink, 9);
  for (const dx of [-140, 140]) { rr(dx - 26, -420, 52, 110, 26); ctx.fillStyle = P.ink; ctx.fill(); }
  rr(-80, -260, 160, 260, 80); ctx.fillStyle = P.ink; ctx.fill();
  if (door > 0) { cut(P_rr(-80, -180, 160 * door, 180, 2), P.sepia, { shadow: 0.2, edge: 2 }); }
  ctx.restore();
}
/** a closed arched door (mosque, temple, church). close 0..1 swings it shut; lock adds a padlock */
export function archDoor(x, y, s = 1, kind = 'mosque', close = 1, lock = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const wall = kind === 'temple' ? P.sand : kind === 'church' ? P.white : P.stone;
  cut(P_rr(-380, -900, 760, 900, 4), wall, { shadow: 0.7, edge: 5 });
  if (kind === 'mosque') cut(() => { ctx.beginPath(); ctx.ellipse(0, -900, 240, 200, 0, Math.PI, TAU); ctx.closePath(); }, wall, { shadow: 0.5, edge: 5 });
  if (kind === 'temple') cut(P_poly([[-300, -900], [0, -1300], [300, -900]]), wall, { shadow: 0.5, edge: 5 });
  const arch = () => { ctx.beginPath(); ctx.moveTo(-180, 0); ctx.lineTo(-180, -460); if (kind === 'mosque') { ctx.quadraticCurveTo(-180, -660, 0, -720); ctx.quadraticCurveTo(180, -660, 180, -460); } else ctx.arc(0, -460, 180, Math.PI, TAU); ctx.lineTo(180, 0); ctx.closePath(); };
  arch(); ctx.fillStyle = P.ink; ctx.fill();
  ctx.save(); arch(); ctx.clip(); const k = eo(clamp(close)); for (const sd of [-1, 1]) { ctx.save(); ctx.translate(sd * 180, 0); ctx.scale(lerp(0.08, 1, k), 1); cut(P_rr(sd < 0 ? 0 : -180, -760, 180, 760, 0), '#6E4E30', { shadow: 0, edge: 3 }); ctx.restore(); } ctx.restore();
  if (lock > 0) padlock(0, -300, eob(clamp(lock)) * 1.3);
  ctx.restore();
}
/** Mughal court arch (Fatehpur Sikri style): red sandstone, a pointed arch, chhatri kiosks */
export function mughalArch(t = 0) {
  ctx.fillStyle = P.parch; ctx.fillRect(-400, -400, W + 800, H + 800);
  cut(P_rr(-100, 360, W + 200, 1200, 0), P.sand, { shadow: 0.5, edge: 5 });
  cut(() => { ctx.beginPath(); ctx.moveTo(170, 1560); ctx.lineTo(170, 900); ctx.quadraticCurveTo(170, 620, 540, 520); ctx.quadraticCurveTo(910, 620, 910, 900); ctx.lineTo(910, 1560); ctx.closePath(); }, '#7E4434', { shadow: 0, edge: 5 });
  cut(() => { ctx.beginPath(); ctx.moveTo(250, 1560); ctx.lineTo(250, 940); ctx.quadraticCurveTo(250, 700, 540, 620); ctx.quadraticCurveTo(830, 700, 830, 940); ctx.lineTo(830, 1560); ctx.closePath(); }, '#E7D3B0', { shadow: 0.4, edge: 4 });
  for (const x of [90, 990]) { cut(P_rr(x - 50, 260, 100, 120, 6), P.sand, { shadow: 0.5, edge: 4 }); cut(() => { ctx.beginPath(); ctx.ellipse(x, 260, 70, 60, 0, Math.PI, TAU); ctx.closePath(); }, P.white, { shadow: 0.5, edge: 4 }); }
  for (let i = 0; i < 9; i++) cut(P_rr(-60 + i * 140, 330, 90, 40, 4), '#C98A68', { shadow: 0, edge: 3 });
  cut(P_rr(-100, 1560, W + 200, 600, 0), '#C9A878', { shadow: 0, edge: 0 });
}
/** Hooghly river port: a wide river, warehouses with a Portuguese flag, boats */
export function hooghlyPort(t = 0, { night = 0, flagLower = 0, tents = 0 } = {}) {
  ctx.fillStyle = P.sky; ctx.fillRect(-400, -400, W + 800, 1100);
  cut(P_rr(-400, 560, W + 800, 420, 0), P.forest, { shadow: 0.3, edge: 4 });
  for (let i = 0; i < 5; i++) { const x = 90 + i * 200; cut(P_rr(x, 700, 170, 230, 4), i % 2 ? '#D9B98E' : P.stone, { shadow: 0.6, edge: 4 }); cut(P_poly([[x - 12, 704], [x + 85, 640], [x + 182, 704]]), P.wine, { shadow: 0.5, edge: 4 }); rr(x + 60, 820, 50, 110, 4); ctx.fillStyle = P.ink; ctx.fill(); }
  flag(900, 700, 'portugal', t, 0.7, { lower: flagLower, h: 380 });
  if (tents > 0) for (let i = 0; i < 7; i++) { const sc = eob(clamp(tents * 7 - i)); if (sc <= 0) continue; const x = 40 + i * 165; ctx.save(); ctx.translate(x, 600); ctx.scale(sc, sc); cut(P_poly([[-70, 0], [0, -110], [70, 0]]), P.mughal, { shadow: 0.5, edge: 4 }); circle(0, -114, 8, P.gold); ctx.restore(); }
  cut(P_rr(-400, 960, W + 800, 1000, 0), '#9DA99B', { shadow: 0.4, edge: 5 });
  for (let i = 0; i < 4; i++) { const wy = 1040 + i * 110; ctx.strokeStyle = 'rgba(247,239,220,0.5)'; ctx.lineWidth = 5; ctx.beginPath(); for (let x = -100; x < W + 100; x += 30) ctx.lineTo(x, wy + Math.sin(x * 0.02 + t + i) * 8); ctx.stroke(); }
}
/** a crown: 'portugal' (gold, blue jewel) or 'spain' (gold, crimson jewel, taller) */
export function crown(x, y, s = 1, kind = 'portugal', rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  const tall = kind === 'spain' ? 1.25 : 1;
  cut(P_poly([[-150, 0], [150, 0], [170, -120 * tall], [90, -70 * tall], [60, -170 * tall], [0, -100 * tall], [-60, -170 * tall], [-90, -70 * tall], [-170, -120 * tall]]), P.gold, { shadow: 0.8, edge: 5 });
  cut(P_rr(-155, -30, 310, 40, 8), '#A87A22', { shadow: 0, edge: 3 });
  for (const dx of [-90, 0, 90]) circle(dx, -10, 13, kind === 'spain' ? P.crimson : P.royal);
  ctx.restore();
}
/** a door-shaped gap opening in a paper wall: p 0..1; behind = what shows through (sea light) */
export function paperDoor(p, t, behind) {
  ctx.save(); ctx.beginPath(); ctx.rect(330, 500, 420, 820); ctx.clip(); behind(); ctx.restore();
  const k = eo(clamp(p));
  cut(() => { ctx.beginPath(); ctx.rect(-400, -400, W + 800, H + 800); ctx.rect(750, 500, -420, 820); }, P.land, { shadow: 0.9, edge: 0 });
  ctx.save(); ctx.translate(330, 0); ctx.scale(lerp(1, 0.08, k), 1); cut(P_rr(0, 500, 420, 820, 2), '#C9B48A', { shadow: 0.6, edge: 4 }); circle(360, 920, 16, P.ink); ctx.restore();
  ctx.strokeStyle = P.ink; ctx.lineWidth = 6; ctx.strokeRect(330, 500, 420, 820);
}
