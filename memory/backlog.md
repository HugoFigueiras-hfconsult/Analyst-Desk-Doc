# Offene Punkte

## Agent

| Punkt | Stand |
|---|---|
| Kurse neu ziehen: Yahoo war in Lauf 5 und 6 gesperrt; Stand Schluss 20.11., Bitcoin 21.11. | offen |
| Brent-Reihe prüfen: 20.11. laut Yahoo 89,95 $, laut Reuters 92,57 $ | offen |
| Montag, 23.11., nachziehen: Wochennotiz von Wilson, Siegel-Kommentar (WisdomTree), 8-K von Strategy, Rede von Williams (22:00 MEZ), ARK-Handel, Zahlen von HPE; vorläufige Einkaufsmanagerindizes | offen |
| Nvidia: 10-Q (laut MLQ.ai Frist 4.12.) und Antworten an Bessent (fällig um den 25. bis 27.11.) | offen |
| Mögliche Doppel im Bestand prüfen: `w4-williams-0` und `w4-williams-1` (Axios-Veranstaltung 17.11.), `w4-arcuri-0` und `w4-arcuri-1` (UBS-Notiz 18.11.), `r5-22` und `r6-35` (Rosenberg 20.11.) | offen |
| Daten nachbelegen: Oppenheimer-Ausblick (12. oder 13.11., `r6-02`), Sendetag von Woods Interview bei ETF IQ Asia (`r6-12`), Bessents Zehn-Tage-Forderung (15. oder 17.11., `r5-09`), Rasgons AMAT-Notiz (13. oder 17.11., `w4-rasgon-0`) | offen |
| Musk: X-Beiträge vom 21.11. zu Betriebskapital und SpaceX-Schulden aus besserer Quelle als BigGo belegen | offen |
| Cohen: weiter keine datierte Aussage aus 2026 (Suche 23.11.); nur 13F | offen |
| Greiner und Paffrath: weiter keine belegte Aussage (nur TV-Zusagen und Videotitel); Corcoran, Herjavec und John haben seit Lauf 6 je einen Eintrag mit `da:1` | offen |
| Georgieva: APEC-Rede vom 19.11. steht nur in `kb` (gleiche Konferenz wie `s36`) | bekannt |
| Schiffs Goldkaufaufruf vom 20.11. hat keinen Call, weil für XAU nur die Future-Reihe vorliegt | bekannt |
| Belegte Wirkung (`fx`) nachtragen | offen |
| Rollen bestätigen (`v:1`): 9 in Lauf 6 bestätigt (Cohen, Turnquist, Bessent, Kiyosaki, Corcoran, Herjavec, John, Greiner, Paffrath); rund 100 offen | offen |
| Zahlentermin Oracle (7. oder 9.12.): vom Unternehmen noch nicht bestätigt; Broadcom (9.12.) und Micron (17.12.) sind bestätigt | offen |
| Flow Show vom 20.11. nur über Yahoo und Investing.com belegt; nächste Ausgabe laut Wallstreetcn am 3.12. | offen |
| Citi-Kursziel Bitcoin (99.532 nach 113.000 Dollar) aus besserer Quelle belegen | offen |
| S&P-Ziel 2027 der Bank of America (Subramanian) noch nicht gefunden | offen |
| Musterprüfung von `errors.md` (jeder 5. Lauf): wieder in Lauf 10 | geplant |

## Chat/Hugo

