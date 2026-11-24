# Wartendes Datenbündel aus Lauf 9

| Fakt | Wert |
|---|---|
| Erstellt | 2026-11-24, Lauf 9 (Kurz), geplante Aufgabe |
| Grund | Die Sitzung hat kein `publish_files`; veröffentlicht wurde über die Datenbank (Weg B) |
| Basis | Artefakt-Version 1795476169-09ad (Dateistand Lauf 5) |
| Inhalt | `data/statements.json` (393), `moves.json` (194), `calls.json` (41), `calendar.json` (37), `kb.json` (74), `people.json` (169), `stories.json`, `scenarios.json`, `desk.json`, `agent.json`, `prices.json` (76 Reihen, Schluss 23.11., aus dem Zweig `kurse`) |
| Prüfung | `agent/check.py`: 0 Fehler, 0 Warnungen; Routentest lokal: 172 Routen mit dem Bündel und 172 mit altem Dateistand plus zurückgelesener Datenbank, je 0 Fehler; Seite und Bündel stimmen in beiden Fällen überein (393 Aussagen, Ereignisse je Story) |
| Schon im Desk | alles: 10 Überlagerungen `files/<name>` (run 9) und 312 Dokumente in `stm` (davon 21 neue `r9-*`, 157 aus Lauf 8), 44 in `tl`; zurückgelesen und mit dem Plan verglichen |
| Unterschied zur Datenbank | `r5-03` trägt im Bündel `sw: 5`, in der Datenbank `sw: 9` (sonst übernimmt der Desk die Korrektur nicht). Aussagen aus `stm` führen dort `srcN` und `srcU`, im Bündel einen Schlüssel in `desk.sources` |
| Verwenden | Version noch gleich: alle elf Dateien als Dateien veröffentlichen; die Dokumente in `files`, `stm`, `tl` verfallen dann von selbst (`desk.sweep.n` = 9). Danach diesen Ordner entfernen |
