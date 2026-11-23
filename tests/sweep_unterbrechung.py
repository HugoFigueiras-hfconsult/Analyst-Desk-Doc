import asyncio, json, sys
from playwright.async_api import async_playwright
MOCK = """
(() => { const today = new Date().toISOString().slice(0,10), store = new Map(), subs = new Map();
 const fire = p => (subs.get(p) || []).forEach(cb => setTimeout(() => cb({ exists: store.has(p), data: () => JSON.parse(JSON.stringify(store.get(p))) }), 5));
 const docRef = p => ({ set: async d => { store.set(p, JSON.parse(JSON.stringify(d))); fire(p); (window.__writes = window.__writes || []).push(p); }, get: async () => ({ exists: store.has(p), data: () => store.get(p) }), delete: async () => { store.delete(p); fire(p); },
   onSnapshot: cb => { (subs.get(p) || subs.set(p, []).get(p)).push(cb); fire(p); return () => {}; } });
 const db = { doc: docRef, collection: p => ({ limit() { return this; }, get: async () => ({ docs: [...store.entries()].filter(([k]) => k.startsWith(p + '/')).map(([k, v]) => ({ id: k.split('/')[1], data: () => v })) }) }) };
 window.__n = 0; window.__mode = 'ok'; window.__hangFrom = 1e9;
 const mcp = { callTool: (s, t, i) => { const n = ++window.__n; if (window.__mode === 'hang' && n >= window.__hangFrom) return new Promise(() => {}); return Promise.resolve({ payload: { search_id: 'x', results: [{ url: 'https://example.com/' + n, title: 'Titel ' + n, publish_date: today, excerpts: ['Auszug eins', 'Auszug zwei'] }] } }); } };
 const sample = async p => { const u = (p.match(/https:\\/\\/example\\.com\\/\\d+/) || [''])[0]; if (/Zeitleiste der Markt-Story/.test(p.slice(0, 80))) return { text: JSON.stringify({ items: [{ d: today, t: 'Testereignis ' + u + ' zur Story mit einer Zahl von 123 Punkten im Probelauf.', url: u }] }) };
   return { text: JSON.stringify({ items: [{ d: today, da: 0, k: 'Interview', s: 'bull', a: ['NVDA'], ar: ['semis'], st: ['nvda'], th: ['Halbleiter'], lv: '', t: 'Testaussage ' + u + ' aus dem Probelauf mit ausreichender Länge für die Prüfung.', url: u }] }) }; };
 if (window.__seed) Object.entries(window.__seed).forEach(([k, v]) => store.set(k, v));
 window.claude = { use: async k => ({ mcp, sample, db })[k] || null }; window.__store = store; window.__db = db; })();
"""
ST = "JSON.parse(JSON.stringify(window.__store.get('sweep/status') || null))"
async def page(b, seed=None):
    pg = await b.new_page(viewport={"width": 390, "height": 800}); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)[:300])); pg.on("console", lambda m: errs.append("C " + m.text[:200]) if m.type == "error" and "404" not in m.text else None); pg.on("response", lambda r: errs.append("404 " + r.url) if r.status == 404 and "favicon" not in r.url else None)
    if seed is not None: await pg.add_init_script("window.__seed = " + json.dumps(seed) + ";")
    await pg.add_init_script(MOCK)
    await pg.goto("http://localhost:8765/index.html#sweep"); await pg.wait_for_timeout(1500)
    return pg, errs
async def wait(pg, secs=120):
    for i in range(secs * 4):
        await pg.wait_for_timeout(250)
        if not await pg.evaluate("RUN.on"): return True
    return False
