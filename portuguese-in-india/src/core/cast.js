// The recurring cast: simple cut-paper period figures, told apart by COSTUME (never a copied face or portrait).
// person({ role, x, y, h, dir, arm, arm2, walk, brow, prop, t }) stands on (x, y). h = height (default 640).
// Each power keeps one costume colour all video (see CAST below and the colour notes in STYLE notes of the brief).
import { ctx, TAU, clamp, lerp, rnd, circle, line } from './lib.js';
import { P, cut, P_rr, P_poly, P_circ, seal } from './paper.js';

const R = (d) => (d * Math.PI) / 180;
const BEARD_DARK = '#2A1E14', GREY = '#A8A196', WHITE_BEARD = '#EFE9DB';

/** role -> costume. body: tunic/robe colour · robe: false (legs) | 'long' | 'mundu' · hat · beard · prop (held in the front hand) */
export const CAST = {
  gama:        { name: 'Vasco da Gama', body: P.royal, collar: P.white, legs: P.ink, hat: 'beret', hatC: P.ink, beard: 'full', beardC: BEARD_DARK },
  zamorin:     { name: 'the Zamorin', skin: P.skinD, chest: true, shawl: P.forest, shawlTrim: P.gold, robe: 'mundu', robeC: P.white, hat: 'crown', hatC: P.gold, beard: 'moustache' },
  bearer:      { name: 'parasol bearer', skin: P.skinD, chest: true, robe: 'mundu', robeC: P.white, hat: 'none', prop: 'parasol' },
  arab:        { name: 'Arab merchant', skin: P.skinD, body: P.white, cloak: P.ink, robe: 'long', robeC: P.white, hat: 'turban', hatC: P.white, beard: 'full', beardC: BEARD_DARK, prop: 'ledger' },
  pilot:       { name: 'Gujarati pilot', skin: P.skinD, body: P.white, sash: P.brown, robe: 'long', robeC: P.white, hat: 'turban', hatC: P.brown, beard: 'short', beardC: BEARD_DARK, prop: 'kamal' },
  cabral:      { name: 'Pedro Cabral', body: P.royal, sash: P.wine, legs: P.ink, hat: 'morion', hatC: P.stoneDark, beard: 'full', beardC: '#4A3424' },
  almeida:     { name: 'Francisco de Almeida', body: P.royal, armour: P.stone, legs: P.ink, hat: 'none', hair: GREY, beard: 'full', beardC: GREY },
  albuquerque: { name: 'Afonso de Albuquerque', body: P.ink, trim: P.royal, robe: 'long', robeC: P.ink, hat: 'tall', hatC: P.ink, beard: 'long', beardC: WHITE_BEARD },
  bahadur:     { name: 'Bahadur Shah', skin: P.skinD, body: P.brown, sash: P.edge, robe: 'long', robeC: P.brown, hat: 'turban', hatC: P.brown, jewel: P.gold, beard: 'short', beardC: BEARD_DARK },
  jesuit:      { name: 'Jesuit priest', body: P.ink, robe: 'long', robeC: P.ink, hat: 'biretta', hatC: P.ink, cross: true, beard: 'short', beardC: '#4A3424' },
  akbar:       { name: 'Akbar', skin: P.skinD, body: P.mughal, sash: P.gold, robe: 'jama', robeC: P.mughal, hat: 'turban', hatC: P.gold, jewel: P.white, beard: 'moustache' },
  jahangir:    { name: 'Jahangir', skin: P.skinD, body: P.mughal, sash: P.wine, robe: 'jama', robeC: P.mughal, hat: 'turban', hatC: P.gold, plume: true, beard: 'short', beardC: BEARD_DARK },
  shahjahan:   { name: 'Shah Jahan', skin: P.skinD, body: P.mughal, sash: P.gold, robe: 'jama', robeC: P.mughal, hat: 'turban', hatC: P.gold, jewel: P.crimson, beard: 'full', beardC: '#5A5048' },
  hawkins:     { name: 'William Hawkins', body: P.sepia, collar: P.white, ruff: true, legs: P.ink, hat: 'capotain', hatC: P.ink, beard: 'short', beardC: '#6A4A2A', prop: 'letter' },
  dutch:       { name: 'Dutch captain', body: P.ink, sash: P.orange, collar: P.white, legs: P.ink, hat: 'widebrim', hatC: P.ink, beard: 'short', beardC: '#7A5A36' },
  maratha:     { name: 'Maratha soldier', skin: P.skinD, body: P.white, sash: P.saffron, legs: P.white, hat: 'pagadi', hatC: P.saffron, beard: 'moustache', prop: 'bhagwa' },
  henry:       { name: 'Prince Henry', body: P.ink, robe: 'long', robeC: '#2E2620', hat: 'chaperon', hatC: '#2E2620', beard: 'moustache', beardC: BEARD_DARK },
  sailor:      { name: 'Portuguese sailor', body: P.royal, legs: P.ink, hat: 'cap', hatC: P.white, beard: 'none' },
  merchant:    { name: 'merchant', skin: P.skinD, body: P.white, robe: 'long', robeC: P.white, hat: 'turban', hatC: P.white, beard: 'short', beardC: BEARD_DARK },
};

