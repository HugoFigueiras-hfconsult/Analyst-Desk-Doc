#!/usr/bin/env python3
# Vorlage: wiederholbarer Bau des Bündels für einen Lauf. Im Scratchpad neben base/, k/, desk/, out/ ablegen.
# Eingang base/ (Kopie von memory/pending/data), Kurse k/prices.json (Zweig kurse), Ausgang desk/data/ und out/plan.json.
# Aufruf: python3 bau.py 2026-11-28T06:35Z   (Zeit mit date -u bestimmen)
import json, os, sys, shutil
S = os.path.dirname(os.path.abspath(__file__)); B = S + '/base/'; O = S + '/desk/data/'
AT = sys.argv[1]; TODAY = AT[:10]
L = lambda n: json.load(open(B + n + '.json', encoding='utf-8'))
people, stm, moves, stories, scen, desk, kb, calls, cal, agent = (L(n) for n in ['people', 'statements', 'moves', 'stories', 'scenarios', 'desk', 'kb', 'calls', 'calendar', 'agent'])
RUN = desk['sweep']['n'] + 1  # gegen Datenbank prüfen: max(sw in stm und tl, run in files) + 1
ST = {s['id']: s for s in stories}; KB = {k['id']: k for k in kb}; P = {p['id'] for p in people}; SC = {s['id']: s for s in scen}
TH = {t for s in stm for t in s.get('th', [])}; IDS = {s['id'] for s in stm}

# ---- Quellen: Schlüssel -> (Name mit Datum, URL); kein Schlüssel darf schon vorhanden sein
SRC = {}
for k, (n, u) in SRC.items():
    assert k not in desk['sources'], k; desk['sources'][k] = {'n': n, 'u': u}

# ---- Aussagen: Felder wie statements.json, ohne sw
NEW = []
for n in NEW:
    assert n['id'] not in IDS and n['src'] in desk['sources'] and all(t in TH for t in n['th']), n['id']
    assert all(a in desk['assets'] for a in n['a']) and all(a in desk['areas'] for a in n['ar']) and all(x in ST for x in n['st']), n['id']
    assert ('p' in n and n['p'] in P) or n.get('who'), n['id']; assert len(n['t']) <= 700, n['id']
    n['sw'] = RUN; stm.append(n)
CORR = []  # [[id, sw]] für korrigierte Bestandseinträge (sw = Lauf, oder bisherige sw, wenn das Dokument schon in stm liegt)
DEL = []

# ---- Positionen: 13F ohne per und d, alles andere mit per und Handelstag d
def mv_find(p, tk, d=None):
    r = [m for m in moves if m['p'] == p and m['tk'] == tk and (d is None or m.get('d') == d)]; assert len(r) == 1, (p, tk, d, len(r)); return r[0]
MV = []
for x in MV:
    assert x['p'] in P and x['sec'] in desk['areas'] and x['src'] in desk['sources']
    assert not [m for m in moves if m['p'] == x['p'] and m['tk'] == x['tk'] and m.get('d') == x.get('d')], (x['p'], x['tk'])
    moves.append(x)

# ---- Stories: Ereignis anhängen, Quellen ergänzen, Zusammenfassung nur mit geprüftem Anfang ersetzen
def tl(sid, d, t):
    s = ST[sid]; assert not [e for e in s['tl'] if e['d'] == d and e['t'] == t]
    s['tl'].append({'d': d, 't': t}); s['tl'].sort(key=lambda e: e['d'])
def src(sid, *keys):
    for k in keys:
        assert k in desk['sources'], k
        if k not in ST[sid]['src']: ST[sid]['src'].append(k)
def setsum(sid, start, new):
    assert ST[sid]['sum'].startswith(start), (sid, ST[sid]['sum'][:60]); ST[sid]['sum'] = new
# Stories ohne px (fed, capex, rot, spx27, gold): kpi, sub und lv.now von Hand, je mit assert auf den alten Wert

# ---- Kalender: vorhandenen Termin eindeutig greifen, neue anhängen, älter als 14 Tage entfernen
def cal_one(d, start):
    r = [c for c in cal if c['d'] == d and c['t'].startswith(start)]; assert len(r) == 1, (d, start, len(r)); return r[0]
CAL = []
for x in CAL:
    assert x['src'] in desk['sources'] and all(a in desk['assets'] for a in x.get('aff', [])); cal.append(x)
cal.sort(key=lambda c: c['d'])

# ---- Wissensbank: open je Leitfigur neu fassen, Thesen vorn einfügen (höchstens 5, neueste zuerst)
OPEN = {}; THN = {}
for i, t in OPEN.items(): KB[i]['open'] = t
for i, (d, t) in THN.items():
    th = KB[i].setdefault('th', []); th.insert(0, {'d': d, 't': t}); th.sort(key=lambda x: x['d'], reverse=True); del th[5:]
    assert {'d': d, 't': t} in th, i

# ---- Desk und Agent: asOf, pxAsOf, read, sweep, sweeps, flows (höchstens 12), snapshot; agent.log und agent.offen
desk['asOf'] = TODAY
# desk['pxAsOf'] = ...; desk['read'] = ...; desk['sweep'] = {'n': RUN, 'last': TODAY, 'at': AT, 'label': ...}; desk['sweeps'].append({...})

# ---- Schreiben im Dateiformat des Repos (Einrückung 0; desk einzeilig; prices unverändert aus dem Zweig kurse)
os.makedirs(O, exist_ok=True)
def W(n, o, one=False):
    with open(O + n + '.json', 'w', encoding='utf-8') as fh: fh.write(json.dumps(o, ensure_ascii=False) if one else json.dumps(o, ensure_ascii=False, indent=0))
for n, o in [('statements', stm), ('moves', moves), ('calls', calls), ('calendar', cal), ('kb', kb), ('people', people), ('stories', stories), ('scenarios', scen), ('agent', agent)]: W(n, o)
W('desk', desk, one=True); shutil.copyfile(S + '/k/prices.json', O + 'prices.json')
json.dump({'new': [n['id'] for n in NEW], 'corr': CORR, 'del': DEL, 'at': AT}, open(S + '/out/plan.json', 'w'))
print('Aussagen', len(stm), 'Positionen', len(moves), 'Calls', len(calls), 'Termine', len(cal), 'tl', {s['id']: len(s['tl']) for s in stories})
