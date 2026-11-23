#!/usr/bin/env python3
"""Prüft die Ergebnisse der Suchagenten und baut die Datenbank-Einträge (stm, Lauf 8).
Aufruf: pruefen.py [--drop id,id,...]  ->  ops-<n>.json, tabelle.txt, bericht.txt"""
import json, glob, re, sys, os, datetime, collections

D = '/home/claude/sweep8/'
BUNDLE = '/home/claude/analyst-desk-doc/memory/pending/data/'
meta = json.load(open(D + 'meta.json', encoding='utf-8'))
A = meta['allowed']; REST = set(meta['rest']); NAMES = meta['names']
old = json.load(open(BUNDLE + 'statements.json', encoding='utf-8'))
desk = json.load(open(BUNDLE + 'desk.json', encoding='utf-8'))
SRC = desk['sources']
FROM, TO = '2026-11-09', '2026-11-23'
drop = set()
if '--drop' in sys.argv: drop = set(sys.argv[sys.argv.index('--drop') + 1].split(','))
PATCH = json.load(open(D + 'patch.json', encoding='utf-8')) if os.path.exists(D + 'patch.json') else {}
drop |= set(PATCH.get('_drop', []))

def words(t): return set(w for w in re.findall(r'[a-zäöüß0-9]{4,}', t.lower()))
def sim(a, b):
    x, y = words(a), words(b)
    return len(x & y) / max(1, min(len(x), len(y)))
def okdate(d): return isinstance(d, str) and re.fullmatch(r'\d{4}-\d{2}-\d{2}', d) and not _bad(d)
def _bad(d):
    try: datetime.date.fromisoformat(d); return False
    except ValueError: return True
def host(u): return re.sub(r'^www\.', '', re.sub(r'^https?://', '', u).split('/')[0])
def longquote(t):
    for q in re.findall(r'[„"“»]([^„"“”«»]{20,})[“”"«]', t):
        if len(q.split()) > 14: return True
    return False

items, heads, bad, files = [], {}, [], sorted(glob.glob(D + 'out/agent-*.json'))
for f in files:
    try: o = json.load(open(f, encoding='utf-8'))
    except Exception as e: bad.append((os.path.basename(f), 'JSON ungültig: %s' % e)); continue
    for h in o.get('heads', []): heads[h.get('id')] = h
    for it in o.get('items', []): it['_f'] = os.path.basename(f); items.append(it)

keep, rej = [], []
oldby = collections.defaultdict(list)
for s in old:
    if s.get('p'): oldby[s['p']].append(s)
for it in items:
    why = []
    p, d, t, u = it.get('p'), it.get('d'), (it.get('t') or '').strip(), (it.get('url') or '').strip()
    if p not in REST: why.append('Kopf nicht im Auftrag')
    if not okdate(d) or not (FROM <= d <= TO): why.append('Datum außerhalb')
    if it.get('s') not in A['stance']: why.append('Haltung ungültig')
    if not (40 <= len(t) <= 650): why.append('Textlänge %d' % len(t))
    if not re.match(r'^https?://[^\s]+\.[^\s]+', u): why.append('URL fehlt')
    if re.search(r'\b13F\b|13-F|Form 13', t + ' ' + (it.get('evid') or ''), re.I): why.append('13F')
    if longquote(t): why.append('Zitat zu lang')
    if not (it.get('evid') or '').strip(): why.append('Beleg fehlt')
    pub = it.get('pub') or ''
    if okdate(pub) and okdate(d) and d > pub: why.append('Aussage nach Veröffentlichung')
    if d == TO and pub != TO: why.append('Sweep-Tag ohne Beleg')
    if why: rej.append((it, '; '.join(why))); continue
    # Doppel gegen Bestand: gleiche Quelle oder gleicher Tag (±1) mit ähnlichem Inhalt
    dup = None
    for s in oldby.get(p, []):
        su = (SRC.get(s.get('src'), {}) or {}).get('u', '')
        near = abs((datetime.date.fromisoformat(s['d']) - datetime.date.fromisoformat(d)).days) <= 1
        if (su and su.split('?')[0] == u.split('?')[0]) or (near and sim(s['t'], t) >= .45): dup = s['id']; break
    if dup: rej.append((it, 'Doppel zum Bestand ' + dup)); continue
    for k in keep:
        if k['p'] == p and ((k['url'].split('?')[0] == u.split('?')[0] and sim(k['t'], t) >= .5) or (k['d'] == d and sim(k['t'], t) >= .55)): dup = 1; break
    if dup: rej.append((it, 'Doppel im Lauf')); continue
    it['t'] = re.sub(r'\s+[–—]\s+', ', ', t); it['url'] = u
    it['t'] = it['t'].replace('Am Tag des Huang-Rücktritts', 'Nach Huangs Rücktritt').replace('Am Tag von Huangs Rücktritt', 'Nach Huangs Rücktritt')
    it['a'] = [x for x in (it.get('a') or []) if x in A['tickers']][:4]
    it['ar'] = [x for x in (it.get('ar') or []) if x in A['areas']][:3]
    it['st'] = [x for x in (it.get('st') or []) if x in A['stories']][:3]
    it['th'] = [x for x in (it.get('th') or []) if isinstance(x, str) and 0 < len(x) < 40][:2]
    it['k'] = it.get('k') if it.get('k') in A['kinds'] else 'Kommentar'
    keep.append(it)

