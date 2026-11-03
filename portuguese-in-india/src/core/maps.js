// Real maps: Natural Earth 1:50m coastlines (public domain) baked into data/geo.json by tools/bake_geo.py,
// drawn as cut paper on a parchment sea. A VIEW = { lon, lat, w } (centre + degrees of longitude across the 1080 px frame),
// Mercator. Places are pinned with slips; labels must stay above y 1450 (caption strip below).
import { ctx, W, H, TAU, clamp, lerp, eio, eob, seg, rnd, circle, line } from './lib.js';
import { P, cut, P_poly, P_rr, parchment, slip, compass, dashedRoute } from './paper.js';

let GEO = null, BOX = [];
export async function loadGeo() {
  const r = await fetch('data/geo.json', { cache: 'no-store' }); if (!r.ok) throw new Error('missing data/geo.json: run tools/bake_geo.py');
  GEO = await r.json();
  BOX = GEO.land.map((p) => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const [x, y] of p) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y); } return [a, b, c, d]; });
}
export const place = (name) => { const p = GEO.places[name]; if (!p) throw new Error(`no place "${name}" in geo.json`); return p; };

const mercY = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * 180 / Math.PI;
/** project [lon, lat] (or a place name) into the frame for view v */
export function proj(v, ll) {
  const [lon, lat] = typeof ll === 'string' ? place(ll) : ll, k = W / v.w;
  return [540 + (lon - v.lon) * k, 960 - (mercY(lat) - mercY(v.lat)) * k];
}
/** blend two views (for map moves); zooms in log space so it feels steady */
export const lerpView = (a, b, p) => ({ lon: lerp(a.lon, b.lon, p), lat: lerp(a.lat, b.lat, p), w: Math.exp(lerp(Math.log(a.w), Math.log(b.w), p)) });

// the views this story uses (checked against the coastline on review/maps.png)
export const VIEWS = {
  route: { lon: 31, lat: 6, w: 122 },        // Lisbon - round Africa - India
  med: { lon: 18, lat: 38, w: 44 },          // Venice, Constantinople, Cairo, Lisbon edge
  iberia: { lon: -6, lat: 37, w: 30 },       // Portugal on the edge of the Atlantic
  africa: { lon: 12, lat: 2, w: 74 },        // down the coast of Africa to the Cape
  ocean: { lon: 71, lat: 10, w: 76 },         // the Indian Ocean: Malindi to Malacca, Hormuz
  india: { lon: 79, lat: 14, w: 34 },        // the subcontinent: Gujarat, Malabar, Bengal
  malabar: { lon: 75, lat: 14.5, w: 11 },    // Goa, Cannanore, Calicut, Cochin
  gujarat: { lon: 72.6, lat: 19.8, w: 9 },   // Diu, Daman, Surat, Bassein, Chaul
  bengal: { lon: 88.5, lat: 23.2, w: 9 },    // Hooghly
  brazil: { lon: -18, lat: 0, w: 120 },      // the Atlantic to Brazil
};

/** a rough Portugal outline (lon/lat) to gold-tint the country on small-scale maps */
const PORTUGAL = [[-8.9, 41.9], [-8.2, 42.1], [-6.2, 41.6], [-6.9, 41.0], [-6.9, 40.0], [-7.0, 39.0], [-7.3, 38.4], [-7.0, 38.0], [-7.4, 37.2], [-8.9, 37.0], [-8.8, 38.0], [-9.5, 38.8], [-9.0, 40.0], [-8.8, 41.0]];

/**
 * the map page. o = { seaTint: [colour, alpha] (e.g. the blue-water wash), grid, frame, gold: ['portugal'], compassAt, dim }
 * returns pr(ll) = projection for this view
 */
