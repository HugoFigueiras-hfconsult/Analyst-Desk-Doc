import asyncio, json
from playwright.async_api import async_playwright
MOCK = """
(() => { const today = new Date().toISOString().slice(0,10), store = new Map();
 const docRef = p => ({ set: async d => { store.set(p, d); }, get: async () => ({ exists: store.has(p), data: () => store.get(p) }), delete: async () => { store.delete(p); }, onSnapshot: (cb) => { cb({ exists: false, data: () => undefined }); return () => {}; } });
 const db = { doc: docRef, collection: p => ({ limit() { return this; }, get: async () => ({ docs: [...store.entries()].filter(([k]) => k.startsWith(p + '/')).map(([k, v]) => ({ id: k.split('/')[1], data: () => v })) }) }) };
 let n = 0;
 const mcp = { callTool: async (s, t, i) => { n++; if (s !== 'Parallel Search' || t !== 'web_search' || !i.objective || !Array.isArray(i.search_queries)) throw { code: 'bad_request' }; if (n === 7) throw { code: 'server_unavailable', retryable: true, retryAfterMs: 50 }; return { payload: { search_id: 'x', results: [{ url: 'https://example.com/' + n, title: 'Titel ' + n, publish_date: today, excerpts: ['Auszug eins', 'Auszug zwei'] }] } }; } };
 const sample = async p => { const u = (p.match(/https:\\/\\/example\\.com\\/\\d+/) || [''])[0]; if (/Zeitleiste der Markt-Story/.test(p.slice(0, 80))) return { text: 'Hier: ' + JSON.stringify({ items: [{ d: today, t: 'Testereignis zur Story mit einer Zahl von 123 Punkten im Probelauf.', url: u }] }) };
   return { text: JSON.stringify({ items: [{ d: today, da: 0, k: 'Interview', s: 'bull', a: ['NVDA', 'GIBTSNICHT'], ar: ['semis', 'falsch'], st: ['nvda'], th: ['Halbleiter'], lv: '', t: 'Testaussage aus dem Probelauf mit ausreichender Länge für die Prüfung.', url: u }, { d: '2020-01-01', s: 'bull', t: 'Zu alt und muss verworfen werden, weil das Datum nicht passt.', url: u }, { d: today, s: 'bull', t: 'Fremde Quelle, muss verworfen werden, weil die URL nicht stimmt.', url: 'https://boese.example/x' }] }) }; };
 window.claude = { use: async k => ({ mcp, sample, db })[k] || null }; window.__store = store; })();
"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        pg = await b.new_page(viewport={"width": 1440, "height": 900}); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)[:300])); pg.on("console", lambda m: errs.append("C " + m.text[:200]) if m.type == "error" else None)
        await pg.add_init_script(MOCK)
        await pg.goto("http://localhost:8765/index.html#sweep"); await pg.wait_for_timeout(1500)
        before = await pg.evaluate("[D.statements.length, D.stories.reduce((s,x)=>s+x.tl.length,0), sweepTargets('Kurz').length, sweepTargets('Standard').length, sweepTargets('Voll').length, D.desk.sweep.n]")
        await pg.evaluate("state.scope='Selbsttest'; runSweep()"); await pg.wait_for_timeout(2500)
        t1 = await pg.evaluate("[RUN.on, SW.msg, D.statements.length, window.__store.size]")
        await pg.evaluate("state.scope='Kurz'; runSweep()")
        for i in range(90):
            await pg.wait_for_timeout(1000)
            if not await pg.evaluate("RUN.on"): break
        after = await pg.evaluate("[D.statements.length, D.stories.reduce((s,x)=>s+x.tl.length,0), RUN.done, RUN.total, RUN.added, SW.msg, D.desk.sweep.n, window.__store.size, JSON.stringify(window.__store.get('sweep/status')), RUN.log.filter(r=>r.e).length]")
        bad = await pg.evaluate("D.statements.filter(s => s.live && ((s.a||[]).includes('GIBTSNICHT') || (s.ar||[]).includes('falsch') || s.d < '2026')).length")
        await pg.screenshot(path="/home/claude/shots/sweep-run.png", full_page=False)
        for r in ["lage", "aussagen", "s-nvda", "wirkung", "rotation", "p-oleary", "wissen", "wechsel"]:
            await pg.evaluate("h=>{location.hash=h}", r); await pg.wait_for_timeout(350)
            ti = await pg.evaluate("document.querySelector('#title').textContent")
            if "Fehler" in ti: errs.append("VIEW " + r)
        row = await pg.evaluate("[...document.querySelectorAll('.tbl tbody tr')].filter(r => r.innerText.includes('Cathie Wood')).map(r => r.innerText.replace(/\\s+/g,' ').slice(0,220))")
        print("before", before); print("selbsttest", t1); print("after", after); print("invalid kept", bad); print("wood row", row); print("errors", errs[:5])
        await b.close()
asyncio.run(main())
