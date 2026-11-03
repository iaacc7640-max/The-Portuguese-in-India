"""Write data/chapters.json (start/end of each chapter, card included) from script.json + data/lines.json, after voice.py.
Used for YouTube chapter timestamps, QA ranges and the music sections.   python3 tools/chapters.py
"""
import json
from pathlib import Path
R = Path(__file__).resolve().parent.parent
S = json.loads((R / 'script.json').read_text()); Ls = json.loads((R / 'data/lines.json').read_text())
lines, dur = Ls['lines'], Ls['duration']; out = []
for c in sorted(set(l['chapter'] for l in S['lines'])):
    idx = [i for i, l in enumerate(S['lines']) if l['chapter'] == c]
    start = 0.0 if c == 0 else round(lines[idx[0] - 1]['end'] + 0.12, 2)     # the card starts right after the last word of the previous chapter
    card = S.get('cards', {}).get(str(c))
    out.append({'chapter': c, 'title': f"{card['year']}: {card['title']}" if card else 'Cold open', 'start': start, 'first_line': lines[idx[0]]['start'], 'lines': [idx[0], idx[-1]]})
for k, c in enumerate(out): c['end'] = out[k + 1]['start'] if k + 1 < len(out) else dur
(R / 'data/chapters.json').write_text(json.dumps({'duration': dur, 'chapters': out}, indent=1))
for c in out: m, s = divmod(int(c['start']), 60); print(f"{m}:{s:02d}  {c['start']:7.2f}-{c['end']:7.2f}  CH{c['chapter']} {c['title']}")
