#!/usr/bin/env python3
# Geplante Datenbank-Dokumente (Weg B) und simulierte Datenbank für den Routentest
import json, os, shutil, glob, sys
S = os.path.dirname(os.path.abspath(__file__)); D = S + '/desk/data/'
plan = json.load(open(S + '/out/plan.json')); AT = plan['at'].replace('Z', ':00Z') if len(plan['at']) == 17 else plan['at']
L = lambda n: json.load(open(D + n + '.json', encoding='utf-8'))
desk = L('desk'); stm = {s['id']: s for s in L('statements')}
shutil.rmtree(S + '/pub', ignore_errors=True); os.makedirs(S + '/pub/stm'); os.makedirs(S + '/pub/files')
def doc(s, sw):
    o = {k: v for k, v in s.items() if k != 'id'}; o['sw'] = sw; o['at'] = AT
    o['srcN'] = desk['sources'][s['src']]['n']; o['srcU'] = desk['sources'][s['src']]['u']; return o
out = {}
for i in plan['new']: out[i] = doc(stm[i], 11)
for i, sw in plan['corr']: out[i] = doc(stm[i], sw)
for i in plan['del']: out[i] = {'del': 1, 'sw': 11, 'at': AT}
for i, o in out.items(): json.dump(o, open(S + '/pub/stm/%s.json' % i, 'w', encoding='utf-8'), ensure_ascii=False)
FILES = ['moves', 'stories', 'scenarios', 'desk', 'prices', 'kb', 'calls', 'calendar', 'agent']
tot = 0
for n in FILES:
    o = {'run': 11, 'at': plan['at'], 'data': L(n)}
    p = S + '/pub/files/%s.json' % n; json.dump(o, open(p, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    sz = os.path.getsize(p); tot += sz; assert sz < 250 * 1024, (n, sz); print('files/%s %d KiB' % (n, sz // 1024))
print('stm', len(out), 'files', len(FILES), 'gesamt %d KiB' % (tot // 1024))
# simulierte Datenbank: Bestand + Plan
sim = {'stm': {}, 'tl': {}, 'files': {}}
for c in sim:
    for f in glob.glob(S + '/db/%s/*.json' % c): sim[c][os.path.basename(f)[:-5]] = json.load(open(f, encoding='utf-8'))
    for f in glob.glob(S + '/pub/%s/*.json' % c): sim[c][os.path.basename(f)[:-5]] = json.load(open(f, encoding='utf-8'))
json.dump(sim, open(S + '/out/simdb.json', 'w', encoding='utf-8'), ensure_ascii=False)
print({c: len(v) for c, v in sim.items()})
