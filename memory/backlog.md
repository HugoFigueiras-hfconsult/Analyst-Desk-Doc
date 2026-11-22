# Offene Punkte

## Agent

| Punkt | Stand |
|---|---|
| Bündel `memory/pending/data/*.json` (Lauf 5, Basis-Version 1795374461-4d32, `check.py` 0 Fehler) veröffentlichen, sobald Dateien allein veröffentlicht werden können. Danach alle Dokumente `w4-*` und `r5-*` in `stm` und `tl` löschen und den Ordner `memory/pending` entfernen. Hat sich die Version geändert oder liegen neue Datenbank-Einträge (`w6-…`) vor: Bündel als Vorlage nehmen und diese zusätzlich übernehmen. Nächste Laufnummer: 6 | offen |
| Im Bündel, aber noch nicht im Desk: 24 Positionen (13F von Griffin, Sundheim, Cohen; Burry-Handel vom 16. und 20.11.), 2 Calls (Lee, Yardeni), 9 Termine, Fed-Szenario 93 % zu 7 %, Gold-Spot 3.518,50 $, Story-Texte und Level, Wissensbank, Korrektur n07 | offen |
| `w4-griffin-0` und `w4-sundheim-0` liegen als Aussagen in der Datenbank: beim Übernehmen nicht als Aussage führen (im Bündel bereits Positionen) | offen |
| Kurse neu ziehen: Yahoo war in Lauf 5 gesperrt; Stand Schluss 20.11., Bitcoin 21.11. | offen |
| Brent-Reihe prüfen: 20.11. laut Yahoo 89,95 $, laut Reuters 92,57 $ | offen |
| Fed-Szenario mit CME FedWatch abgleichen (Quellen zum 20.11. weichen ab) | offen |
| Cohen: datierte Aussage aus 2026 suchen (bisher nur 13F); Cuban: Tag der Aussage vom Oktober belegen | offen |
| Sharks Corcoran, Herjavec, John, Greiner und Paffrath: je eigene Suche | offen |
| Belegte Wirkung (`fx`) nachtragen | offen |
| Rollen bestätigen (`v:1`) für rund 110 Köpfe | offen |
| Zahlentermine Oracle (9.12.), Broadcom (10.12.), Micron (16.12.): erwartet, von den Unternehmen noch nicht bestätigt | offen |
| Flow Show vom 20.11. über Yahoo und Investing.com belegt; Primärquelle nicht frei zugänglich | offen |
| Citi-Kursziel Bitcoin (99.532 nach 113.000 Dollar) aus besserer Quelle belegen | offen |

## Chat/Hugo

| Punkt | Stand |
|---|---|
| Veröffentlichen aus der geplanten Aufgabe ermöglichen: entweder den Connector mit `publish_files` (`mcp__claude-artifacts__*`) in die Sitzung bringen oder erlauben, dass die unveränderte Seite über `Artifact` mitgesendet wird. Bis dahin landen nur Aussagen und Ereignisse im Desk (über die Datenbank) | wartet auf Hugo |
| Netzfreigabe für `query1.finance.yahoo.com` in der Umgebung der geplanten Aufgabe, sonst keine neuen Kurse | wartet auf Hugo |
| Geplante Aufgabe: Zeitplan und „Automatisch genehmigen“ in den Einstellungen setzen | wartet auf Hugo |
| Befund zur Sitzung der geplanten Aufgabe (22.11.): Repo-Zugriff ja, Artefakt lesen ja, Datenbank ja, Parallel Search ja; Dateien veröffentlichen nein, Yahoo nein | bekannt |
| Seiten-Sweep, Befund aus Lauf 5: 6 von 72 Aussagen unbrauchbar (Videotitel, Doppel derselben Rede, 13F als Aussage), 23 korrigiert (Datum, Werte, Kennzeichnung). Idee für die Seite: Datum nie auf den Sweep-Tag setzen, keine Einträge aus youtube.com, gleiche Rede je Kopf und Tag nur einmal, Werte nur wenn im Auszug genannt, 13F-Berichte nicht als Aussage | Idee |
| Hinweis bei der CFD-Referenz XAUUSD nennt noch rund 3.540 $ (Feld `cfd`, für den Agenten gesperrt); letzter belegter Spot 3.518,50 $ am 20.11. | offen |
| Brent-Symbol der Kursquelle prüfen (Frontmonat?) | offen |
| Gold-Spot-Reihe finden | offen |
| Kurse im Seiten-Sweep nicht möglich: großer Lauf nötig | bekannt |
| Deutsche Stimmen ergänzen? In Lauf 5 eine aufgenommen (Reinwand, Helaba, über dpa-AFX) | Frage an Hugo |
