// Scene kit: parallax camera, sky + night wash, paper sea, era bar, chapter card, flags of every power.
// Everything is a pure function of time (no Math.random, no clocks): seeded noise only via rnd().
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, circle, line } from './lib.js';
import { P, cut, P_rr, P_poly, P_circ, parchment, ribbon, slip, seal, label } from './paper.js';

const SERIF = 'Caladea';
const mix = (a, b, k) => { const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16); const c = (s) => Math.round(lerp((pa >> s) & 255, (pb >> s) & 255, clamp(k))); return `rgb(${c(16)},${c(8)},${c(0)})`; };
export { mix as mixColor };

// ═════════════════════════ CAMERA + LAYERS ═════════════════════════
/** camera move across a shot: from/to = { x, y, zoom } (x, y = pan in px, zoom 1 = none), eased in-out */
export function cam(lt, d, from = {}, to = {}) {
  const k = eio(clamp(lt / d)), f = { x: 0, y: 0, zoom: 1, ...from }, g = { ...f, ...to };
  return { x: lerp(f.x, g.x, k), y: lerp(f.y, g.y, k), zoom: lerp(f.zoom, g.zoom, k) };
}
/** draw fn on a parallax layer: depth 0 = fixed (sky), 1 = moves with the camera, >1 = foreground (moves faster) */
export function layer(c, depth, fn) {
  ctx.save(); const z = 1 + (c.zoom - 1) * depth;
  ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-540 - c.x * depth, -960 - c.y * depth); fn(); ctx.restore();
}

// ═════════════════════════ SKY + NIGHT ═════════════════════════
/** parchment sky. night 0 = day (pale), 0.5 = dusk (warm), 1 = night (navy wash comes from nightWash) */
export function sky(night = 0, sunY = 420, sunX = 800) {
  parchment(5);
  const top = night < 0.5 ? mix(P.sky, P.dusk, night * 2) : mix(P.dusk, P.navy, (night - 0.5) * 2);
  ctx.save(); ctx.globalAlpha = 0.55; ctx.fillStyle = top; ctx.fillRect(-1100, -400, W + 2200, 1500); ctx.restore();
  if (night < 0.8) cut(P_circ(sunX, sunY + night * 260, 90), night < 0.4 ? '#EFC66A' : '#E39A5A', { shadow: 0.4, edge: 5 });
}
/** the Paper Atlas night: the same page under a navy wash (+ paper stars when fully dark) */
export function nightWash(n, seed = 1) {
  if (n <= 0) return;
  ctx.save(); ctx.globalAlpha = 0.78 * clamp(n); ctx.fillStyle = P.navy; ctx.fillRect(-1100, -400, W + 2200, H + 800); ctx.restore();
  if (n > 0.6) { ctx.save(); ctx.globalAlpha = clamp((n - 0.6) * 2.5); for (let i = 0; i < 28; i++) circle(rnd(i + seed) * W, 120 + rnd(i + 40 + seed) * 700, 3 + rnd(i) * 3, P.parch); ctx.restore(); }
}
/** a soft glow (fire on the horizon, a lamp), drawn after the night wash */
export function glow(x, y, r, color = '#E0782E', a = 0.6) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
}

// ═════════════════════════ PAPER SEA ═════════════════════════
/** one cut-paper wave strip at height y (fills down to the page bottom) */
export function wave(y, t, { amp = 22, len = 0.011, speed = 1.2, phase = 0, color = P.sea, shadow = 0.7 } = {}) {
  cut(() => { ctx.beginPath(); ctx.moveTo(-1200, H + 400); ctx.lineTo(-1200, y); for (let x = -1200; x <= W + 1200; x += 36) ctx.lineTo(x, y + Math.sin(x * len + t * speed + phase) * amp); ctx.lineTo(W + 1200, H + 400); ctx.closePath(); }, color, { shadow, edge: 5 });
}
/** height of a wave strip at x (to float ships on it) */
export const waveY = (x, y, t, { amp = 22, len = 0.011, speed = 1.2, phase = 0 } = {}) => y + Math.sin(x * len + t * speed + phase) * amp;
/**
 * layered outdoor sea scene. o = { t, c (camera), night, horizon, far(t) (ships on the far sea), mid(t), fore(t), sunX, sunY }
 * layers: sky (0.1) · far sea (0.35) · far ships · mid sea (0.7) · mid things · near sea (1.0) · foreground (1.4)
 */
