// CH7 · "1632: The Fall": the Hooghly slave trade (said plainly, shown only as a broken chain on a ledger), Shah Jahan's
// siege, everything slipping (Spain's crown, Brazil, the route copied), the Dutch take Malabar, the Marathas take Bassein,
// and the governor's remark as a labelled paraphrase. No people suffering on screen.
import { ctx, W, H, clamp, lerp, seg, eo, eio, eob, rnd, line, circle } from '../core/lib.js';
import * as K from '../core/kit.js';
const { P } = K;
const MAL = { lon: 75.4, lat: 11.0, w: 6.5 };

/** the governor figure: sword in the front hand, cross in the back hand; drop 0..1 lets both fall; coins 0..1 bulge his pockets */
function governor(lt, t, { drop = 0, coins = 0 } = {}) {
  const x = 540, y = 1500, h = 900, s = h / 640, a2 = 80, ang = (10 + a2) * Math.PI / 180;
  ctx.save(); ctx.translate(0, coins * 10); K.person({ role: 'sailor', x, y, h, arm: drop > 0 ? lerp(70, 10, eo(drop)) : 70, arm2: drop > 0 ? lerp(a2, 0, eo(drop)) : a2, prop: drop > 0.2 ? 'none' : 'sword', t }); ctx.restore();
  if (coins > 0) for (let k = 0; k < 9; k++) { const c = clamp(coins * 9 - k); if (c <= 0) continue; K.coin(x - 100 + (k % 5) * 50, y - 262 * s + 40 - Math.floor(k / 5) * 40 + (1 - eob(c)) * -60, 26 * s * 0.6); }
  if (drop <= 0.2) { const hx = x + (-30 - Math.sin(ang) * 216) * s, hy = y + (-440 + Math.cos(ang) * 216) * s; ctx.save(); ctx.translate(hx, hy); ctx.scale(s, s); K.drawProp('cross', t); ctx.restore(); }
  else { const f = eio(clamp((drop - 0.2) / 0.8)); ctx.save(); ctx.translate(x + 200, lerp(900, 1480, f)); ctx.rotate(f * 1.4); ctx.scale(s, s); K.drawProp('sword', t); ctx.restore(); ctx.save(); ctx.translate(x - 220, lerp(950, 1490, f)); ctx.rotate(-f * 1.3); ctx.scale(s, s); K.drawProp('cross', t); ctx.restore(); }
}

