# Sportbutiken — lageranalys och inköpsplanering

En svensk interaktiv dashboard med fiktiv övningsdata från ett eget Excel-projekt. Affärsfrågan: hur kan en sportbutik balansera risken för lagerbrist mot kapitalbindningen i lager?

## Öppna direkt
Dubbelklicka på `index.html`. Data och beräkningslogik finns även i `dashboard.js` för att direktöppning ska fungera utan server. Vid ändring av källdata behöver denna leveransfil byggas om.

## Starta lokalt
Installera Node.js och kör `npm start` i projektmappen. Öppna http://127.0.0.1:4173. Kör `npm test` för beräkningstester. Inga npm-beroenden krävs. Typsnitt hämtas från Google Fonts; lokala reservtypsnitt används utan uppkoppling.

## Funktioner
- Filter för produkt och leverantör; alla huvudnyckeltal, diagram och tabell följer urvalet.
- Buffertscenario som räknar om inköpsförslagen.
- Separat kampanjsimulering med pris, bruttovinst och marginal.
- Responsiv layout, tangentbordsåtkomst.

## Data och definitioner
`data/source.json` är en extraktion av indata från Sportbutik – portfolio.xlsx.xlsx: tio produkter, tre leverantörer, 40 produktveckor och slutlager efter vecka 4. Originalarbetsboken ändras inte. JSON är en statisk ögonblicksbild och uppdateras inte automatiskt när Excel ändras. Analysdatum: 2026-11-06. Försäljningsveckorna saknar kalenderdatum och visas därför som vecka 1–4.

Veckosnitt = totalt sålt / 4. Lagertäckning = slutlager / veckosnitt. Bristrisk = lagertäckning < leveranstid. Målnivå = avrundning uppåt av veckosnitt × (leveranstid + buffert). Föreslaget antal = max(0, målnivå − slutlager). Lagervärde och inköpsbelopp använder inköpspriser. Bruttomarginal = (pris − inköpspris) / pris.

Grundscenario: 527 sålda, 37 820 kr i lager, 14 035 kr föreslagna inköp och sex produkter med bristrisk. En buffert på två veckor ger 22 160 kr i föreslagna inköp. Dessa kontrollvärden testas mot Excel-resultaten.

## Slutsatser
Vattenflaska och Träningsband säljer snabbt och riskerar lagerbrist. Tennisracket binder 14 000 kr, cirka 37 % av lagervärdet, med 8,42 veckors täckning. Åtgärder kan vara prioriterad påfyllning för de första och återhållsamma inköp eller prövad kampanj för den senare. Kampanjscenariot visar lägre bruttovinst per enhet, inte bevis för ökad efterfrågan.

## Begränsningar
Fiktiv liten datamängd; ingen statistisk prognos eller kausal slutsats. Inga pågående inköp räknas av, inklusive den separata leveransövningen i Excel. Ingen moms, frakt, rabatthistorik, svinn, säsong eller lagerbristjusterad efterfrågan ingår. Bristrisk följer fyraveckorssnittet, inte senaste veckans takt. Sex veckor används endast som en enkel granskningsgräns för kapitalbindning. Kampanjvalet är oberoende av huvudfiltren.

## Publicering och uppdateringar
Projektet är statiskt och kan publiceras med GitHub Pages från repots rot. Välj Deploy from a branch, grenen main och mappen / (root) i Settings → Pages. Inga serverhemligheter eller npm-beroenden behövs.

Vid ändringar i app.js, model.js eller data/source.json: kör `npm run build` för att uppdatera dashboard.js och därefter `npm test`. Lägg sedan upp ändringarna på GitHub. Excel-filen finns i downloads/ och nås via dashboardens nedladdningsknapp. Om Excel-datan ändras behöver JSON-underlaget uppdateras separat.
