# The-Portuguese-in-India — Architecture

> High-level technical truth. Names used here are the names used everywhere else — do not
> invent parallel vocabulary. Update in the same change as the thing it describes.

## Overview
The video "First In, Last Out: The Portuguese in India", as a Paper Atlas project in `portuguese-in-india/`. `script.json` (built from `PLAN.md` by `tools/plan_to_script.py`) holds the narration, captions and sources. The Kokoro voice gives line times; shots are drawn on a canvas per chapter; headless Chrome captures frames; ffmpeg writes the MP4.

## Components and repositories
| Component | Responsibility | Tech | Owner |
| --- | --- | --- | --- |
| src/main.js | Boot, camera, captions, overlays | JS canvas | Pratik Mekhe |
| src/shots.js + src/chapters/ | Shot list per chapter, chapter cards, era bar | JS | Pratik Mekhe |
| src/core/ | The kit: paper look, scenes, real maps, cast, props, timing, captions | JS | Pratik Mekhe |
| tools/ | capture (frames/sheets/video), mix (sound), map bake, script build, chapters, Shorts | Node, Python, bash | Pratik Mekhe |

## Data flow
PLAN.md -> plan_to_script.py -> script.json -> voice.py -> data/narration.wav + lines.json -> words.py -> words.json -> chapters.py -> chapters.json -> capture.mjs cues -> mix.py -> data/mix.wav -> capture.mjs video -> renders/portuguese-in-india.mp4.

## Tech stack and tools
JavaScript canvas 2D, Node 22, Python 3.11 (numpy, scipy, kokoro-onnx), ffmpeg, Chromium via Playwright. data/geo.json from Natural Earth 1:50m (public domain).

## Deployment and environments
Runs locally or in a cloud session. renders/ and data/*.wav are git-ignored and rebuilt from code. The owner uploads to YouTube by hand.

## Boundaries and contracts
No other repo depends on this one.

## Cross-cutting concerns
No secrets. Full render about 13 min on CPU. Whisper word timing needs huggingface.co; without it words are spread inside each line's exact voice time.

## Local development
See AGENTS.md → Commands.
