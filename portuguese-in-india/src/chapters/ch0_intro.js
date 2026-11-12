// CH0 · cold open (no card): dawn off Kerala, three caravels, the route round Africa, pepper, "1498 -> 1961".
import { ctx, W, H, clamp, lerp, seg, eo, eio, eob, rnd, line, circle } from '../core/lib.js';
import * as K from '../core/kit.js';
const { P } = K;

/** the dawn arrival: shared with the CH8 callback. ships 0..1 = how far the caravels have slid in, anchor 0..1 */
export function dawnArrival(lt, d, t, ships = 1, anchor = 0, c = null, leave = 0) {
  c = c || K.cam(lt, d, { x: 40, zoom: 1.0 }, { x: -40, zoom: 1.06 });
  K.seascape({ t, c, night: 0.38, horizon: 980, sunY: lerp(470, 400, clamp(lt / d)), sunX: 760,
    far: () => { for (let i = 0; i < 6; i++) K.palm(-40 + i * 60, 1000, 0.25 + (i % 2) * 0.06, t + i, P.forest); cut_coast(); },
    mid: (tt) => { [[620, 0.42], [820, 0.36], [990, 0.3]].forEach(([x, s], k) => { const xx = lerp(x + 1500, x - 140, eo(clamp(ships - k * 0.12))) - eio(clamp(leave * 1.15 - k * 0.08)) * 1900; const y = K.waveY(xx, 1100, tt, { amp: 16, len: 0.013, speed: 0.9, phase: 1 }) + 10; K.caravel(xx, y, s, tt + k, { rot: Math.sin(tt * 1.3 + k) * 0.03 });
      if (anchor > 0) { const a = eo(clamp(anchor * 1.4 - k * 0.2)); line([[xx - 240 * s, y - 20 * s], [xx - 260 * s, y + a * 160 * s]], P.ink, 4); } }); },
  });
}
function cut_coast() { K.cut(() => { ctx.beginPath(); ctx.moveTo(-500, 1010); ctx.quadraticCurveTo(-100, 930, 300, 990); ctx.lineTo(300, 1030); ctx.lineTo(-500, 1030); ctx.closePath(); }, P.forest, { shadow: 0.3, edge: 4 }); }

/** pepper vine close-up; a peppercorn falls from the spike and rolls into the sack at roll 0..1 */
export function pepperShot(lt, d, t, roll) {
  const c = K.cam(lt, d, { x: 0, y: 0, zoom: 1.04 }, { x: 30, y: 20, zoom: 1.12 });
  K.layer(c, 0.15, () => { K.parchment(14); ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = P.sky; ctx.fillRect(-1100, -400, W + 2200, H + 800); ctx.restore(); for (let i = 0; i < 4; i++) K.palm(100 + i * 300, 1500, 0.9, t + i, '#9AA374'); });
  K.layer(c, 0.6, () => { K.cut(K.P_rr(-1100, 1340, W + 2200, 900, 0), '#A88A5E', { shadow: 0.3, edge: 5 }); K.pepperVine(330, 1360, 1.35, t); });
  K.layer(c, 1.0, () => { K.sack(760, 1380, 1.25);
    const r = eo(clamp(roll)); const x = lerp(285, 760, r), y = r < 0.5 ? lerp(700, 1280, (r / 0.5) ** 2) : lerp(1280, 990 + Math.abs(Math.sin(r * 9)) * 40 * (1 - r), (r - 0.5) * 2);
    if (roll < 1.05) K.peppercorn(x, roll > 0.98 ? 1010 : y, 22); });
  K.layer(c, 1.4, () => { for (let i = 0; i < 3; i++) K.cut(() => { ctx.beginPath(); ctx.moveTo(-60 + i * 120, 2000); ctx.quadraticCurveTo(-20 + i * 120 + Math.sin(t + i) * 10, 1500, 20 + i * 130, 1380); ctx.quadraticCurveTo(10 + i * 120, 1600, 40 + i * 120, 2000); ctx.closePath(); }, P.forest, { shadow: 0.5, edge: 3 }); });
}

