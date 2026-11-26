# Werkzeug des Sweep-Agenten

Hilfsskripte aus Lauf 11 für Schritt 7 und 8 (Prüfen, Weg B). Sie gehören zum Gedächtnis, nicht zur Seite; der Agent kopiert sie in seinen Scratchpad und ändert dort nichts am Repo.

| Datei | Zweck | Erwartet im selben Ordner |
|---|---|---|
| `mkdb.py` | Erzeugt die Dokumente für Weg B (`pub/stm/<id>.json`, `pub/files/<name>.json`) und eine simulierte Datenbank `out/simdb.json` (Bestand aus `db/` plus Plan) | `desk/data/*.json` (geprüftes Bündel), `db/stm`, `db/tl`, `db/files` (mit `ArtifactData` und `out_dir` gelesen), `out/plan.json` mit `{new:[ids], corr:[[id, sw]], del:[ids], at:"JJJJ-MM-TTTHH:MMZ"}` |
| `routen.js` | Routentest mit Node-Playwright (`/opt/node-tools/node_modules/playwright`): `node routen.js <datenordner> [simdb.json oder -] [bündelordner]`; meldet Routen mit Fehlern und vergleicht die Seite mit dem Bündel (IDs, Datum, Text, Haltung, Werte, Quelle, Ereignisse je Story, Zählungen) | `build/index.html` aus `python3 src/build.py <scratchpad>/build`, `out/plan.json` |

| Schritt | Aufruf |
|---|---|
| 1 Bündel als Dateien | `node routen.js desk/data` |
| 2 alter Dateistand plus geplante Datenbank | `python3 mkdb.py && node routen.js art/data out/simdb.json desk/data` |
| 3 nach dem Schreiben | Datenbank nach `rb/` zurücklesen, Dokumente mit `pub/` vergleichen, daraus `out/rbdb.json` bilden und Schritt 2 damit wiederholen |

| Hinweis | Inhalt |
|---|---|
| Themenrouten | `th-<slug>`: »&« wird zu »und« ohne Bindestrich (`S&P-Ziel 2027` → `sundp-ziel-2027`) |
| Fehlalarm | Das deutsche Wort »null« in Aussagetexten wird gemeldet: Text umformulieren |
| Laufnummer | In `mkdb.py` und in der Status-Attrappe von `routen.js` steht die Laufnummer 11 fest: vor dem nächsten Lauf anpassen |
