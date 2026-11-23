#!/usr/bin/env python3
"""Analyst Desk: Kursdaten neu ziehen (Yahoo Finance, Tagesschluss, 6 Monate).
Aufruf: python3 prices.py <data-ordner> [--add KEY=YAHOO|Name|Basis|Einheit|TradingView ...]
        python3 prices.py <data-ordner> --stand    (nur Stand der vorhandenen Datei ausgeben, kein Abruf)
Liest <data-ordner>/prices.json (Serien mit Feld y = Yahoo-Symbol), zieht jede Serie neu,
verwirft den laufenden Handelstag, solange weniger als 90 % der Sitzung vorbei sind, und schreibt
prices.json zurueck. Fehlt nach Handelsschluss der Schluss im Tagesbalken, gilt der letzte Kurs aus meta.
Schlaegt ein Abruf fehl, bleibt die alte Serie stehen. Exit 1, wenn mehr als ein Drittel fehlschlaegt."""
import json, subprocess, sys, time, datetime as dt, os
d = sys.argv[1]; path = os.path.join(d, "prices.json")
old = json.load(open(path, encoding="utf-8"))
ser = old["s"]
if "--stand" in sys.argv:
    ref = ser.get("SPX") or next(iter(ser.values()))
    print("STAND fetched=%s pxAsOf=%s Serien=%d" % (old.get("fetchedAt") or old.get("fetched"), old["cal"][ref["cal"]][-1], len(ser))); sys.exit(0)
def tail(s):  # Daten zur Serie
    cal = old["cal"][s["cal"]]; return cal[len(cal) - len(s["c"]):]
for k, s in ser.items(): s["_t"] = tail(s)
for a in sys.argv[2:]:
    if a == "--add": continue
    key, rest = a.split("=", 1); y, n, b, u, tv = rest.split("|")
    if key not in ser: ser[key] = {"y": y, "n": n, "b": b, "u": u, "tv": tv, "c": [], "_t": []}
now = time.time(); fail = []; ok = 0
for k, s in ser.items():
    url = "https://query1.finance.yahoo.com/v8/finance/chart/%s?range=6mo&interval=1d" % s["y"]
    pts = None
    for attempt in (1, 2):
        r = subprocess.run(["curl", "-s", "-m", "25", "-H", "User-Agent: Mozilla/5.0", url], capture_output=True, text=True)
        try:
            res = json.loads(r.stdout)["chart"]["result"][0]; m = res["meta"]
            ts = res["timestamp"]; cl = res["indicators"]["quote"][0]["close"]; off = m.get("gmtoffset", 0)
            reg = (m.get("currentTradingPeriod") or {}).get("regular") or {}
            run = bool(ts and reg and reg.get("start", 0) <= ts[-1] and now < reg.get("end", 0))
            if run and (now - reg["start"]) / max(1, reg["end"] - reg["start"]) < 0.9: ts, cl = ts[:-1], cl[:-1]  # laufender Tag
            elif ts and cl[-1] is None and not run and m.get("regularMarketPrice") and (m.get("regularMarketTime", 0) + off) // 86400 == (ts[-1] + off) // 86400:
                cl = cl[:-1] + [m["regularMarketPrice"]]  # Schluss steht noch nicht im Balken
            pts = [(dt.datetime.fromtimestamp(t + off, dt.timezone.utc).strftime("%Y-%m-%d"), c) for t, c in zip(ts, cl) if c is not None and c > 0]
            break
        except Exception:
            time.sleep(1.5)
    if not pts or (len(s["c"]) > 60 and len(pts) < 60) or (s["_t"] and pts[-1][0] < (dt.date.fromisoformat(s["_t"][-1]) - dt.timedelta(days=4)).isoformat()):
        fail.append(k); continue
    dec = 4 if s.get("u") == "$/lb" else 2
    s["_t"] = [p[0] for p in pts]; s["c"] = [round(p[1], dec) for p in pts]; ok += 1
    time.sleep(0.2)
ser = {k: s for k, s in ser.items() if s["c"]}
if not ser or len(fail) > max(3, len(ser) / 3):
    print("ABBRUCH: zu viele Abrufe fehlgeschlagen:", ", ".join(fail)); sys.exit(1)
cals = []
def calid(dates):
    for i, c in enumerate(cals):
        if len(c) >= len(dates) and c[-len(dates):] == dates: return i
        if len(dates) > len(c) and dates[-len(c):] == c: cals[i] = dates; return i
    cals.append(dates); return len(cals) - 1
for s in sorted(ser.values(), key=lambda s: -len(s["_t"])): calid(s["_t"])
for s in ser.values(): s["cal"] = "c%d" % calid(s["_t"])
for s in ser.values(): del s["_t"]
today = dt.datetime.now(dt.timezone.utc)
out = {"src": "Yahoo Finance, Tagesschlusskurse", "fetched": today.strftime("%Y-%m-%d"), "fetchedAt": today.strftime("%Y-%m-%dT%H:%MZ"),
       "cal": {"c%d" % i: c for i, c in enumerate(cals)}, "s": ser}
for s in ser.values(): assert len(out["cal"][s["cal"]]) >= len(s["c"])
json.dump(out, open(path, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
ref = ser.get("SPX") or next(iter(ser.values())); c = out["cal"][ref["cal"]]
print("OK %d Serien neu, %d alt behalten%s. pxAsOf=%s" % (ok, len(fail), (" (" + ", ".join(fail) + ")") if fail else "", c[-1]))
