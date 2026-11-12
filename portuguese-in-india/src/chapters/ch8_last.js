// CH8 · "1961: Last to Leave": three blue pins outlast every empire, the era bar races to 1961, the tricolour rises over
// Goa, and the film loops back to the dawn arrival and the peppercorn.
import { ctx, W, H, clamp, lerp, seg, eo, eio, eob, rnd, line, circle } from '../core/lib.js';
import * as K from '../core/kit.js';
import { dawnArrival, pepperShot } from './ch0_intro.js';
import { eraPos } from '../shots.js';
const { P } = K;
const WEST = { lon: 76, lat: 17, w: 20 };

function threePins(pr, s = [1, 1, 1]) { ['GOA', 'DAMAN', 'DIU'].forEach((n, k) => { if (s[k] > 0) K.pin(pr, n, { side: k === 2 ? 'left' : 'right', color: P.royal, sc: eob(clamp(s[k])), r: 15, size: 44 }); }); }

export default function (B) {
  const { add, cue, cut_, Wd, L, Le, i0 } = B, ch = 8, I = (k) => i0 + k;

  // 0 · And yet, Goa, Daman and Diu stayed Portuguese. : three royal-blue pins
  { const i = I(0), st = cut_(i), w = ['goa', 'duh', 'dee'].map((x) => Wd(x, i) - st);
    add({ id: 'C8a', ch, at: st, year: 1739, note: 'west India map: Goa, Daman and Diu pinned in royal blue, one per name', draw(lt, d, t) {
      const pr = K.realMap(WEST); threePins(pr, w.map((a) => (lt - a) / 0.3)); } });
    w.forEach((a) => cue(st + a, 'pop', { gain: 0.5 })); }

  // 1 · They outlasted the Mughals, the Marathas, | even the British. (two cuts)
  { const i = I(1), st = cut_(i), mu = Wd('mughals', i) - st, ma = Wd('marathas', i) - st, br = Wd('british', i) - st;
    add({ id: 'C8b', ch, at: st, year: 1800, barYear: () => 1663, note: 'Mughal and Maratha flags stand around the three pins, then fade on their names', draw(lt, d, t) {
      const pr = K.realMap(WEST); threePins(pr);
      [['mughal', [79, 23], mu], ['maratha', [76, 19.5], ma]].forEach(([k, ll, a]) => { const [x, y] = pr(ll); ctx.save(); ctx.globalAlpha = 1 - clamp((lt - a - 0.2) / 0.6); K.flag(x, y, k, t, 0.6, { h: 380 }); ctx.restore(); });
    } });
    const s2 = st + br - 0.08;
    add({ id: 'C8c', ch, at: s2, year: 1900, barYear: () => 1663, note: 'a British flag (crimson cross) slides down its pole beside the three blue pins', draw(lt, d, t) {
      const pr = K.realMap(WEST); threePins(pr); const [x, y] = pr([80, 21]); K.flag(x, y, 'england', t, 0.75, { h: 440, lower: eio(clamp(lt / (d * 0.9))) }); } });
    cue(st + mu + 0.2, 'slide', { dur: 0.6, gain: 0.3 }); cue(st + ma + 0.2, 'slide', { dur: 0.6, gain: 0.3 }); cue(s2 + 0.1, 'slide', { dur: 1, gain: 0.4 }); }

  // 2 · Only in 1961 did India take them back, : the era bar races to 1961, the tricolour rises over Goa
  { const i = I(2), st = cut_(i), si = Wd('sixty', i) - st, bk = Wd('back', i) - st;
    add({ id: 'C8d', ch, at: st, year: 1961, barP: (lt) => lerp(eraPos(1739), 1, eio(clamp(lt / (si + 0.2)))), barYear: (lt) => (lt > si ? 1961 : 1663),
      note: 'the era bar races to 1961; over the Goa skyline the Portuguese flag lowers and the Indian tricolour rises', draw(lt, d, t) {
        const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.05 }); K.layer(c, 0.2, () => K.sky(0.15, 420, 820)); K.layer(c, 1, () => K.goaSkyline(t, 1400));
        const sw = eio(clamp((lt - bk + 0.6) / 1.0)); K.flag(260, 900, 'portugal', t, 0.8, { h: 500, lower: sw }); K.flag(800, 900, 'india', t, 0.8, { h: 500, lower: 1 - sw });
        K.ribbon('1961', 540, 420, eob(seg(lt, si, si + 0.35)), 100);
      } });
    cue(st + 0.1, 'zip', { gain: 0.5 }); cue(st + si, 'pop', { gain: 0.5 }); cue(st + bk - 0.4, 'slide', { dur: 1, gain: 0.4 }); }

  // 3 · four hundred and sixty-three years | after da Gama reached Calicut. (two cuts)
  { const i = I(3), st = cut_(i), af = Wd('after', i) - st;
    add({ id: 'C8e', ch, at: st, year: 1961, note: 'ribbon 1498 -> 1961 and a 463 YEARS slip', draw(lt, d, t) {
      K.parchment(40); K.ribbon('1498 → 1961', 540, 760, eob(seg(lt, 0.05, 0.4)), 100); K.torn('463 years', 540, 1000, eob(seg(lt, 0.4, 0.7)), -0.02, 90); } });
    const s2 = st + af - 0.08;
    add({ id: 'C8f', ch, at: s2, year: 1961, note: 'the route map: da Gama\'s crimson route draws on once more, to Calicut', draw(lt, d, t) {
      const pr = K.realMap(K.VIEWS.route, { gold: ['portugal'] }); const head = K.placeRoute(pr, K.SEA_ROUTE, eio(clamp(lt / (d * 0.9)))); K.pin(pr, 'LISBON', { side: 'up' }); if (lt > d * 0.85) K.pin(pr, 'CALICUT', { side: 'down', dx: -70 });
      ctx.save(); ctx.translate(head[0], head[1]); K.caravel(0, 0, 0.12, t); ctx.restore(); } });
    cue(st + 0.1, 'pop', { gain: 0.4 }); cue(s2, 'quill', { dur: 1.8, gain: 0.5 }); }

  // 4 · The first Europeans to arrive : the dawn arrival again (callback)
  { const i = I(4), st = cut_(i);
    add({ id: 'C8g', ch, at: st, year: 1961, noBar: true, note: 'callback: the cold-open dawn, three caravels slide in', draw(lt, d, t) { dawnArrival(lt, d, t, clamp(lt / d), 0); } });
    cue(st, 'waves', { dur: 3, gain: 0.6 }); }

  // 5 · were the last to leave. : the caravels sail away to the left
  { const i = I(5), st = cut_(i);
    add({ id: 'C8h', ch, at: st, year: 1961, noBar: true, note: 'the three caravels sail out of frame to the left', draw(lt, d, t) {
      ctx.save(); dawnArrival(lt + 3, d + 3, t, 1, 0, K.cam(lt, d, { x: -40, zoom: 1.06 }, { x: 40, zoom: 1.06 }), clamp(lt / d)); ctx.restore(); } });
    cue(st, 'creak', { gain: 0.5 }); }

  // 6 · And it all began with three small ships, : the ships at anchor, calm
  { const i = I(6), st = cut_(i);
    add({ id: 'C8i', ch, at: st, year: 1961, noBar: true, note: 'dawn, the three small ships at anchor off Kerala', draw(lt, d, t) { dawnArrival(lt, d, t, 1, 1); } });
    cue(st, 'waves', { dur: 2.4, gain: 0.5 }); }

  // 7 · and a taste for pepper. + end card: the peppercorn rolls into the sack (loops to the cold open)
  { const i = I(7), st = cut_(i), pe = Wd('pepper', i) - st;
    add({ id: 'C8j', ch, at: st, year: 1961, noBar: true, note: 'the peppercorn rolls into the sack on "pepper"; end card FIRST IN, LAST OUT', draw(lt, d, t) {
      pepperShot(lt, d, t, clamp((lt - pe + 0.6) / 0.9)); const e = seg(lt, pe + 0.6, pe + 1.0);
      if (e > 0) { ctx.save(); ctx.globalAlpha = clamp(e * 1.5) * 0.85; ctx.fillStyle = P.parch; ctx.fillRect(-1100, -300, W + 2200, H + 600); ctx.restore(); K.ribbon('1498 → 1961', 540, 640, eob(e), 92); K.torn('FIRST IN, LAST OUT', 540, 860, eob(seg(lt, pe + 0.8, pe + 1.2)), -0.02, 92); K.slip('The Portuguese in India', 600, 1010, eob(seg(lt, pe + 1.0, pe + 1.4)), 0.03, 40); }
    } });
    cue(st + pe + 0.3, 'plop', { gain: 0.6 }); cue(st + pe + 0.7, 'seal'); }
}
