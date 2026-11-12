# AGENTS.md — The-Portuguese-in-India

Instructions for coding agents in this repository.

## Read before you write anything
1. The workspace above, if any: `PROJECT.md`, `ARCHITECTURE.md`, `CONSTITUTION.md`, `CONTRACTS/` (/home/user).
2. `ARCHITECTURE.md` in this repo — the internals of this service.
3. The spec for the feature you are touching: `specs/NNN-slug/`.

## Commands
**If this project uses Python: use `uv` — never `pip`.** `uv add <pkg>` / `uv add --dev <pkg>` to add dependencies, `uv sync` to install,
`uv run <cmd>` to run anything (tests, linters, the app), commit `uv.lock` and never edit it by hand; no `python -m venv`, no `pip install`.

Run from `portuguese-in-india/` (SKILL = the faceless-shorts skill folder):
- Setup: `bash SKILL/scripts/setup.sh`
- Script: `python3 -I tools/plan_to_script.py` (from PLAN.md)
- Voice + timing: `SKILL/scripts/py tools/voice.py .` (project copy with fixed name phonemes) then `SKILL/scripts/py SKILL/scripts/words.py .` then `python3 -I tools/chapters.py`
- Check (must print CHECK OK before "done"): `node tools/capture.mjs check`
- QA sheet for one chapter: `node tools/capture.mjs sheet review/chN.jpg 0.5 9 START END`
- Sound: `node tools/capture.mjs cues` then `SKILL/scripts/py tools/mix.py .`
- Render: `node tools/capture.mjs video renders/portuguese-in-india.mp4`

## Where code lives
**Read `CODEMAP.md` before searching the code.** It lists every code folder and what it holds, where outside systems (LLMs,
databases, APIs) are called, where settings are read, and the entry files and tests. After adding, moving or removing a
folder, run `groundwork.py codemap` and describe any new folder in its Holds column.
`groundwork.py layout` shows the layout decision: the GroundWork standard folders, or "keep" — the repo's own structure,
where new code goes next to code of the same kind and copies its patterns.

## Conventions
- Everything is a pure function of time t; no Math.random, no clocks.
- Shared art goes in src/core (the kit), never copied between chapters.
- Anchor reveals on words with Wd(word, line); spoken text may be phonetic, captions keep real spellings.
- Paper Atlas palette only; crimson for routes/fire/key word, gold for dates/crowns/seals.
- Never commit renders/ or data/*.wav.

## Code quality
Run `groundwork.py verify` after every change (it runs the commands below) and fix what fails. Never weaken a rule,
add an ignore comment or skip a test to make it pass; an ignore needs a reason on the same line.

- test: `cd portuguese-in-india && node tools/capture.mjs check`

1. Reuse before writing: look in CODEMAP.md and search for an existing function first. Never copy-paste a block.
2. Make the smallest change that meets the spec. No speculative abstractions, options or layers.
3. Never swallow errors (no empty catch, no blind `except Exception`). Handle them at the entry point.
4. Validate input where it enters (routes, commands, consumers). Parameterised SQL only; no shell built from input.
5. Add a dependency only with the package manager, after checking it exists and is maintained; prefer what is already used.
6. Comments say why, never what. No commented-out code; no TODO without a tracked item.
7. Names come from the domain (PROJECT.md glossary); no Manager/Helper/Util names.
8. Test behaviour through public functions; mock only connectors to outside systems. A test must fail when the code is wrong.
9. Log through the project's logger, never print in core code, and never log secrets or personal data.
10. Keep files under the size limit and functions short; split by responsibility.

## Process (enforced by the groundwork plugin)
Interview → RFC → human approval → spec → plan → tasks → evals → implement → handover.
Change behaviour ⇒ change the spec in the same change. Do not commit or push unless asked.