export function seascape(o) {
  const t = o.t || 0, c = o.c || { x: 0, y: 0, zoom: 1 }, n = o.night || 0, hz = o.horizon ?? 1000;
  layer(c, 0.1, () => sky(n, o.sunY ?? 420, o.sunX ?? 800));
  layer(c, 0.35, () => { wave(hz, t, { amp: 8, len: 0.02, speed: 0.6, color: P.seaDark, shadow: 0.3 }); o.far && o.far(t); });
  layer(c, 0.7, () => { wave(hz + 120, t, { amp: 16, len: 0.013, speed: 0.9, phase: 1, color: P.sea, shadow: 0.5 }); o.mid && o.mid(t); });
  layer(c, 1.0, () => { wave(hz + 330, t, { amp: 24, len: 0.01, speed: 1.2, phase: 2, color: P.seaDark }); o.near && o.near(t); });
  nightWash(clamp((n - 0.5) / 0.5), 3);                       // dusk = warm sky only; the navy wash is for real night
  o.lights && o.lights(t);
  layer(c, 1.4, () => { wave(hz + 560, t, { amp: 30, len: 0.008, speed: 1.4, phase: 3, color: mix(P.sea, P.navy, n * 0.6) }); o.fore && o.fore(t); });
}

// ═════════════════════════ ERA BAR (persistent, top of frame) ═════════════════════════
export const ERAS = [1453, 1498, 1510, 1580, 1632, 1663, 1961];
/** thin timeline at y 170. active = index of the crimson tick (-1 none); p = marker 0..1 along the bar (null = at active) */
export function eraBar(active = -1, p = null, a = 1) {
  if (a <= 0) return; const y = 170, x0 = 110, x1 = 970, n = ERAS.length, xs = (i) => lerp(x0, x1, i / (n - 1));
  ctx.save(); ctx.globalAlpha = a;
  cut(() => { ctx.beginPath(); ctx.moveTo(40, 118); for (let x = 40; x <= 1040; x += 30) ctx.lineTo(x, 118 + (rnd(x) - 0.5) * 8); for (let x = 1040; x >= 40; x -= 30) ctx.lineTo(x, 236 + (rnd(x + 3) - 0.5) * 8); ctx.closePath(); }, 'rgba(243,233,210,0.92)', { shadow: 0.5, edge: 0 });
  line([[x0, y], [x1, y]], P.ink, 4);
  const mp = p == null ? (active >= 0 ? active / (n - 1) : -1) : p;
  if (mp >= 0) line([[x0, y], [lerp(x0, x1, clamp(mp)), y]], P.crimson, 6);
  ERAS.forEach((yr, i) => { const on = i === active; circle(xs(i), y, on ? 13 : 8, on ? P.crimson : P.ink); ctx.font = `700 ${on ? 32 : 26}px ${SERIF}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = on ? P.crimson : P.ink; ctx.fillText(String(yr), xs(i), y + 38); });
  if (mp >= 0) { const mx = lerp(x0, x1, clamp(mp)); cut(P_poly([[mx, y - 14], [mx - 14, y - 40], [mx + 14, y - 40]]), P.crimson, { shadow: 0.4, edge: 3 }); }
  ctx.restore();
}

// ═════════════════════════ CHAPTER CARD (~1.6 s) ═════════════════════════
/** a parchment page turns over, the YEAR rides in on a gold ribbon, the hook title on a torn slip, a wax seal stamps on */
export function chapterCard(lt, d, { year, title, n, letter = 'P', seed = 20 }) {
  parchment(seed);
  ctx.font = `700 40px ${SERIF}`; ctx.letterSpacing = '10px'; ctx.textAlign = 'center'; ctx.fillStyle = P.sepia; ctx.fillText(`CHAPTER ${n}`, 540, 560); ctx.letterSpacing = '0px';
  line([[300, 610], [780, 610]], P.sepia, 3);
  ribbon(String(year), 540, 820, eob(seg(lt, 0.3, 0.6)) * 1.15, 120);
  const ts = eob(seg(lt, 0.5, 0.8));
  if (ts > 0) torn(title, 540, 1060, ts, -0.02, 74);
  const ss = seg(lt, 0.85, 1.05);
  if (ss > 0) { ctx.save(); ctx.globalAlpha = clamp(ss * 3); seal(540, 1280, lerp(2.0, 1.0, eo(ss)) * 0.95, letter); ctx.restore(); }
  // the page turn: the previous page lifts away to the left over the first 0.35 s
  const pt = seg(lt, 0, 0.38);
  if (pt < 1) {
    const x = lerp(W + 40, -260, eio(pt)), curl = 140 * Math.sin(Math.PI * pt);
    ctx.save(); ctx.beginPath(); ctx.moveTo(-400, -400); ctx.lineTo(x, -400); ctx.quadraticCurveTo(x - curl, 960, x, H + 400); ctx.lineTo(-400, H + 400); ctx.closePath(); ctx.clip(); parchment(seed + 7); ctx.restore();
    const g = ctx.createLinearGradient(x - 80, 0, x + 60, 0); g.addColorStop(0, 'rgba(70,45,20,0)'); g.addColorStop(0.6, 'rgba(70,45,20,0.35)'); g.addColorStop(1, 'rgba(70,45,20,0)');
    ctx.fillStyle = g; ctx.fillRect(x - 80 - curl, -400, 140 + curl, H + 800);
  }
}
/** a torn paper slip (caption look) with a line of text: for chapter titles and paraphrase quotes */
export function torn(text, x, y, sc = 1, rot = 0, size = 64, color = P.ink, maxW = 920) {
  if (sc <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc); ctx.font = `700 ${size}px ${SERIF}`;
  const tw = ctx.measureText(text).width, fit = Math.min(1, maxW / (tw + 100)); ctx.scale(fit, fit); const hw = tw / 2 + 50, hh = size * 0.85;
  cut(() => { ctx.beginPath(); ctx.moveTo(-hw, -hh); for (let i = -hw; i <= hw; i += 24) ctx.lineTo(i, -hh + (rnd(i + text.length) - 0.5) * 12); for (let i = hw; i >= -hw; i -= 24) ctx.lineTo(i, hh + (rnd(i + 7) - 0.5) * 12); ctx.closePath(); }, '#F3E9D2', { shadow: 0.8, edge: 0 });
  ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 5); ctx.restore();
}
/** a paraphrase slip: the line on torn paper + a small "paraphrase · speaker" tag under it */
export function quoteSlip(text, who, x, y, sc = 1, size = 56) {
  if (sc <= 0) return; torn(text, x, y, sc, -0.015, size);
  ctx.save(); ctx.globalAlpha = clamp(sc); slip(`paraphrase · ${who}`, x + 120, y + size * 1.35, sc * 0.9, 0.03, 30); ctx.restore();
}

// ═════════════════════════ FLAGS (one per power, kept all video) ═════════════════════════
/**
 * a paper flag on a pole standing at (x, y = pole foot). kind: portugal | calicut | arab | gujarat | mughal | england | dutch |
 * maratha | spain | bijapur | india. wave = time for the flutter, s = scale, lower 0..1 slides it down the pole, torn 0..1 rips it
 */
export function flag(x, y, kind, t = 0, s = 1, { lower = 0, torn: tr = 0, h = 420 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-7, -h, 14, h, 5), P.ink, { shadow: 0.5, edge: 3 });
  const fw = 230, fh = 150, top = -h + 10 + lower * (h - fh - 20);
  const pt = (u, v) => [u * fw, top + v * fh + Math.sin(u * 5 + t * 4) * 10 * u];
  const quad = (u0, v0, u1, v1, col) => { const pts = []; for (let k = 0; k <= 6; k++) pts.push(pt(lerp(u0, u1, k / 6), v0)); for (let k = 6; k >= 0; k--) pts.push(pt(lerp(u0, u1, k / 6), v1)); cut(P_poly(pts), col, { shadow: 0, edge: 0 }); };
  ctx.save(); ctx.shadowColor = 'rgba(70,45,20,0.3)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 6;
  const umax = 1 - tr * 0.45;
  switch (kind) {
    case 'portugal': {   // the owner's flag (spec 001-video-16x9 FR-11): green hoist 2/5, red fly, yellow armillary sphere + shield
      quad(0, 0, Math.min(0.4, umax), 1, '#1F5E3B'); if (umax > 0.4) quad(0.4, 0, umax, 1, P.crimson);
      const [cx, cy] = pt(0.4, 0.5); ctx.restore(); ctx.save();
      ctx.strokeStyle = '#E8C23A'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, 44, 0, TAU); ctx.stroke();
      ctx.lineWidth = 4; for (const k of [-0.5, 0, 0.5]) { ctx.beginPath(); ctx.ellipse(cx, cy + k * 30, 44, 12, 0, 0, TAU); ctx.stroke(); }
      ctx.beginPath(); ctx.ellipse(cx, cy, 14, 44, 0, 0, TAU); ctx.stroke();
      const sh = (w, h) => { ctx.beginPath(); ctx.moveTo(cx - w, cy - h); ctx.lineTo(cx + w, cy - h); ctx.lineTo(cx + w, cy + h * 0.3); ctx.quadraticCurveTo(cx + w, cy + h, cx, cy + h * 1.1); ctx.quadraticCurveTo(cx - w, cy + h, cx - w, cy + h * 0.3); ctx.closePath(); };
      sh(26, 30); ctx.fillStyle = P.white; ctx.fill(); sh(23, 27); ctx.fillStyle = P.crimson; ctx.fill(); sh(14, 17); ctx.fillStyle = P.white; ctx.fill();
      for (const [dx, dy] of [[0, -9], [-8, 0], [0, 0], [8, 0], [0, 9]]) { ctx.beginPath(); ctx.arc(cx + dx, cy + dy, 3.2, 0, TAU); ctx.fillStyle = P.royal; ctx.fill(); }
      break; }
    case 'england': quad(0, 0, umax, 1, P.white); quad(0.42, 0, 0.58, 1, P.crimson); quad(0, 0.4, umax, 0.6, P.crimson); break;
    case 'dutch': quad(0, 0, umax, 1 / 3, P.orange); quad(0, 1 / 3, umax, 2 / 3, P.white); quad(0, 2 / 3, umax, 1, P.royal); break;
    case 'calicut': quad(0, 0, umax, 1, P.forest); quad(0, 0.42, umax, 0.58, P.gold); break;
    case 'arab': quad(0, 0, umax, 1, P.ink); quad(0, 0.35, umax, 0.65, P.white); break;
    case 'gujarat': case 'bijapur': quad(0, 0, umax, 1, P.brown); quad(0, 0.8, umax, 0.92, P.edge); break;
    case 'mughal': quad(0, 0, umax, 1, P.mughal); quad(0.25, 0.25, 0.55, 0.75, P.gold); break;
    case 'maratha': { const pts = []; for (let k = 0; k <= 6; k++) pts.push(pt(k / 6 * umax, k / 6 * 0.42)); pts.push(pt(0.62 * umax, 0.5)); for (let k = 6; k >= 0; k--) pts.push(pt(k / 6 * umax, 1 - k / 6 * 0.42)); cut(P_poly(pts), P.saffron, { shadow: 0, edge: 0 }); const p2 = []; for (let k = 0; k <= 6; k++) p2.push(pt(k / 6 * 0.5, 0.5 + k / 6 * 0.0)); break; }
    case 'spain': quad(0, 0, umax, 1, P.white); quad(0, 0, umax, 0.25, P.wine); quad(0, 0.75, umax, 1, P.wine); break;
    case 'india': quad(0, 0, umax, 1 / 3, P.saffron); quad(0, 1 / 3, umax, 2 / 3, P.white); quad(0, 2 / 3, umax, 1, P.indiaGreen);
      { const [cx, cy] = pt(0.5, 0.5); ctx.restore(); ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, 19, 0, TAU); ctx.strokeStyle = P.royal; ctx.lineWidth = 4; ctx.stroke(); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; line([[cx, cy], [cx + Math.cos(a) * 18, cy + Math.sin(a) * 18]], P.royal, 2); } } break;
  }
  ctx.restore();
  if (tr > 0) { const [tx, ty] = pt(umax, 0.5); ctx.strokeStyle = P.edge; ctx.lineWidth = 3; ctx.beginPath(); for (let k = 0; k <= 8; k++) ctx.lineTo(tx + (rnd(k) - 0.5) * 16, top + k / 8 * fh); ctx.stroke(); }
  ctx.restore();
}
