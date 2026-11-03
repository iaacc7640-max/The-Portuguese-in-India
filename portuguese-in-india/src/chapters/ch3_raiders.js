// CH3 · "1500: Traders Become Raiders": Cabral's trading post, the attack (shown by objects only), Cabral's reprisal
// (far-off smoke, a cannon puff), friends in Cochin and Cannanore, the refused demand, the post that grows into a fort.
// Violence rule: no fighting, no bodies. Consequences only: a slammed door, a torn flag, empty stools, smoke on the horizon.
import { ctx, W, H, clamp, lerp, seg, eo, eio, eob, rnd, line, circle } from '../core/lib.js';
import * as K from '../core/kit.js';
const { P } = K;
const SIL = '#1E2236';
const MAL = { lon: 75.4, lat: 11.0, w: 6.5 };                 // close Malabar view: Cannanore, Calicut, Cochin

/** the Calicut beach with the Portuguese post: grow 0..2 (hut -> walls -> towers), night, door 0..1 (shut), torn flag */
function postScene(lt, d, t, { grow = 0, night = 0, door = 0, torn = 0, c = null, extra = null } = {}) {
  c = c || K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.06 });
  K.layer(c, 0.15, () => K.sky(night * 0.6, 420, 800));
  K.layer(c, 0.4, () => { K.wave(1000, t, { amp: 8, len: 0.02, speed: 0.6, color: P.seaDark, shadow: 0.3 }); for (let k = 0; k < 5; k++) K.palm(-60 + k * 70, 1050, 0.3, t + k); for (let k = 0; k < 4; k++) K.palm(880 + k * 70, 1060, 0.32, t + k); });
  K.layer(c, 0.8, () => { K.cut(K.P_rr(-1100, 1060, W + 2200, 1000, 0), '#D8C08E', { shadow: 0.3, edge: 5 }); K.factoryFort(540, 1360, 0.9, grow, t, { tornFlag: torn });
    if (door > 0 && grow < 0.5) { const k = eo(clamp(door)); K.cut(K.P_rr(540 - 54, 1360 - 171, 108 * lerp(0.15, 1, k), 171, 2), '#6E4E30', { shadow: 0.3, edge: 3 }); } extra && extra(); });
  K.nightWash(clamp((night - 0.5) / 0.5) * 0.9, 4);
}
/** a cut-paper scroll that tears into two halves: tear 0..1 */
function tearScroll(x, y, s, tear, text) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const k = eo(clamp(tear));
  for (const sd of [-1, 1]) { ctx.save(); ctx.translate(sd * k * 120, k * 80); ctx.rotate(sd * k * 0.3);
    ctx.beginPath(); ctx.moveTo(0, -300); for (let i = 0; i <= 12; i++) ctx.lineTo((rnd(i) - 0.5) * 30, -300 + i * 50); ctx.lineTo(sd * 260, 300); ctx.lineTo(sd * 260, -300); ctx.closePath(); ctx.save(); ctx.clip();
    K.cut(K.P_rr(-260, -300, 520, 600, 8), P.edge, { shadow: 0.8, edge: 0 }); ctx.font = '700 52px Caladea'; ctx.textAlign = 'center'; ctx.fillStyle = P.ink;
    text.forEach((tx, j) => ctx.fillText(tx, 0, -150 + j * 90)); K.seal(150, 200, 0.6, 'P'); ctx.restore(); ctx.restore(); }
  ctx.restore();
}