function arm(xS, ang, col, len = 220, skin = P.skin, sh = 0.5) {
  cut(() => { ctx.beginPath(); ctx.save(); ctx.translate(xS, -440); ctx.rotate(ang); ctx.roundRect(-20, 0, 40, len, 20); ctx.restore(); }, col, { shadow: sh, edge: 4 });
  ctx.save(); ctx.translate(xS, -440); ctx.rotate(ang); circle(0, len - 4, 21, skin); ctx.restore();
}

/** a cast member. arm / arm2 = raise of the front / back arm in degrees; walk = phase (radians, animate with t); brow 0..1 raises an eyebrow */
export function person(o) {
  const c = CAST[o.role] || CAST.merchant, h = o.h || 640, d = o.dir || 1, s = h / 640, wk = o.walk != null ? Math.sin(o.walk) : 0;
  const skin = c.skin || P.skin, body = c.body || P.white;
  ctx.save(); ctx.translate(o.x, o.y); ctx.scale(s * d, s);
  // legs / lower body
  if (!c.robe) for (const k of [-1, 1]) cut(P_poly([[k * 22 - 18, -250], [k * 22 + 18, -250], [k * 22 + 16 + k * wk * 30, 0], [k * 22 - 16 + k * wk * 30, 0]]), c.legs || P.ink, { shadow: 0.6, edge: 4 });
  if (c.robe === 'mundu') { for (const k of [-1, 1]) cut(P_rr(k * 22 - 14 + k * wk * 20, -40, 30, 40, 10), skin, { shadow: 0.4, edge: 3 }); cut(P_poly([[-80, -270], [80, -270], [92, -40], [-92, -40]]), c.robeC, { shadow: 0.6, edge: 4 }); line([[10, -260], [24, -48]], 'rgba(62,44,30,0.25)', 4); if (c.shawlTrim) cut(P_rr(-92, -64, 184, 16, 4), c.shawlTrim, { shadow: 0, edge: 0 }); }
  // back arm
  arm(-30, R(10 - wk * 18 + (o.arm2 || 0)), c.chest ? skin : (c.cloak || body), 220, skin);
  // body
  if (c.robe === 'long') cut(P_poly([[-72, -470], [72, -470], [118, 0], [-118, 0]]), c.robeC || body);
  else if (c.robe === 'jama') { cut(P_poly([[-70, -470], [70, -470], [86, -260], [150, 0], [-150, 0], [-86, -260]]), c.robeC || body); line([[-86, -262], [86, -262]], 'rgba(62,44,30,0.3)', 4); }
  else if (c.robe === 'mundu') cut(P_rr(-72, -470, 144, 210, 40), skin);
  else cut(P_rr(-75, -470, 150, 240, 40), body);
  if (c.cloak) { cut(P_poly([[-78, -470], [-30, -470], [-60, 0], [-124, 0]]), c.cloak, { shadow: 0.4, edge: 4 }); cut(P_poly([[78, -470], [30, -470], [60, 0], [124, 0]]), c.cloak, { shadow: 0.4, edge: 4 }); }
  if (c.armour) { cut(() => { ctx.beginPath(); ctx.moveTo(-70, -460); ctx.lineTo(70, -460); ctx.quadraticCurveTo(84, -330, 0, -250); ctx.quadraticCurveTo(-84, -330, -70, -460); ctx.closePath(); }, c.armour, { shadow: 0.4, edge: 4 }); line([[0, -455], [0, -262]], P.stoneDark, 4); }
  if (c.shawl) cut(P_poly([[-72, -470], [-30, -470], [72, -300], [72, -250], [40, -250]]), c.shawl, { shadow: 0.3, edge: 3 });
  if (c.shawlTrim && c.shawl) line([[-30, -468], [72, -300]], c.shawlTrim, 6);
  if (c.sash) cut(P_poly([[-72, -440], [-40, -470], [72, -290], [72, -250]]), c.sash, { shadow: 0.3, edge: 3 });
  if (c.trim && !c.sash) line([[0, -470], [0, c.robe ? -20 : -235]], c.trim, 10);
  if (!c.robe || c.robe === 'jama') { ctx.beginPath(); ctx.roundRect(-75, -262, 150, 20, 6); ctx.fillStyle = c.robe === 'jama' ? (c.sash || P.gold) : 'rgba(62,44,30,0.7)'; ctx.fill(); }
  if (c.cross) { line([[18, -430], [18, -340]], P.white, 9); line([[-2, -402], [38, -402]], P.white, 9); }
  if (c.collar && !c.ruff) cut(P_poly([[-46, -472], [46, -472], [0, -430]]), c.collar, { shadow: 0.2, edge: 3 });
  // head
  if (c.ruff) { cut(() => { ctx.beginPath(); for (let i = 0; i <= 24; i++) { const a = i / 24 * TAU, r = 60 + (i % 2) * 8; ctx.lineTo(Math.cos(a) * r, -470 + Math.sin(a) * r * 0.32); } ctx.closePath(); }, P.white, { shadow: 0.3, edge: 2 }); }
  cut(P_circ(0, -545, 64), skin);
  if (c.hair) cut(() => { ctx.beginPath(); ctx.arc(0, -548, 66, Math.PI * 1.05, Math.PI * 1.95); ctx.lineTo(50, -575); ctx.quadraticCurveTo(0, -592, -50, -575); ctx.closePath(); }, c.hair, { shadow: 0, edge: 2 });
  circle(26, -552, 7, P.ink);                                                                            // the eye (shows facing)
  const bw = clamp(o.brow || 0); line([[12, -575 - bw * 14], [42, -572 - bw * 22]], P.ink, 5);           // brow
  beard(c);
  hat(c, o.t || 0);
  // front arm (+ prop in the hand, kept upright)
  const fa = R(-(o.arm || 0) - 10 + wk * 18);
  arm(30, fa, c.chest ? skin : (c.cloak || body), 220, skin);
  const prop = o.prop ?? c.prop;
  if (prop) { ctx.save(); ctx.translate(30, -440); ctx.rotate(fa); ctx.translate(0, 216); ctx.rotate(-fa); drawProp(prop, o.t || 0, d); ctx.restore(); }
  ctx.restore();
}

