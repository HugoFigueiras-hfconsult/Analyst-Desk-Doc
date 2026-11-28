# Wartendes Datenbündel aus Lauf 13

| Fakt | Wert |
|---|---|
| Erstellt | 2026-11-28, Lauf 13 (Kurz), geplante Aufgabe |
| Grund | Die Sitzung hat kein `publish_files`; veröffentlicht wurde über die Datenbank (Weg B) |
| Basis | Artefakt-Version 1795476169-09ad (Dateistand Lauf 5) |
| Inhalt | `data/statements.json` (451), `moves.json` (235), `calls.json` (45), `calendar.json` (50), `kb.json` (75), `people.json` (169, unverändert seit Lauf 9), `stories.json`, `scenarios.json`, `desk.json`, `agent.json`, `prices.json` (76 Reihen aus dem Zweig `kurse`, Abruf 28.11., 05:27 UTC: USA, DAX, Euro Stoxx 50, Stoxx 600, VIX, Gold-Future, Brent, Kupfer und Dollar-Index Schluss 27.11., Bitcoin 26.11.; unverändert übernommen, kein laufender Tagesbalken) |
| Prüfung | `agent/check.py`: 0 Fehler, 0 Warnungen; Routentest lokal: 409 Routen mit dem Bündel, 409 mit altem Dateistand plus geplanter Datenbank und 409 mit altem Dateistand plus zurückgelesener Datenbank, je 0 Fehler; Seite und Bündel stimmen in allen Fällen überein (451 Aussagen, Ereignisse je Story, Positionen, Calls, Termine) |
| Schon im Desk | alles: 9 Überlagerungen `files/<name>` mit run 13 (rund 383 KiB; `people` weiter mit run 9) und 373 Dokumente in `stm` (davon 9 neue `r13-*`), 44 in `tl`; zurückgelesen und Dokument für Dokument mit dem Plan verglichen |
| Unterschied zur Datenbank | `r5-03`, `s33` und `s14` tragen im Bündel ihre alte `sw` (5, 1 und 1), in der Datenbank `sw: 9`, `sw: 10` und `sw: 11` (sonst übernimmt der Desk die Korrektur nicht). `w4-marks-0` fehlt im Bündel und steht in der Datenbank als `{del:1, sw:11}`. `r11-17` trägt in beiden `sw: 11`. Aussagen aus `stm` führen dort zusätzlich `srcN`, `srcU` und `at` |
| Verwenden | Version noch gleich: alle elf Dateien als Dateien veröffentlichen; die Dokumente in `files`, `stm`, `tl` verfallen dann von selbst (`desk.sweep.n` = 13). Danach diesen Ordner entfernen |
