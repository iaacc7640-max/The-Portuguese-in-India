// CH2 · "1498: Hello, Calicut": da Gama through the door, the Gujarati pilot, the monsoon, the Zamorin's court,
// the shared ocean, one blue sail that wants to own it, and pepper worth many times its price.
import { ctx, W, H, clamp, lerp, seg, eo, eio, eob, rnd, line, circle } from '../core/lib.js';
import * as K from '../core/kit.js';
const { P } = K;

const SAIL_COLS = [[P.white, P.ink], [P.brown, P.sepia], [P.forest, P.sepia], [P.stone, '#6E4E30']];   // Arab · Indian · African · Chinese
/** the many small sails of the shared ocean on the ocean view (deterministic positions) */
function sails(pr, t, { show = [1, 1, 1, 1], shrink = 0, lanes = 0 } = {}) {
  const P0 = [[[52, 14], [58, 20], [62, 8]], [[70, 16], [66, 10], [74, 4], [80, 12]], [[44, 0], [46, -8], [50, 4]], [[88, 6], [94, 10], [84, -2]]];
  P0.forEach((grp, g) => grp.forEach(([lon, lat], k) => { const s = show[g]; if (s <= 0) return;
    const drift = Math.sin(t * 0.4 + g * 2 + k) * 1.2, [x, y] = pr([lon + drift, lat + Math.cos(t * 0.3 + k) * 0.6]);
    const home = shrink > 0 ? pr([[60, 24], [72, 21], [42, 2], [96, 14]][g]) : [x, y], xx = lerp(x, home[0], eo(shrink)), yy = lerp(y, home[1], eo(shrink));
    K.dhow(xx, yy, 0.12 * eob(clamp(s)) * (1 - shrink * 0.5), t + k, { sail: SAIL_COLS[g][0], hull: SAIL_COLS[g][1] }); }));
}

