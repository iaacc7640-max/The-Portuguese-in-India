// CH6 · "1580: Priests and Emperors": Jesuits at Akbar's court, the dream of a converted emperor (a bubble that pops),
// the Inquisition in Goa (a closed temple door), Hawkins and his king's letter at Surat, Swally 1612, Jahangir impressed.
import { ctx, W, H, clamp, lerp, seg, eo, eio, eob, rnd, line, circle } from '../core/lib.js';
import * as K from '../core/kit.js';
const { P } = K;

/** Akbar's court under the arch with scholars of several faiths */
function court(lt, d, t, { bubble = 0, blue = 0, pop = 0, akbarDir = -1 } = {}) {
  const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.05 });
  K.layer(c, 0.5, () => K.mughalArch(t));
  K.layer(c, 1, () => { K.person({ role: 'akbar', x: 760, y: 1500, h: 640, dir: akbarDir, arm: 20, t }); K.person({ role: 'jesuit', x: 230, y: 1520, h: 580, arm: 40, t }); K.person({ role: 'jesuit', x: 400, y: 1540, h: 560, arm: 10, t }); K.person({ role: 'merchant', x: 560, y: 1560, h: 520, dir: 1, t }); });
  if (bubble > 0) { const sc = pop > 0 ? 1 + pop * 0.4 : eob(clamp(bubble)); ctx.save(); ctx.globalAlpha = pop > 0 ? 1 - clamp(pop * 1.6) : 1; K.thoughtBubble(380, 640, 260, sc);
    ctx.save(); ctx.beginPath(); ctx.ellipse(380, 640, 200 * sc, 150 * sc, 0, 0, Math.PI * 2); ctx.clip(); ctx.translate(380, 640); ctx.scale(0.3 * sc, 0.3 * sc); ctx.translate(-540, -960);
    K.realMap(K.VIEWS.india, { frame: false, compassAt: false, land: K.mixColor(P.land, P.royal, blue) }); ctx.restore(); ctx.restore(); }
}

