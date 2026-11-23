# Seiten und Rechenregeln

| Seite | Zeigt | Klick führt zu |
|---|---|---|
| Lage | Sweep-Status, Kursleiste, Hero-Story mit Chart, Rotation der Sektoren, auffällige Tage, frische Stimmen (je Kopf eine), Stimmungsbild, Meinungswechsel, Kalender | Detailseiten |
| Money Rotation | Reiter Überblick (Lesart, Rotations-Karte, Rangliste, Paare), Kurse (Tabelle, Verhältnis-Verläufe), Depots (Flussbild, Matrix, Konsens, Gebiete, Einzelwerte), Flüsse & Stimmen | Instrument, Gebiet, Person |
| Hot Stories | Karten je Story | Story |
| Level-Radar | Marken je Story, nächste Marke darüber und darunter, Leiter | Story, Aussage |
| Wirkung | Auffällige Tage mit Anlass, Aussagen mit stärkster Tagesbewegung, belegte Wirkung (`fx`) | Aussage |
| Themen-Kompass | Stimmen-Saldo gegen 13F-Saldo je Gebiet | Gebiet |
| Instrumente | Alle Kursreihen, Filter nach Art, Sortierung | Instrument |
| Szenarien | Wahrscheinlichkeiten, betroffene Werte, Positionen, Desk-Einschätzung | Story |
| Kalender | Wochen, Countdown, „wirkt auf“, deine CFDs, Kurs am Tag bei Vergangenem | Story, Instrument |
| Aussagen | Feed mit Filtern, Sortierung nach Datum oder Kursreaktion | Aussage |
| Meinungswechsel | Vorher/nachher, Kurs des betroffenen Werts (`chg.a`) | Aussage |
| Call-Tracker | Zwischenstand messbarer Aussagen | Person |
| Sagen & Tun | Aussage gegen Position je Kopf und Wert | Person |
| Wissensbank | Köpfe mit Profil, Kanälen, Thesen | Person |
| Sweep & Agent | Start, Fortsetzen, Umfang, Fortschritt, Protokoll, Ausgewogenheit | – |
| CFD-Brücke | Kontext je CFD-Referenz zum Kopieren | Instrument |
| Desk fragen | Fragen an die Daten über `sample` | – |
| Suche | Treffer in Werten, Köpfen, Stories, Themen, Aussagen | alle |

## Rechenregeln

| Größe | Regel | Ort |
|---|---|---|
| Kursreaktion | Schluss gegen Vortag am ersten Handelstag ab Datum (höchstens 4 Tage später); „seither“ bis letzter Schluss; `z` = Tag ÷ Standardabweichung der 60 Tage davor; auffällig ab 2 | `react` |
| Renditen (Einheit %) | Veränderung in Basispunkten statt Prozent | `delta`, `dU` |
| Stimmungsbild, Saldo je Gebiet, Balken | je Kopf zählt nur die jüngste Aussage | `heads`, `stanceBar` |
| Übersichtslisten | erst je Kopf eine Aussage, dann der Rest | `spread` |
| Relative Stärke | Kurs 7/30/91 Tage gegen S&P 500 in Prozentpunkten, Stichtag `pxAsOf` | `rel`, `rotStats` |
| Lage in der Rotation | 3 Monate ≥ 0 und 1 Monat ≥ 0: führt; < 0 und ≥ 0: holt auf; ≥ 0 und < 0: lässt nach; sonst bleibt zurück | `rotStats` |
| Rotations-Paar | Verhältnis A/B über 66 gemeinsame Tage, Start = 100; Lesart ab ±0,5 % in 1 Monat | `pairStats` |
| Depot-Fluss | je Manager: Gebiet mit Saldo < 0 → Gebiet mit Saldo > 0; Breite = Zahl der Manager | `depotFlows` |
| Story-KPI | bei `px`: letzter Schluss, Tagesänderung, Abstand zum Sechsmonatshoch | `normStories` |
| Call-Stand | long/short: im Plan oder gegenläufig seit Aussage; Ziel: offen mit Abstand | `callEval` |
| Meinungswechsel-Kurs | nur für `chg.a`; fehlt es, wird der Wert aus dem Text abgeleitet, sonst nichts gezeigt | `chgRx` |

## Feste Vorgaben

| Thema | Vorgabe |
|---|---|
| Preise | Kassa, Spot und Future nie mischen; Basis, Quelle, Zeitstempel zeigen |
| Gold | Chart ist COMEX-Future, so beschriftet; Spot-Marken nicht in den Future-Chart |
| Ursache | Kursreaktion heißt zeitlicher Zusammenhang; Ursache nur mit Quelle (`fx`) |
| Personenfotos | keine; Initialen-Kürzel |
| Zitate | sinngemäß auf Deutsch, kein wörtliches Zitat über 14 Wörter |
| Farben | Kauf/bullisch #1c9fc4, Verkauf/bärisch #e5477d, Warnung #ab9016, neutral #5d6a82, Wahrscheinlichkeit #8f6bf0, Akzent #ff8a2a; Text trägt nie Serienfarbe |
