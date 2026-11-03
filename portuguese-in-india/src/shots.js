// FIRST IN, LAST OUT: the shot list. One module per chapter (src/chapters/chN_*.js); shared art lives in src/core/kit.js.
// Each chapter module gets a builder B: { add, cue, cut_, at, L, Le, Wd, T, lines, script } and adds one shot per cut.
// This file adds the chapter cards (in the pause before each chapter's first line) and the persistent era bar overlay.
import { ctx, clamp, seg, eo } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
import ch0 from './chapters/ch0_intro.js';
import ch1 from './chapters/ch1_spice.js';
import ch2 from './chapters/ch2_calicut.js';
import ch3 from './chapters/ch3_raiders.js';
import ch4 from './chapters/ch4_water.js';
import ch5 from './chapters/ch5_goa.js';
import ch6 from './chapters/ch6_priests.js';
import ch7 from './chapters/ch7_fall.js';
import ch8 from './chapters/ch8_last.js';

const CHAPTERS = [ch0, ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8];
const CH_YEAR = [1498, 1453, 1498, 1500, 1505, 1510, 1580, 1632, 1961];

/** where a year sits on the era bar (0..1), interpolated between its ticks */
export function eraPos(year) {
  const E = K.ERAS, n = E.length; if (year <= E[0]) return 0; if (year >= E[n - 1]) return 1;
  let i = 0; while (E[i + 1] < year) i++; return (i + (year - E[i]) / (E[i + 1] - E[i])) / (n - 1);
}
export const eraTick = (year) => { let i = -1; K.ERAS.forEach((e, k) => { if (e <= year) i = k; }); return i; };

export function buildShots() {
  const script = window.OP.script, S = [], CUES = [];
  const add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const lines = script.lines;
  const first = (c) => lines.findIndex((l) => l.chapter === c && !l.card), last = (c) => lines.length - 1 - [...lines].reverse().findIndex((l) => l.chapter === c);
  const B = { add, cue, cut_, L, Le, Wd, T, lines, script, first, last, chapterOf: (i) => lines[i].chapter };

  CHAPTERS.forEach((build, c) => build({ ...B, ch: c, i0: first(c), i1: last(c) }));

  // chapter cards: from just after the previous chapter's last word to just before this chapter's first cut
  for (let c = 1; c < CHAPTERS.length; c++) {
    // the card plays under its spoken line "Chapter N. Title." (the line just before the chapter's first cut)
    const i0 = first(c), st = Le(i0 - 2) + 0.3, card = script.cards[String(c)];
    S.filter((s) => s.at >= st && s.at < cut_(i0)).forEach((s) => (s.at = cut_(i0)));       // nothing else may start inside the card
    add({ id: `CARD${c}`, at: st, card: true, zoom: 0.02, note: `chapter card ${card.year}: ${card.title}`, draw(lt, d) { K.chapterCard(lt, d, { year: card.year, title: card.title, n: c, letter: card.year === '1961' ? 'I' : 'P', seed: 20 + c }); } });
    cue(st, 'rustle'); cue(st + 0.9, 'seal');
  }

  // the persistent era bar: hidden on cards, on shots marked noBar, and in the cold open (except where a shot asks for it)
  const overlay = (t, sh) => {
    if (sh.card || sh.noBar) return;
    const year = sh.year ?? CH_YEAR[sh.ch ?? 0];
    if ((sh.ch ?? 0) === 0 && !sh.bar) return;
    const fadeIn = sh.barIn != null ? clamp((t - sh.at - sh.barIn) / 0.3) : 1;
    const p = sh.barP ? sh.barP(t - sh.at) : eraPos(year);
    K.eraBar(eraTick(sh.barYear ? sh.barYear(t - sh.at) : year), p, fadeIn);
  };
  return { shots: S, cues: CUES, overlay };
}

/** a storyboard placeholder for chapters not built yet: parchment + the planned shot on a slip (never shipped) */
export function storyboard(B, c) {
  for (let i = B.i0; i <= B.i1; i++) {
    const ln = B.lines[i];
    B.add({ id: `C${c}L${i}`, ch: c, at: B.cut_(i), note: `[storyboard] ${ln.shot}`, draw(lt, d) {
      K.parchment(i); ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = K.P.stone; ctx.fillRect(80, 400, 920, 900); ctx.restore();
      K.label('STORYBOARD', 540, 480, 40, K.P.sepia);
      const words = ln.shot.split(' '); let row = '', y = 700; ctx.font = '700 46px Caladea';
      for (const w of words) { if (ctx.measureText(row + ' ' + w).width > 820) { K.label(row, 540, y, 46); row = w; y += 70; } else row = row ? row + ' ' + w : w; }
      K.label(row, 540, y, 46);
    } });
  }
}
