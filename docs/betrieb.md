# Betrieb

| Aufgabe | Befehl oder Schritt |
|---|---|
| Seite bauen | `python3 src/build.py dist` → `dist/index.html`; `node --check dist/desk.js` |
| Daten prüfen | `python3 agent/check.py <data-ordner>`; 0 Fehler ist Pflicht |
| Kurse ziehen | `python3 agent/prices.py <data-ordner> [--add 'KEY=YAHOO\|Name\|Basis\|Einheit\|TradingView']` |
| Lokal ansehen | `dist/index.html` und `data/` in einen Ordner, `python3 -m http.server 8765` |
| Routentest | `python3 tests/routen.py` (42 Routen; meldet `[object`, `undefined`, `NaN`, Seitenfehler) |
| Sweep-Test | `python3 tests/sweep_mock.py` (Attrappen für `mcp`, `sample`, `db`) |
| Unterbrechungs-Test | `python3 tests/sweep_unterbrechung.py` (hängende Suche, Fortsetzen, Ablösung, Lebenszeichen, aufgewachte Seite, Anfragelimit mit Pause; 42 Prüfungen) |
| Veröffentlichen | `publish_files` mit `slug` und `base_version` aus `get_artifact`; nur geänderte Dateien |
| Neue Fähigkeit | erst `declare_capabilities` (ganze Erklärung), dann Code veröffentlichen |

## Grenzen der Plattform

| Grenze | Folge |
|---|---|
| Seite ist eine HTML-Datei; fremde Netzabrufe blockiert | Kurse nur über den großen Lauf |
| Dateitypen: `.py` nicht erlaubt | Skripte als `.py.txt` |
| Eine Seite kann keine Claude-Sitzung starten | Knopf startet den Sweep in der Seite |
| Seiten-Sweep läuft nur im geöffneten, wachen Tab; am Handy hält das System die Seite an | Lebenszeichen, Wartezeiten und „Fortsetzen“ (`docs/sweep.md`) |
| `sample` hat kein Netz | Suche über Connector |
| Geplante Aufgabe erreicht Yahoo nicht (Netzrichtlinie) | Der Lauf übernimmt `prices.json` aus dem Zweig `kurse` (`agent/auftrag.md` Schritt 4). Der GitHub-Workflow `.github/workflows/kurse.yml` füllt den Zweig täglich um 04:30 UTC (05:30 MEZ, 06:30 MESZ; auch von Hand startbar): ein Commit, der jedes Mal ersetzt wird. Von Hugo am 24.11. freigegeben. Neue Instrumente: `memory/kurse-add.txt` |
| Connector „Parallel Search“ läuft ohne Konto in der kostenlosen Stufe mit Anfragelimit | Seiten-Sweep pausiert und setzt fort; große Umfänge dauern entsprechend länger |
| Yahoo: keine Spot-Reihe für Gold | Future `GC=F` als GOLDF, beschriftet |
| stooq blockiert | Yahoo-Chart-API mit User-Agent |
| Kommentar-Weckruf nicht verfügbar | kein Start über Kommentare |
| Lokaler Testserver endet zwischen Arbeitsschritten | vor Tests neu starten |
