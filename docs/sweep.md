# Sweeper

| | Sweep in der Seite | Großer Lauf |
|---|---|---|
| Start | Knopf „Sweep starten“, zweiter Klick bestätigt | geplante Aufgabe „Analyst Desk Sweep“ oder Auftrag im Chat |
| Läuft | im geöffneten Tab | eigene Claude-Sitzung |
| Suche | Parallel Search über `mcp` | Parallel Search, Ersatz WebSearch |
| Auswertung | `sample` (Claude ohne Netz) | Agent |
| Holt | neue Aussagen der Köpfe, Ereignisse der Stories | zusätzlich Kurse, 13F, Szenarien, Kalender, Wissensbank, Calls |
| Schreibt | Datenbank `stm`, `tl`, `sweep/status` | `data/*.json` per `publish_files`, `sweep/status`, `memory/` |
| Prüfung | in der Seite (unten) | `agent/check.py` |
| Gedächtnis | keins | dieses Repo |

## Seiten-Sweep (`src/k-sweep.js`)

| Schritt | Regel |
|---|---|
| Ziele | aktive Stories, dann Köpfe. Kurz: Leitfiguren. Standard: dazu Köpfe mit Daten oder Wissensbank-Eintrag. Voll: alle. Selbsttest: 1 Kopf, speichert nichts. |
| Reihenfolge | wenigste Aussagen zuerst, innerhalb gleicher Zahl gemischt |
| Suche | `web_search {objective, search_queries[3], session_id}`; bis 8 Treffer, Auszüge auf 1.400 Zeichen gekürzt; 1 Wiederholung bei `retryable` |
| Auswertung | Antwort als JSON `{"items":[…]}`; bei Anfragelimit 35 s Pause, höchstens 2 Wiederholungen |
| Prüfung | Datum im Fenster der letzten 14 Tage; Text 25–700 Zeichen; URL muss aus den Treffern stammen; Haltung gültig; unbekannte Ticker, Gebiete, Stories werden entfernt; kein Doppel (gleiche URL oder gleicher Tag und Wert); höchstens 2 je Ziel |
| Abbruch | Knopf „Abbrechen“; 5 Fehler in Folge; fehlende Freigabe, fehlender Connector, Anfragelimit |
| Status | `sweep/status` alle 5 Ziele und am Ende |

## Großer Lauf

Ablauf: `AGENT.md` und `agent/auftrag.md`. Umfang über Zusatzzeile „Umfang: Kurz/Standard/Voll/Selbsttest“, Schwerpunkt über „Fokus: …“.

## Fehlerbilder

| Meldung im Desk | Ursache | Behebung |
|---|---|---|
| Connector nicht verbunden | Parallel Search fehlt im Konto | In Claude unter Connectors hinzufügen |
| Freigabe nötig | Abfrage abgelehnt oder offen | erneut starten, erlauben |
| Diese Ansicht kann keine Connectoren nutzen | Vorschau statt veröffentlichter Ansicht | Artefakt auf claude.ai öffnen |
| Lauf nicht abgeschlossen | Tab geschlossen | neu starten; Gefundenes bleibt |
| Datenbank nicht erreichbar | `db` fehlt in der Ansicht | Einträge gelten bis zum Neuladen |
