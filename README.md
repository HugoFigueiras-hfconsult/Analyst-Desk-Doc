# Analyst Desk: Dokumentation und Agenten-Gedächtnis

Privates Artefakt von Hugo: Aussagen, Positionen und Kursreaktionen aktiver Fondsmanager, Analysten und Publikumsinvestoren. Dieses Repo ist Bauplan, Quellstand und Langzeitgedächtnis des Sweep-Agenten.

| Fakt | Wert |
|---|---|
| Artefakt | https://claude.ai/artifact/9SBEE9LwYKubjyTfAu3jw8 |
| slug | 444d01bc-c5b6-4549-b7d3-6b6600e6d4db |
| Arbeitszweig | `brain` (Agent liest und schreibt hier) |
| Sprache | Deutsch, Oberfläche und Daten |
| Stand der Doku | 22.11.2026, Artefakt-Version 1795371775-067e |

## Karte

| Pfad | Inhalt | Wer pflegt |
|---|---|---|
| `AGENT.md` | Einstieg für den Sweep-Agenten: Gedächtnis laden, Lauf, Gedächtnis schreiben | Chat |
| `agent/auftrag.md` | Ablauf, Regeln, Felder des großen Laufs (maßgeblich; Kopie liegt im Artefakt) | Chat |
| `agent/geplante-aufgabe.md` | Auftragstext und Einstellungen der geplanten Aufgabe | Chat |
| `agent/prices.py`, `agent/check.py` | Kurse ziehen, Daten prüfen (im Artefakt als `.py.txt`) | Chat |
| `docs/architektur.md` | Aufbau, Dateien, Fähigkeiten, Datenfluss | Chat |
| `docs/datenmodell.md` | Felder aller Dateien und der Datenbank | Chat |
| `docs/seiten.md` | Seiten, Funktionen, Rechenregeln | Chat |
| `docs/sweep.md` | Beide Sweeper: in der Seite und als geplante Aufgabe | Chat |
| `docs/betrieb.md` | Bauen, Testen, Veröffentlichen, Grenzen | Chat |
| `memory/` | Gedächtnis: Regeln, Fehler, Läufe, Quellen, offene Punkte | Agent |
| `src/` | Quellteile der Seite, `build.py` erzeugt `index.html` | Chat |
| `tests/` | Routentest und Sweep-Test mit Attrappen | Chat |

## Lesereihenfolge

| Wer | Liest |
|---|---|
| Sweep-Agent | `AGENT.md` → `memory/lessons.md` → `memory/errors.md` → `memory/sources.md` → `agent/auftrag.md` |
| Wer die Seite ändert | `docs/architektur.md` → `docs/seiten.md` → `docs/betrieb.md` → `src/` |