export function realMap(v, o = {}) {
  parchment(o.seed ?? 3);
  ctx.save(); ctx.globalAlpha = 0.9; ctx.fillStyle = P.sea; ctx.fillRect(-400, -400, W + 800, H + 800); ctx.restore();
  if (o.seaTint) { ctx.save(); ctx.globalAlpha = o.seaTint[1]; ctx.fillStyle = o.seaTint[0]; ctx.fillRect(-400, -400, W + 800, H + 800); ctx.restore(); }
  // graticule every 10 degrees (or 2 on close views)
  const step = v.w > 40 ? 10 : v.w > 12 ? 5 : 2, k = W / v.w;
  ctx.save(); ctx.strokeStyle = 'rgba(62,44,30,0.16)'; ctx.lineWidth = 2; ctx.beginPath();
  for (let lon = Math.floor((v.lon - v.w) / step) * step; lon <= v.lon + v.w; lon += step) { const [x] = proj(v, [lon, 0]); ctx.moveTo(x, -400); ctx.lineTo(x, H + 400); }
  for (let lat = -60; lat <= 70; lat += step) { const [, y] = proj(v, [0, lat]); ctx.moveTo(-400, y); ctx.lineTo(W + 400, y); }
  ctx.stroke(); ctx.restore();
  // land: every polygon that touches the frame, one cut-paper path
  const lon0 = v.lon - v.w * 0.75, lon1 = v.lon + v.w * 0.75, hh = (H / W) * v.w * 0.8;
  const path = () => {
    ctx.beginPath();
    GEO.land.forEach((p, i) => {
      const b = BOX[i]; if (b[2] < lon0 || b[0] > lon1 || b[3] < v.lat - hh * 1.6 || b[1] > v.lat + hh * 1.6) return;
      const sk = Math.max(1, Math.floor(p.length / 2000)); let first = true;
      for (let j = 0; j < p.length; j += sk) { const [x, y] = proj(v, p[j]); if (first) { ctx.moveTo(x, y); first = false; } else ctx.lineTo(x, y); }
      ctx.closePath();
    });
  };
  cut(path, o.land || P.land, { shadow: 0.7, edge: Math.max(3, Math.min(6, k * 0.15)) });
  if (o.gold && o.gold.includes('portugal')) { cut(P_poly(PORTUGAL.map((ll) => proj(v, ll))), P.gold, { shadow: 0.3, edge: 3 }); }
  if (o.dim) { ctx.save(); ctx.globalAlpha = o.dim; ctx.fillStyle = P.parch; ctx.fillRect(-400, -400, W + 800, H + 800); ctx.restore(); }
  if (o.frame !== false) { ctx.save(); ctx.strokeStyle = P.ink; ctx.lineWidth = 5; ctx.strokeRect(36, 36, W - 72, H - 72); ctx.restore(); }
  if (o.compassAt !== false) compass(...(o.compassAt || [930, 1360]), 0.42);
  return (ll) => proj(v, ll);
}

/**
 * pin a place: ink dot + a slip label. o = { side: 'up'|'down'|'left'|'right', size, sc, color (dot), text, dy, dx }
 * slips never go below y 1450: they flip up if they would.
 */
export function pin(pr, name, o = {}) {
  const sc = o.sc ?? 1; if (sc <= 0) return; const [x, y] = pr(name), r = (o.r || 11) * Math.min(1, sc * 1.3);
  circle(x, y, r + 3, P.edge); circle(x, y, r, o.color || P.ink);
  if (o.text === '') return [x, y];
  const size = o.size || 34, gap = 46 + size * 0.4;
  let side = o.side || 'up', dx = o.dx || 0, dy = o.dy || 0;
  if (side === 'down' && y + gap > 1430) side = 'up';
  const [lx, ly] = side === 'up' ? [x, y - gap] : side === 'down' ? [x, y + gap] : side === 'left' ? [x - 30 - (o.text || name).length * size * 0.36, y] : [x + 30 + (o.text || name).length * size * 0.36, y];
  ctx.font = `700 ${size}px Caladea`; const hw = (ctx.measureText(o.text || name).width + 70) / 2;   // keep the slip inside the frame
  const sx = clamp(lx + dx, 50 + hw, W - 50 - hw);
  slip(o.text || name, sx, Math.min(1430, ly + dy), sc, o.rot ?? (rnd(x) - 0.5) * 0.06, size);
  return [x, y];
}
/** a little paper fort tower standing on a place (Portuguese = royal, Dutch = orange ...) */
export function fortIcon(x, y, s = 1, color = P.royal, flagKind = null, t = 0) {
  if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(() => { ctx.beginPath(); ctx.moveTo(-34, 0); ctx.lineTo(-34, -60); for (let i = 0; i < 5; i++) { const bx = -34 + i * 17; ctx.lineTo(bx, -72); ctx.lineTo(bx + 8.5, -72); ctx.lineTo(bx + 8.5, -60); ctx.lineTo(bx + 17, -60); } ctx.lineTo(34, 0); ctx.closePath(); }, color, { shadow: 0.6, edge: 4 });
  ctx.fillStyle = P.ink; ctx.beginPath(); ctx.arc(0, -16, 12, Math.PI, 0); ctx.lineTo(12, 0); ctx.lineTo(-12, 0); ctx.fill();
  if (flagKind) { ctx.save(); ctx.translate(0, -72); ctx.scale(0.3, 0.3); ctx.restore(); }
  ctx.restore();
}
/** crimson dashed route through places / [lon, lat] points in view pr; p draws it on; returns the head [x, y, angle] */
export function placeRoute(pr, stops, p = 1) { return dashedRoute(stops.map((s) => pr(s)), p); }
/** the recurring sea route Lisbon -> round Africa -> Malindi -> Calicut, as lon/lat waypoints at sea */
export const SEA_ROUTE = ['LISBON', [-15, 30], [-20, 15], [-12, 0], [0, -20], [10, -33], 'CAPE OF GOOD HOPE', [26, -36], [36, -26], [42, -14], 'MALINDI', [55, 3], [68, 9], 'CALICUT'];
