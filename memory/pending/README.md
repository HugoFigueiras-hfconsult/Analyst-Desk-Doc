# Wartendes Datenbündel aus Lauf 11

| Fakt | Wert |
|---|---|
| Erstellt | 2026-11-26, Lauf 11 (Kurz), geplante Aufgabe |
| Grund | Die Sitzung hat kein `publish_files`; veröffentlicht wurde über die Datenbank (Weg B) |
| Basis | Artefakt-Version 1795476169-09ad (Dateistand Lauf 5) |
| Inhalt | `data/statements.json` (431), `moves.json` (215), `calls.json` (45), `calendar.json` (44), `kb.json` (75), `people.json` (169, unverändert seit Lauf 9), `stories.json`, `scenarios.json`, `desk.json`, `agent.json`, `prices.json` (76 Reihen, Schluss 25.11., Bitcoin 24.11., aus dem Zweig `kurse`; der laufende Tagesbalken vom 26.11. bei Gold, Brent, Kupfer und Dollar-Index ist entfernt) |
| Prüfung | `agent/check.py`: 0 Fehler, 0 Warnungen; Routentest lokal: 412 Routen mit dem Bündel und 412 mit altem Dateistand plus zurückgelesener Datenbank, je 0 Fehler; Seite und Bündel stimmen in beiden Fällen überein (431 Aussagen, Ereignisse je Story, Positionen, Calls, Termine) |
| Schon im Desk | alles: 9 Überlagerungen `files/<name>` mit run 11 (rund 341 KiB; `people` weiter mit run 9) und 353 Dokumente in `stm` (davon 23 neue `r11-*`), 44 in `tl`; zurückgelesen und Dokument für Dokument mit dem Plan verglichen |
| Unterschied zur Datenbank | `r5-03`, `s33` und `s14` tragen im Bündel ihre alte `sw` (5, 1 und 1), in der Datenbank `sw: 9`, `sw: 10` und `sw: 11` (sonst übernimmt der Desk die Korrektur nicht). `w4-marks-0` fehlt im Bündel und steht in der Datenbank als `{del:1, sw:11}`. Aussagen aus `stm` führen dort zusätzlich `srcN`, `srcU` und `at` |
| Verwenden | Version noch gleich: alle elf Dateien als Dateien veröffentlichen; die Dokumente in `files`, `stm`, `tl` verfallen dann von selbst (`desk.sweep.n` = 11). Danach diesen Ordner entfernen |
