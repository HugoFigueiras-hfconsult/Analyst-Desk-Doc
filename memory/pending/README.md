# Wartendes Datenbündel aus Lauf 6

| Fakt | Wert |
|---|---|
| Erstellt | 2026-11-23, Lauf 6 (Standard), geplante Aufgabe |
| Grund | Die Sitzung hat kein `publish_files`; veröffentlicht wurde über die Datenbank (Weg B) |
| Basis | Artefakt-Version 1795378168-be42 (Dateistand Lauf 5); `prices.json` unverändert und deshalb nicht enthalten |
| Inhalt | `data/statements.json` (215), `moves.json` (156), `calls.json` (28), `calendar.json` (31), `kb.json` (72), `people.json`, `stories.json`, `scenarios.json`, `desk.json`, `agent.json` |
| Prüfung | `agent/check.py` (mit `prices.json` des Artefakts): 0 Fehler, 0 Warnungen; Routentest lokal: 124 Routen mit dem Bündel, 146 mit altem Dateistand plus Datenbank, je 0 Fehler |
| Schon im Desk | alles: 9 Überlagerungen `files/<name>` (run 6) und 53 Dokumente in `stm` (38 neue `r6-*`, 13 korrigierte, 2 mit `del:1`); zurückgelesen und mit dem Bündel verglichen |
| Unterschied zur Datenbank | Korrigierte Bestandseinträge tragen im Bündel ihre alte `sw`, in der Datenbank `sw: 6` (sonst übernimmt der Desk sie nicht) |
| Verwenden | Version noch gleich: als Dateien veröffentlichen; die Dokumente in `files`, `stm`, `tl` verfallen dann von selbst (`desk.sweep.n` = 6). Danach diesen Ordner entfernen |
