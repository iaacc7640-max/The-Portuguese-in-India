// CH5 · "1510: Albuquerque's Goa": strongholds at the ocean's gates, Goa taken from Bijapur, settlers, tobacco and cashew,
// the sati ban, persecution of Muslims (a closed, padlocked door), Goa the capital, and Bahadur Shah who never came home.
import { ctx, W, H, clamp, lerp, seg, eo, eio, eob, rnd, line, circle } from '../core/lib.js';
import * as K from '../core/kit.js';
const { P } = K;
const GOA = { lon: 74.0, lat: 15.5, w: 7 };

function tobacco(x, y, s) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); K.cut(K.P_rr(-8, -420, 16, 420, 6), P.forest, { shadow: 0.4, edge: 3 }); for (let k = 0; k < 5; k++) { const sd = k % 2 ? 1 : -1; K.cut(() => { ctx.beginPath(); ctx.ellipse(sd * 90, -80 - k * 70, 100 - k * 12, 40 - k * 4, sd * -0.4, 0, Math.PI * 2); }, '#8E9A5E', { shadow: 0.4, edge: 3 }); } for (let k = 0; k < 4; k++) circle(-20 + k * 14, -440, 12, '#E8B0B8'); ctx.restore(); }
function cashew(x, y, s) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); K.cut(K.P_rr(-10, -380, 20, 380, 6), P.sepia, { shadow: 0.4, edge: 3 }); for (let k = 0; k < 4; k++) { const sd = k % 2 ? 1 : -1; K.cut(() => { ctx.beginPath(); ctx.ellipse(sd * 80, -120 - k * 60, 80, 34, sd * -0.3, 0, Math.PI * 2); }, P.forest, { shadow: 0.4, edge: 3 }); }
  K.cut(() => { ctx.beginPath(); ctx.ellipse(40, -330, 40, 54, 0, 0, Math.PI * 2); }, '#D9772E', { shadow: 0.5, edge: 3 }); K.cut(() => { ctx.beginPath(); ctx.ellipse(46, -260, 24, 16, 0.4, 0, Math.PI * 2); }, '#B49668', { shadow: 0.3, edge: 3 }); ctx.restore(); }
function garland(y, p, t) { const n = 26; for (let k = 0; k < n * clamp(p); k++) { const u = k / (n - 1), x = lerp(120, 960, u), yy = y + Math.sin(u * Math.PI) * 200 + Math.sin(t * 2 + k) * 3; circle(x, yy, 26, k % 3 ? P.saffron : P.gold); circle(x - 6, yy - 6, 8, 'rgba(255,255,255,0.25)'); } }
function houses(t, smoke = 0) { for (let k = 0; k < 3; k++) { const x = 180 + k * 330; K.cut(K.P_rr(x - 120, 1120, 240, 220, 4), k % 2 ? '#E8DCC4' : '#D9B98E', { shadow: 0.6, edge: 4 }); K.cut(K.P_poly([[x - 140, 1124], [x, 1020], [x + 140, 1124]]), P.wine, { shadow: 0.5, edge: 4 }); ctx.fillStyle = P.ink; ctx.fillRect(x - 30, 1240, 60, 100); if (smoke > 0) K.smokeColumn(x + 70, 1040, 0.35, t + k, smoke * 0.7); } }

