// CH1 · "1453: The Spice Problem": Constantinople falls, the land roads lock, middlemen take their cut, little Portugal
// bets on going around, Prince Henry pushes ships down Africa, Dias rounds the Cape, a door opens.
import { ctx, W, H, clamp, lerp, seg, eo, eio, eob, rnd, line, circle } from '../core/lib.js';
import * as K from '../core/kit.js';
const { P } = K;

const EAST = { lon: 42, lat: 32, w: 62 };                      // Venice to the Persian Gulf
const LAND_ROAD = ['VENICE', [20, 40], 'CONSTANTINOPLE', [38, 38], [48, 33], [58, 30], [70, 30]];

/** the land road east, ink dashed (not a sea route), with an optional padlock at Constantinople */
function landRoad(pr, p = 1, lock = 0) {
  const pts = LAND_ROAD.map((s) => pr(s)); ctx.save(); ctx.setLineDash([18, 14]); ctx.strokeStyle = P.ink; ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.beginPath(); let tot = 0; const L = []; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(l); tot += l; }
  let left = tot * clamp(p); ctx.moveTo(...pts[0]); for (let i = 1; i < pts.length && left > 0; i++) { const k = Math.min(1, left / L[i - 1]); ctx.lineTo(lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)); left -= L[i - 1]; }
  ctx.stroke(); ctx.restore();
  if (lock > 0) { const [x, y] = pr('CONSTANTINOPLE'); K.padlock(x + 10, y - 20, eob(clamp(lock)) * 0.9); }
}
/** a goods icon: pepper sack, silk roll, cotton boll */
function good(kind, x, y, s) {
  if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (kind === 'pepper') K.sack(0, 50, 0.35);
  if (kind === 'silk') { K.cut(K.P_rr(-70, -40, 140, 80, 40), P.wine, { shadow: 0.6, edge: 4 }); K.cut(K.P_circ(-70, 0, 40), '#9A4A55', { shadow: 0, edge: 4 }); }
  if (kind === 'cotton') { for (const [dx, dy] of [[-30, 0], [30, 0], [0, -30], [0, 10]]) K.cut(K.P_circ(dx, dy, 34), P.white, { shadow: 0.5, edge: 3 }); K.cut(K.P_poly([[-30, 30], [30, 30], [0, 70]]), P.forest, { shadow: 0, edge: 3 }); }
  ctx.restore();
}
/** the middlemen: a row of four traders; the sack sits with trader k (fractional = passing) */
function middlemen(lt, t, at, coins = -1) {
  K.parchment(13); K.cut(K.P_rr(-1100, 1320, W + 2200, 700, 0), '#C9A878', { shadow: 0, edge: 0 });
  const xs = [150, 400, 650, 900], roles = ['merchant', 'arab', 'merchant', 'arab'];
  xs.forEach((x, k) => K.person({ role: roles[k], x, y: 1330, h: 430, dir: 1, arm: 55, prop: 'none', t }));
  const k = clamp(at, 0, 3), i = Math.floor(k), f = k - i, x = lerp(xs[i], xs[Math.min(3, i + 1)], eio(f)) + 90, y = 1030 - Math.sin(f * Math.PI) * 80;
  K.sack(x, y + 90, 0.42);
  if (coins >= 0) for (let j = 0; j < 4; j++) { const c = clamp(coins * 4 - j); if (c <= 0) continue; K.coin(xs[j] + 60, lerp(1010, 1290, eo(c)), 26); }
}

