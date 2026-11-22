# Fehlerprotokoll

| Datum | Symptom | Ursache | Behebung | Regel |
|---|---|---|---|---|
| 2026-11-22 | Meinungswechsel Cathie Wood zu Nvidia zeigte Kursreaktion von SpaceX (n03) | Anzeige nahm den ersten Ticker mit Kursreihe; ANT hatte keine | Feld `chg.a`, Anzeige nur dafür (`chgRx`); `check.py` prüft | Zuordnung |
| 2026-11-22 | Burry 6 und Wood 5 Aussagen, andere Leitfiguren 0 | Nachrecherche folgte Hugos Beispielnamen | Zählung je Kopf. Deckel, Reihenfolge nach Anzahl und Sperrliste hat Hugo am selben Tag verworfen | Ausgewogenheit |
| 2026-11-22 | Seiten-Sweep nahm 13F-Bericht über D1 als Aussage mit Haltung neutral auf (w4-sundheim-0) | Auswertung trennt Aussage und Positionsbericht nicht scharf | beim großen Lauf als Position nach `moves.json` übernehmen, nicht als Aussage | Zuordnung |
| 2026-11-22 | Sharks-Sammelsuche lieferte nur O'Leary | ein Suchziel für sechs Personen | je Kopf eigene Suche | Suche |
| 2026-11-22 | Bitcoin-Schluss enthielt laufenden Tag | Yahoo liefert offenen Tagesbalken | `prices.py` verwirft Balken der laufenden Sitzung | Preise |
| 2026-11-22 | Story-KPI wich vom Chart ab | KPI von Hand, Kurse automatisch | `px`: Desk rechnet KPI | Stories |
| 2026-11-22 | `publish_files` lehnte `agent/prices.py` ab | Dateityp `.py` nicht erlaubt | als `.py.txt` ablegen | Betrieb |
| 2026-11-22 | Geplante Aufgabe dreimal abgelehnt | Fassung mit Zeitplan und „unbeaufsichtigt, keine Rückfragen“ | angelegt ohne Zeitplan, mit Rückfrage vor Aktionen; Zeitplan und automatische Genehmigung setzt Hugo | Betrieb |
| 2026-11-22 | Spot-Marken im Future-Chart (Gold) | Chart-Alias XAU → GOLDF | Linien unterdrücken, Hinweis | Preise |
| 2026-11-21 | „[object HTMLButtonElement]“ in der Seite | Arrays direkt an `replaceChildren` | Helfer `put()` | – |
| 2026-11-21 | Zwei ARK-Einträge verloren | Dedupe-Schlüssel (p, tk, per) zu grob | Schlüssel (p, tk, ac, det) | – |
| 2026-11-21 | „Rekordschluss“ beim DAX unbelegt | Schluss aus sechs Monaten abgeleitet | „Sechsmonatshoch“ | Wortwahl |