| Punkt | Stand |
|---|---|
| Bündel aus `memory/pending/data` (Lauf 6) als Dateien veröffentlichen, damit die Überlagerungen in der Datenbank klein bleiben: derzeit 9 Dokumente in `files` mit zusammen rund 180 KiB | bei Bedarf |
| Netzfreigabe für `query1.finance.yahoo.com` in der Umgebung der geplanten Aufgabe, sonst keine neuen Kurse (zwei Läufe ohne Kurse) | wartet auf Hugo |
| Geplante Aufgabe: Zeitplan läuft (Lauf 6 startete am 23.11. um 07:16 Uhr von selbst und lief ohne Rückfragen durch) | erledigt |
| Befund zur Sitzung der geplanten Aufgabe (23.11.): Repo ja, Artefakt lesen ja, Datenbank ja (Stapel bis 50 Schreibvorgänge), Parallel Search ja, Forks ja; Dateien veröffentlichen nein, Yahoo nein | bekannt |
| Idee für die Seite: Bei Weg B erscheinen korrigierte Bestandseinträge als »neu im letzten Sweep«, weil `stm`-Dokumente `sw` = Lauf brauchen (Lauf 6: 13 von 51). Vorschlag: Feld für Korrekturen auswerten | Idee |
| Idee für die Seite: Nach einem Lauf über Weg B gibt es keinen Hinweis »Neue Daten laden« (Status ohne `version`); mit `version` bliebe der Knopf dauerhaft stehen | Idee |
| Idee für die Daten: Thema und Gebiet »Immobilien« fehlen (Corcoran, Stephan stehen ohne Gebiet) | Frage an Hugo |
| Seiten-Sweep, Befund aus Lauf 5: 6 von 72 Aussagen unbrauchbar (Videotitel, Doppel derselben Rede, 13F als Aussage), 23 korrigiert (Datum, Werte, Kennzeichnung). In Lauf 6 weitere 6 Korrekturen und 1 Doppel an `w4`-Einträgen. Idee für die Seite: Datum nie auf den Sweep-Tag setzen, keine Einträge aus youtube.com, gleiche Rede je Kopf und Tag nur einmal, Werte nur wenn im Auszug genannt, 13F-Berichte nicht als Aussage | Idee |
| Hinweis bei der CFD-Referenz XAUUSD nennt noch rund 3.540 $ (Feld `cfd`, für den Agenten gesperrt); letzter belegter Spot rund 3.606 $ am 23.11., 00:10 Uhr New York (Kitco) | offen |
| Brent-Symbol der Kursquelle prüfen (Frontmonat?) | offen |
| Gold-Spot-Reihe finden | offen |
| Kurse im Seiten-Sweep nicht möglich: großer Lauf nötig | bekannt |
| Deutsche Stimmen ergänzen? In Lauf 5 eine aufgenommen (Reinwand, Helaba, über dpa-AFX); in Lauf 6 keine weitere | Frage an Hugo |

## Aus dem Chat-Sweep vom 23.11. (Lauf 8)

| Punkt | Stand |
|---|---|
| Unbestätigte Spur: Jensen Huang soll am 23.11. als Nvidia-Chef zurückgekehrt sein (Gelonghui/Sina zu einer Hochstufung durch Reitzes; Randspalte einer Yahoo-Zweitverwertung). Im nächsten Lauf zuerst an Primärquellen prüfen; betrifft Story `nvda` und viele Aussagen | offen, hohe Priorität |
| Einträge `c8-…` (122) und `w8-…` (128) wie Seiteneinträge prüfen; in `w8` viele 13F-Meldungen als Aussage (Kantesaria, Coleman, Halvorsen, Klarman, Englander) | offen |
| Verworfen wegen schwacher Quelle, bei besserem Beleg nachtragen: Krishna (Barclays-Ziel 8.700, »Chips and Dips«), Niles (Yahoo-Finance-Gespräch um den 09.11.), Kuo (TPU-Bestellungen bis 2029), Reitzes 23.11., Mahaney (Tausch Netflix/Spotify), Mortier zu Anthropic, Chronert bei Fox Business 18.11. | offen |
| Nicht zugeordnet: Deutsche Bank S&P-Ziel 9.000 für Ende 2027 (Reuters 23.11., Chadha nicht genannt); Subramanians Ziel 7.800 ungeprüft | offen |
| Bessent: CNBC Squawk Box am 13.11. als `c8-bessent-0` eingetragen; `r6-33` (20.11.) ist ein späterer Auftritt mit ähnlicher Aussage, Datum gegenprüfen | offen |
| Ohne belegten Fund am 23.11.: Greg Davis, Bert Flossbach, Ben Snider, Sharon Bell, Savita Subramanian, Venu Krishna, Gerry Fowler, Marko Kolanovic, Barry Bannister, Hans Mosesmann, Dan Niles, Mark Mahaney, Ming-Chi Kuo, Mike Mayo, Betsy Graseck, Geoff Kendrick, Christopher Waller, John Williams, Kristalina Georgieva, Fatih Birol, Ted Pick, Colette Kress, Satya Nadella, Sundar Pichai, Mark Zuckerberg, C.C. Wei, Barbara Corcoran, Robert Herjavec, Daymond John, Lori Greiner, Mike Novogratz, Andrei Jikh | nächster voller Lauf |
