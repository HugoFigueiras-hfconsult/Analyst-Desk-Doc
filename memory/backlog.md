# Offene Punkte

## Agent

| Punkt | Stand |
|---|---|
| ARK-Handel vom 23.11. nachziehen (lag am Morgen des 24.11. noch nicht vor): Kauft ARK Nvidia nach Huangs Rückkehr zurück? Dazu der SpaceX-Kauf vom 16.11. (laut Cathiesark 46,8 Mio. $ in ARKK) mit Stückzahl | offen |
| Dienstag, 24.11., nachziehen: Ifo-Geschäftsklima, US-Verbrauchervertrauen, Zahlen von Dell und HP; Mittwoch, 25.11.: PCE-Preisindex, Beige Book | offen |
| Nvidia: 10-Q (laut MLQ.ai Frist 4.12.), Antworten an Bessent (fällig um den 25. bis 27.11.), Ergebnis der Ausschuss-Untersuchung; Huangs Aussage vor Ausschüssen des Repräsentantenhauses am 1.12. ist nur über Berichte belegt (TIKR, BeInCrypto): Termin aus Primärquelle belegen, dann in den Kalender | offen |
| Karniol-Tambour: Ernennung zur Chefin des kanadischen Staatsfonds am 9.11. belegt (WSJ über MarketWatch), Antrittstermin fehlt; Rolle in `people.json` erst danach ändern | offen |
| Mögliche Doppel im Bestand prüfen: `w4-williams-0` und `w4-williams-1` (Axios-Veranstaltung 17.11.), `w4-arcuri-0` und `w4-arcuri-1` (UBS-Notiz 18.11.), `r5-22` und `r6-35` (Rosenberg 20.11.), `c8-bessent-0` (13.11.) und `r6-33` (20.11., zwei CNBC-Auftritte?), mehrere `c8`-Einträge je Kopf am selben Tag (Munster 16. und 17.11., Arya 12.11., Jassy 17.11.), `w8-oleary-2460` und `r3-01` (17.11.), `w8-yardeni-2461` und `r6-15` (22.11.) | offen |
| Daten nachbelegen: Oppenheimer-Ausblick (12. oder 13.11., `r6-02`), Sendetag von Woods Interview bei ETF IQ Asia (`r6-12`) und der Podcast-Folge »Money Rehab« (`r9-12`), Bessents Zehn-Tage-Forderung (15. oder 17.11., `r5-09`), Rasgons AMAT-Notiz (13. oder 17.11., `w4-rasgon-0`), Datum des Third-Point-Briefs (`w8-loeb-2460`, `r3-14`), Tag von Ackmans Yahoo-Gespräch (12. oder 13.11.) | offen |
| Schwach belegt, bei besserer Quelle nachtragen: O'Leary am 21.11. (»Bank von Nvidia geschlossen«, Benzinga nicht abrufbar), Burrys Schwelle von 200 Dollar für neue Nvidia-Shorts und sein Lululemon-Rückkauf, Gerstner beim TomorrowX Summit am 17.11. (nur bidclub.ai), El-Erians gelöschter X-Beitrag vom 23.11., Anleihen über rund 44 Mrd. $ für SpaceX-Rechenzentren (nur MLQ.ai) | offen |
| Wissensbank: Für die 66 Köpfe aus dem Chat-Sweep und für Reitzes, Reid, Sonders, Gerstner fehlen Einträge in `kb.json` | offen |
| Kurse: Die Bitcoin-Reihe im Zweig `kurse` endete am 24.11. (Abruf 05:30 UTC) am 22.11.; beim nächsten Lauf prüfen, ob der 23.11. nachkommt, sonst als Fehler an den Chat | offen |
| Cohen: weiter keine datierte Aussage aus 2026; nur 13F | offen |
| Greiner und Paffrath: Greiner ohne belegte Aussage; Paffrath nur über ein Video (`c8-paffrath-0`) | offen |
| Georgieva: APEC-Rede vom 19.11. steht nur in `kb` (gleiche Konferenz wie `s36`) | bekannt |
| Schiffs Goldkaufaufruf vom 20.11. hat keinen Call, weil für XAU nur die Future-Reihe vorliegt | bekannt |
| Belegte Wirkung (`fx`) nachtragen | offen |
| Rollen bestätigen (`v:1`): in Lauf 9 Huang und Kress; rund 100 offen | offen |
| Flow Show vom 20.11. nur über Yahoo und Investing.com belegt; nächste Ausgabe laut Wallstreetcn am 3.12. | offen |
| S&P-Ziel 2027 der Bank of America (Subramanian) noch nicht gefunden; ein Bericht nennt 8.200 mit den Kennzahlen von Wells Fargo (vermutlich verwechselt) | offen |
| Verworfen wegen schwacher Quelle, bei besserem Beleg nachtragen: Krishna (Barclays-Ziel 8.700, »Chips and Dips«), Niles (Yahoo-Finance-Gespräch um den 09.11.), Kuo (TPU-Bestellungen bis 2029), Mahaney (Tausch Netflix/Spotify), Mortier zu Anthropic, Chronert bei Fox Business 18.11. | offen |
| Ohne belegten Fund am 23.11. (nächster voller Lauf): Greg Davis, Bert Flossbach, Ben Snider, Sharon Bell, Savita Subramanian, Venu Krishna, Gerry Fowler, Marko Kolanovic, Barry Bannister, Hans Mosesmann, Dan Niles, Mark Mahaney, Ming-Chi Kuo, Mike Mayo, Betsy Graseck, Geoff Kendrick, Christopher Waller, Kristalina Georgieva, Fatih Birol, Ted Pick, Colette Kress, Satya Nadella, Sundar Pichai, Mark Zuckerberg, C.C. Wei, Barbara Corcoran, Robert Herjavec, Daymond John, Lori Greiner, Mike Novogratz, Andrei Jikh | offen |
| Musterprüfung von `errors.md` (jeder 5. Lauf): in Lauf 10 | geplant |

