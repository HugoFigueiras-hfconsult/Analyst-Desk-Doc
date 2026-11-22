# Architektur

## Bausteine

| Baustein | Ort | Aufgabe |
|---|---|---|
| Seite | Artefakt `index.html` (eine Datei, CSS und JS inline) | Darstellung, Rechenregeln, Sweep in der Seite |
| Datendateien | Artefakt `data/*.json` | Quelle der Wahrheit für Köpfe, Aussagen, Positionen, Kurse |
| Agenten-Dateien | Artefakt `agent/auftrag.md`, `prices.py.txt`, `check.py.txt` | Großer Lauf ohne Repo möglich |
| Datenbank | Artefakt-Datenbank (`db`) | Status, Ergebnisse der Seiten-Sweeps |
| Repo | dieses | Quellstand, Doku, Gedächtnis |

## Fähigkeiten des Artefakts

| Fähigkeit | Einstellung | Wofür |
|---|---|---|
| `sample` | `{}` | Desk fragen, Desk-Einschätzung, Auswertung der Suchtreffer |
| `db` | `{}` (nur Besitzer schreibt) | `sweep/status`, `stm/*`, `tl/*` |
| `mcp` | Server „Parallel Search“, Tool `web_search` | Suche im Seiten-Sweep |

Laufzeitvertrag 0.2.96. Erste Nutzung von `mcp` und `sample` fragt den Betrachter um Freigabe.

## Datenfluss

| Weg | Schritte |
|---|---|
| Laden | `boot()` lädt 11 JSON-Dateien → `prep()` baut Verzeichnisse und KPI → `loadDb()` legt Überlagerungen `files/<name>` darüber und mischt `stm` und `tl` dazu; es zählt nur, was über dem Dateistand `desk.sweep.n` liegt |
| Seiten-Sweep | Knopf → `runSweep()` → je Ziel `web_search` → `sample` → Prüfung → `db.doc("stm/…")` → sofort im Desk |
| Großer Lauf im Chat | Dateien laden → `prices.py` → Recherche → `check.py` → `publish_files` (nur `data/*`) → `sweep/status` |
| Großer Lauf als geplante Aufgabe | wie oben, aber ohne `publish_files`: schreibt `files/<name>` und `stm/<id>` in die Datenbank und den Dateisatz nach `memory/pending/data`; Kurse nur, wenn die Umgebung Yahoo erlaubt |

## Quellteile (`src/`, Reihenfolge = Dateiname)

| Datei | Inhalt |
|---|---|
| `head.html`, `body.html` | Kopf, Seitenleiste, Kopfzeile |
| `css.css`, `css2.css` | Grundgestaltung; Zusätze für Rotation, Reaktionen, Sweep |
| `a-core.js` | DOM-Helfer `h`/`put`, Formatierer, Konstanten, Kurshelfer, Tooltip, `heads`/`spread`/`stanceBar` |
| `b-charts.js` | `priceChart` (Marken, Ereignis-Rauten), `spark` |
| `c-cards.js` | `stmList`, `moveRow`, `mvBlock`, `ladder` |
| `d-derived.js` | `coverage`, `areaStats`, `callEval`, `sagenTun` |
| `e-parts.js` | Kursleiste, Hero-Story, Stimmungsbild |
| `f-views.js` | Seiten Kompass, Wechsel, Calls, Sagen & Tun, Wissensbank, CFD, Fragen |
| `g-detail.js` | Detail Person, Thema; `deskContext`, `askDesk` |
| `h-impact.js` | Kursreaktion `react`, Karten, Kalender, Rotations-Rechnung |
| `i-views.js` | Seiten Lage, Stories, Level, Rotation, Wirkung, Instrumente, Szenarien, Kalender, Aussagen, Sweep, Suche |
| `j-detail.js` | Detail Aussage, Instrument, Story, Gebiet |
| `k-sweep.js` | Sweep in der Seite, Status, Datenbank-Abgleich |
| `z-app.js` | Routing, Navigation, Start |

## Routen

| Muster | Seite |
|---|---|
| `#lage`, `#rotation`, `#stories`, `#level`, `#wirkung`, `#kompass`, `#instrumente`, `#szenarien`, `#kalender`, `#aussagen`, `#wechsel`, `#calls`, `#sagen-tun`, `#wissen`, `#sweep`, `#cfd`, `#fragen`, `#suche` | Seiten |
| `#a-<id>` | Aussage |
| `#p-<id>` | Person |
| `#t-<slug>` | Instrument |
| `#s-<id>` | Story |
| `#x-<schlüssel>` | Gebiet |
| `#th-<slug>` | Thema |
