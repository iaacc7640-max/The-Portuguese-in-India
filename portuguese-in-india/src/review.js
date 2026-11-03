// Kit review boards (1920x1080), drawn with the project's own kit: review.html?board=cast | props | maps | card | map&v=india
import { ctx, setCtx } from './core/lib.js';
import { startBoard, panel, frame, cell, small } from './core/board.js';
import * as K from './core/kit.js';
const { P } = K;
const q = new URLSearchParams(location.search), board = q.get('board') || 'cast';
const cv = document.getElementById('cv');

try {
  await document.fonts.load('900 40px Inter'); await document.fonts.load('700 40px Caladea'); await K.loadGeo();
  const pageBg = (b) => { ctx.save(); ctx.beginPath(); ctx.roundRect(b.x, b.y, b.w, b.h, 14); ctx.clip(); ctx.translate(b.x, b.y); ctx.scale(b.w / 1080, b.h / 1920 * 2.2); K.parchment(4); ctx.restore(); };

  if (board === 'cast') {
    startBoard(cv, { title: 'FIRST IN, LAST OUT: CAST SHEET', bg: '#1D1712', line: '#4D3E2F', head: '#F1E6CC', author: 'PAPER ATLAS · ORIGINAL DESIGNS' });
    const rows = [['henry', 'gama', 'pilot', 'zamorin', 'bearer', 'arab', 'cabral', 'almeida', 'albuquerque', 'bahadur'],
      ['jesuit', 'akbar', 'jahangir', 'shahjahan', 'hawkins', 'dutch', 'maratha', 'sailor', 'merchant']];
    const props = { gama: 'map', henry: 'map', jesuit: 'cross', shahjahan: 'seal', almeida: 'scroll' };
    rows.forEach((r, ri) => {
      const b = panel(20, 80 + ri * 500, 1880, 490, ri + 1, ri ? 'PRIESTS, EMPERORS, RIVALS' : 'THE VOYAGE, CALICUT, THE GOVERNORS');
      pageBg(b);
      r.forEach((role, i) => { const cx = b.x + 95 + i * (b.w - 190) / 9; const nm = K.CAST[role].name.toUpperCase(), sp = nm.length > 14 ? nm.lastIndexOf(' ') : -1;
        cell(cx, b.y + 345, 0.42, () => K.person({ role, x: 0, y: 0, arm: props[role] ? 60 : role === 'bearer' ? 80 : 0, prop: props[role], dir: 1, t: 0.5 }), sp > 0 ? nm.slice(0, sp) + '\n' + nm.slice(sp + 1) : nm, 26, '#3E2C1E'); });
    });
  }

  if (board === 'props') {
    startBoard(cv, { title: 'FIRST IN, LAST OUT: PROPS + PLACES', bg: '#1D1712', line: '#4D3E2F', head: '#F1E6CC', author: 'PAPER ATLAS · KIT' });
    let b = panel(20, 80, 1880, 330, 1, 'SHIPS (ONE COLOUR PER POWER)'); pageBg(b);
    const L = '#3E2C1E';
    cell(b.x + 150, b.y + 200, 0.28, () => K.caravel(0, 0, 1, 0.3), 'CARAVEL · PORTUGAL', 60, L);
    cell(b.x + 420, b.y + 200, 0.28, () => K.dhow(0, 0, 1, 0.3, { sail: P.white, hull: P.ink }), 'DHOW · ARAB', 60, L);
    cell(b.x + 650, b.y + 200, 0.28, () => K.dhow(0, 0, 1, 0.3, { sail: P.brown, hull: P.sepia }), 'DHOW · GUJARAT/EGYPT', 60, L);
    cell(b.x + 880, b.y + 200, 0.28, () => K.flagShip(0, 0, 1, 0.3, 'england'), 'ENGLISH SHIP', 60, L);
    cell(b.x + 1110, b.y + 200, 0.28, () => K.flagShip(0, 0, 1, 0.3, 'dutch'), 'DUTCH SHIP', 60, L);
    cell(b.x + 1340, b.y + 200, 0.28, () => K.caravel(0, 0, 1, 0.3, { sil: '#1E2236' }), 'NIGHT SILHOUETTE', 60, L);
    cell(b.x + 1600, b.y + 200, 0.3, () => K.cannon(0, -40, 1, 1, 0.35), 'CANNON + CRIMSON PUFF', 60, L);
    b = panel(20, 420, 940, 320, 2, 'SPICE, MONEY, PAPERS'); pageBg(b);
    cell(b.x + 70, b.y + 230, 0.22, () => K.pepperVine(0, 0, 1), 'PEPPER VINE', 26, L);
    cell(b.x + 190, b.y + 220, 0.4, () => K.sack(0, 0, 1), 'SACK', 36, L);
    cell(b.x + 330, b.y + 210, 0.17, () => K.spiceScale(0, 0, 1, 0.5, () => K.sack(0, 0, 0.4), () => K.coinStack(0, 0, 6)), 'SCALE', 46, L);
    cell(b.x + 450, b.y + 200, 0.6, () => K.coinStack(0, 0, 7), 'COINS', 46, L);
    cell(b.x + 560, b.y + 130, 0.24, () => K.cartaz(0, 0, 1, 1), 'CARTAZ', 110, L);
    cell(b.x + 690, b.y + 130, 0.22, () => K.ledger(0, 0, 1, 1), 'LEDGER + BROKEN CHAIN', 110, L);
    cell(b.x + 820, b.y + 130, 0.22, () => K.lawScroll(0, 0, 1, 1, 'DECREE'), 'LAW SCROLL', 110, L);
    b = panel(970, 420, 930, 320, 3, 'SYMBOLS + FLAGS'); pageBg(b);
    ['portugal', 'calicut', 'arab', 'gujarat', 'mughal', 'england', 'dutch', 'maratha', 'spain', 'india'].forEach((k, i) => cell(b.x + 40 + i * 88, b.y + 200, 0.32, () => K.flag(0, 0, k, 0.4, 1, { h: 360 }), k.toUpperCase(), 30, L));
    b = panel(20, 750, 1880, 316, 4, 'PLACES'); pageBg(b);
    const places = [['CALICUT COURT', () => { K.calicutCourt(); K.person({ role: 'bearer', x: 330, y: 1500, h: 560, arm: 150 }); K.person({ role: 'zamorin', x: 540, y: 1480, h: 620 }); }],
      ['FACTORY 0', () => { K.sky(0); K.wave(1500, 0); K.factoryFort(540, 1420, 0.9, 0, 0); }], ['FACTORY 1', () => { K.sky(0); K.wave(1500, 0); K.factoryFort(540, 1420, 0.9, 1, 0); }], ['FORT 2', () => { K.sky(0); K.wave(1500, 0); K.factoryFort(540, 1420, 0.9, 2, 0); }],
      ['GOA', () => { K.sky(0.3); K.goaSkyline(0); }], ['MUGHAL ARCH', () => { K.mughalArch(); K.person({ role: 'akbar', x: 540, y: 1500, h: 640 }); }], ['HOOGHLY', () => { K.hooghlyPort(0, { tents: 1 }); }],
      ['MOSQUE DOOR', () => { K.parchment(3); K.archDoor(540, 1450, 0.9, 'mosque', 1, 1); }], ['DUSK SEA', () => { K.seascape({ t: 1, night: 0.5, mid: (t) => K.caravel(540, 1120, 0.6, t) }); }], ['NIGHT SEA', () => { K.seascape({ t: 1, night: 1, far: (t) => K.dhow(300, 1000, 0.3, t), lights: () => K.glow(300, 960, 160) }); }],
      ['CROWNS', () => { K.parchment(2); K.crown(540, 900, 1.3, 'portugal'); K.crown(540, 1300, 1.3, 'spain'); }]];
    places.forEach(([lab, fn], i) => { const x = b.x + 8 + i * 168; frame(x, b.y + 4, 140, fn); small(lab, x + 70, b.y + 270, 'center', 12, '#E6DCC6'); });
  }

  if (board === 'maps') {
    startBoard(cv, { title: 'FIRST IN, LAST OUT: REAL MAPS (NATURAL EARTH 1:50M)', bg: '#1D1712', line: '#4D3E2F', head: '#F1E6CC', author: 'GEO CHECK' });
    const views = [['route', ['LISBON', 'CAPE OF GOOD HOPE', 'MALINDI', 'CALICUT'], true], ['med', ['LISBON', 'VENICE', 'CONSTANTINOPLE', 'CAIRO']], ['ocean', ['MALINDI', 'HORMUZ', 'CALICUT', 'GOA', 'MALACCA', 'DIU']],
      ['india', ['DIU', 'SURAT', 'GOA', 'CALICUT', 'COCHIN', 'HOOGHLY', 'FATEHPUR SIKRI', 'BIJAPUR']], ['malabar', ['GOA', 'CANNANORE', 'CALICUT', 'COCHIN']], ['gujarat', ['DIU', 'DAMAN', 'SURAT', 'BASSEIN', 'CHAUL']], ['bengal', ['HOOGHLY']], ['brazil', ['LISBON', 'BRAZIL', 'CAPE OF GOOD HOPE']]];
    views.forEach(([v, pins, route], i) => { const x = 30 + (i % 8) * 236; frame(x, 110, 220, () => { const pr = K.realMap(K.VIEWS[v], { gold: ['portugal'] }); if (route) K.placeRoute(pr, K.SEA_ROUTE, 1); pins.forEach((n, j) => K.pin(pr, n, { size: 46, side: j % 2 ? 'down' : 'up' })); K.eraBar(2); }); small(v.toUpperCase(), x + 110, 530, 'center', 16, '#E6DCC6'); });
    const z = [['malabar', ['GOA', 'CANNANORE', 'CALICUT', 'COCHIN']], ['gujarat', ['DIU', 'DAMAN', 'SURAT', 'BASSEIN', 'CHAUL']], ['india', ['DIU', 'GOA', 'CALICUT', 'HOOGHLY']]];
    z.forEach(([v, pins], i) => { const x = 30 + i * 300; frame(x, 560, 280, () => { const pr = K.realMap(K.VIEWS[v]); pins.forEach((n, j) => K.pin(pr, n, { size: 46, side: j % 2 ? 'right' : 'left' })); }); });
    small('PINS: LEFT/RIGHT SLIPS ON THE CLOSE VIEWS', 1000, 600, 'left', 18, '#E6DCC6');
  }

  if (board === 'card') {
    startBoard(cv, { title: 'FIRST IN, LAST OUT: CHAPTER CARD + ERA BAR', bg: '#1D1712', line: '#4D3E2F', head: '#F1E6CC', author: 'PAPER ATLAS · KIT' });
    [0.12, 0.3, 0.5, 0.75, 0.95, 1.2, 1.6].forEach((lt, i) => { const x = 30 + i * 268; frame(x, 110, 250, () => K.chapterCard(lt, 1.6, { year: 1498, title: 'Hello, Calicut', n: 2, letter: 'C' })); small(`t = ${lt}s`, x + 125, 570, 'center', 16, '#E6DCC6'); });
    frame(30, 600, 250, () => { K.realMap(K.VIEWS.india); K.eraBar(1); });
    frame(300, 600, 250, () => { K.seascape({ t: 2, night: 0, c: { x: 0, y: 0, zoom: 1 }, mid: (t) => K.caravel(600, 1120, 0.6, t) }); K.eraBar(6, 0.97); K.torn('FIRST IN, LAST OUT', 540, 700, 1, -0.02, 76); K.ribbon('1498 → 1961', 540, 480, 1, 96); });
    frame(570, 600, 250, () => { K.parchment(9); K.quoteSlip('Rule the sea, hold India.', 'Almeida', 540, 700, 1, 60); K.eraBar(2); });
  }

  if (board === 'endcard' || board === 'cover') { cv.width = 1080; cv.height = 1920; setCtx(cv.getContext('2d'));
    if (board === 'endcard') { K.parchment(41); K.ribbon('FIRST IN, LAST OUT', 540, 700, 1, 84); K.torn('Full story on the channel', 540, 960, 1, -0.02, 70); K.seal(540, 1230, 1, 'P'); }
    else { const pr = K.realMap(K.VIEWS.route, { gold: ['portugal'] }); K.placeRoute(pr, K.SEA_ROUTE, 1); K.pin(pr, 'LISBON', { side: 'up' }); K.pin(pr, 'CALICUT', { side: 'down', dx: -70 });
      ctx.save(); ctx.globalAlpha = 0.55; ctx.fillStyle = P.parch; ctx.fillRect(0, 1180, 1080, 740); ctx.restore(); K.wave(1320, 0.5, { color: P.seaDark }); K.wave(1480, 1.2, { phase: 2 });
      K.caravel(560, 1360, 0.95, 0.4); K.ribbon('1498', 540, 330, 1.3, 120); K.torn('FIRST IN, LAST OUT', 540, 560, 1.15, -0.02, 84); } }
  if (board === 'map') { cv.width = 1080; cv.height = 1920; setCtx(cv.getContext('2d')); const v = q.get('v') || 'india'; const pr = K.realMap(K.VIEWS[v]); (q.get('pins') || '').split(',').filter(Boolean).forEach((n, j) => K.pin(pr, n, { side: j % 2 ? 'right' : 'left' })); K.eraBar(1); }
  window.REVIEW_READY = true;
} catch (e) { window.REVIEW_ERROR = String(e.stack || e); }