function beard(c) {
  const col = c.beardC || BEARD_DARK;
  if (c.beard === 'full') cut(() => { ctx.beginPath(); ctx.moveTo(-58, -560); ctx.quadraticCurveTo(-62, -470, 8, -455); ctx.quadraticCurveTo(66, -470, 62, -560); ctx.quadraticCurveTo(30, -510, -58, -560); ctx.closePath(); }, col, { shadow: 0.2, edge: 2 });
  if (c.beard === 'long') cut(() => { ctx.beginPath(); ctx.moveTo(-58, -560); ctx.quadraticCurveTo(-70, -420, -10, -300); ctx.lineTo(20, -330); ctx.quadraticCurveTo(70, -440, 62, -560); ctx.quadraticCurveTo(30, -510, -58, -560); ctx.closePath(); }, col, { shadow: 0.3, edge: 2 });
  if (c.beard === 'short') cut(() => { ctx.beginPath(); ctx.moveTo(-50, -545); ctx.quadraticCurveTo(-40, -485, 10, -482); ctx.quadraticCurveTo(58, -490, 60, -545); ctx.quadraticCurveTo(28, -512, -50, -545); ctx.closePath(); }, col, { shadow: 0.2, edge: 2 });
  if (c.beard === 'moustache' || c.beard === 'full' || c.beard === 'short') cut(() => { ctx.beginPath(); ctx.ellipse(28, -520, 30, 9, -0.1, 0, TAU); }, c.beardC || BEARD_DARK, { shadow: 0, edge: 0 });
}

