export type Artikkel = {
  tittel: string
  kategori: string
  html: string
}

export const ARTIKLER: Record<string, Artikkel> = {
  'kom-i-gang/hva-er-bolgevarsel': {
    tittel: 'Hva er Bølgevarsel?',
    kategori: 'Kom i gang',
    html: `
<p>Bølgevarsel er en norsk tjeneste som sender deg daglige sjø- og værvarsler tilpasset kyststeder i Norge. Hver morgen kl. 07:30 mottar du en rapport med bølgehøyde, vindstyrke, vindretning og temperatur — slik at du vet hva som venter deg på havet eller ved sjøen.</p>
<h2>Hvem passer tjenesten for?</h2>
<ul>
<li><strong>Båteiere</strong> som vil vite om det er trygt å legge ut</li>
<li><strong>Familier med hytte ved sjøen</strong> som ønsker å planlegge bading og friluftsliv</li>
<li><strong>Fiskere og kajakker</strong> som trenger oppdatert informasjon</li>
<li><strong>Foreldre</strong> som vil holde oversikt over forholdene der barna bader</li>
</ul>
<h2>Hva får du?</h2>
<p>Avhengig av abonnementsplan mottar du:</p>
<ul>
<li>Daglig <strong>SMS-varsel</strong> med kortfattet værinformasjon</li>
<li>Daglig <strong>e-postrapport</strong> med fullstendig oversikt</li>
<li>Automatisk <strong>farevarsel</strong> ved ekstremvær eller kuling</li>
</ul>
<p>Du velger selv hvilke kyststeder du vil følge, og hvem som skal motta varslene.</p>
`,
  },

  'kom-i-gang/velg-plan': {
    tittel: 'Hvilken plan passer for meg?',
    kategori: 'Kom i gang',
    html: `
<p>Vi tilbyr tre abonnementsplaner. Her er en enkel oversikt:</p>
<table style="width:100%;border-collapse:collapse;margin:1rem 0">
<thead><tr style="background:#f0f8fc">
<th style="padding:10px;text-align:left;border-bottom:2px solid #e2e8f0">Plan</th>
<th style="padding:10px;text-align:left;border-bottom:2px solid #e2e8f0">Pris</th>
<th style="padding:10px;text-align:left;border-bottom:2px solid #e2e8f0">Lokasjoner</th>
<th style="padding:10px;text-align:left;border-bottom:2px solid #e2e8f0">SMS</th>
</tr></thead>
<tbody>
<tr><td style="padding:10px;border-bottom:1px solid #f1f5f9"><strong>Kyst</strong></td><td style="padding:10px;border-bottom:1px solid #f1f5f9">49 kr/mnd</td><td style="padding:10px;border-bottom:1px solid #f1f5f9">3</td><td style="padding:10px;border-bottom:1px solid #f1f5f9">Kun e-post</td></tr>
<tr><td style="padding:10px;border-bottom:1px solid #f1f5f9"><strong>Familie</strong></td><td style="padding:10px;border-bottom:1px solid #f1f5f9">179 kr/mnd</td><td style="padding:10px;border-bottom:1px solid #f1f5f9">1</td><td style="padding:10px;border-bottom:1px solid #f1f5f9">Opptil 3 mottakere</td></tr>
<tr><td style="padding:10px"><strong>Pro</strong></td><td style="padding:10px">299 kr/mnd</td><td style="padding:10px">3</td><td style="padding:10px">Opptil 5 mottakere</td></tr>
</tbody>
</table>
<h2>Velg Kyst hvis du...</h2>
<ul><li>Bare trenger e-postvarsler til deg selv</li><li>Har opp til tre kyststeder du vil følge</li><li>Er ny og vil prøve tjenesten til en lav pris</li></ul>
<h2>Velg Familie hvis du...</h2>
<ul><li>Vil at hele familien skal få SMS-varsler</li><li>Har én fast lokasjon (f.eks. hytta)</li><li>Vil inkludere barn, ektefelle eller foreldre</li></ul>
<h2>Velg Pro hvis du...</h2>
<ul><li>Trenger varsler for flere lokasjoner med SMS</li><li>Er båteier med ulike farvann</li><li>Ønsker maksimal fleksibilitet</li></ul>
`,
  },

  'kom-i-gang/registrering': {
    tittel: 'Slik registrerer du deg',
    kategori: 'Kom i gang',
    html: `
<p>Det tar under 2 minutter å komme i gang med Bølgevarsel.</p>
<h2>Steg 1 — Velg plan</h2>
<p>Gå til <a href="/registrer" style="color:#4da8cc">bolgevarsel.no/registrer</a> og velg abonnementsplanen som passer deg. Du kan alltid bytte plan senere.</p>
<h2>Steg 2 — Skriv inn e-postadressen din</h2>
<p>Skriv inn e-postadressen du ønsker å bruke. Denne brukes til å logge inn og motta e-postrapporter.</p>
<h2>Steg 3 — Betal</h2>
<p>Du sendes til en sikker Stripe-betalingsside. Vi aksepterer alle vanlige betalingskort. Abonnementet fornyes automatisk hver måned og du kan si opp når som helst.</p>
<h2>Steg 4 — Sjekk innboksen</h2>
<p>Etter betaling sender vi deg en velkomste-post med en innloggingslenke. Klikk lenken for å komme til Min side.</p>
<h2>Steg 5 — Legg til lokasjon og mottakere</h2>
<p>På Min side legger du til kyststedet du vil følge og telefonnumrene som skal motta SMS-varsler. Ferdig!</p>
<p style="margin-top:1.5rem;padding:1rem;background:#f0f8fc;border-radius:12px;font-size:0.9rem">💡 <strong>Tips:</strong> Du begynner å motta daglige varsler fra neste morgen kl. 07:30.</p>
`,
  },

  'kom-i-gang/legg-til-lokasjon': {
    tittel: 'Legg til din kystlokasjon',
    kategori: 'Kom i gang',
    html: `
<p>En lokasjon er stedet du vil motta sjø- og værvarsler for. Du kan velge alle steder langs norskekysten.</p>
<h2>Slik legger du til en lokasjon</h2>
<ol>
<li>Logg inn på <a href="/min-side" style="color:#4da8cc">Min side</a></li>
<li>Finn seksjonen <strong>Mine lokasjoner</strong></li>
<li>Skriv inn stedsnavnet i søkefeltet — f.eks. "Tånes", "Stavanger havn" eller "Lyngdal"</li>
<li>Velg riktig sted fra forslagslisten</li>
<li>Klikk <strong>Legg til</strong></li>
</ol>
<h2>Hvor nøyaktig er lokasjonen?</h2>
<p>Vi bruker koordinatene fra stedsnavnet du velger. Jo mer spesifikt sted du søker, desto mer nøyaktige blir værdataene. For en hytte i en vik kan det lønne seg å søke på det nærmeste tettstedet.</p>
<h2>Antall lokasjoner per plan</h2>
<ul>
<li><strong>Kyst:</strong> opptil 3 lokasjoner</li>
<li><strong>Familie:</strong> 1 lokasjon</li>
<li><strong>Pro:</strong> opptil 3 lokasjoner</li>
</ul>
<p style="margin-top:1.5rem;padding:1rem;background:#f0f8fc;border-radius:12px;font-size:0.9rem">💡 <strong>Tips:</strong> Du må legge til minst én lokasjon før du kan legge til mottakere.</p>
`,
  },

  'kom-i-gang/legg-til-mottakere': {
    tittel: 'Legg til mottakere',
    kategori: 'Kom i gang',
    html: `
<p>Mottakere er personene som skal motta SMS-varsler for en gitt lokasjon. Du kan for eksempel legge til deg selv, ektefellen og barna.</p>
<h2>Slik legger du til en mottaker</h2>
<ol>
<li>Logg inn på <a href="/min-side" style="color:#4da8cc">Min side</a></li>
<li>Sørg for at du har lagt til minst én lokasjon først</li>
<li>Finn seksjonen <strong>Mine mottakere</strong></li>
<li>Velg hvilken lokasjon mottakeren skal få varsler for</li>
<li>Skriv inn navn (valgfritt) og telefonnummer i format <code>+4799...</code></li>
<li>Klikk <strong>Legg til mottaker</strong></li>
</ol>
<h2>Antall mottakere per plan</h2>
<ul>
<li><strong>Kyst:</strong> Ingen SMS — kun e-post til deg</li>
<li><strong>Familie:</strong> opptil 3 SMS-mottakere</li>
<li><strong>Pro:</strong> opptil 5 SMS-mottakere</li>
</ul>
<h2>Kan mottakere pauses?</h2>
<p>Ja! Du kan enkelt pause en mottaker ved å klikke ⏸-knappen. Da slutter de å motta SMS-varsler inntil du aktiverer dem igjen. Du kan også skru av SMS spesifikt uten å slette mottakeren.</p>
`,
  },

  'varsler/nar-sendes-varsel': {
    tittel: 'Når sendes varselet?',
    kategori: 'Varsler og rapporter',
    html: `
<p>Bølgevarsel sender ut daglige varsler <strong>kl. 07:30 hver morgen</strong> — slik at du vet hva dagen bringer før du legger ut på havet eller planlegger aktiviteter.</p>
<h2>SMS-varselet</h2>
<p>SMS sendes kl. 07:30 til alle aktive mottakere. Det tar normalt under 1 minutt fra utsending til du mottar meldingen.</p>
<h2>E-postrapporten</h2>
<p>E-postrapporten sendes samtidig som SMS og inneholder en mer detaljert gjennomgang av dagens og kommende dagers forhold.</p>
<h2>Farevarsler</h2>
<p>Farevarsler sendes <strong>utenom den faste kl. 07:30</strong> dersom det oppstår ekstreme forhold i løpet av dagen — f.eks. kuling, sterk vind eller høye bølger. Da varsler vi umiddelbart, uansett tidspunkt.</p>
<p style="margin-top:1.5rem;padding:1rem;background:#fff8e1;border-radius:12px;font-size:0.9rem">⚠️ <strong>Merk:</strong> Varsler sendes ikke i helger og helligdager — tjenesten kjører alle 365 dager i året.</p>
`,
  },

  'varsler/forstå-sms': {
    tittel: 'Forstå SMS-varselet',
    kategori: 'Varsler og rapporter',
    html: `
<p>SMS-varselet er kortfattet og designet for å gi deg det viktigste på sekunder. Her er et eksempel:</p>
<div style="background:#f8fbfc;border:1px solid #e2e8f0;border-radius:12px;padding:1.2rem;font-family:monospace;font-size:0.9rem;margin:1rem 0;line-height:1.8">
Bølgevarsel - Tånes, søndag 5. apr<br/>
Bølger: 0.3m | Vind: 3m/s SV | Temp: 8°C<br/>
Forhold: Rolig og pent. God dag på sjøen.
</div>
<h2>Hva betyr feltene?</h2>
<ul>
<li><strong>Bølger:</strong> Signifikant bølgehøyde i meter</li>
<li><strong>Vind:</strong> Vindstyrke i meter per sekund og vindretning</li>
<li><strong>Temp:</strong> Lufttemperatur</li>
<li><strong>Forhold:</strong> En kort oppsummering av dagen</li>
</ul>
<h2>Vindretninger forklart</h2>
<p>N = Nord, S = Sør, Ø = Øst, V = Vest, NV = Nordvest osv. Vindretningen angir <em>hvor vinden kommer fra</em>.</p>
`,
  },

  'varsler/forstå-epost': {
    tittel: 'Forstå e-postrapporten',
    kategori: 'Varsler og rapporter',
    html: `
<p>E-postrapporten gir en komplett gjennomgang av sjø- og værsituasjonen. Den er mer detaljert enn SMS og inneholder trender fremover i tid.</p>
<h2>Innholdet i rapporten</h2>
<ul>
<li><strong>Dagens forhold</strong> — bølgehøyde, vind, temperatur og en vurdering</li>
<li><strong>Farevarsel-status</strong> — om det er varslet om ekstremvær</li>
<li><strong>Alle dine lokasjoner</strong> — én seksjon per sted du følger</li>
</ul>
<h2>Farger og emojier</h2>
<p>Rapporten bruker farger for å gjøre det enkelt å vurdere forholdene på et øyeblikk:</p>
<ul>
<li>🟢 Rolige og gode forhold</li>
<li>🟡 Moderat — vær litt forsiktig</li>
<li>🔴 Krevende eller farlige forhold</li>
</ul>
`,
  },

  'varsler/farevarsel': {
    tittel: 'Hva er et farevarsel?',
    kategori: 'Varsler og rapporter',
    html: `
<p>Et farevarsel sendes automatisk når vi registrerer ekstreme sjø- eller værforhold ved en av dine lokasjoner. Dette er et ekstraordinært varsel utenom den daglige kl. 07:30-utsendingen.</p>
<h2>Hva utløser et farevarsel?</h2>
<ul>
<li>Bølgehøyde over 2 meter</li>
<li>Vindstyrke tilsvarende kuling (over 13,9 m/s)</li>
<li>Ekstreme temperaturforhold</li>
</ul>
<h2>Hvem mottar farevarsel?</h2>
<p>Alle aktive mottakere mottar farevarsel via SMS — også de som normalt har SMS skrudd av. Sikkerhet går foran innstillinger.</p>
<p style="margin-top:1.5rem;padding:1rem;background:#fee2e2;border-radius:12px;font-size:0.9rem">🔴 <strong>Viktig:</strong> Farevarsel er ikke en erstatning for offisielle varsler fra Meteorologisk institutt og Kystverket. Følg alltid myndighetenes råd.</p>
`,
  },

  'varsler/pause-sms': {
    tittel: 'Pause eller skru av SMS-varsler',
    kategori: 'Varsler og rapporter',
    html: `
<p>Det er enkelt å pause eller skru av SMS-varsler uten å slette mottakeren.</p>
<h2>Pause en mottaker</h2>
<ol>
<li>Logg inn på <a href="/min-side" style="color:#4da8cc">Min side</a></li>
<li>Finn mottakeren under <strong>Mine mottakere</strong></li>
<li>Klikk ⏸-knappen for å pause</li>
</ol>
<p>Pauset mottaker får ikke SMS-varsler, men kan enkelt aktiveres igjen med ▶-knappen.</p>
<h2>Skru av SMS for en mottaker</h2>
<p>Klikk 📱-knappen for å skru av SMS spesifikt. Mottakeren forblir aktiv og vil motta SMS igjen hvis det sendes farevarsel.</p>
<h2>Skru av alle varsler midlertidig</h2>
<p>Vil du ikke motta noe? Pause alle mottakere individuelt. Du kan alltids aktivere dem igjen med ett klikk per mottaker.</p>
`,
  },

  'konto/logg-inn': {
    tittel: 'Slik logger du inn',
    kategori: 'Konto og abonnement',
    html: `
<p>Bølgevarsel bruker <strong>innloggingslenker via e-post</strong> — du trenger aldri å huske et passord.</p>
<h2>Slik logger du inn</h2>
<ol>
<li>Gå til <a href="/min-side" style="color:#4da8cc">bolgevarsel.no/min-side</a></li>
<li>Skriv inn e-postadressen du registrerte deg med</li>
<li>Klikk <strong>Send innloggingslenke</strong></li>
<li>Sjekk innboksen din og klikk lenken i e-posten</li>
<li>Du er nå logget inn på Min side</li>
</ol>
<h2>Hvor lenge er innloggingslenken gyldig?</h2>
<p>Innloggingslenker er gyldige i <strong>1 time</strong> og kan kun brukes én gang. Hvis lenken er utløpt, kan du enkelt be om en ny.</p>
<h2>Husker du ikke e-posten din?</h2>
<p>Sjekk kvitteringen du mottok fra Stripe etter kjøp — den inneholder e-postadressen din. Du kan også kontakte oss på <a href="mailto:hei@bolgevarsel.no" style="color:#4da8cc">hei@bolgevarsel.no</a>.</p>
<p style="margin-top:1.5rem;padding:1rem;background:#f0f8fc;border-radius:12px;font-size:0.9rem">💡 <strong>Tips:</strong> Sjekk søppelpost hvis du ikke finner innloggings-e-posten.</p>
`,
  },

  'konto/endre-epost': {
    tittel: 'Endre e-postadresse',
    kategori: 'Konto og abonnement',
    html: `
<p>Ønsker du å endre e-postadressen din? Ta kontakt med oss så ordner vi det raskt.</p>
<h2>Slik endrer du e-post</h2>
<p>Send en e-post til <a href="mailto:hei@bolgevarsel.no" style="color:#4da8cc">hei@bolgevarsel.no</a> fra den gamle e-postadressen din og oppgi den nye adressen du ønsker å bruke.</p>
<p>Vi behandler forespørsler innen én virkedag.</p>
`,
  },

  'konto/bytte-plan': {
    tittel: 'Bytte abonnementsplan',
    kategori: 'Konto og abonnement',
    html: `
<p>Du kan bytte abonnementsplan når som helst. Send oss en e-post på <a href="mailto:hei@bolgevarsel.no" style="color:#4da8cc">hei@bolgevarsel.no</a> med hvilken plan du ønsker å bytte til, så ordner vi det for deg.</p>
<h2>Hva skjer med eksisterende data?</h2>
<p>Lokasjoner og mottakere beholdes ved planbytte. Hvis du bytter til en plan med færre lokasjoner eller mottakere enn du allerede har, vil vi informere deg om hva som må justeres.</p>
<h2>Fakturering ved planbytte</h2>
<p>Ved oppgradering faktureres differansen for gjenværende periode. Ved nedgradering krediteres du for gjenværende periode.</p>
`,
  },

  'konto/si-opp': {
    tittel: 'Si opp abonnementet',
    kategori: 'Konto og abonnement',
    html: `
<p>Du kan si opp abonnementet ditt når som helst — ingen bindingstid.</p>
<h2>Slik sier du opp</h2>
<p>Send en e-post til <a href="mailto:hei@bolgevarsel.no" style="color:#4da8cc">hei@bolgevarsel.no</a> fra e-postadressen din og be om oppsigelse. Vi behandler det innen én virkedag.</p>
<h2>Hva skjer etter oppsigelse?</h2>
<ul>
<li>Abonnementet løper ut inneværende betalingsperiode</li>
<li>Du vil ikke belastes for neste periode</li>
<li>Varsler fortsetter til periodens slutt</li>
<li>Kontoen og dataene dine slettes etter 30 dager</li>
</ul>
<p style="margin-top:1.5rem;padding:1rem;background:#f0f8fc;border-radius:12px;font-size:0.9rem">💡 Vurderer du å si opp fordi du savner en funksjon? Send oss en e-post — vi tar gjerne imot tilbakemeldinger!</p>
`,
  },

  'konto/betaling': {
    tittel: 'Betaling og faktura',
    kategori: 'Konto og abonnement',
    html: `
<p>Bølgevarsel bruker <strong>Stripe</strong> for sikker betalingshåndtering. Vi lagrer aldri kortinformasjon på egne servere.</p>
<h2>Betalingsmetoder</h2>
<p>Vi aksepterer alle vanlige betalingskort — Visa, Mastercard og American Express.</p>
<h2>Fakturering</h2>
<p>Abonnementet faktureres månedlig fra den dagen du registrerte deg. Du mottar en kvittering på e-post etter hver betaling.</p>
<h2>Finn dine fakturaer</h2>
<p>Kvitteringer sendes automatisk til e-postadressen din fra Stripe. Har du mistet en kvittering? Kontakt oss på <a href="mailto:hei@bolgevarsel.no" style="color:#4da8cc">hei@bolgevarsel.no</a>.</p>
`,
  },

  'faq/hvor-noyaktig': {
    tittel: 'Hvor nøyaktig er værdataene?',
    kategori: 'Vanlige spørsmål',
    html: `
<p>Vi henter værvarsler fra <strong>Open-Meteo</strong>, som er en gratis og åpen værtjeneste basert på data fra europeiske og globale værtjenester inkludert ECMWF og Meteo France. Dataene oppdateres flere ganger daglig.</p>
<h2>Nøyaktighet</h2>
<p>For de fleste norske kyststeder er dataene svært gode — spesielt langs åpne kystlinjer. I trange fjorder og sund kan lokale vindeffekter påvirke nøyaktigheten noe.</p>
<h2>Bølgedata</h2>
<p>Bølgehøyde hentes fra havmodeller og er generelt pålitelige for eksponerte kyststeder. I lukkede fjorder bør du ta høyde for at lokale bølgeforhold kan avvike.</p>
<p style="margin-top:1.5rem;padding:1rem;background:#fff8e1;border-radius:12px;font-size:0.9rem">⚠️ Bølgevarsel er et hjelpemiddel for planlegging — ta alltid egne vurderinger og følg offisielle farevarsler fra Meteorologisk institutt.</p>
`,
  },

  'faq/hvilke-lokasjoner': {
    tittel: 'Hvilke lokasjoner kan jeg velge?',
    kategori: 'Vanlige spørsmål',
    html: `
<p>Du kan velge alle steder langs norskekysten — fra Hvaler i sør til Nordkapp i nord. Vi bruker stedsnavn fra Open-Meteos geokodingstjeneste som dekker hele Norge.</p>
<h2>Slik søker du opp et sted</h2>
<p>Søk på stedsnavnet, tettstedet eller kommunen nærmest der du vil overvåke. Jo mer spesifikt, jo bedre. Eksempler:</p>
<ul>
<li>Tånes</li>
<li>Stavanger havn</li>
<li>Henningsvær</li>
<li>Lindesnes</li>
<li>Ålesund</li>
</ul>
<h2>Finner du ikke stedet ditt?</h2>
<p>Prøv å søke på nærmeste tettsted eller kommunenavn. Kontakt oss på <a href="mailto:hei@bolgevarsel.no" style="color:#4da8cc">hei@bolgevarsel.no</a> hvis du ikke finner det du leter etter.</p>
`,
  },

  'faq/sms-ikke-mottatt': {
    tittel: 'Jeg har ikke mottatt SMS — hva gjør jeg?',
    kategori: 'Vanlige spørsmål',
    html: `
<p>De vanligste årsakene til at SMS ikke mottas:</p>
<h2>1. Telefonnummeret er feil registrert</h2>
<p>Logg inn på <a href="/min-side" style="color:#4da8cc">Min side</a> og sjekk at telefonnummeret er korrekt med landkode. Norske numre skal skrives som <code>+4799112233</code>.</p>
<h2>2. Mottakeren er pauset eller deaktivert</h2>
<p>Sjekk at mottakeren viser status <strong>Aktiv</strong> og at SMS er slått på (📱-ikonet er grønt).</p>
<h2>3. Ingen lokasjon er lagt til</h2>
<p>SMS sendes bare hvis det er knyttet en aktiv lokasjon til mottakeren. Sjekk at lokasjon er satt opp under <strong>Mine lokasjoner</strong>.</p>
<h2>4. Nettverk/operatørproblemer</h2>
<p>Av og til kan SMS bli forsinket av nettverksproblemer hos mobiloperatøren. Vent noen minutter og sjekk igjen.</p>
<p>Vedvarer problemet? Kontakt oss på <a href="mailto:hei@bolgevarsel.no" style="color:#4da8cc">hei@bolgevarsel.no</a>.</p>
`,
  },

  'faq/flere-lokasjoner': {
    tittel: 'Kan jeg ha flere lokasjoner?',
    kategori: 'Vanlige spørsmål',
    html: `
<p>Ja! Antall lokasjoner avhenger av abonnementsplanen din:</p>
<ul>
<li><strong>Kyst:</strong> opptil 3 lokasjoner (kun e-post)</li>
<li><strong>Familie:</strong> 1 lokasjon</li>
<li><strong>Pro:</strong> opptil 3 lokasjoner med SMS</li>
</ul>
<h2>Varsler for flere lokasjoner</h2>
<p>Hvis du har flere lokasjoner får du én samlet e-postrapport med alle stedene, og én samlet SMS per mottaker med informasjon om alle aktive lokasjoner.</p>
<h2>Vil du ha enda flere lokasjoner?</h2>
<p>Ta kontakt på <a href="mailto:hei@bolgevarsel.no" style="color:#4da8cc">hei@bolgevarsel.no</a> — vi kan tilpasse en løsning for spesielle behov.</p>
`,
  },

  'faq/datakilder': {
    tittel: 'Hvilke datakilder bruker dere?',
    kategori: 'Vanlige spørsmål',
    html: `
<p>Bølgevarsel bruker data fra åpne og anerkjente meteorologiske tjenester:</p>
<h2>Open-Meteo</h2>
<p><a href="https://open-meteo.com" style="color:#4da8cc" target="_blank">Open-Meteo</a> er en gratis, åpen API-tjeneste som samler data fra europeiske og globale værtjenester — inkludert ECMWF (European Centre for Medium-Range Weather Forecasts), som regnes som verdens beste værvarselsmodell.</p>
<h2>Hva henter vi?</h2>
<ul>
<li>Signifikant bølgehøyde (fra havmodell)</li>
<li>Vindstyrke og vindretning (10m høyde)</li>
<li>Lufttemperatur</li>
<li>Bølgeperiode</li>
</ul>
<h2>Oppdateringsfrekvens</h2>
<p>Dataene oppdateres flere ganger daglig. Varselet vårt kl. 07:30 bruker den siste tilgjengelige modellkjøringen.</p>
`,
  },
}