export default function (B) {
  const { add, cue, cut_, Wd, L, Le, i0 } = B, ch = 3, I = (k) => i0 + k;

  // 0 · The next fleet, under Pedro Cabral, : Cabral on deck, the fleet behind
  { const i = I(0), st = cut_(i), ca = Wd('cabral', i) - st;
    add({ id: 'C3a', ch, at: st, year: 1500, note: 'Cabral (helmet, red sash) at the rail; a fleet of caravels behind', draw(lt, d, t) {
      const c = K.cam(lt, d, { x: 30 }, { x: -30, zoom: 1.05 });
      K.seascape({ t, c, night: 0.1, horizon: 900, far: (tt) => { for (let k = 0; k < 5; k++) K.caravel(120 + k * 210, 930 + (k % 2) * 20, 0.2, tt + k); },
        fore: () => { K.cut(K.P_rr(-1100, 1380, W + 2200, 700, 0), P.sepia, { shadow: 0.6, edge: 5 }); for (let k = 0; k < 9; k++) K.cut(K.P_rr(-40 + k * 140, 1300, 26, 110, 6), '#6E4E30', { shadow: 0.4, edge: 3 }); K.cut(K.P_rr(-1100, 1290, W + 2200, 30, 8), '#6E4E30', { shadow: 0.4, edge: 3 }); K.person({ role: 'cabral', x: 560, y: 1520, h: 820, arm: 15, t }); } });
      if (lt > ca) K.slip('PEDRO CABRAL', 540, 420, eob(seg(lt, ca, ca + 0.3)), -0.03, 56);
    } });
    cue(st, 'whoosh'); cue(st, 'waves', { dur: 3, gain: 0.5 }); cue(st + ca, 'pop', { gain: 0.5 }); }

  // 1 · set up a trading post in Calicut in 1500. : the thatched post with its flag, ribbon 1500
  { const i = I(1), st = cut_(i), hu = Wd('hundred', i) - st;
    add({ id: 'C3b', ch, at: st, year: 1500, note: 'the Portuguese trading post on the Calicut beach; ribbon 1500 on "hundred"', draw(lt, d, t) {
      postScene(lt, d, t, { grow: 0 }); K.slip('TRADING POST · CALICUT', 540, 560, eob(seg(lt, 0.2, 0.5)), -0.02, 44); K.ribbon('1500', 540, 400, eob(seg(lt, hu - 0.4, hu)), 96);
    } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(st + 0.3, 'thud', { gain: 0.3 }); cue(st + hu - 0.4, 'pop', { gain: 0.5 }); }

  // 2 · Locals attacked it, : the door slams shut (no people)
  { const i = I(2), st = cut_(i), at = Wd('attacked', i) - st;
    add({ id: 'C3c', ch, at: st, year: 1500, note: 'the post door slams shut on "attacked"; the flag jolts', draw(lt, d, t) {
      const sh = lt > at && lt < at + 0.3 ? Math.sin((lt - at) * 60) * 8 : 0; ctx.save(); ctx.translate(sh, 0);
      postScene(lt, d, t, { grow: 0, night: 0.45, door: clamp((lt - at) / 0.15), torn: clamp((lt - at) / 0.4) * 0.5, c: K.cam(lt, d, { zoom: 1.1 }, { zoom: 1.18, y: 60 }) }); ctx.restore();
    } });
    cue(st + at, 'slam'); }

  // 3 · and several Portuguese died. : torn flag, empty stools, a dropped cap
  { const i = I(3), st = cut_(i);
    add({ id: 'C3d', ch, at: st, year: 1500, note: 'dusk, quiet: torn flag, two empty stools, a dropped sailor cap in the sand', draw(lt, d, t) {
      postScene(lt, d, t, { grow: 0, night: 0.55, door: 1, torn: 1, c: K.cam(lt, d, { zoom: 1.12, y: 40 }, { zoom: 1.08, y: 30 }), extra: () => {
        for (const x of [250, 840]) { K.cut(K.P_rr(x - 50, 1400, 100, 20, 6), '#6E4E30', { shadow: 0.5, edge: 3 }); for (const dx of [-40, 34]) K.cut(K.P_rr(x + dx, 1418, 12, 70, 4), '#6E4E30', { shadow: 0.3, edge: 2 }); }
        K.cut(() => { ctx.beginPath(); ctx.ellipse(640, 1520, 60, 26, 0.3, Math.PI, Math.PI * 2); ctx.closePath(); }, P.white, { shadow: 0.5, edge: 3 }); } });
    } });
    cue(st, 'wind', { dur: 2.4, gain: 0.6 }); }

  // 4 · Cabral struck back: : night, the caravel silhouette turns toward the city
  { const i = I(4), st = cut_(i);
    add({ id: 'C3e', ch, at: st, year: 1500, note: 'night: a caravel silhouette turns its broadside toward the shore', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.08 }), k = eio(clamp(lt / d));
      K.seascape({ t, c, night: 1, horizon: 980, mid: (tt) => { ctx.save(); ctx.translate(560, 1110); ctx.scale(lerp(1, -1, k) || 0.01, 1); K.caravel(0, 0, 0.75, tt, { sil: SIL }); ctx.restore(); } });
    } });
    cue(st, 'creak', { gain: 0.6 }); cue(st + 0.3, 'waves', { dur: 2, gain: 0.5 }); }

  // 5 · he burned Arab ships in the harbour : far dhow silhouettes, orange glow and smoke on the horizon
  { const i = I(5), st = cut_(i), bu = Wd('burned', i) - st;
    add({ id: 'C3f', ch, at: st, year: 1500, note: 'far horizon at night: dhow silhouettes, orange glow and smoke rising (no people)', draw(lt, d, t) {
      const c = K.cam(lt, d, { x: 20 }, { x: -20, zoom: 1.05 }), g = clamp((lt - bu + 0.2) / 0.8);
      K.seascape({ t, c, night: 1, horizon: 1000, far: (tt) => { for (let k = 0; k < 4; k++) K.dhow(260 + k * 180, 1010, 0.28, tt + k, { sil: SIL }); },
        lights: () => { K.glow(540, 980, 420 * g, '#E0782E', 0.55 * g); for (let k = 0; k < 3; k++) K.smokeColumn(340 + k * 200, 960, 0.7, t + k, g * 0.8); } });
    } });
    cue(st + bu, 'sizzle', { dur: 2, gain: 0.4 }); }

  // 6 · and turned his cannons on the city. : a cannon with a crimson-tinted puff, the city roofs far off
  { const i = I(6), st = cut_(i), cn = Wd('cannons', i) - st;
    add({ id: 'C3g', ch, at: st, year: 1500, note: 'a ship cannon fires a crimson-tinted puff toward far city roofs (muffled)', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.06 }, { zoom: 1.0 });
      K.layer(c, 0.2, () => { K.sky(0.7, 400, 820); for (let k = 0; k < 8; k++) K.cut(K.P_poly([[k * 140 - 20, 1000], [k * 140 + 50, 930 - (k % 3) * 20], [k * 140 + 120, 1000]]), SIL, { shadow: 0, edge: 0 }); K.wave(1000, t, { amp: 8, color: P.seaDark }); });
      K.nightWash(0.75, 6);
      K.layer(c, 0.6, () => { K.glow(500, 960, 300, '#E0782E', 0.4); K.smokeColumn(420, 950, 0.5, t, 0.6); });
      K.layer(c, 1, () => { K.cut(K.P_rr(-1100, 1250, W + 2200, 900, 0), '#4A3A2E', { shadow: 0.5, edge: 5 }); K.cut(K.P_rr(-1100, 1180, W + 2200, 90, 10), '#5E4836', { shadow: 0.4, edge: 4 }); K.cannon(700, 1150, 1.3, -1, lt > cn ? clamp((lt - cn) / 1.2) : -1); });
    } });
    cue(st + cn, 'cannon'); }

  // 7 · Then he sailed south, | and made friends with Calicut's rivals, (two cuts)
  { const i = I(7), st = cut_(i), mf = Wd('made', i) - st;
    add({ id: 'C3h', ch, at: st, year: 1500, note: 'Malabar map: the caravel slides south from Calicut', draw(lt, d, t) {
      const pr = K.realMap(MAL); K.pin(pr, 'CALICUT', { side: 'left' }); const [ax, ay] = pr([75.2, 11.2]), [bx, by] = pr([75.8, 10.1]), k = eio(clamp(lt / d));
      K.caravel(lerp(ax, bx, k), lerp(ay, by, k), 0.2, t); } });
    const s2 = st + mf - 0.08;
    add({ id: 'C3i', ch, at: s2, year: 1500, note: 'two hands shake on a slip: Portugal blue and the rival king', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.08 }); K.layer(c, 0.3, () => K.parchment(21));
      K.layer(c, 1, () => { const k = eob(clamp(lt / 0.5)); for (const sd of [-1, 1]) { ctx.save(); ctx.translate(540 + sd * lerp(300, 70, k), 900); ctx.scale(sd, 1); K.cut(K.P_rr(-420, -50, 360, 100, 40), sd < 0 ? P.royal : P.forest, { shadow: 0.7, edge: 5 }); K.cut(K.P_circ(-50, 0, 70), sd < 0 ? P.skin : P.skinD, { shadow: 0.5, edge: 4 }); ctx.restore(); } });
      K.slip("CALICUT'S RIVALS", 540, 520, eob(seg(lt, 0.2, 0.5)), -0.02, 50);
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(s2 + 0.3, 'thud', { gain: 0.4 }); }

  // 8 · Cochin and Cannanore. : the two rival ports pinned, a small blue flag at each
  { const i = I(8), st = cut_(i), co = Wd('cochin', i) - st, cn = Wd('kanna', i) - st;
    add({ id: 'C3j', ch, at: st, year: 1500, note: 'Malabar map: Cochin and Cannanore pinned in royal blue, Calicut stays forest green', draw(lt, d, t) {
      const pr = K.realMap(MAL); K.pin(pr, 'CALICUT', { side: 'left', color: P.forest });
      K.pin(pr, 'COCHIN', { side: 'left', color: P.royal, sc: eob(seg(lt, co, co + 0.3)) }); if (lt > cn) K.pin(pr, 'CANNANORE', { side: 'left', color: P.royal, sc: eob(seg(lt, cn, cn + 0.3)) });
    } });
    cue(st + co, 'pop', { gain: 0.5 }); cue(st + cn, 'pop', { gain: 0.5 }); }

  // 9 · When da Gama returned, : his blue sail on the horizon again (1502)
  { const i = I(9), st = cut_(i), re = Wd('returned', i) - st;
    add({ id: 'C3k', ch, at: st, year: 1502, note: 'day sea: a blue-cross sail grows on the horizon; ribbon 1502', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.08 }), k = eio(clamp(lt / d));
      K.seascape({ t, c, night: 0.15, horizon: 960, mid: (tt) => K.caravel(lerp(820, 600, k), 1080, lerp(0.25, 0.7, k), tt) });
      K.ribbon('1502', 540, 420, eob(seg(lt, re, re + 0.35)), 96);
    } });
    cue(st + re, 'pop', { gain: 0.5 }); }

  // 10 · and demanded that the Zamorin | expel every Arab trader, (two cuts)
  { const i = I(10), st = cut_(i), ex = Wd('expel', i) - st;
    add({ id: 'C3l', ch, at: st, year: 1502, note: 'court: da Gama holds out a demand scroll to the Zamorin', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.04 }, { zoom: 1.1, x: 20 }); K.layer(c, 0.5, () => K.calicutCourt(t));
      K.layer(c, 1, () => { K.person({ role: 'bearer', x: 780, y: 1430, h: 520, arm: 165, dir: -1, t }); K.person({ role: 'zamorin', x: 660, y: 1450, h: 580, dir: -1, t }); K.person({ role: 'gama', x: 260, y: 1460, h: 580, arm: lerp(10, 70, eob(clamp(lt / 0.5))), prop: 'scroll', t }); }); } });
    const s2 = st + ex - 0.08;
    add({ id: 'C3m', ch, at: s2, year: 1502, note: 'the demand on a scroll: EXPEL EVERY ARAB TRADER', draw(lt, d, t) {
      K.parchment(22); tearScroll(540, 900, lerp(0.9, 1.0, eo(clamp(lt / 0.6))), 0, ['THE DEMAND', '', 'expel every', 'Arab trader']); } });
    cue(st + 0.3, 'rustle', { gain: 0.5 }); cue(s2, 'quill', { dur: 1 }); }

  // 11 · the Zamorin refused, : he shakes his head; the scroll tears in two
  { const i = I(11), st = cut_(i), rf = Wd('refused', i) - st;
    add({ id: 'C3n', ch, at: st, year: 1502, note: 'the Zamorin turns his head away, the demand scroll tears in two on "refused"', draw(lt, d, t) {
      K.calicutCourt(t); const sh = lt > rf - 0.3 && lt < rf + 0.5 ? (Math.sin((lt - rf) * 20) > 0 ? 1 : -1) : 1;
      K.person({ role: 'bearer', x: 330, y: 1430, h: 540, arm: 165, t }); K.person({ role: 'zamorin', x: 540, y: 1450, h: 620, dir: sh, arm: 20, t });
      tearScroll(820, 1000, 0.5, clamp((lt - rf) / 0.5), ['expel every', 'Arab trader']);
    } });
    cue(st + rf, 'rustle', { gain: 0.7 }); }

  // 12 · and the trading posts quietly grew walls and guns. : the hut grows stone walls, a cannon peeks out
  { const i = I(12), st = cut_(i), wa = Wd('walls', i) - st;
    add({ id: 'C3o', ch, at: st, year: 1502, note: 'the post grows stone walls on "walls", a cannon appears on the wall', draw(lt, d, t) {
      const g = eio(clamp((lt - wa + 0.3) / 1.0)); postScene(lt, d, t, { grow: g, extra: () => { if (g > 0.8) K.cannon(760, 1360 - 320 * 0.9 - 10, 0.5 * eob(clamp((g - 0.8) * 5)), 1); } });
    } });
    for (let k = 0; k < 4; k++) cue(st + wa - 0.2 + k * 0.2, 'thud', { gain: 0.3 }); }

  // 13 · In 1503, the first Portuguese fort | rose at Cochin. (two cuts)
  { const i = I(13), st = cut_(i), fo = Wd('fort', i) - st, co = Wd('cochin', i) - st;
    add({ id: 'C3p', ch, at: st, year: 1503, note: 'walls grow towers and a gate: the first fort; ribbon 1503', draw(lt, d, t) {
      postScene(lt, d, t, { grow: 1 + eio(clamp(lt / (d * 0.9))) }); K.ribbon('1503', 540, 400, eob(seg(lt, 0.1, 0.45)), 100); } });
    const s2 = st + fo + 0.3;
    add({ id: 'C3q', ch, at: s2, year: 1503, note: 'Malabar map: a royal-blue fort icon rises on Cochin, slip COCHIN 1503', draw(lt, d, t) {
      const pr = K.realMap(MAL); K.pin(pr, 'CALICUT', { side: 'left', color: P.forest }); K.pin(pr, 'CANNANORE', { side: 'left', color: P.royal });
      const [x, y] = pr('COCHIN'); K.fortIcon(x, y - 6, eob(clamp(lt / 0.4)) * 1.2, P.royal); K.slip('COCHIN 1503', x - 230, y + 90, eob(seg(lt, 0.2, 0.5)), -0.02, 48);
    } });
    cue(st + 0.2, 'pop', { gain: 0.5 }); for (let k = 0; k < 3; k++) cue(st + 0.4 + k * 0.3, 'thud', { gain: 0.3 }); cue(s2 + 0.1, 'seal'); }
}