export default function (B) {
  const { add, cue, cut_, Wd, L, Le } = B, ch = 0;

  // 0 · In 1498, : dawn sea, the sun lifts
  { const st = 0;
    add({ id: 'C0a', ch, at: st, note: 'dawn sea off Kerala, sun lifts, palms on the far coast', draw(lt, d, t) { dawnArrival(lt, d, t, 0, 0); K.ribbon('1498', 540, 560, eob(seg(lt, Wd('ninety', 0) - 0.15, Wd('ninety', 0) + 0.25)), 100); } });
    cue(0.2, 'waves', { dur: 6, gain: 0.8 }); cue(Wd('ninety', 0) - 0.1, 'pop', { gain: 0.5 }); }

  // 1 · three small ships dropped anchor off the coast of Kerala
  { const st = cut_(1), an = Wd('anchor', 1) - st;
    add({ id: 'C0b', ch, at: st, note: 'three caravels slide in from the right, anchors drop on "anchor"', draw(lt, d, t) { dawnArrival(lt, d, t, clamp(lt / (an + 0.2)), clamp((lt - an) / 0.8)); if (lt > Wd('kerala', 1) - st) K.slip('KERALA', 230, 640, eob(seg(lt, Wd('kerala', 1) - st, Wd('kerala', 1) - st + 0.3)), -0.04, 50); } });
    cue(st + 0.1, 'creak', { gain: 0.6 }); cue(st + an + 0.1, 'splash', { gain: 0.6 }); }

  // 2 · Their crews had sailed for almost eleven months, : deck close-up, hourglass + calendar months peel off
  { const st = cut_(2), mo = ['JUL 1497', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'JAN 1498', 'FEB', 'MAR', 'APR', 'MAY 1498'];
    add({ id: 'C0c', ch, at: st, note: 'deck: hourglass runs, calendar peels JUL 1497 -> MAY 1498', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.08, y: -20 });
      K.layer(c, 0.2, () => { K.parchment(12); for (let i = 0; i < 12; i++) K.cut(K.P_rr(-1100, 300 + i * 130, W + 2200, 120, 0), i % 2 ? '#A88A5E' : '#B49668', { shadow: 0.2, edge: 3 }); });
      K.layer(c, 0.7, () => { line([[-100, 280], [1200, 260]], P.sepia, 14); K.hourglass(270, 1000, 1.1, clamp(lt / d)); });
      K.layer(c, 1.0, () => K.calendar(720, 960, 1.15, mo, clamp(lt / (d * 0.92)) * (mo.length - 1)));
      K.layer(c, 1.4, () => { K.cut(() => { ctx.beginPath(); ctx.moveTo(-100, 200); ctx.quadraticCurveTo(300, 260, 1180, 120); ctx.lineTo(1180, 150); ctx.quadraticCurveTo(300, 290, -100, 230); ctx.closePath(); }, P.sepia, { shadow: 0.6, edge: 3 }); });
    } });
    for (let k = 0; k < 6; k++) cue(st + 0.3 + k * 0.32, 'rustle', { gain: 0.35 }); }

  // 3 · all the way around Africa, : the route draws on
  { const st = cut_(3), af = Wd('africa', 3) - st;
    add({ id: 'C0d', ch, at: st, year: 1498, note: 'real map: crimson route Lisbon -> Cape -> Calicut draws on', draw(lt, d, t) {
      const v = K.lerpView(K.VIEWS.route, { ...K.VIEWS.route, lat: 3 }, eio(clamp(lt / d)));
      const pr = K.realMap(v, { gold: ['portugal'] }); const p = eio(clamp(lt / (d * 0.95)));
      const head = K.placeRoute(pr, K.SEA_ROUTE, p);
      K.pin(pr, 'LISBON', { side: 'up' }); if (p > 0.5) K.pin(pr, 'CAPE OF GOOD HOPE', { side: 'down', sc: eob(seg(p, 0.5, 0.6)), size: 30 });
      if (p > 0.97) K.pin(pr, 'CALICUT', { side: 'down', sc: eob(seg(p, 0.97, 1)), dx: -70 });
      ctx.save(); ctx.translate(head[0], head[1]); K.caravel(0, 0, 0.12, t); ctx.restore();
      if (lt > af) K.slip('AFRICA', 470, 1030, eob(seg(lt, af, af + 0.3)), 0.03, 44);
    } });
    cue(st, 'whoosh'); cue(st + 0.1, 'quill', { dur: 2.2, gain: 0.6 }); }

  // 4 · for one thing: pepper.
  { const st = cut_(4), pe = Wd('pepper', 4) - st;
    add({ id: 'C0e', ch, at: st, note: 'pepper vine close-up; a peppercorn rolls into the sack on "pepper"', draw(lt, d, t) { pepperShot(lt, d, t, clamp((lt - pe + 0.6) / 0.9)); } });
    cue(st, 'whoosh', { gain: 0.6 }); cue(st + pe + 0.25, 'plop', { gain: 0.6 }); }

  // 5 · They had just started a story : the quill writes a first line
  { const st = cut_(5);
    add({ id: 'C0f', ch, at: st, note: 'a quill writes the first line of a page', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.08 }, { zoom: 1.0 });
      K.layer(c, 0.3, () => { K.parchment(6); K.cut(K.P_rr(120, 330, 840, 1080, 6), P.edge, { shadow: 0.9, edge: 0 }); });
      K.layer(c, 1.0, () => { const p = eio(clamp(lt / (d * 0.9))); ctx.font = '700 84px Caladea'; ctx.textAlign = 'left'; ctx.fillStyle = P.ink;
        ctx.save(); ctx.beginPath(); ctx.rect(170, 480, 740 * p, 150); ctx.clip(); ctx.fillText('Calicut, 1498.', 190, 590); ctx.restore();
        for (let i = 0; i < 6; i++) line([[190, 720 + i * 90], [880 - (i % 3) * 90, 720 + i * 90]], 'rgba(62,44,30,0.18)', 5);
        K.quill(190 + 640 * p, 600, 1, t); });
    } });
    cue(st + 0.05, 'quill', { dur: 1.6 }); }

  // 6 · that would last 463 years. : 1498 -> 1961 ribbon, title slip, era bar races to 1961
  { const st = cut_(6), yr = Wd('last', 6) - st, ln = Le(6) - st;
    add({ id: 'C0g', ch, at: st, bar: true, barIn: 0.1, barP: (lt) => lerp(1 / 6, 1, eio(clamp((lt - 0.2) / (yr - 0.1)))), barYear: (lt) => (lt > yr ? 1961 : 1498),
      note: 'era bar races 1498 -> 1961, ribbon "1498 -> 1961", title slip FIRST IN, LAST OUT on "years"', draw(lt, d, t) {
        dawnArrival(lt + 6, d + 6, t, 1, 1, K.cam(lt, d, { x: -40, zoom: 1.06 }, { x: -60, zoom: 1.1 }));
        K.ribbon('1498 → 1961', 540, 520, eob(seg(lt, 0.15, 0.5)), 96);
        K.torn('FIRST IN, LAST OUT', 540, 760, eob(seg(lt, yr, yr + 0.35)), -0.02, 92);
        if (lt > yr + 0.2) K.slip('The Portuguese in India', 600, 905, eob(seg(lt, yr + 0.2, yr + 0.5)), 0.03, 40);
      } });
    cue(st + 0.15, 'pop', { gain: 0.5 }); cue(st + 0.2, 'zip', { gain: 0.5 }); cue(st + yr, 'seal'); }
}
