// CH4 · "1505: Rule the Water": Almeida's plan (blue water), the cartaz pass, the Egypt-Gujarat alliance, Chaul 1508
// (a sinking silhouette, an empty helmet), Diu 1509 (paper sails fall), and the lesson as a labelled paraphrase.
import { ctx, W, H, clamp, lerp, seg, eo, eio, eob, rnd, line, circle } from '../core/lib.js';
import * as K from '../core/kit.js';
const { P } = K;
const SIL = '#1E2236', WEST = { lon: 50, lat: 25, w: 52 }, WIDE = { lon: 42, lat: 32, w: 68 };

export default function (B) {
  const { add, cue, cut_, Wd, L, Le, i0 } = B, ch = 4, I = (k) => i0 + k;

  // 0 · In 1505, Portugal sent its first governor, : Almeida arrives on deck
  { const i = I(0), st = cut_(i), go = Wd('governor', i) - st;
    add({ id: 'C4a', ch, at: st, year: 1505, note: 'Almeida (grey beard, armour) arrives at the rail; ribbon 1505; FIRST GOVERNOR slip', draw(lt, d, t) {
      const c = K.cam(lt, d, { x: -20 }, { x: 20, zoom: 1.06 });
      K.seascape({ t, c, night: 0.15, horizon: 900, far: (tt) => { for (let k = 0; k < 4; k++) K.caravel(160 + k * 240, 930, 0.22, tt + k); },
        fore: () => { K.cut(K.P_rr(-300, 1380, W + 600, 700, 0), P.sepia, { shadow: 0.6, edge: 5 }); K.cut(K.P_rr(-300, 1290, W + 600, 30, 8), '#6E4E30', { shadow: 0.4, edge: 3 }); K.person({ role: 'almeida', x: 520, y: 1520, h: 820, arm: 10, t }); } });
      K.ribbon('1505', 540, 400, eob(seg(lt, 0.1, 0.45)), 100); if (lt > go) K.slip('FIRST GOVERNOR', 540, 590, eob(seg(lt, go, go + 0.3)), -0.02, 50);
    } });
    cue(st + 0.1, 'pop', { gain: 0.5 }); cue(st, 'waves', { dur: 3, gain: 0.5 }); cue(st + go, 'pop', { gain: 0.4 }); }

  // 1 · Francisco de Almeida, with a simple plan: : he unrolls a map
  { const i = I(1), st = cut_(i), pl = Wd('plan', i) - st;
    add({ id: 'C4b', ch, at: st, year: 1505, note: 'Almeida unrolls a sea chart on a table; slip FRANCISCO DE ALMEIDA', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.04 }, { zoom: 1.1, y: 30 });
      K.layer(c, 0.4, () => { K.parchment(23); K.cut(K.P_rr(-200, 300, W + 400, 1200, 0), P.stone, { shadow: 0, edge: 0 }); });
      K.layer(c, 1, () => { K.person({ role: 'almeida', x: 300, y: 1500, h: 760, arm: 55, t }); K.cut(K.P_rr(380, 1180, 700, 60, 8), '#6E4E30', { shadow: 0.7, edge: 4 });
        const u = eo(clamp((lt - pl + 0.3) / 0.6)); ctx.save(); ctx.beginPath(); ctx.rect(440, 900, 560 * u, 290); ctx.clip(); ctx.translate(720, 1045); ctx.scale(0.27, 0.15); ctx.translate(-540, -960); K.realMap(K.VIEWS.ocean, { frame: false, compassAt: false }); ctx.restore();
        K.cut(K.P_rr(430 + 560 * u, 890, 30, 310, 15), P.sepia, { shadow: 0.4, edge: 3 }); });
      K.slip('FRANCISCO DE ALMEIDA', 540, 420, eob(seg(lt, 0.1, 0.4)), -0.02, 48);
    } });
    cue(st + pl - 0.2, 'rustle', { gain: 0.6 }); }

  // 2 · forget the land, control the water. : the land dims, a royal-blue wash floods the sea
  { const i = I(2), st = cut_(i), wa = Wd('water', i) - st, la = Wd('land', i) - st;
    add({ id: 'C4c', ch, at: st, year: 1505, note: 'ocean map: land fades on "land", a royal-blue wash floods the sea on "water" (Blue Water Policy)', draw(lt, d, t) {
      const b = eio(clamp((lt - wa + 0.2) / 0.7)); K.realMap(K.VIEWS.ocean, { seaTint: [P.royal, 0.45 * b], dim: 0.35 * clamp((lt - la) / 0.4) });
      if (lt > wa) K.slip('THE BLUE WATER POLICY', 540, 1300, eob(seg(lt, wa + 0.2, wa + 0.5)), -0.02, 44);
    } });
    cue(st + wa, 'slide', { dur: 1.2, gain: 0.6 }); }

  // 3 · Every ship now needed a Portuguese pass, : the cartaz, stamped
  { const i = I(3), st = cut_(i), pa = Wd('pass', i) - st;
    add({ id: 'C4d', ch, at: st, year: 1505, note: 'the cartaz pass; the wax seal stamps on "pass"', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.08 }, { zoom: 1.0 }); K.layer(c, 0.3, () => K.parchment(24)); K.layer(c, 1, () => K.cartaz(540, 900, 1.25, clamp((lt - pa) / 0.25)));
    } });
    cue(st + 0.1, 'rustle', { gain: 0.5 }); cue(st + pa, 'seal'); }

  // 4 · or risked being seized. : a dhow with no pass, a chain across its bow, a caravel alongside
  { const i = I(4), st = cut_(i), se = Wd('seized', i) - st;
    add({ id: 'C4e', ch, at: st, year: 1505, note: 'a dhow without a pass: a chain snaps across its bow, a caravel looms alongside', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.08 });
      K.seascape({ t, c, night: 0.2, horizon: 950, mid: (tt) => { K.caravel(800, 1060, 0.6, tt); K.dhow(360, K.waveY(360, 1120, tt, { amp: 16, len: 0.013, speed: 0.9, phase: 1 }) + 10, 0.65, tt, { chain: clamp((lt - se + 0.2) / 0.4) }); } });
      K.slip('NO PASS', 360, 640, eob(seg(lt, 0.1, 0.4)), -0.04, 50);
    } });
    cue(st + se - 0.1, 'slam', { gain: 0.5 }); }

  // 5 · That threatened Gujarat, Egypt, : pins light on the map
  { const i = I(5), st = cut_(i), gu = Wd('gujarat', i) - st, eg = Wd('egypt', i) - st;
    add({ id: 'C4f', ch, at: st, year: 1505, note: 'map: Gujarat (Diu) and Egypt (Cairo) light up in crimson-brown', draw(lt, d, t) {
      const pr = K.realMap(WEST, { seaTint: [P.royal, 0.2] });
      if (lt > gu) K.pin(pr, 'DIU', { text: 'GUJARAT', color: P.brown, side: 'down', sc: eob(seg(lt, gu, gu + 0.3)), r: 16 });
      if (lt > eg) K.pin(pr, 'CAIRO', { text: 'EGYPT', color: P.brown, side: 'down', sc: eob(seg(lt, eg, eg + 0.3)), r: 16 });
    } });
    cue(st + gu, 'pop', { gain: 0.5 }); cue(st + eg, 'pop', { gain: 0.5 }); }

  // 6 · and even the merchants of Venice, : Venice joins, a crimson thread links the three
  { const i = I(6), st = cut_(i), ve = Wd('venice', i) - st;
    add({ id: 'C4g', ch, at: st, year: 1505, note: 'map widens to Venice; a crimson thread links Venice, Cairo and Gujarat', draw(lt, d, t) {
      const pr = K.realMap(K.lerpView(WEST, WIDE, eio(clamp(lt / 0.8))), { seaTint: [P.royal, 0.2] });
      K.pin(pr, 'DIU', { text: 'GUJARAT', color: P.brown, side: 'down', r: 16 }); K.pin(pr, 'CAIRO', { text: 'EGYPT', color: P.brown, side: 'down', r: 16 });
      if (lt > ve) { K.pin(pr, 'VENICE', { side: 'up', sc: eob(seg(lt, ve, ve + 0.3)), r: 16 }); K.dashedRoute([pr('VENICE'), pr('CAIRO'), pr('DIU')], eio(clamp((lt - ve) / 0.6))); }
    } });
    cue(st + ve, 'pop', { gain: 0.5 }); cue(st + ve + 0.1, 'quill', { dur: 0.6, gain: 0.5 }); }

  // 7 · so Egypt and Gujarat joined forces. : crimson-brown sails gather into one fleet
  { const i = I(7), st = cut_(i), fo = Wd('forces', i) - st;
    add({ id: 'C4h', ch, at: st, year: 1505, note: 'crimson-brown dhow sails converge into one fleet on "forces"', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.06 }), k = eio(clamp((lt) / (fo + 0.3)));
      K.seascape({ t, c, night: 0.3, horizon: 940, mid: (tt) => { for (let j = 0; j < 6; j++) { const x0 = j < 3 ? -200 - j * 120 : 1280 + (j - 3) * 120, x1 = 300 + j * 100; K.dhow(lerp(x0, x1, k), 1060 + (j % 2) * 40, 0.42, tt + j, { sail: P.brown, hull: P.sepia }); } } });
      K.slip('EGYPT + GUJARAT', 540, 560, eob(seg(lt, fo, fo + 0.3)), 0.02, 52);
    } });
    cue(st, 'wind', { dur: 2.2, gain: 0.5 }); cue(st + fo, 'thud', { gain: 0.4 }); }

  // 8 · In 1508, at Chaul, they beat the Portuguese, : night, one Portuguese silhouette sinks under the navy wash
  { const i = I(8), st = cut_(i), cha = Wd('chowl', i) - st, be = Wd('beat', i) - st;
    add({ id: 'C4i', ch, at: st, year: 1508, note: 'night off Chaul: ribbon 1508; one Portuguese ship silhouette sinks on "beat" (no people)', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.06 }), sk = eio(clamp((lt - be) / 1.4));
      K.seascape({ t, c, night: 1, horizon: 980, far: (tt) => { for (let k = 0; k < 3; k++) K.dhow(160 + k * 120, 1000, 0.2, tt + k, { sil: SIL }); }, mid: (tt) => K.caravel(640, 1110, 0.6, tt, { sil: SIL, sink: sk }) });
      K.ribbon('1508', 540, 400, eob(seg(lt, 0.1, 0.45)), 96); if (lt > cha) K.slip('CHAUL', 540, 580, eob(seg(lt, cha, cha + 0.3)), -0.03, 52);
    } });
    cue(st + 0.1, 'pop', { gain: 0.4 }); cue(st + be, 'cannon', { gain: 0.6 }); cue(st + be + 0.6, 'splash', { gain: 0.5 }); }

  // 9 · and Almeida's own son was killed. : an empty helmet on a table, a candle
  { const i = I(9), st = cut_(i);
    add({ id: 'C4j', ch, at: st, year: 1508, note: 'night interior: an empty helmet beside a candle on a table', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.1, y: 40 });
      K.layer(c, 0.4, () => { K.parchment(25); K.cut(K.P_rr(-200, 300, W + 400, 1200, 0), P.stoneDark, { shadow: 0, edge: 0 }); });
      K.layer(c, 1, () => { K.cut(K.P_rr(100, 1180, 880, 60, 8), '#6E4E30', { shadow: 0.7, edge: 4 }); K.cut(K.P_rr(160, 1240, 40, 300, 6), '#6E4E30', { shadow: 0.5, edge: 3 }); K.cut(K.P_rr(880, 1240, 40, 300, 6), '#6E4E30', { shadow: 0.5, edge: 3 });
        K.cut(() => { ctx.beginPath(); ctx.moveTo(330, 1180); ctx.quadraticCurveTo(340, 1080, 380, 1040); ctx.quadraticCurveTo(440, 930, 520, 1040); ctx.quadraticCurveTo(560, 1080, 570, 1180); ctx.closePath(); }, '#CFC7B4', { shadow: 0.8, edge: 4 }); K.cut(() => { ctx.beginPath(); ctx.ellipse(450, 1180, 170, 22, 0, 0, Math.PI * 2); }, '#B9B09A', { shadow: 0.4, edge: 3 }); line([[450, 965], [450, 930]], '#B9B09A', 12);
        K.cut(K.P_rr(720, 1060, 40, 120, 6), P.white, { shadow: 0.4, edge: 3 }); });
      K.nightWash(0.42, 9); K.layer(c, 1, () => { K.glow(740, 1040, 260 + Math.sin(t * 9) * 8, '#F2C14E', 0.55); K.cut(() => { ctx.beginPath(); ctx.ellipse(740, 1040, 12, 24 + Math.sin(t * 9) * 3, 0, 0, Math.PI * 2); }, '#F2C14E', { shadow: 0, edge: 0 }); });
    } });
    cue(st, 'wind', { dur: 2, gain: 0.4 }); }

  // 10 · A year later, off Diu, : dawn sea, ribbon 1509, DIU slip
  { const i = I(10), st = cut_(i), di = Wd('dee', i) - st;
    add({ id: 'C4k', ch, at: st, year: 1509, note: 'dawn off Diu: ribbon 1509, Almeida\'s caravels line up facing the brown fleet', draw(lt, d, t) {
      const c = K.cam(lt, d, { x: 20 }, { x: -20, zoom: 1.04 });
      K.seascape({ t, c, night: 0.4, horizon: 960, sunX: 300, far: (tt) => { for (let k = 0; k < 5; k++) K.dhow(560 + k * 110, 980, 0.22, tt + k, { sail: P.brown, hull: P.sepia }); }, mid: (tt) => { for (let k = 0; k < 3; k++) K.caravel(160 + k * 170, 1090, 0.36, tt + k); } });
      K.ribbon('1509', 540, 400, eob(seg(lt, 0.1, 0.45)), 96); if (lt > di) K.slip('DIU', 760, 600, eob(seg(lt, di, di + 0.3)), 0.03, 56);
    } });
    cue(st + 0.1, 'pop', { gain: 0.4 }); cue(st, 'waves', { dur: 2, gain: 0.5 }); }

  // 11 · Almeida destroyed their fleet. : their paper sails fall one by one
  { const i = I(11), st = cut_(i), de = Wd('destroyed', i) - st;
    add({ id: 'C4l', ch, at: st, year: 1509, note: 'the brown paper sails fall one by one like cut-outs, starting on "destroyed" (no people)', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.04 }, { zoom: 1.0 });
      K.seascape({ t, c, night: 0.4, horizon: 960, sunX: 300, mid: (tt) => { for (let k = 0; k < 5; k++) K.dhow(140 + k * 200, 1080 + (k % 2) * 30, 0.42, tt + k, { sail: P.brown, hull: P.sepia, fall: eio(clamp((lt - de - k * 0.22) / 0.5)) }); } });
    } });
    for (let k = 0; k < 5; k++) cue(st + de + k * 0.22, 'rustle', { gain: 0.4 }); cue(st + de, 'cannon', { gain: 0.5 }); }

  // 12 · His lesson was clear: : Almeida close-up
  { const i = I(12), st = cut_(i);
    add({ id: 'C4m', ch, at: st, year: 1509, note: 'Almeida close-up, looking out to sea', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.06 });
      K.layer(c, 0.2, () => { K.sky(0.3, 520, 820); K.wave(1150, t, { color: P.seaDark }); });
      K.layer(c, 1, () => K.person({ role: 'almeida', x: 460, y: 2300, h: 1700, t }));
    } }); }

  // 13 · whoever rules the sea holds India. : the paraphrase slip, labelled
  { const i = I(13), st = cut_(i), se = Wd('sea', i) - st;
    add({ id: 'C4n', ch, at: st, year: 1509, note: 'torn slip "Rule the sea, hold India." labelled paraphrase · Almeida, over the blue-water map', draw(lt, d, t) {
      K.realMap(K.VIEWS.ocean, { seaTint: [P.royal, 0.45], dim: 0.4 }); K.quoteSlip('Rule the sea, hold India.', 'Almeida', 540, 820, eob(seg(lt, se - 0.3, se)), 72);
    } });
    cue(st + 0.2, 'quill', { dur: 1.2, gain: 0.5 }); }
}
