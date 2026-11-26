// Routentest für den Analyst Desk (lokal): node routen.js <datenordner> [simdb.json] [bundle-ordner zum Vergleich]
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const S = __dirname, dataDir = process.argv[2], simPath = process.argv[3] && process.argv[3] !== '-' ? process.argv[3] : null, cmpDir = process.argv[4] || null;
const J = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const srv = http.createServer((q, r) => {
  const u = decodeURIComponent(q.url.split('?')[0]);
  const f = u.startsWith('/data/') ? path.join(dataDir, u.slice(6)) : path.join(S, 'build', u === '/' ? 'index.html' : u.slice(1));
  fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); r.end('nf'); } else { r.writeHead(200, { 'content-type': f.endsWith('.json') ? 'application/json' : 'text/html; charset=utf-8' }); r.end(b); } });
});
(async () => {
  await new Promise(ok => srv.listen(0, ok)); const port = srv.address().port;
  const ref = J(path.join(cmpDir || dataDir, 'statements.json')), people = J(path.join(cmpDir || dataDir, 'people.json')), stories = J(path.join(cmpDir || dataDir, 'stories.json')), desk = J(path.join(cmpDir || dataDir, 'desk.json'));
  const plan = J(path.join(S, 'out/plan.json'));
  const b = await chromium.launch({ args: ['--no-sandbox'] }); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const pg = await ctx.newPage();
  if (simPath) {
    const sim = J(simPath);
    await pg.addInitScript(sim => {
      const status = { state: 'done', by: 'Agent', run: 11, scope: 'Kurz', startedAt: '2026-11-26T06:16:24Z', finishedAt: '2026-11-26T06:55:00Z', summary: { aussagen: 23, text: 'Test' } };
      const db = {
        doc: p => ({ onSnapshot: (cb) => { setTimeout(() => cb({ exists: p === 'sweep/status', data: () => status }), 10); return () => {}; }, get: async () => ({ exists: p === 'sweep/status', data: () => status }), set: async () => {}, update: async () => {} }),
        collection: n => { const c = { limit: () => c, get: async () => ({ docs: Object.entries(sim[n] || {}).map(([id, d]) => ({ id, data: () => d })) }) }; return c; }
      };
      window.claude = { use: async n => n === 'db' ? db : null };
    }, sim);
  }
  const errs = []; pg.on('pageerror', e => errs.push('PAGEERR ' + String(e).slice(0, 300))); pg.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text().slice(0, 300)); });
  await pg.goto('http://localhost:' + port + '/index.html'); await pg.waitForTimeout(1800);
  const R = ['lage', 'rotation', 'stories', 'level', 'wirkung', 'kompass', 'instrumente', 'szenarien', 'kalender', 'aussagen', 'wechsel', 'calls', 'sagen-tun', 'wissen', 'sweep', 'cfd', 'fragen', 'suche', 'gibtsnicht'];
  stories.forEach(s => R.push('s-' + s.id));
  Object.keys(desk.assets).forEach(a => R.push('t-' + a.toLowerCase()));
  Object.keys(desk.areas).forEach(a => R.push('x-' + a));
  const withData = new Set(ref.map(s => s.p).filter(Boolean)); people.forEach(p => { if (withData.has(p.id) || p.star) R.push('p-' + p.id); });
  const must = new Set([...plan.new, ...plan.corr.map(c => c[0])]);
  ref.forEach((s, i) => { if (must.has(s.id) || i % 3 === 0) R.push('a-' + s.id); });
  ['makro', 'ki-capex', 'fed-und-zinsen', 'sundp-ziel-2027', 'positionierung'].forEach(t => R.push('th-' + t));
  let bad = 0;
  for (const r of R) {
    errs.length = 0; await pg.evaluate(h => { location.hash = h; }, r); await pg.waitForTimeout(110);
    const t = await pg.evaluate(() => document.querySelector('#view').innerText), title = await pg.evaluate(() => document.querySelector('#title').textContent);
    const flags = ['[object', 'undefined', 'NaN', 'Infinity', 'null'].filter(k => t.includes(k));
    if (title.includes('hat einen Fehler')) flags.push('VIEW-ERROR: ' + t.slice(0, 200));
    if (r !== 'gibtsnicht' && title.includes('Nicht gefunden')) flags.push('NOTFOUND');
    if (flags.length || errs.length) { bad++; console.log(r, '|', title, '|', JSON.stringify(flags), errs.slice(0, 3).join(' ; ')); }
  }
  console.log('routes', R.length, 'bad', bad);
  // Seite gegen Bündel vergleichen
  const got = await pg.evaluate(() => ({ st: D.statements.map(s => ({ id: s.id, d: s.d, t: s.t, s: s.s, p: s.p || null, a: s.a || [], sw: s.sw, src: (D.desk.sources[s.src] || {}).u || null })), tl: Object.fromEntries(D.stories.map(s => [s.id, s.tl.length])), moves: D.moves.length, calls: D.calls.length, cal: D.calendar.length, n: D.desk.sweep.n, px: D.desk.pxAsOf, asOf: D.desk.asOf, kb: D.kb.length, sc: D.scenarios.map(s => s.asOf).join(','), spx: D.prices.s.SPX.c.slice(-1)[0], kpi: D.stories.map(s => s.id + ':' + s.kpi).join(' | ') }));
  const want = Object.fromEntries(ref.map(s => [s.id, s])); const gotM = Object.fromEntries(got.st.map(s => [s.id, s]));
  const miss = Object.keys(want).filter(i => !gotM[i]), extra = Object.keys(gotM).filter(i => !want[i]);
  const diff = Object.keys(want).filter(i => gotM[i] && (gotM[i].d !== want[i].d || gotM[i].t !== want[i].t || gotM[i].s !== want[i].s || JSON.stringify(gotM[i].a) !== JSON.stringify(want[i].a || []) || gotM[i].src !== desk.sources[want[i].src].u));
  const tlW = Object.fromEntries(stories.map(s => [s.id, s.tl.length]));
  console.log('Aussagen Seite', got.st.length, 'Bündel', ref.length, 'fehlen', JSON.stringify(miss), 'zusätzlich', JSON.stringify(extra), 'abweichend', JSON.stringify(diff));
  console.log('Ereignisse Seite', JSON.stringify(got.tl), 'gleich Bündel:', JSON.stringify(got.tl) === JSON.stringify(tlW));
  console.log('moves', got.moves, 'calls', got.calls, 'kalender', got.cal, 'kb', got.kb, 'sweep.n', got.n, 'pxAsOf', got.px, 'asOf', got.asOf, 'SPX', got.spx, 'szen', got.sc);
  console.log('KPI', got.kpi);
  const neu = got.st.filter(s => s.sw === 11).map(s => s.id); console.log('sw 11 auf der Seite:', neu.length, neu.join(' '));
  await b.close(); srv.close();
})().catch(e => { console.error('FEHLER', e); process.exit(1); });