export default function (B) {
  const { add, cue, cut_, Wd, L, Le, i0 } = B, ch = 7, I = (k) => i0 + k;

  // 0 · The worst blow came in Bengal. : map, Bengal and Hooghly
  { const i = I(0), st = cut_(i), be = Wd('bengal', i) - st;
    add({ id: 'C7a', ch, at: st, year: 1632, note: 'India map pushes in to Bengal; Hooghly pinned', draw(lt, d, t) {
      const pr = K.realMap(K.lerpView(K.VIEWS.india, K.VIEWS.bengal, eio(clamp(lt / d)))); if (lt > be) K.pin(pr, 'HOOGHLY', { side: 'up', sc: eob(seg(lt, be, be + 0.3)), size: 48 });
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(st + be, 'pop', { gain: 0.5 }); }

  // 1 · At Hooghly, | Portuguese traders ran a cruel slave trade, (two cuts)
  { const i = I(1), st = cut_(i), ra = Wd('ran', i) - st;
    add({ id: 'C7b', ch, at: st, year: 1632, note: 'the Hooghly river port, Portuguese flag over the warehouses', draw(lt, d, t) {
      const c = K.cam(lt, d, { x: 30 }, { x: -30, zoom: 1.05 }); K.layer(c, 1, () => K.hooghlyPort(t)); K.slip('HOOGHLY', 540, 420, eob(seg(lt, 0.1, 0.4)), -0.02, 52); } });
    const s2 = st + ra - 0.08;
    add({ id: 'C7c', ch, at: s2, year: 1632, note: 'a trader\'s ledger page; a broken chain draws across it (the slave trade, as a symbol)', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.06 }, { zoom: 1.0 }); K.layer(c, 0.3, () => K.parchment(33)); K.layer(c, 1, () => K.ledger(540, 900, 1.25, clamp((lt - 0.4) / 0.8))); } });
    cue(st, 'waves', { dur: 1.6, gain: 0.4 }); cue(s2 + 0.4, 'slam', { gain: 0.35 }); }

  // 2 · seizing Hindu and Muslim children, : the broken chain on the ledger, close
  { const i = I(2), st = cut_(i);
    add({ id: 'C7d', ch, at: st, year: 1632, note: 'close on the ledger: the broken chain, a crimson line under it', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.4 }, { zoom: 1.5 }); K.layer(c, 1, () => { K.parchment(33); K.ledger(540, 900, 1.25, 1); line([[300, 1010], [780, 1010]], P.crimson, 6); }); } }); }

  // 3 · and, chroniclers say, | even took two slave girls of Empress Mumtaz Mahal. (two cuts)
  { const i = I(3), st = cut_(i), tw = Wd('two', i) - st;
    add({ id: 'C7e', ch, at: st, year: 1632, note: 'a Mughal chronicle opens; a quill writes', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.06 }); K.layer(c, 0.3, () => K.parchment(34)); K.layer(c, 1, () => { for (const sd of [-1, 1]) K.cut(K.P_rr(540 + (sd < 0 ? -420 : 0), 600, 420, 620, 6), P.edge, { shadow: 0.8, edge: 0 }); for (let k = 0; k < 9; k++) line([[160, 680 + k * 56], [470 - (k % 3) * 40, 680 + k * 56]], 'rgba(62,44,30,0.45)', 6); K.quill(620 + 260 * clamp(lt / d), 700, 0.8, t); });
      K.slip('THE CHRONICLES', 540, 420, eob(seg(lt, 0.1, 0.4)), -0.02, 48);
    } });
    const s2 = st + tw - 0.08;
    add({ id: 'C7f', ch, at: s2, year: 1632, note: 'the Mughal seal over an empty palace doorway with two empty cushions', draw(lt, d, t) {
      K.mughalArch(t); K.cut(K.P_rr(330, 1380, 160, 60, 20), P.wine, { shadow: 0.5, edge: 3 }); K.cut(K.P_rr(590, 1380, 160, 60, 20), P.wine, { shadow: 0.5, edge: 3 });
      K.seal(540, 760, eob(clamp((lt - 0.2) / 0.3)) * 0.9, 'M'); K.slip('EMPRESS MUMTAZ MAHAL', 540, 420, eob(seg(lt, 0.4, 0.7)), -0.02, 44);
    } });
    cue(st + 0.2, 'quill', { dur: 1.2, gain: 0.5 }); cue(s2 + 0.2, 'seal'); }

  // 4 · In 1632, Shah Jahan's army | besieged Hooghly, (two cuts)
  { const i = I(4), st = cut_(i), bs = Wd('besieged', i) - st;
    add({ id: 'C7g', ch, at: st, year: 1632, note: 'Shah Jahan (green, grey beard) raises his seal; ribbon 1632', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.06 }); K.layer(c, 0.5, () => K.mughalArch(t)); K.layer(c, 1, () => K.person({ role: 'shahjahan', x: 480, y: 1500, h: 720, arm: lerp(20, 80, eob(clamp((lt - 0.3) / 0.4))), prop: 'seal', t }));
      K.ribbon('1632', 540, 400, eob(seg(lt, 0.1, 0.45)), 96); K.slip('SHAH JAHAN', 540, 580, eob(seg(lt, 0.4, 0.7)), 0.02, 48);
    } });
    const s2 = st + bs - 0.08;
    add({ id: 'C7h', ch, at: s2, year: 1632, note: 'green Mughal tents ring the Hooghly port one by one (no fighting)', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.04 }, { zoom: 1.0 }); K.layer(c, 1, () => K.hooghlyPort(t, { tents: clamp(lt / (d * 0.8)) })); } });
    cue(st + 0.1, 'pop', { gain: 0.4 }); for (let k = 0; k < 7; k++) cue(s2 + k * 0.22, 'thud', { gain: 0.25 }); }

  // 5 · and three months later, | the Portuguese were gone from Bengal. (two cuts)
  { const i = I(5), st = cut_(i), po = Wd('portuguese', i) - st;
    add({ id: 'C7i', ch, at: st, year: 1632, note: 'a calendar flips three months: JUNE, JULY, AUGUST, SEPTEMBER', draw(lt, d, t) {
      K.parchment(35); K.calendar(540, 900, 1.4, ['JUNE', 'JULY', 'AUG', 'SEPT'], clamp(lt / (d * 0.9)) * 3); } });
    const s2 = st + po - 0.08;
    add({ id: 'C7j', ch, at: s2, year: 1632, note: 'the Portuguese flag slides down the pole over the empty port', draw(lt, d, t) {
      K.hooghlyPort(t, { tents: 1, flagLower: eio(clamp(lt / (d * 0.9))) }); K.slip('GONE FROM BENGAL', 540, 420, eob(seg(lt, d * 0.5, d * 0.5 + 0.3)), -0.02, 48); } });
    for (let k = 0; k < 3; k++) cue(st + 0.4 + k * 0.5, 'rustle', { gain: 0.4 }); cue(s2 + 0.2, 'slide', { dur: 1.2, gain: 0.4 }); }

  // 6 · Everything else was slipping too. : the ocean map tilts, the blue pins slide
  { const i = I(6), st = cut_(i);
    add({ id: 'C7k', ch, at: st, year: 1632, note: 'the ocean map tilts; the Portuguese forts slide toward the edge', draw(lt, d, t) {
      const k = eio(clamp(lt / d)); ctx.save(); ctx.translate(540, 960); ctx.rotate(k * 0.06); ctx.translate(-540, -960); const pr = K.realMap(K.VIEWS.ocean);
      ['HORMUZ', 'DIU', 'GOA', 'COCHIN', 'MALACCA'].forEach((n, j) => { const [x, y] = pr(n); K.fortIcon(x + k * k * 90 * (1 + j * 0.3), y + k * k * 140 * (1 + j * 0.2), 0.8, P.royal); }); ctx.restore();
    } });
    cue(st + 0.3, 'slide', { dur: 1.6, gain: 0.5 }); }

  // 7 · Portugal's crown had passed to Spain, : the Portuguese crown slides under the Spanish one
  { const i = I(7), st = cut_(i), sp = Wd('spain', i) - st;
    add({ id: 'C7l', ch, at: st, year: 1632, note: 'the Spanish crown slides down onto the Portuguese crown on "Spain"', draw(lt, d, t) {
      K.parchment(36); const k = eio(clamp((lt - sp + 0.5) / 0.7)); K.crown(540, 1100, 1.6, 'portugal'); K.crown(lerp(1300, 540, k), lerp(500, 900, k), 1.8, 'spain', (1 - k) * 0.4);
      K.slip('PORTUGAL', 300, 1300, 1, -0.03, 44); if (lt > sp) K.slip('SPAIN', 800, 620, eob(seg(lt, sp, sp + 0.3)), 0.03, 44);
    } });
    cue(st + sp, 'thud', { gain: 0.5 }); }

  // 8 · dragging it into Spain's wars, : smoke on a far horizon, a Spanish-flag ship
  { const i = I(8), st = cut_(i);
    add({ id: 'C7m', ch, at: st, year: 1632, note: 'far horizon: smoke columns, a ship under the Spanish flag (no fighting shown)', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.06 }); K.seascape({ t, c, night: 0.5, horizon: 980, far: (tt) => { for (let k = 0; k < 3; k++) K.smokeColumn(200 + k * 320, 990, 0.6, tt + k, 0.8); }, mid: (tt) => K.flagShip(560, 1110, 0.6, tt, 'spain') });
    } });
    cue(st + 0.2, 'cannon', { gain: 0.35 }); }

  // 9 · Brazil was now worth more than India, : the map swings west, coins roll to Brazil
  { const i = I(9), st = cut_(i);
    add({ id: 'C7n', ch, at: st, year: 1632, note: 'the map swings west to the Atlantic; coins roll from India toward Brazil', draw(lt, d, t) {
      const k = eio(clamp(lt / (d * 0.7))), pr = K.realMap(K.lerpView(K.VIEWS.route, K.VIEWS.brazil, k)); K.pin(pr, 'BRAZIL', { side: 'up', sc: eob(seg(lt, 0.4, 0.7)), size: 48 });
      for (let j = 0; j < 6; j++) { const p = clamp((lt - 0.3 - j * 0.15) / 1.3); if (p <= 0) continue; const a = pr([72, 12]), b = pr([-46, -10]); K.coin(lerp(a[0], b[0], eio(p)), lerp(a[1], b[1], eio(p)) - Math.abs(Math.sin(p * 9)) * 30, 24); }
    } });
    cue(st + 0.3, 'coins', { dur: 1.6, gain: 0.5 }); }

  // 10 · and the sea route was no longer a secret. : the route map is copied onto Dutch and English paper
  { const i = I(10), st = cut_(i), se = Wd('secret', i) - st;
    add({ id: 'C7o', ch, at: st, year: 1632, note: 'the crimson route map, then copies slide out under Dutch and English flags', draw(lt, d, t) {
      K.parchment(37); const card = (x, y, s, r, fk) => { ctx.save(); ctx.translate(x, y); ctx.rotate(r); ctx.scale(s, s); K.cut(K.P_rr(-300, -460, 600, 920, 6), P.edge, { shadow: 0.9, edge: 0 }); ctx.save(); ctx.beginPath(); ctx.rect(-280, -440, 560, 880); ctx.clip(); ctx.scale(0.5, 0.5); ctx.translate(-540, -960); const pr = K.realMap(K.VIEWS.route, { frame: false, compassAt: false }); K.placeRoute(pr, K.SEA_ROUTE, 1); ctx.restore(); if (fk) K.flag(200, 520, fk, t, 0.5, { h: 300 }); ctx.restore(); };
      const k = eio(clamp((lt - 0.3) / 0.9)); card(lerp(540, 300, k), 900, 0.9, lerp(0, -0.12, k), k > 0.1 ? 'dutch' : null); card(lerp(540, 780, k), 920, 0.9, lerp(0, 0.12, k), k > 0.1 ? 'england' : null); card(540, 880, 0.95, 0, null);
      if (lt > se) K.slip('NO LONGER A SECRET', 540, 360, eob(seg(lt, se, se + 0.3)), -0.02, 46);
    } });
    cue(st + 0.3, 'rustle', { gain: 0.5 }); cue(st + 0.6, 'rustle', { gain: 0.4 }); }

  // 11 · By 1663, the Dutch had taken | every Portuguese fort on the Malabar coast. (two cuts)
  { const i = I(11), st = cut_(i), ev = Wd('every', i) - st;
    add({ id: 'C7p', ch, at: st, year: 1663, note: 'Dutch ships (orange-white-blue) sail in; ribbon 1663', draw(lt, d, t) {
      const c = K.cam(lt, d, { x: 30 }, { x: -30, zoom: 1.05 }); K.seascape({ t, c, night: 0.15, horizon: 960, mid: (tt) => { for (let k = 0; k < 3; k++) K.flagShip(lerp(1200, 300, eio(clamp(lt / d))) + k * 260, 1090 + (k % 2) * 30, 0.42, tt + k, 'dutch'); } });
      K.ribbon('1663', 540, 400, eob(seg(lt, 0.1, 0.45)), 96); K.slip('THE DUTCH', 540, 580, eob(seg(lt, 0.5, 0.8)), 0.02, 50);
    } });
    const s2 = st + ev - 0.08;
    add({ id: 'C7q', ch, at: s2, year: 1663, note: 'Malabar map: the forts at Cannanore, Calicut coast and Cochin flip from royal blue to Dutch orange one by one', draw(lt, d, t) {
      const pr = K.realMap(MAL); [['CANNANORE', 0], ['COCHIN', 1]].forEach(([n, k]) => { const f = clamp((lt - 0.4 - k * 0.6) / 0.25); const [x, y] = pr(n); ctx.save(); ctx.translate(x, y); ctx.scale(1, Math.abs(Math.cos(f * Math.PI)) || 0.05); K.fortIcon(0, 0, 1.2, f < 0.5 ? P.royal : P.orange); ctx.restore(); K.pin(pr, n, { side: 'left', text: n, r: 0.1, dx: -40 }); });
      K.slip('MALABAR COAST', 540, 420, eob(seg(lt, 0.1, 0.4)), -0.02, 46);
    } });
    cue(st, 'waves', { dur: 2, gain: 0.4 }); cue(s2 + 0.5, 'pop', { gain: 0.5 }); cue(s2 + 1.1, 'pop', { gain: 0.5 }); }

  // 12 · In 1739, | the Marathas took Bassein. (two cuts)
  { const i = I(12), st = cut_(i), mr = Wd('marathas', i) - st;
    add({ id: 'C7r', ch, at: st, year: 1739, note: 'Gujarat-Konkan map: Bassein pinned; ribbon 1739', draw(lt, d, t) {
      const pr = K.realMap(K.VIEWS.gujarat); K.ribbon('1739', 540, 400, eob(seg(lt, 0.1, 0.45)), 96); K.pin(pr, 'BASSEIN', { side: 'right', color: P.royal, sc: eob(seg(lt, 0.3, 0.6)), size: 46 }); } });
    const s2 = st + mr - 0.08;
    add({ id: 'C7s', ch, at: s2, year: 1739, note: 'Bassein fort: the Portuguese flag lowers, the saffron Maratha flag rises; a Maratha soldier stands by', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.05 }); K.layer(c, 0.2, () => { K.sky(0.2, 420, 820); K.wave(1250, t, { color: P.seaDark }); });
      K.layer(c, 1, () => { K.cut(K.P_rr(-300, 1240, W + 600, 900, 0), '#C9A878', { shadow: 0.5, edge: 5 }); K.cut(K.P_rr(100, 1000, 880, 260, 4), P.stone, { shadow: 0.6, edge: 5 }); for (let k = 0; k < 11; k++) K.cut(K.P_rr(100 + k * 82, 966, 56, 40, 3), P.stone, { shadow: 0, edge: 3 });
        const sw = eio(clamp((lt - 0.2) / 1.2)); K.flag(380, 1000, 'portugal', t, 1, { lower: sw, h: 560 }); K.flag(680, 1000, 'maratha', t, 1, { lower: 1 - sw, h: 560 }); K.person({ role: 'maratha', x: 860, y: 1500, h: 560, dir: -1, t }); });
      K.slip('BASSEIN', 540, 420, eob(seg(lt, 0.2, 0.5)), -0.02, 50);
    } });
    cue(st + 0.1, 'pop', { gain: 0.4 }); cue(s2 + 0.2, 'slide', { dur: 1.2, gain: 0.5 }); }

  // 13 · One Portuguese governor put it best: : a slip with the speaker
  { const i = I(13), st = cut_(i);
    add({ id: 'C7t', ch, at: st, year: 1739, note: 'parchment: slip AS ONE PORTUGUESE GOVERNOR PUT IT (paraphrase follows)', draw(lt, d, t) {
      K.parchment(38); K.torn('As one Portuguese governor put it...', 540, 880, eob(seg(lt, 0.1, 0.4)), -0.02, 56); K.quill(900, 1180, 0.8, t); } });
    cue(st + 0.1, 'quill', { dur: 1.4, gain: 0.5 }); }

  // 14 · they came with a sword in one hand and a cross in the other, : the paper figure holds both
  { const i = I(14), st = cut_(i);
    add({ id: 'C7u', ch, at: st, year: 1739, note: 'a paper figure holds a sword in one hand and a cross in the other', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.05 }); K.layer(c, 0.3, () => K.parchment(39)); K.layer(c, 1, () => governor(lt, t)); } }); }

  // 15 · filled their pockets with gold, : coins bulge from his pockets
  { const i = I(15), st = cut_(i), go = Wd('gold', i) - st;
    add({ id: 'C7v', ch, at: st, year: 1739, note: 'coins pile into his pockets and weigh him down', draw(lt, d, t) {
      K.parchment(39); governor(lt, t, { coins: clamp((lt - 0.1) / (d * 0.8)) }); } });
    cue(st + 0.2, 'coins', { dur: 1.2 }); }

  // 16 · and grew too heavy to hold either. : he drops both; the paraphrase slip, labelled
  { const i = I(16), st = cut_(i), he = Wd('heavy', i) - st;
    add({ id: 'C7w', ch, at: st, year: 1739, note: 'he drops the sword and the cross; the slip: paraphrase · de Souza', draw(lt, d, t) {
      K.parchment(39); governor(lt, t, { coins: 1, drop: clamp((lt - he) / 0.7) }); K.quoteSlip('Too heavy with gold to hold either.', 'de Souza', 540, 400, eob(seg(lt, 0.2, 0.5)), 52);
    } });
    cue(st + he + 0.4, 'thud', { gain: 0.5 }); cue(st + he + 0.55, 'thud', { gain: 0.4 }); }
}
