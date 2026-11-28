# Werkzeug des Sweep-Agenten

Hilfsskripte aus Lauf 11 (angepasst in Lauf 12, ergänzt in Lauf 13) für Schritt 6 bis 8 (Schreiben, Prüfen, Weg B). Sie gehören zum Gedächtnis, nicht zur Seite; der Agent kopiert sie in seinen Scratchpad und ändert dort nichts am Repo.

| Datei | Zweck | Erwartet im selben Ordner |
|---|---|---|
| `mkdb.py` | Erzeugt die Dokumente für Weg B (`pub/stm/<id>.json`, `pub/files/<name>.json`) und eine simulierte Datenbank `out/simdb.json` (Bestand aus `db/` plus Plan) | `desk/data/*.json` (geprüftes Bündel), `db/stm`, `db/tl`, `db/files` (mit `ArtifactData` und `out_dir` gelesen), `out/plan.json` mit `{new:[ids], corr:[[id, sw]], del:[ids], at:"JJJJ-MM-TTTHH:MMZ"}` |
| `routen.js` | Routentest mit Node-Playwright (`/opt/node-tools/node_modules/playwright`): `node routen.js <datenordner> [simdb.json oder -] [bündelordner]`; meldet Routen mit Fehlern und vergleicht die Seite mit dem Bündel (IDs, Datum, Text, Haltung, Werte, Quelle, Ereignisse je Story, Zählungen) | `build/index.html` aus `python3 src/build.py <scratchpad>/build`, `out/plan.json` |
| `bau.py` | Vorlage für das Bau-Skript eines Laufs (seit Lauf 13): liest den Ausgangsstand aus `base/`, ändert ihn mit Zusicherungen (`assert`) und schreibt das Bündel im Dateiformat des Repos nach `desk/data`; dazu `out/plan.json`. Die Abschnitte mit Inhalt sind leer und je Lauf zu füllen | `base/*.json` (Kopie von `memory/pending/data`), `k/prices.json` (Zweig `kurse`) |

| Schritt | Aufruf |
|---|---|
| 0 Bündel bauen | `python3 bau.py <JJJJ-MM-TTTHH:MMZ>` (legt `desk/data` und `out/plan.json` an), dann `python3 desk/agent/check.py desk/data` |
| 1 Bündel als Dateien | `node routen.js desk/data` |
| 2 alter Dateistand plus geplante Datenbank | `python3 mkdb.py && node routen.js art/data out/simdb.json desk/data` |
| 3 nach dem Schreiben | Datenbank nach `rb/` zurücklesen, Dokumente mit `pub/` vergleichen, daraus `out/rbdb.json` bilden und Schritt 2 damit wiederholen |

| Hinweis | Inhalt |
|---|---|
| Themenrouten | `th-<slug>`: »&« wird zu »und« ohne Bindestrich (`S&P-Ziel 2027` → `sundp-ziel-2027`) |
| Fehlalarm | Das deutsche Wort »null« in Aussagetexten wird gemeldet: Text umformulieren |
| Laufnummer | Seit Lauf 12 lesen `mkdb.py` und `routen.js` die Laufnummer aus `desk.sweep.n` des Bündels; nichts anzupassen |
| Plan | `corr` nennt je Eintrag die `sw`, die das Dokument tragen soll: der Lauf für Einträge aus den Dateien, die bisherige `sw` für Einträge, die schon als Dokument in `stm` liegen |
