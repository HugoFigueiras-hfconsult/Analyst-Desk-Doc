# Sweeper

| | Sweep in der Seite | Großer Lauf |
|---|---|---|
| Start | Knopf „Sweep starten“, zweiter Klick bestätigt | geplante Aufgabe „Analyst Desk Sweep“ oder Auftrag im Chat |
| Läuft | im geöffneten Tab | eigene Claude-Sitzung |
| Suche | Parallel Search über `mcp` | Parallel Search, Ersatz WebSearch |
| Auswertung | `sample` (Claude ohne Netz) | Agent |
| Holt | neue Aussagen der Köpfe, Ereignisse der Stories | zusätzlich Kurse, 13F, Szenarien, Kalender, Wissensbank, Calls |
| Schreibt | Datenbank `stm`, `tl`, `sweep/status` | im Chat `data/*.json` per `publish_files`; als geplante Aufgabe Datenbank `files/<name>` und `stm/<id>`; dazu `sweep/status` und `memory/` |
| Prüfung | in der Seite (unten) | `agent/check.py` |
| Gedächtnis | keins | dieses Repo |

## Seiten-Sweep (`src/k-sweep.js`)

| Schritt | Regel |
|---|---|
| Ziele | aktive Stories, dann Köpfe. Kurz: Leitfiguren. Standard: dazu Köpfe mit Daten oder Wissensbank-Eintrag. Voll: alle. Selbsttest: 1 Kopf, speichert nichts. |
| Reihenfolge | aktive Stories, dann Köpfe in Roster-Reihenfolge, Leitfiguren zuerst |
| Suche | `web_search {objective, search_queries[3], session_id}`; bis 8 Treffer, Auszüge auf 1.400 Zeichen gekürzt; 1 Wiederholung bei `retryable` |
| Auswertung | Antwort als JSON `{"items":[…]}`; bei Anfragelimit 35 s Pause, höchstens 2 Wiederholungen |
| Prüfung | Datum im Fenster der letzten 14 Tage; Text 25–700 Zeichen; URL muss aus den Treffern stammen; Haltung gültig; unbekannte Ticker, Gebiete, Stories werden entfernt; kein Doppel (gleiche URL oder gleicher Tag und Wert); kein Deckel je Kopf, nur eine technische Obergrenze von 12 Einträgen je Suche |
| Wartezeit | Suche 45 s, Auswertung 90 s, Datenbank 8 s. Keine Antwort: dasselbe Ziel 1-mal wiederholen, dann Stopp mit `code: timeout`. Der Aufruf selbst wird nicht abgebrochen, die Seite wartet nur nicht länger. |
| Abbruch | Knopf „Abbrechen“; 5 Fehler in Folge; zweite Zeitüberschreitung am selben Ziel; fehlende Freigabe, fehlender Connector, Anfragelimit |
| Status | `sweep/status` beim Start, dann alle 15 bis 20 s (`beat` = Lebenszeichen, `done`, `total`, `added`, `step` mit Ziel und Phase Suche/Auswertung/Ablage) und am Ende |
| Unterbrochen | by „Seite“ und `beat` älter als 2 Minuten: Alle Ansichten zeigen „unterbrochen“ und geben den Start frei (Agentenläufe ohne `beat`: 120 Minuten ab Start) |
| Fortsetzen | Knopf „Fortsetzen ab Ziel n“ bei Unterbrechung, Fehler oder Abbruch, bis 12 Stunden nach Start und ab `done` ≥ 1. Gleiche Laufnummer, gleicher Fokus; Zielliste aus `sweep/plan`, sonst neu gebildet. Das Ziel, an dem der Lauf stoppte, zählt nicht als erledigt. |
| Ablösung | Schreibt ein anderer Lauf den Status (andere Ansicht, Agent), endet der Seiten-Sweep am nächsten Ziel und überschreibt nichts. Nach einer Pause über 45 s (Seite war angehalten) liest er den Status, bevor er schreibt. |
| Laufnummer | höchste aus Dateien, `stm`, `tl` und letztem Seiten-Status + 1 |
| Handy | läuft nur, solange die App offen und der Bildschirm an ist; die Seite fordert Wachhalten an (`navigator.wakeLock`, Erfolg in der App ungeprüft). `wo` im Status: Handy oder Rechner. |

## Großer Lauf

Ablauf: `AGENT.md` und `agent/auftrag.md`. Umfang über Zusatzzeile „Umfang: Kurz/Standard/Voll/Selbsttest“, Schwerpunkt über „Fokus: …“.

## Fehlerbilder

| Meldung im Desk | Ursache | Behebung |
|---|---|---|
| Connector nicht verbunden | Parallel Search fehlt im Konto | In Claude unter Connectors hinzufügen |
| Freigabe nötig | Abfrage abgelehnt oder offen | erneut starten, erlauben |
| Diese Ansicht kann keine Connectoren nutzen | Vorschau statt veröffentlichter Ansicht | Artefakt auf claude.ai öffnen |
| Lauf unterbrochen | Tab geschlossen, Handy gesperrt, App im Hintergrund, Seite neu geladen | „Fortsetzen ab Ziel n“ oder neu starten; Gefundenes bleibt |
| Keine Antwort innerhalb der Wartezeit | Suche oder Auswertung antwortet nicht, oft weil die Seite angehalten war | fortsetzen |
| Ein anderer Lauf hat übernommen | Lauf wurde in anderer Ansicht fortgesetzt oder der Agent hat begonnen | nichts; Gefundenes bleibt |
| Datenbank nicht erreichbar | `db` fehlt in der Ansicht | Einträge gelten bis zum Neuladen |
