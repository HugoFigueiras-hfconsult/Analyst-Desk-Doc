#!/usr/bin/env python3
"""Analyst Desk: Daten pruefen, bevor veroeffentlicht wird. Aufruf: python3 check.py <data-ordner>
Exit 0 = veroeffentlichbar (Warnungen moeglich), Exit 1 = Fehler, NICHT veroeffentlichen."""
import json, sys, os, re, datetime as dt
d = sys.argv[1]; E = []; W = []
def L(f):
    try: return json.load(open(os.path.join(d, f + ".json"), encoding="utf-8"))
    except Exception as e: E.append("%s.json nicht lesbar: %s" % (f, e)); return None
F = {f: L(f) for f in ["people", "statements", "moves", "stories", "scenarios", "desk", "prices", "kb", "calls", "calendar", "agent"]}
if E: print("\n".join("FEHLER " + e for e in E)); sys.exit(1)
P = {p["id"] for p in F["people"]}; desk = F["desk"]; SRC = set(desk["sources"]); AR = set(desk["areas"]); ST = {s["id"] for s in F["stories"]}
PX = set(F["prices"]["s"]); KNOWN = PX | set(desk["assets"]); maxd = (dt.date.today() + dt.timedelta(days=1)).isoformat()
def date(x, where, future=False):
    if not isinstance(x, str) or not re.fullmatch(r"\d{4}-\d{2}-\d{2}", x): E.append("%s: Datum '%s' ungueltig" % (where, x)); return
    try: dt.date.fromisoformat(x)
    except ValueError: E.append("%s: Datum '%s' gibt es nicht" % (where, x)); return
    if not future and x > maxd: E.append("%s: Datum %s liegt in der Zukunft" % (where, x))
def uniq(rows, key, name):
    seen = set()
    for r in rows:
        k = r.get(key)
        if not k: E.append("%s: Eintrag ohne %s" % (name, key))
        elif k in seen: E.append("%s: %s '%s' doppelt" % (name, key, k))
        seen.add(k)
    return seen
uniq(F["people"], "id", "people")
for p in F["people"]:
    for k in ("n", "f", "r", "g"):
        if not p.get(k): E.append("people %s: Feld %s fehlt" % (p.get("id"), k))
    if p.get("g") not in desk["groups"]: E.append("people %s: Gruppe unbekannt" % p.get("id"))
SID = uniq(F["statements"], "id", "statements")
for s in F["statements"]:
    w = "statements " + str(s.get("id")); date(s.get("d"), w)
    if s.get("s") not in ("bull", "neut", "warn", "bear"): E.append(w + ": s ungueltig")
    if s.get("p"):
        if s["p"] not in P: E.append(w + ": Person '%s' nicht im Roster" % s["p"])
    elif not (s.get("who") or s.get("org")): E.append(w + ": weder p noch who/org")
    if s.get("src") not in SRC: E.append(w + ": Quelle '%s' fehlt in desk.sources" % s.get("src"))
    t = s.get("t") or ""
    if not t.strip(): E.append(w + ": Text fehlt")
    if len(t) > 700: W.append(w + ": Text ueber 700 Zeichen")
    if not s.get("k"): E.append(w + ": k (Art) fehlt")
    if not isinstance(s.get("sw"), int): E.append(w + ": sw fehlt")
    for a in s.get("a") or []:
        if a not in KNOWN: W.append(w + ": Wert '%s' weder in assets noch in prices" % a)
    for a in s.get("ar") or []:
        if a not in AR: E.append(w + ": Gebiet '%s' unbekannt" % a)
    for a in s.get("st") or []:
        if a not in ST: E.append(w + ": Story '%s' unbekannt" % a)
    if "chg" in s and not all(k in s["chg"] for k in ("w", "f", "t", "dir")): E.append(w + ": chg unvollstaendig")
    if "chg" in s and s["chg"].get("a") and s["chg"]["a"] not in (s.get("a") or []): E.append(w + ": chg.a '%s' steht nicht in a" % s["chg"]["a"])
    if "chg" in s and (s.get("a") or []) and not s["chg"].get("a"): W.append(w + ": chg ohne a (betroffener Wert)")
    if "fx" in s and not (s["fx"].get("t") and s["fx"].get("src") in SRC): E.append(w + ": fx braucht t und gueltige src")
for i, m in enumerate(F["moves"]):
    w = "moves #%d %s %s" % (i, m.get("p"), m.get("tk"))
    if m.get("p") not in P: E.append(w + ": Person nicht im Roster")
    if m.get("ac") not in ("neu", "plus", "minus", "exit", "short"): E.append(w + ": ac ungueltig")
    if m.get("sec") not in AR: E.append(w + ": sec unbekannt")
    if m.get("src", "tr") not in SRC: E.append(w + ": Quelle fehlt in desk.sources")
    if not m.get("nm") or not m.get("tk") or m.get("det") is None: E.append(w + ": nm/tk/det fehlt")
    if "d" in m:
        date(m["d"], w)
        if not m.get("per"): E.append(w + ": d nur zusammen mit per (kein 13F)")
