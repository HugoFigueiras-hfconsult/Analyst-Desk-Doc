import sys, json, asyncio
from playwright.async_api import async_playwright
ROUTES=["lage","rotation","stories","level","wirkung","kompass","instrumente","szenarien","kalender","aussagen","wechsel","calls","sagen-tun","wissen","sweep","cfd","fragen","suche",
 "s-nvda","s-fed","s-rot","s-gold","s-ant","s-capex","t-nvda","t-spx","t-xau","t-xlk","t-ust10","t-btc","t-ant","x-semis","x-zins","x-aiinfra","p-burry","p-wood","p-fink","a-s01","a-n17","a-s05","th-makro","gibtsnicht"]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path="/usr/bin/google-chrome",args=["--no-sandbox"])
        pg=await b.new_page(viewport={"width":1440,"height":900}); errs=[]
        pg.on("pageerror",lambda e: errs.append("PAGEERR "+str(e)[:300])); pg.on("console",lambda m: errs.append("CONSOLE "+m.text[:300]) if m.type=="error" else None)
        await pg.goto("http://localhost:8765/index.html"); await pg.wait_for_timeout(1200)
        bad=0
        for r in ROUTES:
            errs.clear(); await pg.evaluate("h=>{location.hash=h}",r); await pg.wait_for_timeout(350)
            t=await pg.evaluate("document.querySelector('#view').innerText"); title=await pg.evaluate("document.querySelector('#title').textContent")
            flags=[k for k in ["[object","undefined","NaN","Infinity","null"] if k in t]
            if "hat einen Fehler" in title: flags.append("VIEW-ERROR: "+t[:200])
            if r!="gibtsnicht" and "Nicht gefunden" in title: flags.append("NOTFOUND")
            if flags or errs: bad+=1; print(r,"|",title,"|",flags,errs[:3])
        print("routes",len(ROUTES),"bad",bad)
        for r,name,full in [(x.split(":")[0],x.split(":")[1],True) for x in sys.argv[1:]]:
            await pg.evaluate("h=>{location.hash=h}",r); await pg.wait_for_timeout(500); await pg.screenshot(path="/home/claude/shots/"+name+".png",full_page=full)
        await b.close()
asyncio.run(main())
