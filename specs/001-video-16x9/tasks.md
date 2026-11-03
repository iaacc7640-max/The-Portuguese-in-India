---
id: 001-video-16x9
spec: spec.md
spec_version: 35bcb8e22df7b4f67f7015024189a7143a542857dfd316be90d16b76c5a91e01
plan: plan.md
created: 2026-11-03
---

# Tasks: 16:9 revision of the video

> One task = one reviewable change, ordered so the suite stays green after each.
> `[P]` marks tasks on disjoint files. Legend: `[ ]` not started · `[~]` in progress · `[x]` done.
> Mark a task `[x]` only after its "done when" is verified.

- [x] **T001** — 16:9 canvas, stage transform, wide backgrounds and maps, screen-space captions, era bar, single border
  - **Files:** index.html, src/main.js, src/core/*.js
  - **Done when:** check prints CHECK OK; sample frames fill 1920x1080 with one border
  - **Covers:** FR-1, FR-2, FR-3, FR-7, FR-10
- [x] **T002** — chapter voice lines, Akbar/Jahangir phonemes, Dias captions; re-voice
  - **Files:** PLAN.md, tools/plan_to_script.py, tools/voice.py, tools/chapters.py, src/shots.js
  - **Done when:** lines.json has 8 card lines at chapter starts; voice.py prints the two phoneme strings
  - **Covers:** FR-4, FR-8, FR-9
- [x] **T003** — CH1 army-and-fire shot, seal removed, Dias slip removed
  - **Files:** src/chapters/ch1_spice.js
  - **Done when:** CH1 sheet shows march then fire, no seal, no Dias slip
  - **Covers:** FR-5, FR-6, FR-8
- [x] **T004** — new Portuguese flag
  - **Files:** src/core/scene.js
  - **Done when:** a flag frame matches the attached design
  - **Covers:** FR-11
- [ ] **T005** — review every chapter sheet, fix collisions, render and probe
  - **Files:** src/chapters/*.js as needed, renders/
  - **Done when:** all 9 sheets reviewed; ffprobe shows 1920x1080 30 fps H.264 AAC
  - **Covers:** FR-1, FR-2, FR-7, FR-10

## Verification
- [ ] **T900** — `groundwork.py verify` passes (format, lint, types, tests)
- [ ] **T901** — every FR in the spec maps to at least one completed task
- [ ] **T902** — the spec's manual-test section was run by hand and matches
- [ ] **T903** — foundation docs (ARCHITECTURE/AGENTS/CONTRACTS/PROJECT) updated or explicitly unchanged; `groundwork.py fresh` is clean
