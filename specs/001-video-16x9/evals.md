---
id: 001-video-16x9
spec: spec.md
spec_version: 35bcb8e22df7b4f67f7015024189a7143a542857dfd316be90d16b76c5a91e01
created: 2026-11-03
---

# Evaluations: 16:9 revision of the video

| ID | Scenario | Input | Expected | Covers | How checked |
| --- | --- | --- | --- | --- | --- |
| E1 | Render format | renders/portuguese-in-india.mp4 | 1920x1080, 30/1 fps, h264 + aac | AC-1 | ffprobe |
| E2 | Wide frame | every chapter sheet | no empty sides, labels whole, captions inside, one border | AC-2, AC-3 | contact sheets reviewed |
| E3 | Chapter voice | data/lines.json | 8 card lines, each first in its chapter | AC-4 | script listing |
| E4 | Constantinople | CH1 frames | march then fire; no seal on the maps | AC-5 | CH1 sheet |
| E5 | Dias | CH1 frames and captions | no slip; the three FR-8 captions | AC-6 | sheet + check caption list |
| E6 | Names | tools/voice.py output | ˈʌkbəɹ and dʒəhˈɑːŋɡiəɹ in the phonemes | AC-7 | printed phonemes; owner listens |
| E7 | Flag | CH3 trading post frame | green/red flag with the yellow sphere | AC-8 | full-size frame |
| E8 | Off-screen props | ships and crowns that slide in | not visible too early in the wider frame | FR-2 | sheets reviewed |

## Scenario catalogue (things real users will do that nobody wrote down)
- The owner scrubs to old timestamps (0:23, 0:37, 4:53): they move by up to about 25 s because of the chapter lines; YOUTUBE.md gets the new chapter times.
- The owner watches on a phone in landscape: captions must stay large enough to read.
