# Wartendes Datenbündel aus Lauf 5

| Fakt | Wert |
|---|---|
| Erstellt | 2026-11-22, Lauf 5 (Kurz), geplante Aufgabe |
| Grund | Die Sitzung konnte Datendateien nicht allein veröffentlichen; `index.html` wurde nicht gesendet |
| Basis | Artefakt-Version 1795374461-4d32; `people.json` und `prices.json` unverändert und deshalb nicht enthalten |
| Inhalt | `data/statements.json` (179), `moves.json` (138), `stories.json`, `scenarios.json`, `calls.json` (25), `calendar.json` (23), `kb.json`, `desk.json`, `agent.json` |
| Prüfung | `agent/check.py`: 0 Fehler, 0 Warnungen; Routentest lokal: 58 Routen, 0 Fehler |
| Schon im Desk | über die Datenbank: 66 geprüfte Aussagen aus Lauf 4, 23 Aussagen und 21 Ereignisse aus Lauf 5 |
| Noch nicht im Desk | Positionen, Calls, Kalender, Szenarien, Story-Texte und Level, Wissensbank, Lesart, Gold-Spot, Korrektur n07 |
| Verwenden | Version noch gleich und keine neuen Datenbank-Einträge: prüfen, veröffentlichen, danach `w4-*` und `r5-*` in `stm` und `tl` löschen und diesen Ordner entfernen. Sonst als Vorlage nehmen |
| Vor dem Veröffentlichen anpassen | `desk.sweep`, `desk.sweeps` und `agent.log` auf den Lauf, der veröffentlicht |
