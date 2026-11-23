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
| Anfragelimit | Lehnt die Suche ab (`upstream_error`, `server_unavailable`, `rate_limited`; in der Regel das Limit der kostenlosen Parallel-Stufe, HTTP 429): Pause, dann dasselbe Ziel erneut. Pausen 1, 2, 5, 10, 15 Minuten; danach Stopp am selben Ziel, fortsetzbar. Kein Kopf wird übersprungen. Beobachtet am 23.11.: Sperre nach 79 Suchen in 9 Minuten (Lauf 8); Lauf 4 mit 78 Suchen in 7 Minuten lief durch. Genaue Grenze von Parallel nicht veröffentlicht. |
| Abbruch | Knopf „Abbrechen“ (auch in einer Pause); 5 Fehler in Folge (zurück auf das erste gescheiterte Ziel); zweite Zeitüberschreitung am selben Ziel; fehlende Freigabe, fehlender Connector; Anfragelimit nach der letzten Pause |
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
| Die Suche nimmt gerade keine Anfragen an | Anfragelimit der kostenlosen Suche nach vielen Suchen in kurzer Zeit | wartet von selbst und versucht es erneut; nach dem Stopp später fortsetzen. Dauerhaft: Parallel-Konto mit Anmeldung oder API-Schlüssel (höhere Limits, kostenpflichtig je Suche) |
| Keine Antwort innerhalb der Wartezeit | Suche oder Auswertung antwortet nicht, oft weil die Seite angehalten war | fortsetzen |
| Ein anderer Lauf hat übernommen | Lauf wurde in anderer Ansicht fortgesetzt oder der Agent hat begonnen | nichts; Gefundenes bleibt |
| Datenbank nicht erreichbar | `db` fehlt in der Ansicht | Einträge gelten bis zum Neuladen |

## Chat-Sweep mit parallelen Agenten

| Punkt | Inhalt |
|---|---|
| Wann | Auf Zuruf im Chat, wenn ein Lauf ohne Gerät und ohne das Limit des Seiten-Sweeps durchlaufen soll |
| Ablauf | Köpfe in Pakete zu 14 bis 18 teilen → je Paket ein Agent nach `agent/chat-sweep/auftrag-suchagent.md` → JSON je Agent → `agent/chat-sweep/pruefen.py` (Schema, Fenster, 13F, Zitatlänge, Doppel) → Hauptlauf liest jede Zeile und streicht → `stm/c8-<kopf>-<n>` in die Datenbank → `sweep/status` done, by Chat |
| Während des Laufs | `sweep/status` running, by Chat: Die Seite sperrt dann Start und Fortsetzen |
| Suche | Parallel Search, 1 Suche je Kopf und eigene `session_id` je Agent; die eingebaute WebSearch taugt in Agenten nicht (nur Titel, Kontingent 200) |
| Aufwand am 23.11. | 98 Köpfe, 11 Suchagenten und 1 Schreibagent, rund 110 Minuten, 122 Einträge |
