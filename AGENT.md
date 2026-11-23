# Sweep-Agent: Einstieg

Du führst den großen Lauf für das Artefakt „Analyst Desk“ aus und pflegst dieses Repo als Gedächtnis. Unbeaufsichtigt: keine Rückfragen. Ändere nie `index.html`, `src/` oder `docs/`; du schreibst nur Datendateien des Artefakts und `memory/`.

## 1 Gedächtnis laden (vor jeder Recherche)

| Schritt | Datei | Zweck |
|---|---|---|
| 1 | `memory/lessons.md` | Geltende Regeln aus früheren Läufen. Haben Vorrang vor Gewohnheit, nie vor `agent/auftrag.md`. |
| 2 | `memory/errors.md` (letzte 15) | Fehler, die sich nicht wiederholen dürfen |
| 3 | `memory/sources.md` | Welche Quelle was liefert, welche ausfällt |
| 4 | `memory/backlog.md` | Offene Punkte; Abschnitt „Agent“ zuerst |
| 5 | `memory/runs.md` (letzte 5) | Was zuletzt lief |
| 6 | `agent/auftrag.md` | Ablauf, Regeln, Felder: maßgeblich |

## 2 Lauf

Schritte 0 bis 10 aus `agent/auftrag.md`. Zusätzlich:

| Thema | Vorgabe |
|---|---|
| Suche | Zuerst Parallel Search (`mcp__Parallel_Search__web_search`): je Kopf ein eigener Aufruf mit 2–3 Suchanfragen, eine `session_id` je Lauf. `web_fetch` nur, wenn die Auszüge nicht reichen. Fehlt der Connector: WebSearch. |
| Umfang ohne Angabe | montags Standard, sonst Kurz |
| Ausgewogenheit | Jeder Kopf gleich gründlich; alle neuen, belegten Aussagen aufnehmen. Kein Deckel je Kopf, keine Sperrliste. Der Desk zählt je Kopf nur die jüngste Aussage. |
| Seiten-Sweeps | `db_list` der Sammlungen `stm` und `tl`: Einträge prüfen, in die Dateien übernehmen, danach in der Datenbank löschen |
| Meinungswechsel | `chg.a` = genau der betroffene Wert |
| Veröffentlichen | Ohne `publish_files` (geplante Aufgabe): Weg B über die Datenbank, siehe `agent/auftrag.md` Schritt 8. Vollständigen Dateisatz zusätzlich nach `memory/pending/data`. |
| Zeiten | `startedAt` und `finishedAt` mit `date -u` bestimmen, nicht schätzen |
| Kurse | Ist Yahoo gesperrt: Kurse aus dem Zweig `kurse` übernehmen (`agent/auftrag.md` Schritt 4) und mit `files/prices` und `desk.pxAsOf` veröffentlichen. Nur wenn auch der Zweig veraltet ist: alte Kurse behalten und vermerken |

## 3 Gedächtnis schreiben (Pflicht, auch bei Abbruch)

| Datei | Wann | Form |
|---|---|---|
| `memory/runs.md` | jeder Lauf | 1 Tabellenzeile |
| `memory/errors.md` | jeder Fehler oder Beinahe-Fehler | 1 Zeile: Symptom, Ursache, Behebung, Regel |
| `memory/sources.md` | Quelle neu, besser oder ausgefallen | Zeile ändern statt anhängen |
| `memory/lessons.md` | nur dauerhafte Regel; Doppeltes zusammenführen | höchstens 60 Zeilen |
| `memory/backlog.md` | Erledigtes streichen, Neues eintragen | getrennt nach „Agent“ und „Chat/Hugo“ |

Danach `git pull --rebase`, `git add memory && git commit -m "sweep: Lauf <n>, <ein Satz>" && git push` auf `main`, ohne Rückfrage und ohne Pull Request (Hugos Vorgabe). Scheitert der Push: Kurznotiz in `data/agent.json` (offen) und in der Abschlussmeldung.

## 4 Besser werden

| Takt | Aufgabe |
|---|---|
| jeder Lauf | Vor dem Schreiben prüfen: Verletzt ein Eintrag eine Regel aus `lessons.md`? Dann korrigieren, nicht veröffentlichen. |
| jeder Lauf | 1 Punkt aus `backlog.md` Abschnitt „Agent“ erledigen, wenn er nur Daten oder `memory/` betrifft |
| jeder 5. Lauf | `errors.md` auf Muster prüfen, daraus Regeln für `lessons.md` verdichten, erledigte Fehler kürzen |
| bei Idee für die Seite | nicht umsetzen, in `backlog.md` Abschnitt „Chat/Hugo“ eintragen |
