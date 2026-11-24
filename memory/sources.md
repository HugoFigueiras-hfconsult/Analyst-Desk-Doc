# Quellen

| Quelle | Liefert | Vorsicht |
|---|---|---|
| Parallel Search `web_search` | bis 10 Treffer mit Auszügen und `publish_date`; in der geplanten Sitzung als `mcp__Parallel-Search__web_search`; 63 Suchen in Lauf 6 und 30 in Lauf 9 ohne Ausfall | Auszüge lang (rund 6.000 Token je Suche); je Kopf eigene Suche; `publish_date` liegt teils einen Tag nach der Aussage, vereinzelt Tage zu früh (Investing.com 17.11. statt 20.11.) |
| Parallel Search `web_fetch` | Datum und Kernaussagen einzelner Seiten und PDF (Greenlight-Präsentation, LPL Daily Market Update) | reuters.com antwortet mit 401, benzinga.com mit 403, bloomberg.com liefert nur Überschrift und Anriss; bis 20 URLs je Abruf mit einer gemeinsamen Frage |
| benzinga.com | fasst Beiträge auf X zusammen (O'Leary, Schiff, Novogratz, Burry) | Aussagedatum steht im Text, nicht im Artikeldatum |
| cnbc.com | Cramer, Strategen, Kernaussagen als Stichpunkte | Auszug oft kurz |
| finance.yahoo.com | Interviews, Zweitabdruck von Benzinga, Investing.com, TIKR und AFP; Flow Show über Investing.com | Datum mit Zeitzone; Videoseiten liefern meist nur die Beschreibung, teils ein Transkript (Ackman 13.11.): per Abruf prüfen. Rückblicke der Form »… said he wanted Bitcoin« verwerten alte Zitate (Cuban, Wired vom 8.1.2025) |
| resources.wisdomtree.com | Siegel-Wochenkommentar, montags, Primärquelle | – |
| grahamstephan.substack.com | Newsletter, Primärquelle | neueste Ausgabe nicht immer im Treffer |
| michaeljburry.substack.com | Titel und Anriss der Trading Posts (Feed), Primärquelle | Volltext hinter Bezahlschranke; Details über Invezz, TheStreet, Stocktwits |
| fundstratdirect.com | Tom Lee, Macro Minute mit Anriss, Primärquelle | Volltext für Abonnenten |
| yardeni.com | QuickTakes mit Anriss auf der Startseite (Ziele für den S&P 500), Primärquelle | Adresse ist die Startseite, kein fester Link |
| federalreserve.gov | Reden der Gouverneure im Wortlaut, Primärquelle | – |
| stockmarketwatch.com | Übersicht der Newsletter-Ausgaben | sekundär |
| guruvoices.com | Zitate vieler Köpfe mit Datum und Ursprung | Aggregator, sekundär kennzeichnen |
| cryptoslate.com, coindesk.com, crypto.news, theblock.co | Krypto-Stimmen mit Links auf X, ETF-Flüsse (Farside, SoSoValue) | Tagestiefs je Handelsplatz verschieden |
| thestreet.com, stocktwits.com, invezz.com, tipranks.com | Berichte über Beiträge und CNBC-Auftritte (Chamath, O'Leary, Burry, Lee, Ackman, Wood), Kursziele | sekundär |
| beincrypto.com, gokhshtein.com, news.bitcoin.com, u.today, aol.com | CNBC-Auftritte mit Wochentag (Yardeni, Ives), X-Beiträge im Wortlaut mit Link (O'Leary, Saylor, Schiff), Zweitabdruck von Guardian und Benzinga | sekundär kennzeichnen |
| cathiesark.com, arktradetiming.com, investing.com, folioobs.com, mymoneywood.com | ARK-Tageshandel je ETF und in Summe (Investing.com, FolioObs: Stückzahlen über alle ETF) | Übersichten sekundär; mehrere Tage prüfen; am Morgen nach dem Handelstag fehlt der Vortag noch |
| price-target.com, stocktitan.net (Form 4), sec.gov (8-K), nvidianews.nvidia.com, hpe.com, strategy.com/ledger | Analystennotizen mit Datum und Wortlaut; Insiderkäufe; Personalien (Huang, 8-K mit Ereignisdatum 22.11.), Quartalszahlen, Bitcoin-Käufe von Strategy je Woche | Primär- oder primärnahe Quellen: Zahlen von hier nehmen; das 8-K nennt den Tag des Beschlusses, die Mitteilung den der Bekanntgabe |
| cbsnews.com, lpl.com, mohamedelerian.substack.com, federatedhermes.com, goldmansachs.com/insights, blackrock.com (BII), iheart.com | Transkripte (»Face the Nation«), Daily Market Update von LPL (Turnquist), El-Erians Wochenrückblick (samstags), Ausblicke der Häuser, Podcast-Transkripte | Primärquellen; goldmansachs.com datiert die Zusammenfassung, nicht den Bericht |
| seekingalpha.com, buysidedigest.com, institutionalinvestor.com, tikr.com | Greenlight-Quartalsbrief und 13F-Auswertung (Einhorn), X-Beiträge von Chanos | Brief über Seeking Alpha im Wortlaut; TIKR sekundär |
| investors.broadcom.com, investors.micron.com, oracle.com/corporate/investor_relations/faq.html | bestätigte Zahlentermine (Oracle: 14.12.) | vor jedem »erwartet« hier nachsehen |
| kitco.com/price, tradingeconomics.com | Gold-Spot mit Uhrzeit (New York) und Tagesspanne; Brent und Gold als CFD-Stand mit Kommentar | Trading Economics ist kein Schlusskurs |
| coinlab.info, satsintel.io, dailycryptobriefs.com, farside.co.uk/btc, coinglass.com | Bitcoin-Tagesbrief (Binance, Farside, Deribit), ETF-Flüsse je Tag (Farside-Tabelle direkt lesbar), Tagesdaten, Börsenvorfälle (Kraken) | Farside am letzten Tag vorläufig und ohne IBIT; endgültiger Wert am Folgetag (20.11.: −669,2 statt −124,5 Mio. $) |
| chaincatcher.com, gate.com, treasurybonds.com, watchtowerterminal.com | CME-FedWatch-Werte mit Uhrzeit (ChainCatcher in Pekinger Zeit, Gate in UTC) | sekundär; Werte desselben Tages zwischen 89,7 und 93,2 % |
| de.marketscreener.com (Dow Jones, Reuters, dpa-AFX) | Wochenvorschau mit Uhrzeiten in MEZ, Prognosen für deutsche Daten, Marktberichte | Anmeldeschranke im Kopf, Text im Auszug lesbar |
| money365.market, premarketdaily.com, streetstats.finance | Wochenbilanz der Sektoren und Marktbreite | Werte weichen um Zehntel ab: Spanne nennen |
| biggo, teahose.com, hangingcontext.com, coinotag, vibetrader, wisevoter, bidclub.ai, pod.wave.co, whistlebuzz.com, cvj.ai, kagels-trading.com | – | maschinelle Übersichten und Prognoseseiten: kein Beleg (kagels nannte einen falschen DAX-Schluss). mlq.ai ist eine KI-Redaktion mit Quellenangaben: nur als Spur |
| tokenpost.com, mlq.ai, finabase.io, tikr.com, roic.ai | Wiedergabe von Agenturen und Research | Aggregatoren, sekundär kennzeichnen |
| bitkub.com, vibetrader.com | Wiedergabe von U.Today | sekundär, nur wenn nichts Besseres |
| youtube.com | Titel und Datum | kein Inhalt: kein Eintrag (Paffrath, Lee-Kurzvideos) |
| FinanceBuzz, AOL zu Corcoran | – | verwerten Zitate von 2024: nicht nutzen |
| x.com | Beiträge im Wortlaut (Burry, Lee, Oracle, El-Erian, Kiyosaki, Gundlach, Chamath) | angezeigte Uhrzeit wechselt die Zeitzone; Sendezeit aus der Status-ID rechnen: (ID >> 22) + 1288834974657 ms, UTC |
| frenzycap.com, windailysports.com | Fed-Wahrscheinlichkeiten aus Futures und Prognosemärkten mit Uhrzeit | nicht CME FedWatch; Methode nennen |
| straits.live, houseofsaud.com | Lage in der Straße von Hormus, UKMTO-Meldungen | zählen Durchfahrten verschieden; nur UKMTO-Angaben übernehmen |
| marketsunrise.com, schwab.com, stocktitan.net | Wochenausblick, Zahlen- und Datentermine | Prognosen dem Medium zuordnen |
| macronotebook.com, ppnworld.com, bls.gov, bea.gov | Kalender für vier Wochen; BLS und BEA sind Primärquellen | Zahlentermine teils nur „erwartet“ |
| Yahoo Chart-API | Tagesschluss 6 Monate, 76 Reihen | kein Gold-Spot; offenen Tag verwerfen; in der geplanten Sitzung vom Proxy gesperrt, auch am 24.11.: Kurse kommen aus dem Zweig `kurse` (Stand 24.11., 05:30 UTC; Bitcoin-Reihe nur bis 22.11.); Brent stimmte am 23.11. mit Reuters überein (89,37 $) |
| stooq.com | – | blockiert |
| 13F über Thesis & Rationale, Reuters, Equibles, IBTimes, 24/7 Wall St., GuruFocus, ValueSider, getsignal.finance, gurugems.org, butterflymarketinsider.com | Positionen zum Quartalsende je Fonds mit Stückzahlen und Anteilen | 45 Tage Verzug; nur als Positionen, nie als Aussage; Optionen stehen mit Nominalwert in der Meldung |
| portfolio-terminal.com, cappnotes.substack.com (Closing Look), stocktitan.net (Artikel) | Schlusskurse der Indizes, VIX, US-Renditen (Treasury über FRED), Sektoren und Marktbreite des Handelstags | Zusammenstellungen; am 23.11. deckungsgleich mit CNBC und der Kursreihe |
| newsfilter.io, zamantika.com, fa-mag.com | Spiegel von CNBC-Zusammenfassungen (mit Uhrzeit), von X-Beiträgen (mit Status-ID) und Bloomberg-Berichte im Zweitabdruck | sekundär kennzeichnen; X-Datum über die Status-ID rechnen |
| schwab.com (Marktbericht), yardeni.com (Morning Briefing), research.socialcapital.com, pimco.com | Primärtexte von Sonders, Yardeni, Chamath, Ivascyn | ein Text ergibt einen Eintrag, auch wenn er mehrere Themen hat |
