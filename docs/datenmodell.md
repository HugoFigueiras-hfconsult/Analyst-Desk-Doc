# Datenmodell

Felder der Datendateien: Tabelle „Felder“ in `agent/auftrag.md`. Hier nur, was dort fehlt.

## Dateien

| Datei | Einträge (22.11.2026) | Schlüssel |
|---|---|---|
| `people.json` | 168 Köpfe; `g`: hf, am, st, an, kf, pb; `star` = Leitfigur; `v` = Rolle belegt | `id` |
| `statements.json` | 90; `sw` = Laufnummer; `chg.a` = Wert des Meinungswechsels; `fx` = belegte Wirkung | `id` |
| `moves.json` | 114; ohne `per` = 13F zum Stichtag `desk.f13.asOf`; mit `per` und `d` = datierter Handel | – |
| `stories.json` | 9; `px` = Kurs-Symbol für automatische KPI; `sym` = Chart; `q` = englische Suchanfrage; `ruht` | `id` |
| `scenarios.json` | 6; `aff` = betroffene Werte | `id` |
| `calendar.json` | 14; `aff` = betroffene Werte | – |
| `calls.json` | 23 messbare Aussagen | `id` |
| `kb.json` | 69 Wissensbank-Einträge | `id` = people.id |
| `prices.json` | 76 Reihen, 6 Monate Tagesschluss; `y` = Yahoo-Symbol; `cal` = Kalender-Schlüssel, Reihe liegt am Ende des Kalenders | Symbol |
| `desk.json` | Stand, Lesart, Gruppen, Gebiete, Quellen, Rotation, CFD-Referenzen | – |
| `agent.json` | Zweck, Ablauf, Regeln, Protokoll, offene Punkte (Anzeige im Desk) | – |

## `desk.json`

| Feld | Inhalt |
|---|---|
| `asOf`, `pxAsOf` | Datenstand, letzter Schlusskurs |
| `sweep` | `{n, last, at, label}`; `sweeps` = Liste aller Läufe |
| `f13` | `{asOf, q}` Stichtag der 13F-Meldungen |
| `areas`, `areaPx` | 16 Gebiete; Kurs-Stellvertreter je Gebiet |
| `rot` | `bench`, `groups`, `items[{k,l,g,ar?}]`, `pairs[{a,b,l,up,dn}]` |
| `cfd` | 6 Referenzen: US30=DJI, NAS100=NDX, SPX500=SPX, XAUUSD (Spot, keine Reihe), EU50=SX5E, GER40=DAX |
| `chartFor` | Chart-Alias, z. B. XAU → GOLDF (Future, gekennzeichnet) |
| `direkt` | `{mode:"seite", server:"Parallel Search", tool:"web_search", slug}` |
| `sources` | `{schlüssel:{n,u}}`; Seiten-Sweep legt `w:<id>` zur Laufzeit an |

## Datenbank

| Pfad | Inhalt | Schreibt |
|---|---|---|
| `sweep/status` | `{state: running/done/error, run, scope, startedAt, finishedAt, step, by, version?, summary{aussagen,text}, error}` | Seite, Agent |
| `stm/<id>` | Aussage aus Seiten-Sweep: Felder wie statements plus `srcN`, `srcU`, `at`; `id` = `w<lauf>-<kopf>-<nr>` | Seite |
| `tl/<id>` | Story-Ereignis: `{st, d, t, srcN, srcU, sw, at}` | Seite |

| `files/<name>` | ganze Datei als Überlagerung: `{run, at, data}`; name = people, moves, stories, scenarios, desk, prices, kb, calls, calendar, agent; höchstens 250 KiB | Agent |
| `stm/<id>` mit vorhandener id | ersetzt die Aussage aus der Datei; `{del:1, sw}` entfernt sie | Agent |

Geltung: Der Desk übernimmt aus `files`, `stm`, `tl` nur Dokumente, deren `run` oder `sw` über `desk.sweep.n` der veröffentlichten Dateien liegt. Werden Dateien neu veröffentlicht, verfallen ältere Dokumente von selbst.
