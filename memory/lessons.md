# Regeln aus Erfahrung

| Bereich | Regel | Seit |
|---|---|---|
| Ausgewogenheit | Schieflage wird über die Zählung gelöst, nicht über Deckel: Je Kopf zählt nur die jüngste Aussage. Kein Deckel je Kopf, keine Reihenfolge nach Anzahl, keine Sperrliste (Hugo, 22.11.). | 2026-11-22 |
| Ausgewogenheit | Jeder Kopf wird gleich gründlich gesucht, egal ob Hugo ihn als Beispiel genannt hat. | 2026-11-22 |
| Git | Commit, Push und Merge erledigen Agent und Chat selbst, direkt auf `main`. | 2026-11-22 |
| Zuordnung | Eine Kursreaktion gehört immer zu genau dem Wert, um den es in der Aussage geht. Bei Meinungswechseln `chg.a` setzen. Im Zweifel keinen Wert zeigen: Stellvertreter (ETF, Einzelaktie), die die Aussage nicht nennt, kommen nicht in `a`. | 2026-11-22 |
| Zuordnung | 13F-Berichte sind Positionen (`moves.json`), keine Aussagen. | 2026-11-22 |
| Datum | Datum der Aussage, nicht des Artikels und nie der Tag des Sweeps. „On Wednesday“ im Text gegen das Artikeldatum rückrechnen; bei PDF und Präsentationen das Datum im Dokument lesen (`web_fetch`). Unsicher: `da:1`. | 2026-11-20 |
| Quelle | Aggregatoren und Videotitel sind Sekundärquellen: im Text kennzeichnen; ohne Inhalt kein Eintrag. | 2026-11-22 |
| Doppel | Dieselbe Rede, derselbe Gastbeitrag oder dieselbe Konferenz ergibt je Kopf und Tag einen Eintrag, auch wenn mehrere Medien berichten. | 2026-11-22 |
| Suche | Sammelanfragen über mehrere Köpfe liefern nur den lautesten. Je Kopf eine eigene Suche. | 2026-11-22 |
| Suche | Kurz-Lauf: rund 8 Suchen für Markt, Stories und Kalender, rund 10 für Köpfe und Einzelthemen; alle unabhängigen Suchen gleichzeitig absetzen. | 2026-11-22 |
| Preise | Kassa, Spot und Future nie mischen. Gold-Marken sind Spot, der Chart ist Future. | 2026-11-21 |
| Preise | Tagesschluss heißt abgeschlossener Tag. Den laufenden Tag verwirft `prices.py`. | 2026-11-22 |
| Preise | Schlusskurse von Brent und Gold in Texten gegen eine Agenturmeldung prüfen; die Yahoo-Reihe kann einen anderen Kontraktmonat zeigen. | 2026-11-22 |
| Preise | Ist der Kursabruf gesperrt (ABBRUCH): alte Kurse behalten, Sperre nicht umgehen, in `agent.offen` und im Lauf vermerken. | 2026-11-22 |
| Marktpreise | Fed-Wahrscheinlichkeiten immer mit Quelle, Methode und Uhrzeit; Auswertungen desselben Tages weichen stark voneinander ab. | 2026-11-22 |
| Stories | Bei `px` rechnet der Desk KPI und aktuellen Stand selbst: nicht von Hand pflegen. Level-Einträge vor dem Anhängen auf Doppel prüfen. | 2026-11-22 |
| Kalender | Erwartete, vom Unternehmen nicht bestätigte Zahlentermine als „erwartet“ kennzeichnen. | 2026-11-22 |
| Calls | Zwischenstand, keine Trefferquote, solange wenige Calls abgeschlossen sind. | 2026-11-21 |
| Ursache | Kursbewegung nach Aussage ist zeitlicher Zusammenhang. Ursache nur mit Quelle im Feld `fx`. | 2026-11-22 |
| Veröffentlichen | Nie ohne `check.py` mit 0 Fehlern. Nur `data/*` senden, nie `index.html`. | 2026-11-22 |
| Werkzeuge | In der Sitzung der geplanten Aufgabe fehlen `mcp__claude-artifacts__*` und damit `publish_files`. Lesen geht mit `Artifact` (`action: read`, `paths`), die Datenbank mit `ArtifactData`. Veröffentlicht wird dort über die Datenbank (Weg B in `agent/auftrag.md`): `files/<name>` für ganze Dateien, `stm/<id>` für Aussagen. Nie die Seite senden. Alte Dokumente in `stm`, `tl`, `files` nicht löschen: Der Desk ignoriert alles mit Laufnummer bis `desk.sweep.n` der Dateien. | 2026-11-22 |
| Laufnummer | Lauf = max(`desk.sweep.n`, höchste `sw` in der Datenbank) + 1; der Seiten-Sweep zählt nur in der Datenbank. | 2026-11-22 |
| Prüfen | Vor dem Schreiben die Seite lokal bauen (`src/build.py` in den Scratchpad) und alle Routen mit Playwright (Node) durchlaufen; Python-Playwright fehlt in der Sitzung. | 2026-11-22 |
| Wortwahl | Keine unbelegten Superlative („Rekord“), wenn die Daten nur sechs Monate zeigen. | 2026-11-21 |