export default function (B) {
  const { add, cue, cut_, Wd, L, Le, i0 } = B, ch = 2, I = (k) => i0 + k;

  // 0 · Ten years later, Vasco da Gama walked through it. : the paper door, da Gama walks through
  { const i = I(0), st = cut_(i), ga = Wd('gama', i) - st;
    add({ id: 'C2a', ch, at: st, note: 'paper door open on the sea; da Gama walks in and through', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.1, y: 40 });
      K.layer(c, 1, () => K.paperDoor(1, t, () => { K.sky(0.15, 700, 540); K.wave(1050, t, { color: P.seaDark }); K.wave(1180, t, { phase: 2 }); }));
      const wx = lerp(140, 700, eio(clamp(lt / (d * 0.95)))), sc = lerp(1, 0.72, eio(clamp((lt - d * 0.5) / (d * 0.5))));
      K.layer(c, 1.15, () => { K.person({ role: 'gama', x: wx, y: 1360, h: 620 * sc, walk: lt * 7, t }); });
      if (lt > ga) K.slip('VASCO DA GAMA', 540, 380, eob(seg(lt, ga, ga + 0.3)), -0.03, 56);
    } });
    cue(st, 'whoosh'); cue(st + 0.2, 'creak', { gain: 0.5 }); cue(st + ga, 'pop', { gain: 0.5 }); }

  // 1 · In East Africa, he picked up a Gujarati pilot : Malindi harbour, the pilot boards with his kamal
  { const i = I(1), st = cut_(i), pi = Wd('pilot', i) - st;
    add({ id: 'C2b', ch, at: st, note: 'Malindi harbour: the Gujarati pilot (kamal) walks the pier to the caravel', draw(lt, d, t) {
      const c = K.cam(lt, d, { x: -30 }, { x: 40, zoom: 1.05 });
      K.seascape({ t, c, night: 0.05, horizon: 900, sunX: 260,
        far: () => { K.cut(() => { ctx.beginPath(); ctx.moveTo(-500, 910); ctx.quadraticCurveTo(200, 820, 700, 900); ctx.lineTo(700, 930); ctx.lineTo(-500, 930); ctx.closePath(); }, P.forest, { shadow: 0.3, edge: 4 }); for (let k = 0; k < 5; k++) K.palm(-60 + k * 110, 905, 0.22, t + k); },
        mid: (tt) => K.caravel(760, K.waveY(760, 1020, tt, { amp: 16, len: 0.013, speed: 0.9, phase: 1 }) + 20, 0.62, tt, { rot: Math.sin(tt) * 0.02 }),
        near: () => { K.cut(K.P_rr(-200, 1240, 760, 44, 6), P.sepia, { shadow: 0.7, edge: 4 }); for (const x of [-120, 60, 240, 420]) K.cut(K.P_rr(x, 1270, 28, 400, 4), P.sepia, { shadow: 0.5, edge: 3 });
          const px = lerp(80, 470, eio(clamp(lt / d))); K.person({ role: 'pilot', x: px, y: 1250, h: 430, walk: lt * 6, arm: 30, t }); },
      });
      K.slip('MALINDI', 260, 520, eob(seg(lt, 0.15, 0.45)), -0.03, 50);
      if (lt > pi) K.slip('A GUJARATI PILOT', 640, 640, eob(seg(lt, pi, pi + 0.3)), 0.03, 44);
    } });
    cue(st, 'whoosh'); cue(st, 'waves', { dur: 3, gain: 0.6 }); cue(st + pi, 'pop', { gain: 0.5 }); }

  // 2 · who knew the monsoon winds, : ocean map, wind arrows push the ship from Malindi to Calicut
  { const i = I(2), st = cut_(i), mo = Wd('monsoon', i) - st;
    add({ id: 'C2c', ch, at: st, year: 1498, note: 'ocean map: monsoon wind arrows push the caravel Malindi -> Calicut', draw(lt, d, t) {
      const pr = K.realMap(K.lerpView(K.VIEWS.ocean, { ...K.VIEWS.ocean, w: 66, lon: 66 }, eio(clamp(lt / d))));
      const p = eio(clamp((lt - 0.2) / (d * 0.85))), head = K.placeRoute(pr, ['MALINDI', [55, 3], [68, 9], 'CALICUT'], p);
      K.pin(pr, 'MALINDI', { side: 'down' }); K.pin(pr, 'CALICUT', { side: 'up', sc: eob(seg(p, 0.9, 1)) });
      const wa = clamp((lt - mo + 0.3) / 0.5); ctx.save(); ctx.globalAlpha = wa;
      for (let k = 0; k < 5; k++) { const [x0, y0] = pr([44 + k * 6, -6 + (k % 2) * 4]), off = ((t * 120 + k * 90) % 260); ctx.save(); ctx.translate(x0 + off * 0.8, y0 - off * 0.5); ctx.rotate(-0.55); line([[0, 0], [150, 0]], P.edge, 10); ctx.beginPath(); ctx.moveTo(150, -24); ctx.lineTo(190, 0); ctx.lineTo(150, 24); ctx.fillStyle = P.edge; ctx.fill(); ctx.restore(); }
      ctx.restore();
      if (lt > mo) K.slip('THE MONSOON', 360, 1180, eob(seg(lt, mo, mo + 0.3)), -0.02, 48);
      ctx.save(); ctx.translate(head[0], head[1]); K.caravel(0, 0, 0.14, t); ctx.restore();
    } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(st + mo - 0.2, 'wind', { dur: 2.2 }); }

  // 3 · and in May 1498, he reached Calicut. : Malabar map, Calicut pin + MAY 1498 ribbon
  { const i = I(3), st = cut_(i), re = Wd('reached', i) - st, ma = Wd('may', i) - st;
    add({ id: 'C2d', ch, at: st, year: 1498, note: 'zoom to the Malabar coast: Calicut pin and ribbon MAY 1498', draw(lt, d, t) {
      const v = K.lerpView(K.VIEWS.india, { lon: 75.5, lat: 12.2, w: 11 }, eio(clamp(lt / (d * 0.8))));
      const pr = K.realMap(v); K.ribbon('MAY 1498', 540, 420, eob(seg(lt, ma, ma + 0.35)), 92);
      if (lt > re) { K.pin(pr, 'CALICUT', { side: 'right', sc: eob(seg(lt, re, re + 0.3)), size: 52, dx: 40 }); const [x, y] = pr('CALICUT'); ctx.save(); ctx.translate(x - 90, y + 10); K.caravel(0, 0, 0.16 * eob(seg(lt, re, re + 0.4)), t); ctx.restore(); }
    } });
    cue(st, 'whoosh'); cue(st + ma, 'pop', { gain: 0.5 }); cue(st + re, 'quill', { dur: 0.6 }); }

  // 4 · Calicut's Hindu king, the Zamorin, : the palace court, the Zamorin under his parasol
  { const i = I(4), st = cut_(i), ki = Wd('king', i) - st;
    add({ id: 'C2e', ch, at: st, note: 'Calicut court: the Zamorin seated, parasol bearer behind; slip THE ZAMORIN', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.08, y: -30 });
      K.layer(c, 0.5, () => K.calicutCourt(t));
      K.layer(c, 1.0, () => { K.person({ role: 'bearer', x: 400, y: 1430, h: 540, arm: 165, t }); K.person({ role: 'zamorin', x: 590, y: 1450, h: 620, arm: 20, t }); });
      if (lt > ki) K.slip('THE ZAMORIN', 540, 300, eob(seg(lt, ki, ki + 0.3)), -0.02, 58);
    } });
    cue(st, 'whoosh'); cue(st + ki, 'pop', { gain: 0.5 }); }

  // 5 · grew rich by welcoming traders, : Calicut harbour of many sails, coins into the royal chest
  { const i = I(5), st = cut_(i), tr = Wd('traders', i) - st;
    add({ id: 'C2f', ch, at: st, note: 'harbour full of many-coloured sails; coins drop into a chest', draw(lt, d, t) {
      const c = K.cam(lt, d, { x: 40 }, { x: -40, zoom: 1.05 });
      K.seascape({ t, c, night: 0.1, horizon: 860,
        far: (tt) => { for (let k = 0; k < 6; k++) K.dhow(80 + k * 180, 880 + (k % 2) * 16, 0.18, tt + k, { sail: SAIL_COLS[k % 4][0], hull: SAIL_COLS[k % 4][1] }); },
        mid: (tt) => { for (let k = 0; k < 4; k++) K.dhow(140 + k * 260, K.waveY(140 + k * 260, 980, tt, { amp: 16, len: 0.013, speed: 0.9, phase: 1 }) + 10, 0.34, tt + k, { sail: SAIL_COLS[(k + 1) % 4][0], hull: SAIL_COLS[(k + 1) % 4][1] }); },
        fore: () => { K.cut(K.P_rr(560, 1230, 420, 230, 16), P.sepia, { shadow: 0.8, edge: 5 }); K.cut(K.P_rr(540, 1200, 460, 50, 14), '#6E4E30', { shadow: 0.4, edge: 4 });
          const n = clamp((lt - 0.2) / (d * 0.8)) * 7; K.coinStack(770, 1190, n, 60);
          for (let k = 0; k < 3; k++) { const p = ((lt * 1.6 + k / 3) % 1); if (lt > 0.2) K.coin(770 + (k - 1) * 40, lerp(700, 1150, p * p), 30); } },
      });
      if (lt > tr) K.slip('TRADE = RICHES', 540, 420, eob(seg(lt, tr, tr + 0.3)), 0.02, 48);
    } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(st + 0.3, 'coins', { dur: 1.6, gain: 0.7 }); }

  // 6 · so he welcomed this one too. : da Gama bows, gifts exchanged
  { const i = I(6), st = cut_(i), we = Wd('welcomed', i) - st;
    add({ id: 'C2g', ch, at: st, note: 'court: da Gama bows with a gift chest, the Zamorin raises a hand in welcome', draw(lt, d, t) {
      const c = K.cam(lt, d, { x: -30, zoom: 1.04 }, { x: 20, zoom: 1.08 });
      K.layer(c, 0.5, () => K.calicutCourt(t));
      K.layer(c, 1.0, () => { K.person({ role: 'bearer', x: 760, y: 1430, h: 520, arm: 165, dir: -1, t }); K.person({ role: 'zamorin', x: 640, y: 1440, h: 580, dir: -1, arm: lt > we ? 70 * eob(seg(lt, we, we + 0.3)) : 10, t });
        const bow = Math.sin(clamp(lt / 1.2) * Math.PI) * 0.15; ctx.save(); ctx.translate(280, 1460); ctx.rotate(bow); K.person({ role: 'gama', x: 0, y: 0, h: 560, arm: 40, t }); ctx.restore();
        const gx = lerp(400, 460, eio(clamp(lt / d))); K.cut(K.P_rr(gx - 60, 1340, 120, 90, 10), P.wine, { shadow: 0.7, edge: 4 }); K.cut(K.P_rr(gx - 66, 1330, 132, 24, 8), P.gold, { shadow: 0, edge: 3 }); });
    } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(st + we, 'pop', { gain: 0.5 }); }

  // 7 · The Arab merchants were far less happy. : merchant with ledger, frowning at the blue sail
  { const i = I(7), st = cut_(i), le = Wd('less', i) - st;
    add({ id: 'C2h', ch, at: st, note: 'Arab merchant over his ledger frowns at a blue-cross sail in the window', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.06 }, { zoom: 1.12, x: 30 });
      K.layer(c, 0.3, () => { K.parchment(9); K.cut(K.P_rr(-200, 300, W + 400, 1200, 0), '#C9A878', { shadow: 0, edge: 0 }); ctx.save(); ctx.beginPath(); ctx.roundRect(560, 420, 400, 520, [200, 200, 0, 0]); ctx.clip(); K.sky(0.1, 520, 820); K.wave(760, t, { amp: 10 }); K.caravel(790, 800, 0.32, t); ctx.restore(); ctx.strokeStyle = P.sepia; ctx.lineWidth = 16; ctx.beginPath(); ctx.roundRect(560, 420, 400, 520, [200, 200, 0, 0]); ctx.stroke(); });
      K.layer(c, 1.0, () => { K.cut(K.P_rr(-100, 1260, 800, 60, 8), '#6E4E30', { shadow: 0.6, edge: 4 }); K.person({ role: 'arab', x: 330, y: 1560, h: 760, arm: 50, brow: lt > le ? -1 : 0, t }); });
    } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(st + le, 'thud', { gain: 0.35 }); }

  // 8 · For centuries, Indians, Arabs, Africans and Chinese : the shared ocean fills with sails
  { const i = I(8), st = cut_(i), w = ['indians', 'arabs', 'africans', 'chinese'].map((x) => Wd(x, i) - st);
    add({ id: 'C2i', ch, at: st, year: 1498, note: 'ocean map fills with sails of four colours, one group per name', draw(lt, d, t) {
      const pr = K.realMap(K.VIEWS.ocean); const show = [w[1], w[0], w[2], w[3]].map((a) => clamp((lt - a + 0.1) / 0.35));
      sails(pr, t, { show });
      [['ARABS', 'HORMUZ', w[1]], ['INDIANS', 'CALICUT', w[0]], ['AFRICANS', 'MALINDI', w[2]], ['CHINESE', 'MALACCA', w[3]]].forEach(([tx, pl, a]) => { if (lt > a) K.pin(pr, pl, { text: tx, side: pl === 'MALACCA' ? 'up' : 'down', sc: eob(seg(lt, a, a + 0.3)), size: 36 }); });
    } });
    cue(st, 'whoosh', { gain: 0.6 }); w.forEach((a) => cue(st + a, 'pop', { gain: 0.45 }));
    // second cut inside the long line: push in on the western ocean as Africans and Chinese join
    const s2 = st + w[2] - 0.08;
    add({ id: 'C2i2', ch, at: s2, year: 1498, note: 'closer: African and Chinese sails join the shared ocean', draw(lt, d, t) {
      const L0 = lt + (s2 - st), pr = K.realMap(K.lerpView(K.VIEWS.ocean, { lon: 71, lat: 8, w: 70 }, eio(clamp(lt / 0.6))));
      sails(pr, t, { show: [w[1], w[0], w[2], w[3]].map((a) => clamp((L0 - a + 0.1) / 0.35)) });
      [['ARABS', 'HORMUZ', w[1]], ['INDIANS', 'CALICUT', w[0]], ['AFRICANS', 'MALINDI', w[2]], ['CHINESE', 'MALACCA', w[3]]].forEach(([tx, pl, a]) => { if (L0 > a) K.pin(pr, pl, { text: tx, side: pl === 'MALACCA' ? 'up' : 'down', sc: L0 - a < 0.3 ? eob(seg(L0, a, a + 0.3)) : 1, size: 36 }); });
    } }); }

  // 9 · had shared this ocean by unwritten rules: : trade lanes criss-cross (ink dashes, no flags)
  { const i = I(9), st = cut_(i);
    add({ id: 'C2j', ch, at: st, year: 1498, note: 'ink trade lanes criss-cross the ocean, sails moving along them', draw(lt, d, t) {
      const pr = K.realMap(K.VIEWS.ocean); const p = eio(clamp(lt / (d * 0.8)));
      [['MALINDI', 'CALICUT'], ['HORMUZ', 'CALICUT'], ['CALICUT', 'MALACCA'], ['MALINDI', 'HORMUZ'], ['DIU', 'MALACCA']].forEach(([a, b], k) => { const A = pr(a), Bp = pr(b), q = clamp(p * 1.3 - k * 0.1); ctx.save(); ctx.setLineDash([16, 14]); ctx.strokeStyle = 'rgba(62,44,30,0.6)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(...A); ctx.lineTo(lerp(A[0], Bp[0], q), lerp(A[1], Bp[1], q)); ctx.stroke(); ctx.restore(); });
      sails(pr, t);
    } });
    cue(st, 'quill', { dur: 1.5, gain: 0.5 }); }

  // 10 · everyone traded, but nobody owned the sea. : sails trade places; coins pop between them
  { const i = I(10), st = cut_(i), no = Wd('nobody', i) - st;
    add({ id: 'C2k', ch, at: st, year: 1498, note: 'sails swap places along the lanes; coins pop between; NO OWNER slip on "nobody"', draw(lt, d, t) {
      const pr = K.realMap(K.VIEWS.ocean); sails(pr, t + lt * 2.5);
      for (let k = 0; k < 4; k++) { const ph = (lt * 1.4 + k * 0.25) % 1; const [x, y] = pr([[60, 12], [70, 6], [80, 8], [50, 2]][k]); ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI); K.coin(x, y - ph * 60, 22); ctx.restore(); }
      if (lt > no) K.slip('THE SEA: NO OWNER', 540, 1300, eob(seg(lt, no, no + 0.3)), -0.02, 46);
    } });
    cue(st + 0.2, 'coins', { dur: 1.4, gain: 0.5 }); cue(st + no, 'pop', { gain: 0.4 }); }

  // 11 · The Portuguese wanted to own it. : one blue-cross sail grows, the others shrink back
  { const i = I(11), st = cut_(i), ow = Wd('own', i) - st;
    add({ id: 'C2l', ch, at: st, year: 1498, note: 'one blue-cross caravel grows in the middle of the ocean, the other sails shrink to their coasts', draw(lt, d, t) {
      const k = clamp((lt - ow + 0.2) / 0.8), pr = K.realMap(K.VIEWS.ocean, { seaTint: [P.royal, 0.22 * k] });
      sails(pr, t, { shrink: k }); const [x, y] = pr([66, 6]); K.caravel(x, y + 60, lerp(0.12, 0.5, eob(clamp((lt - ow + 0.4) / 0.7))), t);
    } });
    cue(st + ow - 0.2, 'zip', { gain: 0.6 }); cue(st + ow + 0.3, 'thud', { gain: 0.5 }); }

  // 12 · Da Gama sailed home with a cargo worth a fortune, : the laden caravel sails west
  { const i = I(12), st = cut_(i), fo = Wd('fortune', i) - st;
    add({ id: 'C2m', ch, at: st, note: 'sunset sea: the caravel, deck piled with sacks, sails west (left)', draw(lt, d, t) {
      const c = K.cam(lt, d, { x: 30 }, { x: -30, zoom: 1.04 });
      K.seascape({ t, c, night: 0.5, horizon: 960, sunX: 220, sunY: 470,
        mid: (tt) => { const x = lerp(820, 330, eio(clamp(lt / d))), y = K.waveY(x, 1080, tt, { amp: 16, len: 0.013, speed: 0.9, phase: 1 }) + 20; ctx.save(); ctx.translate(x, y); ctx.scale(-1, 1); K.caravel(0, 0, 0.7, tt); for (let k = 0; k < 5; k++) K.sack(-120 + k * 50, -60 - (k % 2) * 30, 0.22, { open: false }); ctx.restore(); } });
    } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(st, 'creak', { gain: 0.5 }); cue(st + fo, 'coins', { dur: 0.8, gain: 0.6 });
    // second cut: the cargo close-up (sacks of pepper piled on deck)
    const s2 = st + Wd('cargo', i) - st - 0.08;
    add({ id: 'C2m2', ch, at: s2, note: 'deck close-up: sacks of pepper piled high, A FORTUNE slip on "fortune"', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.08 }, { zoom: 1.0 }), f2 = fo - (s2 - st);
      K.layer(c, 0.3, () => { K.sky(0.5, 500, 260); for (let k = 0; k < 10; k++) K.cut(K.P_rr(-60, 1000 + k * 110, W + 120, 100, 0), k % 2 ? '#A88A5E' : '#B49668', { shadow: 0.2, edge: 3 }); });
      K.layer(c, 1.0, () => { [[300, 1400, 1.1], [620, 1420, 1.15], [460, 1180, 1.0], [800, 1200, 0.95]].forEach(([x, y, s], k) => K.sack(x, y, s * eob(clamp((lt - k * 0.12) / 0.35)), { open: k === 2 })); });
      if (lt > f2) K.slip('A FORTUNE', 540, 520, eob(seg(lt, f2, f2 + 0.3)), 0.03, 64);
    } }); }

  // 13 · because pepper that cost little in Kerala : the scale, one sack vs two coins
  { const i = I(13), st = cut_(i), li = Wd('little', i) - st;
    add({ id: 'C2n', ch, at: st, note: 'spice scale: one sack of pepper against two coins (cheap in Kerala)', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.06 });
      K.layer(c, 0.3, () => { K.parchment(15); K.slip('IN KERALA', 540, 330, eob(seg(lt, 0.1, 0.4)), -0.02, 50); });
      K.layer(c, 1.0, () => K.spiceScale(540, 1300, 1.05, -0.6 * eio(clamp(lt / 0.8)), () => K.sack(0, 0, 0.5), () => { K.coinStack(0, 0, 2, 50); }));
      if (lt > li) K.slip('CHEAP', 260, 760, eob(seg(lt, li, li + 0.3)), -0.05, 50);
    } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(st + 0.5, 'creak', { gain: 0.5 }); cue(st + li, 'coins', { dur: 0.5, gain: 0.5 }); }

  // 14 · sold for many times as much in Europe. : the coin stack grows tall and tips the scale
  { const i = I(14), st = cut_(i), ma = Wd('many', i) - st;
    add({ id: 'C2o', ch, at: st, note: 'IN EUROPE: the coin pan fills tall and the scale tips the other way on "many"', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.06 }, { zoom: 1.0, y: -40 });
      const n = 2 + 16 * eio(clamp((lt - ma + 0.1) / 1.2)), tilt = lerp(-0.6, 0.7, eio(clamp((lt - ma - 0.2) / 0.8)));
      K.layer(c, 0.3, () => { K.parchment(16); K.slip('IN EUROPE', 540, 330, 1, 0.02, 50); });
      K.layer(c, 1.0, () => K.spiceScale(540, 1300, 1.05, tilt, () => K.sack(0, 0, 0.5), () => K.coinStack(0, 0, n, 50)));
      if (lt > ma + 0.4) K.slip('MANY TIMES', 800, 560, eob(seg(lt, ma + 0.4, ma + 0.7)), 0.05, 50);
    } });
    cue(st + ma, 'coins', { dur: 1.4 }); cue(st + ma + 0.5, 'thud', { gain: 0.4 }); }
}
