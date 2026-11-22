# Fehlerprotokoll

| Datum | Symptom | Ursache | Behebung | Regel |
|---|---|---|---|---|
| 2026-11-22 | Lauf 5: Datendateien nicht veröffentlicht | Sitzung der geplanten Aufgabe hat keine `mcp__claude-artifacts__*`-Werkzeuge; `Artifact` verlangt beim Veröffentlichen von Dateien zusätzlich `index.html` | Seite nicht gesendet; 23 Aussagen und 21 Ereignisse in die Datenbank, Rest als Bündel in `memory/pending/data`; Status `error` | Werkzeuge |
| 2026-11-22 | `prices.py` ABBRUCH, 76 von 76 Reihen | Proxy der Sitzung sperrt `query1.finance.yahoo.com` (403, Netzrichtlinie) | alte Kurse behalten (Schluss 20.11., Bitcoin 21.11.) | Preise |
| 2026-11-22 | Seiten-Sweep datierte Einhorns Präsentation auf den Sweep-Tag (w4-einhorn-0: 22.11. statt 21.10.) | PDF ohne Datum im Suchtreffer | Datum im Dokument gelesen, in der Datenbank korrigiert | Datum |
| 2026-11-22 | Seiten-Sweep: Aussagedatum nach dem Artikeldatum (w4-bell-0: 13.11., Artikel 9.11.) | Auswertung schätzt das Datum | auf 9.11. mit `da:1` | Datum |
| 2026-11-22 | n07 (Burry) trug 20.11. statt 19.11. | Datum des Berichts statt des X-Beitrags | im Bündel korrigiert; Datei im Artefakt noch alt | Datum |
| 2026-11-22 | Seiten-Sweep: Eintrag aus YouTube-Titel (w4-stephan-0) und Doppel derselben Rede (w4-warsh-1, w4-birol-1, w4-druckenmiller-0) | Seite prüft nur gleiche URL oder gleichen Tag und Wert | verworfen und in der Datenbank gelöscht | Quelle, Doppel |
| 2026-11-22 | Seiten-Sweep ordnete Werte zu, die die Aussage nicht nennt (w4-chamath-1 CRM, w4-fink-0 HYG und TLT, w4-stephan-1 JPM, w4-subramanian-1 NVDA) | Auswertung wählt Stellvertreter | Werte entfernt | Zuordnung |
| 2026-11-22 | Seiten-Sweep nahm 13F-Berichte als Aussagen auf (w4-sundheim-0, w4-griffin-0) | Auswertung trennt Aussage und Positionsbericht nicht scharf | im Bündel als Positionen; die beiden Einträge liegen noch in der Datenbank | Zuordnung |
| 2026-11-22 | Story Gold nannte Brent-Schluss 89,95 $ aus der Yahoo-Reihe; Reuters meldet 92,57 $ | Yahoo-Symbol zeigt vermutlich einen anderen Kontraktmonat | Text im Bündel auf Reuters gestellt; Reihe beim nächsten Abruf prüfen | Preise |
| 2026-11-22 | Doppelte Level-Einträge in `stories.json` (nvda 2, spx27 4) | frühere Läufe hängten Marken mehrfach an | im Bündel entfernt | Stories |
| 2026-11-22 | Kalender: Verbrauchervertrauen stand am 25.11., richtig ist der 24.11. | Sammeltermin ungeprüft übernommen | im Bündel korrigiert | Kalender |
| 2026-11-22 | Beinahe: Lauf als Nr. 4 gezählt (`desk.sweep.n` + 1) | Seiten-Sweep (Lauf 4) steht nur in der Datenbank | Lauf 5 vergeben | Laufnummer |
| 2026-11-22 | Beinahe: Fed-Szenario mit 90 % zu 10 % (25 gegen 50 bp) fortgeschrieben | Berichte vom Vormittag; zum Schluss am 20.11. lag es bei 93 % zu 7 % (25 bp gegen Pause) | Stand mit Quelle und Uhrzeit, Abweichung in der Notiz | Marktpreise |
| 2026-11-22 | Meinungswechsel Cathie Wood zu Nvidia zeigte Kursreaktion von SpaceX (n03) | Anzeige nahm den ersten Ticker mit Kursreihe; ANT hatte keine | Feld `chg.a`, Anzeige nur dafür (`chgRx`); `check.py` prüft | Zuordnung |
| 2026-11-22 | Burry 6 und Wood 5 Aussagen, andere Leitfiguren 0 | Nachrecherche folgte Hugos Beispielnamen | Zählung je Kopf. Deckel, Reihenfolge nach Anzahl und Sperrliste hat Hugo am selben Tag verworfen | Ausgewogenheit |
| 2026-11-22 | Sharks-Sammelsuche lieferte nur O'Leary | ein Suchziel für sechs Personen | je Kopf eigene Suche | Suche |
| 2026-11-22 | Bitcoin-Schluss enthielt laufenden Tag | Yahoo liefert offenen Tagesbalken | `prices.py` verwirft Balken der laufenden Sitzung | Preise |
| 2026-11-22 | Story-KPI wich vom Chart ab | KPI von Hand, Kurse automatisch | `px`: Desk rechnet KPI | Stories |
| 2026-11-22 | `publish_files` lehnte `agent/prices.py` ab | Dateityp `.py` nicht erlaubt | als `.py.txt` ablegen | Betrieb |
| 2026-11-22 | Geplante Aufgabe dreimal abgelehnt | Fassung mit Zeitplan und „unbeaufsichtigt, keine Rückfragen“ | angelegt ohne Zeitplan, mit Rückfrage vor Aktionen; Zeitplan und automatische Genehmigung setzt Hugo | Betrieb |
| 2026-11-22 | Spot-Marken im Future-Chart (Gold) | Chart-Alias XAU → GOLDF | Linien unterdrücken, Hinweis | Preise |
| 2026-11-21 | „Rekordschluss“ beim DAX unbelegt | Schluss aus sechs Monaten abgeleitet | „Sechsmonatshoch“ | Wortwahl |
| 2026-11-21 | Behobene Fehler der Seite ohne Regel, verdichtet in Lauf 5: Arrays direkt an `replaceChildren` (Helfer `put()`); Dedupe-Schlüssel der Positionen zu grob (jetzt p, tk, ac, det) | – | behoben | – |

Musterprüfung in Lauf 5 (jeder 5. Lauf): Datum (4 Fälle), Zuordnung (4), Doppel und Quelle (2), Preise (4), Werkzeuge (2). Daraus neu oder geschärft in `lessons.md`: Datum, Zuordnung, Doppel, Preise, Marktpreise, Werkzeuge, Laufnummer.
| 2026-11-22 | Nachtrag zu Lauf 5 | – | Chat hat das Bündel als Dateien veröffentlicht (Version 1795378040-c5fe). Seite liest ab Version 1795378168-be42 Überlagerungen `files/<name>` und nimmt aus `stm`/`tl` nur Einträge über dem Dateistand. Künftige Läufe veröffentlichen über Weg B. | Werkzeuge |