uniq(F["stories"], "id", "stories")
for s in F["stories"]:
    w = "stories " + str(s.get("id"))
    for k in ("tk", "t", "kpi", "sub", "sum", "tl"):
        if s.get(k) in (None, ""): E.append(w + ": Feld %s fehlt" % k)
    for e in s.get("tl") or []: date(e.get("d"), w + " tl", True)
    for k in ("sym", "px"):
        if s.get(k) and s[k] not in PX: E.append(w + ": %s '%s' nicht in prices" % (k, s[k]))
    for k in s.get("src") or []:
        if k not in SRC: E.append(w + ": Quelle '%s' fehlt" % k)
    if s.get("lv"):
        lv = s["lv"]
        if not isinstance(lv.get("now"), (int, float)): E.append(w + ": lv.now fehlt")
        for it in lv.get("items") or []:
            if not isinstance(it.get("v"), (int, float)) or it.get("k") not in ("kz", "sup", "ref") or not it.get("l"): E.append(w + ": Level-Eintrag ungueltig")
            if it.get("d"): date(it["d"], w + " lv")
uniq(F["scenarios"], "id", "scenarios")
for s in F["scenarios"]:
    w = "scenarios " + str(s.get("id")); date(s.get("asOf"), w)
    if s.get("st") not in ST: E.append(w + ": Story unbekannt")
    if s.get("src") not in SRC: E.append(w + ": Quelle fehlt")
    for it in s.get("items") or []:
        if "p" in it and not (isinstance(it["p"], (int, float)) and 0 <= it["p"] <= 100): E.append(w + ": p ausserhalb 0-100")
    for a in s.get("aff") or []:
        if a not in KNOWN: W.append(w + ": aff '%s' unbekannt" % a)
for i, e in enumerate(F["calendar"]):
    w = "calendar #%d" % i; date(e.get("d"), w, True)
    if e.get("e"): date(e["e"], w, True)
    if not e.get("t") or not e.get("k"): E.append(w + ": t/k fehlt")
    if e.get("st") and e["st"] not in ST: E.append(w + ": Story unbekannt")
    if e.get("src") and e["src"] not in SRC: E.append(w + ": Quelle fehlt")
uniq(F["calls"], "id", "calls")
for c in F["calls"]:
    w = "calls " + str(c.get("id")); date(c.get("d"), w)
    if c.get("p") not in P: E.append(w + ": Person nicht im Roster")
    if c.get("dir") not in ("long", "short", "ziel", "level"): E.append(w + ": dir ungueltig")
    if c.get("a") not in PX and (D := F["desk"].get("chartFor", {})).get(c.get("a")) not in PX: W.append(w + ": Wert '%s' ohne Kursreihe" % c.get("a"))
    if c.get("stm") and c["stm"] not in SID: E.append(w + ": Aussage '%s' fehlt" % c["stm"])
    if c.get("dir") == "ziel" and not isinstance(c.get("tgt"), (int, float)): E.append(w + ": tgt fehlt")
for k in F["kb"]:
    if k.get("id") not in P: E.append("kb %s: Person nicht im Roster" % k.get("id"))
for k in ("asOf", "pxAsOf"): date(desk.get(k), "desk." + k)
sw = desk.get("sweep") or {}
if not isinstance(sw.get("n"), int): E.append("desk.sweep.n fehlt")
if sw.get("n") != max(s["sw"] for s in F["statements"] if isinstance(s.get("sw"), int)) and not sw.get("leer"): W.append("desk.sweep.n passt nicht zur hoechsten sw in statements")
for it in (desk.get("rot") or {}).get("items", []):
    if it["k"] not in PX: W.append("rot: '%s' ohne Kursreihe" % it["k"])
for c in desk.get("cfd", []):
    if c.get("ref") and c["ref"] not in PX: E.append("cfd %s: Referenz ohne Kursreihe" % c.get("k"))
for k in desk.get("rail", []):
    if k not in PX: E.append("rail: '%s' ohne Kursreihe" % k)
pr = F["prices"]
for k, s in pr["s"].items():
    if s.get("cal") not in pr["cal"] or len(pr["cal"][s["cal"]]) < len(s["c"]) or not s["c"]: E.append("prices %s: Kalender passt nicht" % k)
    for f in ("n", "b", "u", "tv", "y"):
        if f not in s: E.append("prices %s: Feld %s fehlt" % (k, f))
ag = F["agent"]
for k in ("log", "offen"):
    if not isinstance(ag.get(k), list): E.append("agent.%s fehlt" % k)
for w in W: print("WARNUNG " + w)
for e in E: print("FEHLER " + e)
print("%d Fehler, %d Warnungen. %d Aussagen, %d Positionen, %d Kursreihen." % (len(E), len(W), len(F["statements"]), len(F["moves"]), len(pr["s"])))
sys.exit(1 if E else 0)