## Chat/Hugo

| Punkt | Stand |
|---|---|
| Bündel aus `memory/pending/data` (Lauf 9) als Dateien veröffentlichen: In der Datenbank liegen 10 Überlagerungen `files/<name>` mit zusammen rund 330 KiB (allein `prices` 92, `desk` 93) und 312 Dokumente in `stm`, die der Desk bei jedem Laden über den Dateistand von Lauf 5 legt | empfohlen |
| Frage an Hugo: Jensen Huang ist seit Lauf 9 als Kopf im Roster (Gruppe Notenbank, Politik, CEOs), nicht als Leitfigur. Soll er `star` bekommen? | Frage an Hugo |
| Frage an Hugo: Tesla als Instrument aufnehmen? Wird von Wood, Musk und in 13F-Meldungen genannt, fehlt in `desk.assets`; die Zeile für `memory/kurse-add.txt` wäre `TSLA=TSLA\|Tesla\|Aktie, Kassa\|$\|NASDAQ:TSLA` | Frage an Hugo |
| Seiten-Sweep, Befund aus Lauf 8: 75 von 110 Aussagen unbrauchbar (32 Positionsmeldungen als Aussage, 32 Doppel oder Mehrfacheinträge zum selben Anlass, 11 ohne Beleg oder undatiert), 28 weitere korrigiert; von 19 Story-Ereignissen 12 doppelt oder falsch. In Lauf 5 waren es 6 von 72. Ideen für die Seite: 13F- und 13D-Meldungen erkennen und nicht als Aussage ablegen; Doppel gegen den Bestand des Kopfes im Abstand von einem Tag prüfen statt nur gegen dieselbe URL; je Suchtreffer höchstens ein Eintrag je Anlass; Werte nur, wenn im Auszug genannt; Datum nie auf den Sweep-Tag; keine Einträge aus youtube.com, BigGo, bidclub.ai; Story-Ereignisse nicht aus Prognose- und Sammelseiten | Idee |
| Idee für `tests/routen.py`: Das deutsche Wort »null« in Aussagetexten löst Fehlalarm aus; nur auf Wortgrenzen außerhalb von Fließtext prüfen oder die Datentexte vorher ausnehmen | Idee |
| Idee für die Seite: Bei Weg B erscheinen korrigierte Bestandseinträge als »neu im letzten Sweep«, weil `stm`-Dokumente aus den Dateien `sw` = Lauf brauchen (Lauf 9: nur `r5-03`). Vorschlag: Feld für Korrekturen auswerten | Idee |
| Idee für die Seite: Nach einem Lauf über Weg B gibt es keinen Hinweis »Neue Daten laden« (Status ohne `version`); mit `version` bliebe der Knopf dauerhaft stehen | Idee |
| Idee für die Daten: Thema und Gebiet »Immobilien« fehlen (Corcoran, Stephan, Weinstein zu britischen REITs stehen ohne Gebiet) | Frage an Hugo |
| Befund zur Sitzung der geplanten Aufgabe (24.11.): Repo ja, Artefakt lesen ja, Datenbank ja (Stapel bis 50 Schreibvorgänge, Dokumente auch aus Dateien), Parallel Search ja, Forks ja; Dateien veröffentlichen nein, Yahoo nein; Kurse über den Zweig `kurse` | bekannt |
| Hinweis bei der CFD-Referenz XAUUSD nennt noch rund 3.540 $ (Feld `cfd`, für den Agenten gesperrt); letzter belegter Spot rund 3.632 $ am 23.11., 22:58 Uhr New York (Kitco) | offen |
| Zweig `kurse`: Bitcoin-Reihe am 24.11. nur bis 22.11. (siehe Abschnitt Agent); Brent stimmte am 23.11. mit Reuters überein, der Punkt »Brent-Symbol prüfen« ist damit erledigt | offen |
| Gold-Spot-Reihe finden | offen |
| Kurse im Seiten-Sweep nicht möglich: großer Lauf nötig | bekannt |
| Deutsche Stimmen ergänzen? Im Bestand: Reinwand (Helaba), Krämer (Commerzbank), Nagel (Bundesbank) | Frage an Hugo |