export default function (B) {
  const { add, cue, cut_, Wd, L, Le, i0 } = B, ch = 5, I = (k) => i0 + k;

  // 0 · His successor, Afonso de Albuquerque, | went further. (two cuts)
  { const i = I(0), st = cut_(i), wf = Wd('went', i) - st;
    add({ id: 'C5a', ch, at: st, year: 1509, note: 'Albuquerque (very long white beard, tall hat) steps forward; name slip', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.06 }); K.layer(c, 0.3, () => { K.sky(0.2, 420, 820); K.wave(1100, t, { color: P.seaDark }); K.caravel(820, 1120, 0.3, t); });
      K.layer(c, 1, () => { K.cut(K.P_rr(-1100, 1380, W + 2200, 700, 0), '#C9A878', { shadow: 0.5, edge: 5 }); K.person({ role: 'albuquerque', x: lerp(380, 480, eio(clamp(lt / d))), y: 1500, h: 860, walk: lt * 4, t }); });
      K.slip('AFONSO DE ALBUQUERQUE', 540, 430, eob(seg(lt, 0.3, 0.6)), -0.02, 46);
    } });
    const s2 = st + wf - 0.08;
    add({ id: 'C5b', ch, at: s2, year: 1509, note: 'ocean map: his pointing hand sweeps across; a crimson arrow pushes past Cochin', draw(lt, d, t) {
      const pr = K.realMap(K.VIEWS.ocean, { seaTint: [P.royal, 0.25] }); K.fortIcon(...pr('COCHIN'), 0.8, P.royal);
      K.dashedRoute([pr('COCHIN'), pr([70, 12]), pr([62, 20]), pr('HORMUZ')], eio(clamp(lt / d)));
    } });
    cue(st + 0.3, 'pop', { gain: 0.4 }); cue(s2, 'zip', { gain: 0.5 }); }

  // 1 · He built strongholds at every gate of the ocean, : padlock-forts on the ocean's doors
  { const i = I(1), st = cut_(i), ga = Wd('gate', i) - st;
    add({ id: 'C5c', ch, at: st, year: 1510, note: 'ocean map: royal-blue forts appear at the sea gates, a small padlock on each', draw(lt, d, t) {
      const pr = K.realMap(K.VIEWS.ocean, { seaTint: [P.royal, 0.25] }); ['COCHIN', 'GOA', 'HORMUZ', 'MALACCA'].forEach((n, k) => { const s = eob(clamp((lt - ga + 0.3 - k * 0.2) / 0.3)); const [x, y] = pr(n); K.fortIcon(x, y, 0.8 * s, P.royal); if (s > 0.5) K.padlock(x + 50, y - 60, 0.35 * s); });
    } });
    for (let k = 0; k < 4; k++) cue(st + ga - 0.3 + k * 0.2, 'thud', { gain: 0.35 }); }

  // 2 · from Hormuz to Malacca, : pins pop at Hormuz, then Malacca
  { const i = I(2), st = cut_(i), ho = Wd('hor', i) - st, ma = Wd('muh', i) - st;
    add({ id: 'C5d', ch, at: st, year: 1510, note: 'Hormuz and Malacca pinned (Hormuz at the Gulf mouth, Malacca on the Malay peninsula)', draw(lt, d, t) {
      const pr = K.realMap(K.VIEWS.ocean, { seaTint: [P.royal, 0.25] }); ['COCHIN', 'GOA', 'HORMUZ', 'MALACCA'].forEach((n) => K.fortIcon(...pr(n), 0.8, P.royal));
      K.pin(pr, 'HORMUZ', { side: 'down', sc: eob(seg(lt, ho, ho + 0.3)), text: 'HORMUZ', r: 0.1 }); if (lt > ma) K.pin(pr, 'MALACCA', { side: 'down', sc: eob(seg(lt, ma, ma + 0.3)), r: 0.1, dx: -40 });
    } });
    cue(st + ho, 'pop', { gain: 0.5 }); cue(st + ma, 'pop', { gain: 0.5 }); }

  // 3 · and in 1510, he captured Goa | from the Sultan of Bijapur. (two cuts)
  { const i = I(3), st = cut_(i), ca = Wd('captured', i) - st;
    add({ id: 'C5e', ch, at: st, year: 1510, note: 'map: zoom to Goa, ribbon 1510', draw(lt, d, t) {
      const pr = K.realMap(K.lerpView(K.VIEWS.india, GOA, eio(clamp(lt / d)))); K.ribbon('1510', 540, 420, eob(seg(lt, 0.1, 0.45)), 100); K.pin(pr, 'GOA', { side: 'left', sc: eob(seg(lt, d * 0.5, d * 0.5 + 0.3)), size: 50 });
    } });
    const s2 = st + ca - 0.08;
    add({ id: 'C5f', ch, at: s2, year: 1510, note: 'flag swap on Goa: Bijapur brown flag slides down, the Portuguese flag rises', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.06 }); K.layer(c, 0.2, () => { K.sky(0.1, 420, 820); K.wave(1250, t, { color: P.seaDark }); });
      K.layer(c, 1, () => { K.cut(K.P_rr(-1100, 1240, W + 2200, 900, 0), '#C9A878', { shadow: 0.5, edge: 5 }); K.cut(K.P_rr(100, 1000, 880, 260, 4), P.stone, { shadow: 0.6, edge: 5 }); for (let k = 0; k < 11; k++) K.cut(K.P_rr(100 + k * 82, 966, 56, 40, 3), P.stone, { shadow: 0, edge: 3 });
        const sw = eio(clamp((lt - 0.2) / 1.2)); K.flag(380, 1000, 'bijapur', t, 1, { lower: sw, h: 560 }); K.flag(680, 1000, 'portugal', t, 1, { lower: 1 - sw, h: 560 }); });
      K.slip('FROM THE SULTAN OF BIJAPUR', 540, 430, eob(seg(lt, 0.2, 0.5)), -0.02, 42);
    } });
    cue(s2 + 0.2, 'slide', { dur: 1.2, gain: 0.5 }); cue(s2 + 1.4, 'pop', { gain: 0.5 }); }

  // 4 · He told his men to marry local women | and settle down. (two cuts)
  { const i = I(4), st = cut_(i), se = Wd('settle', i) - st;
    add({ id: 'C5g', ch, at: st, year: 1510, note: 'a marigold wedding garland strings across the frame', draw(lt, d, t) {
      K.parchment(26); garland(700, eio(clamp(lt / (d * 0.8))), t); K.slip('MARRY AND SETTLE', 540, 1180, eob(seg(lt, 0.3, 0.6)), -0.02, 50); } });
    const s2 = st + se - 0.08;
    add({ id: 'C5h', ch, at: s2, year: 1510, note: 'small family houses go up, smoke from the hearths', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.05 }); K.layer(c, 0.2, () => K.sky(0.2, 420, 820));
      K.layer(c, 1, () => { K.cut(K.P_rr(-1100, 1330, W + 2200, 900, 0), '#C9A878', { shadow: 0.4, edge: 5 }); for (let k = 0; k < 4; k++) K.palm(60 + k * 320, 1340, 0.6, t + k); ctx.save(); ctx.translate(0, (1 - eob(clamp(lt / 0.6))) * 300); houses(t, clamp(lt - 0.4)); ctx.restore(); garland(560, 1, t); });
    } });
    cue(st + 0.3, 'sparkle', { dur: 1, gain: 0.5 }); cue(s2 + 0.2, 'thud', { gain: 0.3 }); }

  // 5 · They brought tobacco and cashew, : the two plants grow
  { const i = I(5), st = cut_(i), tb = Wd('tobacco', i) - st, cs = Wd('cashew', i) - st;
    add({ id: 'C5i', ch, at: st, year: 1510, note: 'a tobacco plant then a cashew tree grow from the soil, each on its word', draw(lt, d, t) {
      K.parchment(27); K.cut(K.P_rr(-1100, 1380, W + 2200, 700, 0), '#A88A5E', { shadow: 0.4, edge: 5 });
      tobacco(330, 1390, 1.4 * eob(clamp((lt - tb + 0.2) / 0.5))); cashew(760, 1390, 1.5 * eob(clamp((lt - cs + 0.2) / 0.5)));
      if (lt > tb) K.slip('TOBACCO', 330, 640, eob(seg(lt, tb, tb + 0.3)), -0.03, 44); if (lt > cs) K.slip('CASHEW', 760, 640, eob(seg(lt, cs, cs + 0.3)), 0.03, 44);
    } });
    cue(st + tb, 'pop', { gain: 0.5 }); cue(st + cs, 'pop', { gain: 0.5 }); }

  // 6 · and Albuquerque banned sati in Goa. : a law scroll, the seal stamps on "banned"
  { const i = I(6), st = cut_(i), ba = Wd('banned', i) - st;
    add({ id: 'C5j', ch, at: st, year: 1510, note: 'a decree scroll "SATI BANNED IN GOA"; the seal stamps on "banned"', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.06 }, { zoom: 1.0 }); K.layer(c, 0.3, () => K.parchment(28)); K.layer(c, 1, () => K.lawScroll(540, 900, 1.2, clamp((lt - ba) / 0.25), 'SATI BANNED'));
      K.slip('IN GOA', 760, 380, eob(seg(lt, 0.2, 0.5)), 0.04, 44);
    } });
    cue(st + ba, 'seal'); }

  // 7 · But Muslims, Portugal's old rivals, : a Goa street at dusk with a mosque
  { const i = I(7), st = cut_(i);
    add({ id: 'C5k', ch, at: st, year: 1510, note: 'a quiet Goa street at dusk, a mosque at its end', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.12, y: -30 }); K.layer(c, 0.2, () => K.sky(0.5, 500, 260));
      K.layer(c, 0.7, () => K.archDoor(540, 1360, 0.75, 'mosque', 0, 0)); K.layer(c, 1, () => { K.cut(K.P_rr(-1100, 1360, W + 2200, 900, 0), '#C9A878', { shadow: 0.4, edge: 5 }); for (const x of [80, 1000]) K.cut(K.P_rr(x - 140, 900, 280, 470, 4), '#D9B98E', { shadow: 0.6, edge: 4 }); });
    } });
    cue(st, 'wind', { dur: 2.2, gain: 0.4 }); }

  // 8 · were bitterly persecuted. : the mosque door shuts and is padlocked
  { const i = I(8), st = cut_(i), pe = Wd('persecuted', i) - st;
    add({ id: 'C5l', ch, at: st, year: 1510, note: 'the mosque door swings shut and a padlock snaps on (no people)', draw(lt, d, t) {
      K.parchment(29); K.archDoor(540, 1420, 1.0, 'mosque', clamp((lt - 0.1) / 0.5), clamp((lt - pe) / 0.3)); } });
    cue(st + 0.4, 'slam', { gain: 0.6 }); cue(st + pe, 'thud', { gain: 0.5 }); }

  // 9 · By 1530, Goa was the capital, : Goa skyline, ribbon 1530, CAPITAL seal
  { const i = I(9), st = cut_(i), ca = Wd('capital', i) - st;
    add({ id: 'C5m', ch, at: st, year: 1530, note: 'Goa skyline with its white church; ribbon 1530; seal + CAPITAL slip on "capital"', draw(lt, d, t) {
      const c = K.cam(lt, d, { x: 30 }, { x: -30, zoom: 1.05 }); K.layer(c, 0.2, () => K.sky(0.2, 420, 820)); K.layer(c, 1, () => K.goaSkyline(t, 1380));
      K.ribbon('1530', 540, 400, eob(seg(lt, 0.1, 0.45)), 96); if (lt > ca) { K.seal(820, 600, eob(seg(lt, ca, ca + 0.3)) * 0.8, 'G'); K.slip('THE CAPITAL', 500, 600, eob(seg(lt, ca, ca + 0.3)), -0.03, 50); }
    } });
    cue(st + 0.1, 'pop', { gain: 0.4 }); cue(st + ca, 'seal'); }

  // 10 · and in 1537, | Sultan Bahadur Shah of Gujarat (two cuts)
  { const i = I(10), st = cut_(i), ba = Wd('sultan', i) - st;
    add({ id: 'C5n', ch, at: st, year: 1537, note: 'Gujarat map: Diu pinned, ribbon 1537', draw(lt, d, t) {
      const pr = K.realMap(K.VIEWS.gujarat); K.ribbon('1537', 540, 420, eob(seg(lt, 0.1, 0.45)), 96); K.pin(pr, 'DIU', { side: 'down', color: P.brown, sc: eob(seg(lt, 0.3, 0.6)), size: 48 }); } });
    const s2 = st + ba - 0.08;
    add({ id: 'C5o', ch, at: s2, year: 1537, note: 'Bahadur Shah (crimson-brown robe and turban) on the shore at Diu', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.08 }); K.layer(c, 0.2, () => { K.sky(0.45, 480, 260); K.wave(1000, t, { color: P.seaDark }); K.caravel(800, 1030, 0.4, t); });
      K.layer(c, 1, () => { K.cut(K.P_rr(-1100, 1380, W + 2200, 700, 0), '#C9A878', { shadow: 0.5, edge: 5 }); K.person({ role: 'bahadur', x: 360, y: 1500, h: 820, t }); });
      K.slip('BAHADUR SHAH', 540, 430, eob(seg(lt, 0.2, 0.5)), -0.02, 52);
    } });
    cue(st + 0.1, 'pop', { gain: 0.4 }); cue(s2 + 0.2, 'pop', { gain: 0.4 }); }

  // 11 · went aboard a Portuguese ship for talks, : he steps onto the ship at dusk
  { const i = I(11), st = cut_(i), ab = Wd('aboard', i) - st;
    add({ id: 'C5p', ch, at: st, year: 1537, note: 'dusk: Bahadur Shah walks up the gangplank onto a Portuguese ship', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.06, x: 30 }); K.seascape({ t, c, night: 0.55, horizon: 980, sunX: 240, sunY: 520,
        mid: (tt) => { K.caravel(700, 1120, 0.75, tt); K.cut(K.P_poly([[120, 1260], [460, 1090], [480, 1110], [140, 1290]]), P.sepia, { shadow: 0.5, edge: 3 }); const k = eio(clamp(lt / d)); K.person({ role: 'bahadur', x: lerp(160, 420, k), y: lerp(1270, 1100, k), h: 380, walk: lt * 6, t }); } });
    } });
    cue(st, 'creak', { gain: 0.6 }); cue(st + ab, 'waves', { dur: 2, gain: 0.5 }); }

  // 12 · and never came home. : his turban floating on dark water
  { const i = I(12), st = cut_(i);
    add({ id: 'C5q', ch, at: st, year: 1537, note: 'night: only his crimson-brown turban floats on the dark water', draw(lt, d, t) {
      const c = K.cam(lt, d, { zoom: 1.0 }, { zoom: 1.1, y: 30 }); K.seascape({ t, c, night: 1, horizon: 960,
        lights: (tt) => { const x = 540 + Math.sin(tt * 0.6) * 20, y = K.waveY(540, 1180, tt, { amp: 20, len: 0.01, speed: 1.2, phase: 2 }); K.glow(x, y - 20, 260, '#E9DCBC', 0.18); K.cut(() => { ctx.beginPath(); ctx.ellipse(x, y, 160, 66, Math.sin(tt) * 0.1, Math.PI, Math.PI * 2); ctx.ellipse(x, y, 160, 24, 0, 0, Math.PI); }, '#7A4430', { shadow: 0.4, edge: 4 }); line([[x - 120, y - 30], [x + 120, y - 50]], 'rgba(0,0,0,0.2)', 6); circle(x + 60, y - 40, 12, P.gold); } });
    } });
    cue(st, 'waves', { dur: 2.5, gain: 0.6 }); }
}