export default function (B) {
  const { add, cue, cut_, Wd, L, Le, i0 } = B, ch = 1, I = (k) => i0 + k;

  // 0 · In 1453, : map of the eastern Mediterranean, Constantinople pinned
  { const i = I(0), st = cut_(i);
    add({ id: 'C1a', ch, at: st, year: 1453, note: 'map: Europe to the Gulf, Constantinople pinned', draw(lt, d, t) {
      const pr = K.realMap(K.lerpView(K.VIEWS.med, EAST, eio(clamp(lt / d) * 0.5))); K.pin(pr, 'CONSTANTINOPLE', { side: 'up', sc: eob(seg(lt, 0.2, 0.5)) }); K.ribbon('1453', 540, 420, eob(seg(lt, 0.1, 0.45)), 96);
    } });
    cue(st + 0.1, 'pop', { gain: 0.5 }); }

  // 1 · the Ottoman Turks captured Constantinople, : an army marches to the walled city; when it arrives the city burns
  //     (spec 001-video-16x9 FR-5: marching and fire only, no fighting or bodies)
  { const i = I(1), st = cut_(i), ca = Wd('captured', i) - st;
    add({ id: 'C1b', ch, at: st, year: 1453, note: 'Ottoman army marches to the walls of Constantinople; on "captured" fire and smoke rise over the city', draw(lt, d, t) {
      const c = K.cam(lt, d, { x: -60, zoom: 1.0 }, { x: 60, zoom: 1.05 }), arrive = clamp(lt / ca), fire = clamp((lt - ca) / 0.6);
      K.layer(c, 0.15, () => K.sky(0.45 + 0.35 * fire, 460, 1150));
      K.layer(c, 0.45, () => { K.walledCity(980, 1180, 1.0); for (let k = 0; k < 5; k++) { K.flame(640 + k * 170, 1060 - (k % 2) * 120, fire * (0.7 + 0.3 * Math.sin(k)), t, k); } for (let k = 0; k < 3; k++) K.smokeColumn(700 + k * 250, 980, 0.9, t + k, fire); K.glow(980, 1000, 600 * fire, '#E0782E', 0.45 * fire); });
      K.layer(c, 0.8, () => { K.cut(K.P_rr(-1100, 1180, W + 2200, 900, 0), '#A88A5E', { shadow: 0.4, edge: 5 }); K.cut(K.P_poly([[-1100, 1300], [600, 1230], [700, 1260], [-1100, 1420]]), '#C9A878', { shadow: 0, edge: 3 }); });
      K.layer(c, 1.0, () => { const front = lerp(-500, 520, eio(arrive)); for (let r = 0; r < 3; r++) for (let k = 0; k < 9; k++) { const x = front - k * 120 - r * 40, y = 1330 + r * 55; if (x > 600) continue; K.marcher(x, y, 0.75 + r * 0.08, lt * 9 + k + r * 2); } });
      K.slip('CONSTANTINOPLE', 980, 640, eob(seg(lt, 0.2, 0.5)), -0.02, 50);
    } });
    for (let k = 0; k < 6; k++) cue(st + 0.1 + k * 0.35, 'thud', { gain: 0.25 }); cue(st + ca, 'sizzle', { dur: 1.6, gain: 0.5 }); }

  // 2 · and the old roads to the East fell into other hands. : the land road draws east, a padlock snaps on
  { const i = I(2), st = cut_(i), ha = Wd('hands', i) - st;
    add({ id: 'C1c', ch, year: 1453, at: st, note: 'ink land road Venice -> Constantinople -> east; padlock snaps on at "hands"', draw(lt, d, t) {
      const pr = K.realMap(EAST); landRoad(pr, eio(clamp(lt / (ha * 0.9))), clamp((lt - ha) / 0.3)); K.pin(pr, 'VENICE', { side: 'up', size: 32 }); K.pin(pr, 'CONSTANTINOPLE', { side: 'up' });
      K.slip('TO INDIA →', 860, pr([70, 30])[1] - 70, eob(seg(lt, 0.6, 0.9)), 0.02, 36);
    } });
    cue(st + 0.1, 'quill', { dur: 1.4, gain: 0.5 }); cue(st + ha + 0.1, 'thud', { gain: 0.6 }); }

  // 3 · Indian pepper, silk and cotton still reached Europe, : three goods pop along the road
  { const i = I(3), st = cut_(i), w = ['pepper', 'silk', 'cotton'].map((x) => Wd(x, i) - st), eu = Wd('europe', i) - st;
    add({ id: 'C1d', ch, at: st, year: 1453, note: 'pepper, silk, cotton pop onto the road one by one and slide west to Europe', draw(lt, d, t) {
      const pr = K.realMap(EAST); landRoad(pr, 1, 1); K.pin(pr, 'CONSTANTINOPLE', { side: 'up' });
      ['pepper', 'silk', 'cotton'].forEach((kind, k) => { const a = w[k], sl = eio(clamp((lt - eu) / 0.9)); const [gx, gy] = pr([[64, 30], [56, 30.5], [48, 33]][k]); const [ex, ey] = pr('VENICE'); good(kind, lerp(gx, ex + k * 40, sl), lerp(gy - 70, ey - 70 - k * 30, sl), eob(clamp((lt - a) / 0.3)) * 1.1); });
    } });
    w.forEach((a) => cue(st + a, 'pop', { gain: 0.45 })); }

  // 4 · but only through Arab middlemen, : the sack passes hand to hand
  { const i = I(4), st = cut_(i);
    add({ id: 'C1e', ch, at: st, year: 1453, note: 'a pepper sack passes hand to hand along four traders', draw(lt, d, t) { middlemen(lt, t, 3 * eio(clamp(lt / d))); } });
    cue(st, 'whoosh', { gain: 0.6 }); for (let k = 0; k < 3; k++) cue(st + 0.4 + k * 0.5, 'plop', { gain: 0.35 }); }

  // 5 · and every one of them took a cut. : a coin drops at each hand, the price slip grows
  { const i = I(5), st = cut_(i), cu = Wd('cut', i) - st;
    add({ id: 'C1f', ch, at: st, year: 1453, note: 'a coin drops at each trader; the PRICE slip grows bigger each time', draw(lt, d, t) {
      const p = clamp(lt / (d * 0.9)); middlemen(lt, t, 3, p);
      K.slip('PRICE', 540, 520, lerp(0.7, 1.9, eo(p)), -0.03, 56);
    } });
    for (let k = 0; k < 4; k++) cue(st + k * 0.4, 'coins', { dur: 0.3, gain: 0.5 }); }

  // 6 · So little Portugal, on the edge of the Atlantic, : Iberia, Portugal in gold at the edge of the sea
  { const i = I(6), st = cut_(i), ed = Wd('edge', i) - st;
    add({ id: 'C1g', ch, at: st, year: 1453, note: 'map pulls back: tiny gold Portugal on the edge of the Atlantic', draw(lt, d, t) {
      const pr = K.realMap(K.lerpView(K.VIEWS.iberia, { lon: -4, lat: 34, w: 64 }, eio(clamp(lt / d))), { gold: ['portugal'] });
      K.pin(pr, 'LISBON', { text: 'PORTUGAL', side: 'down', sc: eob(seg(lt, 0.2, 0.5)), size: 44 });
      if (lt > ed) { const [x, y] = pr([-32, 26]); K.slip('THE ATLANTIC', x, y, eob(seg(lt, ed, ed + 0.3)), -0.04, 40); }
    } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(st + 0.2, 'pop', { gain: 0.5 }); }

  // 7 · made a bold bet: : the compass needle spins
  { const i = I(7), st = cut_(i);
    add({ id: 'C1h', ch, at: st, year: 1453, note: 'a big compass, the needle spins and settles south', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.1 }); K.layer(c, 0.3, () => K.parchment(17));
      K.layer(c, 1, () => { ctx.save(); ctx.translate(540, 900); ctx.rotate(lerp(0, Math.PI * 5, eo(clamp(lt / (d * 0.9))))); K.compass(0, 0, 3.2); ctx.restore();
        for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2, r0 = 420 + Math.sin(lt * 8 + k) * 10; ctx.save(); ctx.globalAlpha = clamp((lt - 0.3) * 2) * 0.6; line([[540 + Math.cos(a) * r0, 900 + Math.sin(a) * r0], [540 + Math.cos(a) * (r0 + 60), 900 + Math.sin(a) * (r0 + 60)]], P.gold, 10); ctx.restore(); } });
    } });
    cue(st, 'zip', { gain: 0.5 }); }

  // 8 · if you can't go through, go around. : an arrow bounces off the padlock, then the route bends round Africa
  { const i = I(8), st = cut_(i), ar = Wd('around', i) - st;
    add({ id: 'C1i', ch, at: st, year: 1453, note: 'route map: arrow hits the Constantinople padlock and bounces; on "around" the crimson route bends round Africa', draw(lt, d, t) {
      const pr = K.realMap(K.VIEWS.route, { gold: ['portugal'] }); const [cx, cy] = pr('CONSTANTINOPLE'), [lx, ly] = pr('LISBON');
      K.padlock(cx, cy - 10, 0.75);
      const a = clamp(lt / (ar * 0.8)); const hit = a < 0.7 ? a / 0.7 : 1 - (a - 0.7) / 0.3 * 0.25;
      if (lt < ar) { ctx.save(); ctx.globalAlpha = lt > ar - 0.2 ? clamp((ar - lt) / 0.2) : 1; K.dashedRoute([[lx, ly], [lerp(lx, cx - 40, hit), lerp(ly, cy, hit)]], 1); ctx.restore(); }
      if (lt > ar - 0.1) K.placeRoute(pr, K.SEA_ROUTE, eo(clamp((lt - ar + 0.1) / 0.6)));
      K.pin(pr, 'LISBON', { side: 'up' });
    } });
    cue(st + 0.6, 'thud', { gain: 0.5 }); cue(st + ar, 'zip', { gain: 0.6 }); }

  // 9 · Prince Henry, the Navigator, : Henry points at a wall map of Africa
  { const i = I(9), st = cut_(i), na = Wd('navigator', i) - st;
    add({ id: 'C1j', ch, at: st, year: 1453, note: 'Prince Henry (dark hood) points at a wall map of Africa', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.04, x: 20 }, { zoom: 1.1, x: -20 });
      K.layer(c, 0.4, () => { K.parchment(18); K.cut(K.P_rr(-1100, 300, W + 2200, 1200, 0), P.stone, { shadow: 0, edge: 0 }); K.cut(K.P_rr(470, 380, 520, 760, 8), P.sepia, { shadow: 0.8, edge: 5 });
        ctx.save(); ctx.beginPath(); ctx.rect(490, 400, 480, 720); ctx.clip(); ctx.translate(730, 760); ctx.scale(0.45, 0.45); ctx.translate(-540, -960); K.realMap(K.VIEWS.africa, { gold: ['portugal'], frame: false, compassAt: false }); ctx.restore(); });
      K.layer(c, 1, () => { K.cut(K.P_rr(-1100, 1450, W + 2200, 600, 0), '#8C6B4A', { shadow: 0, edge: 0 }); K.person({ role: 'henry', x: 300, y: 1470, h: 760, arm: lerp(20, 75, eob(clamp(lt / 0.6))), t }); });
      if (lt > na) K.slip('PRINCE HENRY', 300, 560, eob(seg(lt, na, na + 0.3)), -0.03, 48);
    } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(st + na, 'pop', { gain: 0.5 }); }

  // 10 · pushed ship after ship down the coast of Africa, : caravels step down the coast, leaving pins
  { const i = I(10), st = cut_(i);
    add({ id: 'C1k', ch, at: st, year: 1453, note: 'Africa map: caravel steps down the west coast, a pin at each stop', draw(lt, d, t) {
      const pr = K.realMap(K.VIEWS.africa, { gold: ['portugal'] }); const stops = [[-10, 30], [-17, 21], [-18, 13], [-12, 6], [2, 3], [9, -6], [12, -16]];
      const p = clamp(lt / (d * 0.95)) * (stops.length - 1); const k = Math.floor(p);
      for (let j = 0; j <= Math.min(k, stops.length - 1); j++) { const [x, y] = pr(stops[j]); K.pin(pr, stops[j], { text: '', r: 9, color: P.royal }); }
      const a = pr(stops[Math.min(k, stops.length - 1)]), b = pr(stops[Math.min(k + 1, stops.length - 1)]), f = eio(p - k);
      K.caravel(lerp(a[0], b[0], f) - 40, lerp(a[1], b[1], f), 0.16, t);
    } });
    for (let k = 0; k < 6; k++) cue(st + 0.3 + k * (0.38), 'pop', { gain: 0.35 }); }

  // 11 · and in 1488, Bartholomew Dias rounded the Cape of Good Hope. (two cuts: the ribbon, then the rounding)
  { const i = I(11), st = cut_(i), ro = Wd('rounded', i) - st, cape = Wd('cape', i) - st;
    add({ id: 'C1l', ch, at: st, year: 1488, note: 'southern Africa: ribbon 1488, Dias sails toward the Cape', draw(lt, d, t) {
      const pr = K.realMap({ lon: 20, lat: -28, w: 34 }); K.ribbon('1488', 540, 420, eob(seg(lt, 0.1, 0.45)), 100);
      const [x, y] = pr([10, -22 - 8 * eio(clamp(lt / d))]); K.caravel(x, y, 0.3, t);
    } });
    const s2 = st + ro - 0.08;
    add({ id: 'C1m', ch, at: s2, year: 1488, note: 'Dias rounds the Cape of Good Hope, crimson route bends east', draw(lt, d, t) {
      const pr = K.realMap({ lon: 20, lat: -28, w: 34 }); const pts = [[10, -30], [14, -35], [19, -36.5], [25, -35.5], [30, -33]];
      const p = eio(clamp(lt / (d * 0.95))), head = K.placeRoute(pr, pts, p); K.caravel(head[0], head[1] - 20, 0.3, t);
      const cp = cape - (s2 - st); if (lt > cp) K.pin(pr, 'CAPE OF GOOD HOPE', { side: 'up', sc: eob(seg(lt, cp, cp + 0.3)), dx: -120, size: 40 });
    } });
    cue(st + 0.1, 'pop', { gain: 0.5 }); cue(s2, 'whoosh', { gain: 0.6 }); cue(s2 + 0.1, 'waves', { dur: 2, gain: 0.5 }); }

  // 12 · The door to the Indian Ocean was open. : a door-shaped gap opens in a paper wall, sea light
  { const i = I(12), st = cut_(i), op = Wd('open', i) - st;
    add({ id: 'C1n', ch, at: st, year: 1488, note: 'paper wall: a door swings open onto the Indian Ocean on "open"', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.12, y: 40 });
      K.layer(c, 1, () => K.paperDoor(clamp((lt - op + 0.5) / 0.8), t, () => { K.sky(0.1, 700, 540); K.wave(1050, t, { color: P.seaDark }); K.wave(1180, t, { phase: 2 }); }));
      K.slip('THE INDIAN OCEAN', 540, 400, eob(seg(lt, 0.2, 0.5)), -0.02, 48);
    } });
    cue(st + op - 0.4, 'creak', { gain: 0.6 }); cue(st + op, 'waves', { dur: 2.4, gain: 0.6 }); }
}