export default function (B) {
  const { add, cue, cut_, Wd, L, Le, i0 } = B, ch = 6, I = (k) => i0 + k;

  // 0 · In 1580, two Jesuit priests from Goa : two priests on the road
  { const i = I(0), st = cut_(i), je = Wd('jesuit', i) - st;
    add({ id: 'C6a', ch, at: st, year: 1580, note: 'two Jesuit priests walk the road north from Goa; ribbon 1580', draw(lt, d, t) {
      const c = K.cam(lt, d, { x: -30 }, { x: 30, zoom: 1.04 }); K.layer(c, 0.2, () => { K.sky(0.15, 420, 820); for (let k = 0; k < 6; k++) K.palm(-40 + k * 220, 1120, 0.5, t + k, '#9AA374'); });
      K.layer(c, 1, () => { K.cut(K.P_rr(-300, 1300, W + 600, 900, 0), '#C9A878', { shadow: 0.4, edge: 5 }); K.cut(K.P_poly([[300, 1300], [780, 1300], [1300, 2000], [-200, 2000]]), '#B49668', { shadow: 0, edge: 3 });
        const x = lerp(260, 520, eio(clamp(lt / d))); K.person({ role: 'jesuit', x, y: 1480, h: 600, walk: lt * 6, t }); K.person({ role: 'jesuit', x: x + 220, y: 1460, h: 560, walk: lt * 6 + 1, t }); });
      K.ribbon('1580', 540, 400, eob(seg(lt, 0.1, 0.45)), 96); if (lt > je) K.slip('JESUITS FROM GOA', 540, 580, eob(seg(lt, je, je + 0.3)), -0.02, 46);
    } });
    cue(st + 0.1, 'pop', { gain: 0.4 }); }

  // 1 · reached the court of Emperor Akbar, : Fatehpur Sikri arch, Akbar
  { const i = I(1), st = cut_(i), ak = Wd('akbar', i) - st;
    add({ id: 'C6b', ch, at: st, year: 1580, note: 'the court arch at Fatehpur Sikri; Akbar (green + gold turban); slip AKBAR', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.08 }, { zoom: 1.0 }); K.layer(c, 0.5, () => K.mughalArch(t)); K.layer(c, 1, () => K.person({ role: 'akbar', x: 540, y: 1500, h: 700, t }));
      K.slip('FATEHPUR SIKRI', 540, 420, eob(seg(lt, 0.1, 0.4)), -0.02, 44); if (lt > ak) K.slip('EMPEROR AKBAR', 540, 1180, eob(seg(lt, ak, ak + 0.3)), 0.02, 48);
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(st + ak, 'pop', { gain: 0.5 }); }

  // 2 · who loved debating religion. : Akbar among scholars, speech slips alternate
  { const i = I(2), st = cut_(i), de = Wd('debating', i) - st;
    add({ id: 'C6c', ch, at: st, year: 1580, note: 'Akbar listens to scholars of several faiths; little talk bubbles alternate', draw(lt, d, t) {
      court(lt, d, t, { akbarDir: -1 }); [[260, 860], [560, 940], [720, 780]].forEach(([x, y], k) => { const on = Math.floor((lt - de + 0.5) * 2.5) % 3 === k && lt > de - 0.5; if (on) K.thoughtBubble(x, y, 70, 1); });
    } });
    cue(st + de, 'pop', { gain: 0.3 }); cue(st + de + 0.4, 'pop', { gain: 0.3 }); }

  // 3 · The Portuguese dreamed that if the emperor converted, : a thought bubble with a map of India rises
  { const i = I(3), st = cut_(i), co = Wd('converted', i) - st;
    add({ id: 'C6d', ch, at: st, year: 1580, note: 'a thought bubble with a map of India rises over the Jesuits', draw(lt, d, t) { court(lt, d, t, { bubble: clamp((lt - 0.3) / 0.5) }); } });
    cue(st + 0.3, 'sparkle', { dur: 0.8, gain: 0.4 }); }

  // 4 · Mughal India would follow. : the bubble map turns blue
  { const i = I(4), st = cut_(i), fo = Wd('follow', i) - st;
    add({ id: 'C6e', ch, at: st, year: 1580, note: 'the map in the bubble turns royal blue on "follow"', draw(lt, d, t) { court(lt, d, t, { bubble: 1, blue: eio(clamp((lt - fo + 0.3) / 0.7)) }); } });
    cue(st + fo, 'slide', { dur: 0.8, gain: 0.4 }); }

  // 5 · He didn't. : the bubble pops; Akbar turns away
  { const i = I(5), st = cut_(i);
    add({ id: 'C6f', ch, at: st, year: 1580, note: 'the bubble pops; Akbar turns away', draw(lt, d, t) { court(lt, d, t, { bubble: 1, blue: 1, pop: clamp(lt / 0.4), akbarDir: lt > 0.2 ? 1 : -1 }); } });
    cue(st + 0.05, 'pop'); }

  // 6 · Back in Goa, after the Inquisition arrived, : the Goa church at dusk
  { const i = I(6), st = cut_(i), iq = Wd('inquisition', i) - st;
    add({ id: 'C6g', ch, at: st, year: 1580, note: 'Goa at dusk: the white church; slip THE INQUISITION', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.08 }); K.layer(c, 0.2, () => K.sky(0.55, 500, 260)); K.layer(c, 1, () => { K.cut(K.P_rr(-300, 1400, W + 600, 700, 0), '#C9A878', { shadow: 0.4, edge: 5 }); K.church(540, 1400, 1.4); });
      if (lt > iq) K.slip('THE INQUISITION', 540, 420, eob(seg(lt, iq, iq + 0.3)), -0.02, 50);
    } });
    cue(st, 'wind', { dur: 2.2, gain: 0.4 }); cue(st + iq, 'thud', { gain: 0.3 }); }

  // 7 · Hindus were persecuted too. : a temple door closes, a padlock
  { const i = I(7), st = cut_(i), pe = Wd('persecuted', i) - st;
    add({ id: 'C6h', ch, at: st, year: 1580, note: 'a temple door swings shut and is padlocked (no people)', draw(lt, d, t) { K.parchment(31); K.archDoor(540, 1440, 0.95, 'temple', clamp((lt - 0.1) / 0.5), clamp((lt - pe) / 0.3)); } });
    cue(st + 0.4, 'slam', { gain: 0.6 }); cue(st + pe, 'thud', { gain: 0.5 }); }

  // 8 · Then, in 1608, an Englishman, | William Hawkins, (two cuts)
  { const i = I(8), st = cut_(i), wh = Wd('william', i) - st;
    add({ id: 'C6i', ch, at: st, year: 1608, note: 'an English ship (crimson cross) sails into Surat; ribbon 1608', draw(lt, d, t) {
      const c = K.cam(lt, d, { x: 30 }, { x: -30, zoom: 1.05 }); K.seascape({ t, c, night: 0.1, horizon: 960, mid: (tt) => K.flagShip(lerp(900, 560, eio(clamp(lt / d))), 1100, 0.7, tt, 'england') });
      K.ribbon('1608', 540, 400, eob(seg(lt, 0.1, 0.45)), 96); K.slip('AN ENGLISHMAN', 540, 580, eob(seg(lt, 0.6, 0.9)), 0.02, 46);
    } });
    const s2 = st + wh - 0.08;
    add({ id: 'C6j', ch, at: s2, year: 1608, note: 'Hawkins (tall black hat, ruff) steps onto the Surat quay; slip WILLIAM HAWKINS', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.06 }); K.layer(c, 0.3, () => { K.sky(0.15, 420, 820); K.wave(1050, t, { color: P.seaDark }); K.flagShip(820, 1100, 0.5, t, 'england'); });
      K.layer(c, 1, () => { K.cut(K.P_rr(-300, 1360, W + 600, 700, 0), P.stone, { shadow: 0.5, edge: 5 }); K.person({ role: 'hawkins', x: lerp(520, 400, eio(clamp(lt / d))), y: 1500, h: 780, walk: lt * 5, arm: 20, t }); });
      K.slip('WILLIAM HAWKINS', 540, 420, eob(seg(lt, 0.1, 0.4)), -0.02, 50);
    } });
    cue(st, 'waves', { dur: 2, gain: 0.5 }); cue(st + 0.1, 'pop', { gain: 0.4 }); cue(s2 + 0.1, 'pop', { gain: 0.4 }); }

  // 9 · landed at Surat with a letter from his king. : the letter with its red seal, close
  { const i = I(9), st = cut_(i), le = Wd('letter', i) - st;
    add({ id: 'C6k', ch, at: st, year: 1608, note: 'Surat: Hawkins holds out the king\'s letter with its red wax seal', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.1, x: 40 }); K.layer(c, 0.3, () => { K.parchment(32); K.cut(K.P_rr(-200, 300, W + 400, 1200, 0), P.stone, { shadow: 0, edge: 0 }); });
      K.layer(c, 1, () => { K.person({ role: 'hawkins', x: 330, y: 1520, h: 820, arm: lerp(10, 75, eob(clamp((lt - le + 0.3) / 0.4))), t }); });
      K.slip('SURAT', 540, 420, eob(seg(lt, 0.1, 0.4)), -0.02, 52); if (lt > le) K.slip("THE KING'S LETTER", 760, 600, eob(seg(lt, le, le + 0.3)), 0.03, 44);
    } });
    cue(st + le, 'rustle', { gain: 0.5 }); }

  // 10 · The Portuguese tried everything to stop him, : a Jesuit blocks the court doorway
  { const i = I(10), st = cut_(i), sp = Wd('stop', i) - st;
    add({ id: 'C6l', ch, at: st, year: 1608, note: 'at the court arch a Jesuit spreads his arms across the doorway; Hawkins waits outside', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.06 }); K.layer(c, 0.5, () => K.mughalArch(t));
      K.layer(c, 1, () => { K.person({ role: 'jesuit', x: 560, y: 1520, h: 680, arm: lt > sp - 0.3 ? 100 : 20, arm2: lt > sp - 0.3 ? -80 : 0, t }); K.person({ role: 'hawkins', x: 200, y: 1560, h: 640, t }); });
    } });
    cue(st + sp - 0.3, 'thud', { gain: 0.4 }); }

  // 11 · but in 1612, English ships | beat a Portuguese fleet near Surat, (two cuts)
  { const i = I(11), st = cut_(i), be = Wd('beat', i) - st;
    add({ id: 'C6m', ch, at: st, year: 1612, note: 'off Surat: two small English ships face a bigger Portuguese fleet; ribbon 1612', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.05 }); K.seascape({ t, c, night: 0.2, horizon: 960, far: (tt) => { for (let k = 0; k < 4; k++) K.caravel(560 + k * 140, 1000 + (k % 2) * 20, 0.28, tt + k); }, mid: (tt) => { K.flagShip(200, 1120, 0.42, tt, 'england'); K.flagShip(380, 1150, 0.38, tt + 1, 'england'); } });
      K.ribbon('1612', 540, 400, eob(seg(lt, 0.1, 0.45)), 96);
    } });
    const s2 = st + be - 0.08;
    add({ id: 'C6n', ch, at: s2, year: 1612, note: 'cannon puffs; the Portuguese ships drift back and shrink away (no people)', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.04 }, { zoom: 1.0 }), k = eio(clamp(lt / d));
      K.seascape({ t, c, night: 0.2, horizon: 960, far: (tt) => { for (let j = 0; j < 4; j++) K.caravel(560 + j * 140 + k * 200, 1000 + (j % 2) * 20, 0.28 * (1 - k * 0.5), tt + j, { rot: k * 0.1 }); },
        mid: (tt) => { K.flagShip(200, 1120, 0.42, tt, 'england'); K.flagShip(380, 1150, 0.38, tt + 1, 'england'); for (let j = 0; j < 3; j++) K.smokePuff(470, 1020 - j * 30, 0.5, clamp((lt - j * 0.4) / 1.2)); } });
      K.slip('NEAR SURAT', 540, 420, eob(seg(lt, 0.2, 0.5)), -0.02, 46);
    } });
    cue(s2, 'cannon', { gain: 0.6 }); cue(s2 + 0.4, 'cannon', { gain: 0.5 }); }

  // 12 · and Emperor Jahangir, who had no navy, | was impressed. (two cuts)
  { const i = I(12), st = cut_(i), im = Wd('impressed', i) - st, na = Wd('navy', i) - st;
    add({ id: 'C6o', ch, at: st, year: 1612, note: 'Jahangir (green, gold turban with plume) on his court seat; slip NO NAVY', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.06 }); K.layer(c, 0.5, () => K.mughalArch(t)); K.layer(c, 1, () => K.person({ role: 'jahangir', x: 540, y: 1500, h: 720, t }));
      K.slip('EMPEROR JAHANGIR', 540, 420, eob(seg(lt, 0.1, 0.4)), -0.02, 48); if (lt > na) K.slip('NO NAVY', 780, 760, eob(seg(lt, na, na + 0.3)), 0.04, 46);
    } });
    const s2 = st + im - 0.08;
    add({ id: 'C6p', ch, at: s2, year: 1612, note: 'close-up: Jahangir raises an eyebrow', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.04 }); K.layer(c, 0.3, () => K.mughalArch(t)); K.layer(c, 1, () => K.person({ role: 'jahangir', x: 460, y: 2350, h: 1750, brow: eob(clamp((lt - 0.15) / 0.3)), t }));
    } });
    cue(s2 + 0.15, 'boing', { gain: 0.35 }); }
}
