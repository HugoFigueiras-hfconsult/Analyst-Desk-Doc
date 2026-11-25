# Wartendes Datenbündel aus Lauf 10

| Fakt | Wert |
|---|---|
| Erstellt | 2026-11-25, Lauf 10 (Kurz), geplante Aufgabe |
| Grund | Die Sitzung hat kein `publish_files`; veröffentlicht wurde über die Datenbank (Weg B) |
| Basis | Artefakt-Version 1795476169-09ad (Dateistand Lauf 5) |
| Inhalt | `data/statements.json` (409), `moves.json` (200), `calls.json` (43), `calendar.json` (40), `kb.json` (75), `people.json` (169, unverändert seit Lauf 9), `stories.json`, `scenarios.json`, `desk.json`, `agent.json`, `prices.json` (76 Reihen, Schluss 24.11., Bitcoin 23.11., aus dem Zweig `kurse`) |
| Prüfung | `agent/check.py`: 0 Fehler, 0 Warnungen; Routentest lokal: 400 Routen mit dem Bündel und 400 mit altem Dateistand plus zurückgelesener Datenbank, je 0 Fehler; Seite und Bündel stimmen in beiden Fällen überein (409 Aussagen, Ereignisse je Story, Positionen, Calls, Termine) |
| Schon im Desk | alles: 9 Überlagerungen `files/<name>` mit run 10 (rund 318 KiB; `people` weiter mit run 9) und 329 Dokumente in `stm` (davon 16 neue `r10-*`), 44 in `tl`; zurückgelesen und mit dem Plan verglichen |
| Unterschied zur Datenbank | `r5-03` und `s33` tragen im Bündel ihre alte `sw` (5 und 1), in der Datenbank `sw: 9` und `sw: 10` (sonst übernimmt der Desk die Korrektur nicht). Aussagen aus `stm` führen dort zusätzlich `srcN` und `srcU` |
| Verwenden | Version noch gleich: alle elf Dateien als Dateien veröffentlichen; die Dokumente in `files`, `stm`, `tl` verfallen dann von selbst (`desk.sweep.n` = 10). Danach diesen Ordner entfernen |