function hat(c, t) {
  const col = c.hatC || P.ink;
  switch (c.hat) {
    case 'beret': cut(() => { ctx.beginPath(); ctx.ellipse(-6, -600, 84, 30, -0.08, 0, TAU); }, col, { shadow: 0.4, edge: 4 }); break;
    case 'crown': cut(P_poly([[-58, -588], [58, -588], [50, -640], [26, -628], [14, -700], [0, -740], [-14, -700], [-26, -628], [-50, -640]]), col, { shadow: 0.5, edge: 4 }); circle(0, -650, 9, P.crimson); break;
    case 'turban': cut(() => { ctx.beginPath(); ctx.ellipse(0, -598, 76, 44, 0, Math.PI, TAU); ctx.ellipse(0, -598, 76, 18, 0, 0, Math.PI); }, col, { shadow: 0.4, edge: 4 });
      line([[-60, -606], [62, -628]], 'rgba(62,44,30,0.2)', 5); line([[-66, -592], [66, -606]], 'rgba(62,44,30,0.2)', 5);
      if (c.jewel) circle(36, -622, 10, c.jewel);
      if (c.plume) cut(() => { ctx.beginPath(); ctx.moveTo(30, -628); ctx.quadraticCurveTo(70 + Math.sin(t * 3) * 6, -700, 18, -720); ctx.quadraticCurveTo(46, -680, 22, -628); ctx.closePath(); }, P.white, { shadow: 0.3, edge: 2 });
      break;
    case 'morion': cut(() => { ctx.beginPath(); ctx.moveTo(-100, -590); ctx.quadraticCurveTo(-60, -575, -50, -600); ctx.quadraticCurveTo(-40, -680, 0, -690); ctx.quadraticCurveTo(40, -680, 50, -600); ctx.quadraticCurveTo(60, -575, 100, -590); ctx.quadraticCurveTo(0, -560, -100, -590); ctx.closePath(); }, col, { shadow: 0.5, edge: 4 }); line([[0, -690], [0, -705]], col, 8); break;
    case 'tall': cut(P_poly([[-60, -585], [60, -585], [54, -730], [-54, -730]]), col, { shadow: 0.5, edge: 4 }); cut(P_rr(-82, -598, 164, 18, 9), col, { shadow: 0, edge: 4 }); break;
    case 'biretta': cut(P_poly([[-58, -592], [58, -592], [52, -650], [-52, -650]]), col, { shadow: 0.4, edge: 4 }); circle(0, -656, 12, col); break;
    case 'capotain': cut(P_poly([[-52, -592], [52, -592], [44, -700], [-44, -700]]), col, { shadow: 0.5, edge: 4 }); cut(P_rr(-96, -604, 192, 18, 9), col, { shadow: 0, edge: 4 }); line([[-50, -612], [50, -612]], P.white, 6); break;
    case 'widebrim': cut(() => { ctx.beginPath(); ctx.ellipse(0, -600, 120, 22, 0, 0, TAU); }, col, { shadow: 0.5, edge: 4 }); cut(() => { ctx.beginPath(); ctx.ellipse(0, -620, 60, 40, 0, Math.PI, TAU); ctx.closePath(); }, col, { shadow: 0, edge: 4 }); break;
    case 'pagadi': cut(() => { ctx.beginPath(); ctx.ellipse(0, -600, 74, 40, 0, Math.PI, TAU); ctx.ellipse(0, -600, 74, 16, 0, 0, Math.PI); }, col, { shadow: 0.4, edge: 4 }); cut(P_poly([[40, -630], [96, -660], [70, -610]]), col, { shadow: 0.3, edge: 3 }); break;
    case 'chaperon': cut(() => { ctx.beginPath(); ctx.arc(0, -560, 86, Math.PI * 0.95, Math.PI * 2.05); ctx.quadraticCurveTo(110, -600, 60, -520); ctx.lineTo(50, -560); ctx.quadraticCurveTo(0, -610, -60, -560); ctx.lineTo(-70, -470); ctx.lineTo(-90, -560); ctx.closePath(); }, col, { shadow: 0.5, edge: 4 }); break;
    case 'cap': cut(() => { ctx.beginPath(); ctx.arc(0, -585, 64, Math.PI, TAU); ctx.closePath(); }, col, { shadow: 0.4, edge: 4 }); break;
  }
}

