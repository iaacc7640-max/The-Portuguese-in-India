// Boot: fonts → script + timing → captions → shots. Then draw(t) renders film time t (pure function of t).
// window.OP is the API tools/capture.mjs drives: ready, bootError, duration(), draw(t), frame(t, q), cues(), shots().
import { W, H, SW, SH, setCtx, ctx, clamp, eo, eio } from './core/lib.js';
import { T, loadTiming } from './core/timing.js';
import { buildCaptions, drawCaption, captionList } from './core/captions.js';
import { buildShots } from './shots.js';
import { loadGeo } from './core/kit.js';

const cv = document.getElementById('cv');
setCtx(cv.getContext('2d'));
const OP = (window.OP = { ready: false });

// 16:9 stage: every shot is drawn in its 1080-wide design coordinates and placed by one transform (STAGE), scaled 0.7 and
// centred so stage y 250..1500 sits between the top bar and the captions; backgrounds bleed wide enough to fill 1920x1080.
const STAGE = { s: 0.7, x: 960, y: 540, cx: 540, cy: 986 };
function drawBorder() {
  ctx.save(); ctx.strokeStyle = 'rgba(62,44,30,0.85)'; ctx.lineWidth = 6; ctx.strokeRect(16, 16, SW - 32, SH - 32);
  ctx.strokeStyle = 'rgba(62,44,30,0.35)'; ctx.lineWidth = 2; ctx.strokeRect(28, 28, SW - 56, SH - 56); ctx.restore();
}
function draw(t) {
  t = clamp(t, 0, T.dur - 1e-4);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.letterSpacing = '0px';
  ctx.fillStyle = '#E9DCBC'; ctx.fillRect(0, 0, SW, SH);
  const S = OP._shots; let i = S.length - 1; while (i > 0 && S[i].at > t) i--;
  const sh = S[i], end = i < S.length - 1 ? S[i + 1].at : T.dur, d = end - sh.at, lt = t - sh.at;
  // camera: punch-in on the cut + a slow push across the shot ("camera always moving")
  const punch = 1 + 0.06 * (1 - eo(clamp(lt / 0.25)));
  const drift = 1 + (sh.zoom ?? 0.06) * eio(clamp(lt / d));
  const [cx, cy] = sh.cam || [540, 900];
  ctx.save(); ctx.translate(STAGE.x, STAGE.y); ctx.scale(STAGE.s, STAGE.s); ctx.translate(-STAGE.cx, -STAGE.cy);
  ctx.translate(cx, cy); ctx.scale(punch * drift, punch * drift); ctx.translate(-cx, -cy);
  sh.draw(lt, d, t);
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.letterSpacing = '0px';
  // screen-space vignette (the parchment edge darkening, sized for 16:9)
  { const g = ctx.createRadialGradient(960, 540, 520, 960, 540, 1150); g.addColorStop(0, 'rgba(90,60,30,0)'); g.addColorStop(1, 'rgba(90,60,30,0.32)'); ctx.fillStyle = g; ctx.fillRect(0, 0, SW, SH); }
  if (OP._overlay) { ctx.save(); ctx.translate(24, -46); ctx.scale(0.62, 0.62); OP._overlay(t, sh); ctx.restore(); ctx.globalAlpha = 1; }   // era bar, top-left corner
  drawBorder();                                                                                     // the one frame, start to end
  // fade from / to black on the first and last 0.25 s
  const fade = Math.min(clamp(t / 0.25), clamp((T.dur - t) / 0.35));
  if (fade < 1) { ctx.fillStyle = '#000'; ctx.globalAlpha = 1 - fade; ctx.fillRect(0, 0, SW, SH); ctx.globalAlpha = 1; }
  drawCaption(t);
}

(async () => {
  try {
    await document.fonts.load('900 100px Inter'); await document.fonts.load('700 100px Caladea');
    const script = await (await fetch('script.json', { cache: 'no-store' })).json();
    await loadTiming(); await loadGeo();
    buildCaptions(script);
    OP.script = script;
    const { shots, cues, overlay } = buildShots();
    OP._overlay = overlay || null;
    shots.sort((a, b) => a.at - b.at);
    OP._shots = shots; OP.script = script;
    OP.duration = () => T.dur;
    OP.draw = draw;
    OP.frame = (t, q = 0.92) => { draw(t); return cv.toDataURL('image/jpeg', q); };
    OP.shots = () => shots.map((s, i) => ({ id: s.id, at: +s.at.toFixed(3), end: +(i < shots.length - 1 ? shots[i + 1].at : T.dur).toFixed(3), note: s.note || '' }));
    OP.captions = () => captionList().map((c) => ({ s: +c.s.toFixed(3), e: +c.e.toFixed(3), text: c.words.map((w) => (w.hi ? '*' : '') + w.txt).join(' ') }));
    OP.cues = () => cues.slice().sort((a, b) => a.t - b.t);
    OP.ready = true;
    // preview mode (not capture): play in real time, ?t=12.3 to hold a frame
    const q = new URLSearchParams(location.search);
    if (!q.has('capture')) {
      if (q.has('t')) draw(+q.get('t'));
      else {
        const audio = new Audio('data/mix.wav'); let t0 = null;
        const btn = document.getElementById('play'); btn.hidden = false;
        btn.onclick = () => { btn.hidden = true; t0 = performance.now(); audio.currentTime = 0; audio.play().catch(() => {}); };
        const loop = (now) => { const t = t0 == null ? 0 : (now - t0) / 1000; draw(t0 == null ? 0 : t); if (t0 != null && t > T.dur) { t0 = null; btn.hidden = false; } requestAnimationFrame(loop); };
        requestAnimationFrame(loop);
      }
    }
  } catch (e) { OP.bootError = String(e && e.stack || e); console.error(e); }
})();