keep = [k for k in keep if True]
keep.sort(key=lambda x: (meta['rest'].index(x['p']), x['d']))
n = collections.Counter(); docs = []
for it in keep:
    i = n[it['p']]; n[it['p']] += 1
    _id = 'c8-%s-%d' % (it['p'], i)
    if _id in drop: continue
    sd = it.get('pub') if okdate(it.get('pub') or '') else it['d']
    doc = {'d': it['d'], 't': it['t'], 's': it['s'], 'k': it['k'], 'p': it['p'], 'a': it['a'], 'ar': it['ar'], 'st': it['st'], 'th': it['th'],
           'srcN': '%s, %s.%s.' % ((it.get('src') or host(it['url'])).replace('www.', ''), sd[8:10], sd[5:7]), 'srcU': it['url'], 'sw': 8, 'at': '2026-11-23T21:30:00Z'}
    if it.get('da'): doc['da'] = 1
    lv = (it.get('lv') or '').strip()
    if lv and len(lv) < 120: doc['lv'] = lv
    for k, v in PATCH.get(_id, {}).items():
        if v is None: doc.pop(k, None)
        else: doc[k] = v
    docs.append((_id, doc, it))

for f in glob.glob(D + 'ops-*.json'): os.remove(f)
if os.path.exists(D + 'tabelle2.txt'): os.remove(D + 'tabelle2.txt')
B = 31
for i in range(0, len(docs), B):
    json.dump([{'op': 'set', 'path': 'stm/' + _id, 'data': doc} for _id, doc, _ in docs[i:i + B]], open(D + 'ops-%d.json' % (i // B + 1), 'w', encoding='utf-8'), ensure_ascii=False)
with open(D + 'tabelle.txt', 'w', encoding='utf-8') as f:
    for _id, doc, it in docs:
        f.write('%s | %s%s | %s | %s | %s | %s%s\n    %s\n    Beleg: %s\n' % (_id, doc['d'], '*' if doc.get('da') else '', doc['k'], doc['s'], ','.join(doc['a']) or '-', doc['srcN'], ' | lv ' + doc['lv'] if doc.get('lv') else '', doc['t'], (it.get('evid') or '')[:170]))
        if it['_f'] > 'agent-1.json' and len(it['_f']) > 12: open(D + 'tabelle2.txt', 'a', encoding='utf-8').write('%s|%s%s|%s|%s|%s|%s\n  %s\n  B: %s\n' % (_id[3:], doc['d'][5:], '*' if doc.get('da') else '', doc['k'][:4], doc['s'], ','.join(doc['a']) or '-', doc['srcN'], doc['t'][:230], (it.get('evid') or '')[:110]))
missing = [h for h in meta['rest'] if h not in heads]
got = collections.Counter(doc['p'] for _id, doc, _ in docs)
none = [h for h in meta['rest'] if h in heads and not got[h]]
with open(D + 'bericht.txt', 'w', encoding='utf-8') as f:
    f.write('Dateien %d, Einträge roh %d, übernommen %d, verworfen %d\n' % (len(files), len(items), len(docs), len(rej)))
    f.write('Köpfe mit Einträgen %d, ohne Fund %d, ohne Rückmeldung %d\n' % (len(got), len(none), len(missing)))
    f.write('ohne Fund: ' + ', '.join(NAMES.get(h, h) for h in none) + '\n')
    f.write('ohne Rückmeldung: ' + ', '.join(missing) + '\n')
    for b in bad: f.write('DATEI %s: %s\n' % b)
    for it, why in rej: f.write('VERWORFEN %s %s %s: %s | %s\n' % (it.get('_f'), it.get('p'), it.get('d'), why, (it.get('t') or '')[:90]))
print(open(D + 'bericht.txt', encoding='utf-8').read()[:3000])
print('Stapel:', len(glob.glob(D + 'ops-*.json')), 'Bytes:', sum(os.path.getsize(x) for x in glob.glob(D + 'ops-*.json')))