/** props a figure holds (drawn in hand space: the hand is at 0, 0) */
export function drawProp(kind, t = 0, d = 1) {
  switch (kind) {
    case 'ledger': cut(P_rr(-30, -60, 120, 150, 6), P.sepia, { shadow: 0.5, edge: 4 }); cut(P_rr(-20, -52, 100, 134, 4), P.parch, { shadow: 0, edge: 0 }); for (let i = 0; i < 6; i++) line([[-8, -36 + i * 20], [66, -36 + i * 20]], 'rgba(62,44,30,0.5)', 3); break;
    case 'kamal': cut(P_rr(10, -40, 70, 50, 4), P.sepia, { shadow: 0.5, edge: 3 }); line([[44, -15], [-40, -120]], P.ink, 3); break;
    case 'letter': cut(P_rr(-10, -70, 110, 140, 4), P.edge, { shadow: 0.5, edge: 3 }); seal(44, 30, 0.28, 'R'); break;
    case 'parasol': cut(P_rr(-7, -560, 14, 620, 5), P.sepia, { shadow: 0.4, edge: 3 }); cut(() => { ctx.beginPath(); ctx.moveTo(-230, -470); ctx.quadraticCurveTo(0, -660, 230, -470); ctx.closePath(); }, P.forest, { shadow: 0.6, edge: 5 }); for (let i = 0; i < 9; i++) cut(P_poly([[-230 + i * 51, -470], [-205 + i * 51, -440], [-180 + i * 51, -470]]), P.gold, { shadow: 0, edge: 2 }); break;
    case 'bhagwa': cut(P_rr(-6, -420, 12, 480, 4), P.sepia, { shadow: 0.4, edge: 3 }); cut(P_poly([[6, -420], [150 + Math.sin(t * 4) * 8, -380], [70, -350], [150 + Math.sin(t * 4 + 1) * 8, -320], [6, -290]]), P.saffron, { shadow: 0.4, edge: 3 }); break;
    case 'cross': line([[0, 40], [0, -110]], P.stone, 12); line([[-34, -70], [34, -70]], P.stone, 12); break;
    case 'sword': cut(P_poly([[-6, 0], [6, 0], [4, -260], [0, -290], [-4, -260]]), P.stone, { shadow: 0.4, edge: 3 }); cut(P_rr(-30, -8, 60, 14, 6), P.ink, { shadow: 0, edge: 2 }); break;
    case 'scroll': cut(P_rr(-20, -80, 100, 160, 8), P.edge, { shadow: 0.5, edge: 3 }); cut(P_rr(-26, -90, 112, 18, 9), P.sepia, { shadow: 0, edge: 2 }); cut(P_rr(-26, 72, 112, 18, 9), P.sepia, { shadow: 0, edge: 2 }); break;
    case 'map': cut(P_rr(-20, -90, 170, 120, 4), P.land, { shadow: 0.5, edge: 3 }); line([[0, -40], [40, -60], [90, -30], [130, -50]], P.crimson, 4); break;
    case 'seal': seal(30, -10, 0.45, 'S'); break;
  }
}
