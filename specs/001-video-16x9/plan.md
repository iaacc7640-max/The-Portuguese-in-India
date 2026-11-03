---
id: 001-video-16x9
spec: spec.md
spec_version: 35bcb8e22df7b4f67f7015024189a7143a542857dfd316be90d16b76c5a91e01
created: 2026-11-03
---

# Plan: 16:9 revision of the video

## 1. Approach
- Canvas becomes 1920x1080 (FR-1). Each shot is still drawn in its existing coordinates, placed by one stage transform (scale 0.7, centred) so content fits between the top bar and the captions; every full-bleed background and the maps are widened so the whole frame is covered (FR-2, FR-7, FR-10). Maps cull and draw their grid over the wider area; pin slips clamp to the wide frame.
- Captions, the era bar (top-left corner) and the single border (FR-3) are drawn in screen space after the shot. Map and chapter-card borders are removed.
- script.json gets one card line per chapter ("Chapter one. The Spice Problem.") from tools/plan_to_script.py; chapter modules index from the first non-card line; the card shot spans the card line (FR-4).
- Voice: a project copy of voice.py (tools/voice.py) replaces marked names with fixed phonemes (Akbar ˈʌkbəɹ, Jahangir dʒəhˈɑːŋɡiəɹ) and sends phonemes to Kokoro (FR-9).
- CH1: a new army-and-fire shot replaces the seal shot; the seal is removed from the map shots (FR-5, FR-6). The Dias slip is removed and its captions changed in PLAN.md (FR-8).
- flag('portugal') is redrawn to the attached design (FR-11).

## 2. Affected modules and files
The repo keeps its own structure: portuguese-in-india/index.html, src/main.js, src/core/{lib,paper,scene,maps,captions}.js, src/shots.js, src/chapters/ch1_spice.js (plus small fixes in other chapters as the sheets show), tools/plan_to_script.py, tools/chapters.py, new tools/voice.py, PLAN.md.

## 3. Data model and migrations
script.json lines gain "card": true for chapter lines; data/chapters.json start times move.

## 4. Interfaces and contracts
None outside the repo.

## 5. Failure modes and edge cases
Objects that were off-screen in 9:16 can show in the wider frame (ships waiting to slide in): fixed shot by shot from the sheets. Phonemes cannot be checked by Whisper (blocked); the owner listens.

## 6. Test strategy
capture.mjs check (must print CHECK OK) + one contact sheet per chapter reviewed + ffprobe of the render + the phoneme strings printed by tools/voice.py.

## 7. Rollout and rollback
The new render replaces renders/portuguese-in-india.mp4; the old 9:16 file is kept as renders/portuguese-in-india_9x16.mp4. Rollback = check out the previous commit and re-render.

## 8. Constitution check
As spec section 10: facts unchanged, quotes labelled, every frame reviewed, no AI images, renders not committed.
