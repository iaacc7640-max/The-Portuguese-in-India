"""Build script.json from ../PLAN.md (the approved plan screen): narration -> "text" (with phonetic spellings for Kokoro),
caps -> "caps" (correct spellings), chapter numbers, and a card gap after each chapter's last line.
  python3 tools/plan_to_script.py
"""
import json, re
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
PHON = [('Zamorin', 'Zam-oh-rin'), ('Calicut', 'Kalikut'), ('Cannanore', 'Kanna-nore'), ('Albuquerque', 'Al-boo-kerk'), ('Almeida', 'Al-may-da'),
        ('Bijapur', 'Bee-jah-poor'), ('Hooghly', 'Hoog-lee'), ('Diu', 'Dee-oo'), ('Daman', 'Duh-mun'), ('Chaul', 'Chowl'),
        ('Malacca', 'Muh-lakka'), ('Hormuz', 'Hor-mooz'), ('Mumtaz', 'Mum-taz')]
# Akbar and Jahangir are NOT respelled: tools/voice.py speaks them from fixed phonemes (spec 001-video-16x9 FR-9)
CARDS = {1: ('1453', 'The Spice Problem'), 2: ('1498', 'Hello, Calicut'), 3: ('1500', 'Traders Become Raiders'), 4: ('1505', 'Rule the Water'),
         5: ('1510', "Albuquerque's Goa"), 6: ('1580', 'Priests and Emperors'), 7: ('1632', 'The Fall'), 8: ('1961', 'Last to Leave')}
MUSIC = {0: 'bed', 1: 'bed', 2: 'bed', 3: 'tension', 4: 'tension', 5: 'bed', 6: 'bed', 7: 'tension', 8: 'resolve'}
lines, ch = [], -1
for row in (ROOT.parent / 'PLAN.md').read_text().splitlines():
    m = re.match(r'## CH(\d)', row)
    if m: ch = int(m.group(1)); continue
    m = re.match(r'\| (\d+) \| (.+?) \| (.+?) \| (.+) \|$', row)
    if not m: continue
    text, caps = m.group(2).strip(), m.group(3).replace('\\|', '|').strip()
    for a, b in PHON: text = re.sub(rf'\b{a}\b', b, text)
    lines.append({'chapter': ch, 'text': text, 'caps': caps, 'shot': m.group(4).strip()})
# each chapter 1-8 opens with a spoken card line "Chapter one. The Spice Problem." (spec 001-video-16x9 FR-4)
NUM = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']
KEY = {1: 'Spice', 2: 'Calicut', 3: 'Raiders', 4: 'Water', 5: 'Goa', 6: 'Emperors', 7: 'Fall', 8: 'Leave'}
out_lines = []
for ln in lines:
    c = ln['chapter']
    if c > 0 and (not out_lines or out_lines[-1]['chapter'] != c):
        if out_lines: out_lines[-1]['gap'] = 0.7
        title = CARDS[c][1]; spoken = title
        for a, b in PHON: spoken = re.sub(rf'\b{a}\b', b, spoken)
        caps_title = re.sub(rf'\b{KEY[c]}', '*' + KEY[c], title, count=1)
        out_lines.append({'chapter': c, 'card': True, 'text': f'Chapter {NUM[c]}. {spoken}.', 'caps': f'Chapter *{c} | {caps_title}', 'gap': 0.6, 'shot': f'chapter card {CARDS[c][0]}'})
    out_lines.append(ln)
lines = out_lines
S = json.loads((ROOT / 'script.json').read_text()) if (ROOT / 'script.json').exists() else {}
out = {
    'title': 'First In, Last Out: The Portuguese in India', 'voice': 'bm_george', 'speed': 0.97, 'lead': 0.5, 'outro': 2.2, 'gap': 0.3,
    'music': 'chapters', 'music_by_chapter': MUSIC,
    'cards': {str(k): {'year': v[0], 'title': v[1]} for k, v in CARDS.items()},
    'sources': [
        'Rajiv Ahir, A Brief History of Modern India, ch. 3 "Advent of the Europeans in India" (Portuguese section): core narrative, Albuquerque sati ban, persecution in Goa, Hooghly slave trade and Mumtaz Mahal episode, the Portuguese governor\'s sword-and-cross remark (paraphrased)',
        'Corrections to Ahir applied: 1508 defeat at Chaul (not "off Diu" 1507); pilot unnamed ("a Gujarati pilot"); Nuno da Cunha; Bahadur Shah died 13 Feb 1537 after talks aboard a Portuguese ship',
        'Bartolomeu Dias rounded the Cape early 1488 (Wikipedia "Bartolomeu Dias"; SAHO; History.com)',
        'Vasco da Gama reached Calicut 20 May 1498 (Wikipedia "Portuguese India"; herodote.net)',
        'Fort Manuel, Cochin, 1503: first European fort in India (Wikipedia "Fort Emmanuel"; WorldHistory.org "Portuguese Cochin")',
        'Battle of Chaul March 1508, Lourenco de Almeida killed; Battle of Diu 3 Feb 1509 (Wikipedia "Battle of Chaul"; Britannica "Lourenco de Almeida")',
        'Goa taken March 1510, lost May 1510, retaken 25 Nov 1510 (Britannica "History of Goa"; Wikipedia "Portuguese conquest of Goa")',
        'Capital moved from Cochin to Goa 1530 (Wikipedia "Portuguese India")',
        'Bahadur Shah died 13 Feb 1537 off Diu during talks aboard a Portuguese ship; accounts differ on how (Wikipedia "Bahadur Shah of Gujarat", "Siege of Diu (1538)")',
        'Jesuit mission (Acquaviva, Monserrate, Henriques) reached Fatehpur Sikri Feb/March 1580 (Dawn; Wikipedia "Antoni de Montserrat")',
        'William Hawkins at Surat, August 1608 (GKToday); Battle of Swally, Nov 1612 (Wikipedia "Battle of Swally")',
        'Siege of Hooghly, June-Sept 1632, about three months (Wikipedia "Siege of Hooghly"; Royal Collection "The Capture of Port Hugli")',
        'Dutch take Cochin (Jan 1663) and Cannanore (Feb 1663) (Wikipedia "Dutch conquest of Malabar")',
        'Marathas take Bassein 1739 (not independently re-checked this session)',
        'Operation Vijay, 18-19 Dec 1961: Goa, Daman and Diu annexed by India (Wikipedia "Annexation of Goa"; USI of India)',
    ],
    'lines': lines,
}
(ROOT / 'script.json').write_text(json.dumps(out, indent=1, ensure_ascii=False))
words = sum(len(l['text'].split()) for l in lines)
print(f'script.json: {len(lines)} lines, {words} spoken words, chapters {sorted(set(l["chapter"] for l in lines))}')
