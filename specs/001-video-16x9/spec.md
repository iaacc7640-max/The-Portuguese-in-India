---
id: 001-video-16x9
rfc: RFC-0001
title: 16:9 revision of the video
status: draft
created: 2026-11-03
author: noreply@anthropic.com
requested_by: Pratik Mekhe
owner: Pratik Mekhe
implemented_by: []
support: []
extends: []
depends_on: []
builds_against: []
amends: []
---

# Spec: 16:9 revision of the video

## 1. Problem
The finished film is vertical (9:16) and 5:46 long, so YouTube treats it as a normal video in the wrong shape. The owner also found wrong scenes, labels, names and a flag (RFC-0001).

## 2. Users and context
Pratik Mekhe (owner) uploads the film to YouTube for Indian students and history fans.

## 3. User stories
- **US-1**: As the owner, I want the film in 16:9 so that it plays full-screen as a normal YouTube video.
- **US-2**: As a viewer, I want each chapter announced and names said correctly so that the story is easy to follow.

## 4. Functional requirements
- **FR-1**: The film MUST be 1920x1080, 30 fps, H.264 + AAC, at renders/portuguese-in-india.mp4.
- **FR-2**: Every shot MUST fill the 16:9 frame (no black or empty side bars); captions sit at the bottom and stay readable.
- **FR-3**: One border MUST frame every frame from the first to the last; shots and chapter cards MUST NOT draw borders of their own.
- **FR-4**: Each of chapters 1-8 MUST open with the voice saying "Chapter <number>. <title>" (The Spice Problem, Hello Calicut, Traders Become Raiders, Rule the Water, Albuquerque's Goa, Priests and Emperors, The Fall, Last to Leave) while its chapter card shows.
- **FR-5**: At "the Ottoman Turks captured Constantinople" the film MUST show soldiers marching to the walled city, then fire and smoke over it when they arrive; no fighting or bodies.
- **FR-6**: No red wax seal MUST appear on Constantinople; the following map shots show only its pin and name.
- **FR-7**: The Atlantic label (0:37 in the old cut) and every map label MUST be fully visible and not covered.
- **FR-8**: The Dias line MUST show no "BARTOLOMEU DIAS" slip; its captions read "Bartholomew Dias", "rounded the Cape", "of Good Hope".
- **FR-9**: "Akbar" MUST be spoken like "UHK-bur" and "Jahangir" like "juh-HAHN-geer".
- **FR-10**: The map at "every Portuguese fort on the Malabar coast" (4:53 in the old cut) and every other map MUST show the whole relevant coast, nothing cut off.
- **FR-11**: Every Portuguese flag MUST use the owner's attached design: green hoist (about 2/5), red fly, yellow armillary sphere with a red-and-white shield on the line between them.

## 5. Non-functional requirements
- **NFR-1**: Everything stays drawn in code in the Paper Atlas look; no AI images.
- **NFR-2**: Facts, sources and narration other than FR-4 and FR-8 are unchanged.

## 6. Acceptance criteria
- **AC-1**: Given the render, when probed, then it is 1920x1080, 30 fps, H.264 + AAC. (covers FR-1)
- **AC-2**: Given each chapter's contact sheet, when reviewed, then no frame has empty side bars, labels are not cut, and captions are inside the frame. (covers FR-2, FR-7, FR-10)
- **AC-3**: Given the contact sheets, when reviewed, then the same single border is on every frame, including cards. (covers FR-3)
- **AC-4**: Given the narration timings, when listed, then a "Chapter N" line starts each chapter 1-8 during its card. (covers FR-4)
- **AC-5**: Given the frames at the Constantinople line, then soldiers march and the city then burns, and no seal shows on that or the next map shots. (covers FR-5, FR-6)
- **AC-6**: Given the Dias shots, then no "BARTOLOMEU DIAS" slip shows and the captions match FR-8. (covers FR-8)
- **AC-7**: Given the phonemes sent to the voice for the Akbar and Jahangir lines, then they contain the planned sounds. (covers FR-9)
- **AC-8**: Given frames with a Portuguese flag, then it matches the attached design. (covers FR-11)

## 7. Failure behaviour
If a render or check fails, the previous 9:16 film stays as the delivered version and the failure is reported to the owner with the error.

## 8. Manual test
1. Open renders/portuguese-in-india.mp4: it fills a 16:9 screen with one border all the way through.
2. At each chapter card, hear "Chapter one. The Spice Problem." through "Chapter eight. Last to Leave."
3. At the Constantinople line, see the army march and the city burn; on the next maps, only the pin and name.
4. Check the Atlantic label, the Dias captions and the Malabar forts map are fully visible.
5. Listen to the Akbar line and the Jahangir line in chapter 6.
6. Look at a Portuguese flag (e.g. the trading post in chapter 3): green and red with the yellow sphere.

## 9. Out of scope
The three 9:16 Shorts; any new facts or other script changes.

## 10. Constitution check
Facts sourced and unchanged (NFR-2). Paraphrased quotes stay labelled. Every frame reviewed via contact sheets (AC-2, AC-3). No AI images (NFR-1). Renders not committed.