async def main():
    ok = True
    def chk(name, cond, info=""):
        nonlocal ok; ok = ok and bool(cond); print(("PASS " if cond else "FAIL ") + name, info if not cond or "-v" in sys.argv else "")
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        # 1 hang -> timeout -> error, resumable; then continue to the end
        pg, errs = await page(b)
        stopHidden = await pg.evaluate("getComputedStyle([...document.querySelectorAll('button')].find(x => x.textContent === 'Abbrechen')).display")
        chk("Abbrechen ohne Lauf verborgen", stopHidden == "none", stopHidden)
        total = await pg.evaluate("sweepTargets('Kurz').length")
        await pg.evaluate("TMO.s = 1200; TMO.a = 1500; __mode = 'hang'; __hangFrom = 4; state.scope = 'Kurz'; state.fokus = 'Testfokus'; void runSweep()")
        await pg.wait_for_timeout(1200)
        mid = await pg.evaluate(ST)
        chk("Status läuft mit Lebenszeichen", mid and mid["state"] == "running" and mid.get("beat") and mid.get("tok") and mid["total"] == total, mid)
        chk("Lauf endet trotz hängender Suche", await wait(pg, 20))
        s1 = await pg.evaluate(ST); r1 = await pg.evaluate("[RUN.done, RUN.added, SW.msg, !!swResume(), RUN.log.filter(r => r.e).length]")
        chk("Fehlerstatus timeout", s1["state"] == "error" and s1["code"] == "timeout" and s1["done"] == 3 and s1["total"] == total, s1)
        chk("fortsetzbar", r1[3] and "fortsetzen" in (r1[2] or ""), r1)
        btn = await pg.evaluate("[...document.querySelectorAll('button')].filter(x => /^Fortsetzen ab Ziel/.test(x.textContent) && getComputedStyle(x).display !== 'none').map(x => x.textContent)")
        chk("Knopf Fortsetzen sichtbar", len(btn) >= 1 and btn[0] == "Fortsetzen ab Ziel 4 von %d" % total, btn)
        plan = await pg.evaluate("JSON.parse(JSON.stringify(window.__store.get('sweep/plan') || null))")
        chk("Zielliste gespeichert", plan and len(plan["keys"]) == total and plan["startedAt"] == s1["startedAt"], plan and plan["keys"][:3])
        calls = await pg.evaluate("__n")
        await pg.evaluate("__mode = 'ok'; [...document.querySelectorAll('button')].find(x => /^Fortsetzen ab Ziel/.test(x.textContent) && getComputedStyle(x).display !== 'none').click()")
        chk("Fortsetzung läuft durch", await wait(pg, 90))
        s2 = await pg.evaluate(ST); r2 = await pg.evaluate("[RUN.done, RUN.total, RUN.added, SW.msg, !!swResume(), __n]")
        chk("Status done nach Fortsetzung", s2["state"] == "done" and s2["done"] == total and s2["run"] == s1["run"] and s2["startedAt"] == s1["startedAt"] and s2["fokus"] == "Testfokus", s2)
        chk("nur die restlichen Ziele gesucht", r2[5] - calls == total - 3, (calls, r2))
        ids = await pg.evaluate("[...window.__store.keys()].filter(k => /^(stm|tl)\\//.test(k))")
        chk("Einträge mit eindeutigen Schlüsseln", len(ids) == len(set(ids)) and len(ids) == s2["added"], (len(ids), s2["added"], ids[:3]))
        chk("nicht mehr fortsetzbar", not r2[4])
        run1 = s2["run"]
        # 2 next start gets a new number; takeover by another writer stops the run without overwriting
        await pg.evaluate("TMO.s = 60000; state.scope = 'Kurz'; state.fokus = ''; void runSweep()")
        await pg.wait_for_timeout(2500)
        s3 = await pg.evaluate(ST)
        chk("neuer Lauf, neue Nummer", s3["state"] == "running" and s3["run"] == run1 + 1, s3)
        await pg.evaluate("window.__db.doc('sweep/status').set({ state: 'running', run: 99, by: 'Agent', startedAt: new Date().toISOString() })")
        chk("abgelöster Lauf endet", await wait(pg, 30))
        s4 = await pg.evaluate(ST); r4 = await pg.evaluate("[SW.msg, RUN.done, RUN.total]")
        chk("Status des anderen Laufs bleibt", s4["run"] == 99 and s4["by"] == "Agent", s4)
        chk("Hinweis abgelöst", "übernommen" in (r4[0] or "") and r4[1] < r4[2], r4)
        chk("keine Seitenfehler (1)", not errs, errs[:4]); await pg.close()
        # 3 stale page run in the database: interrupted, continue without stored target list
        import datetime
        now = datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None)
        iso = lambda m: (now - datetime.timedelta(minutes=m)).strftime("%Y-%m-%dT%H:%M:%S.000Z")
        pg, errs = await page(b, {"sweep/status": {"state": "error", "run": 7, "scope": "Standard", "fokus": "", "startedAt": iso(115), "finishedAt": iso(1), "by": "Seite", "wo": "Handy", "done": 1, "total": 81, "added": 1, "code": "unterbrochen", "error": "Am Handy unterbrochen."}})
        v = await pg.evaluate("[swState().k, swState().t, swState().sub, !!swResume(), sweepTargets('Standard').length, [...document.querySelectorAll('button')].filter(x => getComputedStyle(x).display !== 'none').map(x => x.textContent).filter(t => /Fortsetzen|starten/i.test(t))]")
        chk("unterbrochener Handy-Lauf: Warnung und Fortsetzen", v[0] == "warn" and v[3] and any("Fortsetzen ab Ziel 2 von 81" in t for t in v[5]) and any(t == "Neu starten" for t in v[5]), v)
        n0 = await pg.evaluate("__n")
        await pg.evaluate("void runSweep(true)"); await pg.wait_for_timeout(1500)
        s5 = await pg.evaluate(ST); r5 = await pg.evaluate("[RUN.on, RUN.done, RUN.total, RUN.log.map(r => r.l).slice(-1)[0], sweepTargets('Standard')[1].l]")
        chk("Fortsetzung ohne Zielliste ab Ziel 2", s5["state"] == "running" and s5["run"] == 7 and r5[2] == v[4] and r5[3] == r5[4], (s5, r5))
        await pg.evaluate("RUN.stop = true"); await wait(pg, 30)
        s6 = await pg.evaluate(ST)
        chk("Abbrechen: done mit stopped, fortsetzbar", s6["state"] == "done" and s6.get("stopped") and await pg.evaluate("!!swResume()"), s6)
        chk("keine Seitenfehler (2)", not errs, errs[:4]); await pg.close()
        # 4 heartbeat rules for a run in another view
        for name, st, want in [
            ("anderer Seitenlauf mit frischem Lebenszeichen", {"state": "running", "run": 8, "scope": "Kurz", "startedAt": iso(30), "beat": iso(1.2), "by": "Seite", "wo": "Rechner", "tok": "x", "done": 5, "total": 40, "added": 2, "step": "5 von 40"}, ("run", False, True)),
            ("anderer Seitenlauf ohne Lebenszeichen seit 5 Minuten", {"state": "running", "run": 8, "scope": "Kurz", "startedAt": iso(30), "beat": iso(5), "by": "Seite", "wo": "Handy", "tok": "x", "done": 5, "total": 40, "added": 2, "step": "5 von 40"}, ("warn", True, False)),
            ("altes Format ohne Lebenszeichen (Lauf 7 von heute)", {"state": "running", "run": 7, "scope": "Standard", "startedAt": iso(110), "by": "Seite", "step": "0 von 81"}, ("warn", False, False)),
            ("Agentenlauf seit 30 Minuten", {"state": "running", "run": 8, "scope": "Standard", "startedAt": iso(30), "by": "Agent"}, ("run", False, True)),
            ("Agentenlauf seit 3 Stunden", {"state": "running", "run": 8, "scope": "Standard", "startedAt": iso(180), "by": "Agent"}, ("warn", False, False)),
        ]:
            pg, errs = await page(b, {"sweep/status": st})
            v = await pg.evaluate("[swState().k, !!swResume(), swBusy(), swState().t + ' | ' + swState().sub]")
            chk(name, (v[0], v[1], v[2]) == want and not errs, (v, errs[:2])); await pg.close()
        # 5 page slept during a search and the run was continued elsewhere: it must not overwrite the status
        ctx = await b.new_context(viewport={"width": 390, "height": 844}, user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148")
        pg = await ctx.new_page(); await pg.add_init_script(MOCK)
        await pg.goto("http://localhost:8765/index.html#sweep"); await pg.wait_for_timeout(1500)
        await pg.evaluate("TMO.s = 4000; __mode = 'hang'; __hangFrom = 3; state.scope = 'Kurz'; void runSweep()"); await pg.wait_for_timeout(1800)
        a = await pg.evaluate(ST)
        await pg.evaluate("window.__store.set('sweep/status', { state: 'running', run: 6, scope: 'Kurz', by: 'Seite', wo: 'Rechner', tok: 'anderer', startedAt: '%s', beat: new Date().toISOString(), done: 9, total: 39, added: 4 }); const o = Date.now.bind(Date); Date.now = () => o() + 60000; void RUN.beat(true)" % a["startedAt"])
        await wait(pg, 20)
        end = await pg.evaluate(ST); r = await pg.evaluate("[RUN.on, SW.msg]")
        chk("Status vom Handy trägt wo", a["wo"] == "Handy", a)
        chk("aufgewachte Seite überschreibt nichts und gibt ab", end["tok"] == "anderer" and end["done"] == 9 and not r[0] and "übernommen" in (r[1] or ""), (end, r))
        await b.close()
    print("ALLE BESTANDEN" if ok else "FEHLER")
asyncio.run(main())
