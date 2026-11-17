# 1-BID · Udvikling af IT-systemer

Kursusmateriale til modulet **Udvikling af IT-systemer** (1-BID, Innovation og digitalisering) ved Aalborg Universitet, efterår 2026.

**Kursushjemmeside:** <https://jeppefq.github.io/bid/>

Hvad sker der egentlig inde i de IT-systemer, der træffer beslutninger i den offentlige sektor? På modulet lærer I, hvordan computere, algoritmer og software virker, og I lærer det ved selv at programmere i Python. Koden i slides kører direkte i browseren, og under hver kodeboks ligger en trinvis forklaring skrevet til begyndere. Begreberne bliver vist med figurer, man kan trykke sig igennem.

- **Underviser:** Jeppe Fjeldgaard Qvist (modulansvarlig) og Marianne Paasch
- **Omfang:** 10 ECTS, 10 kursusgange, hver med en workshop
- **Mini-projekt:** Diversitetsbarometeret, fra lektion 3 ([`jeppeFQ/BID-workshop-projekt`](https://github.com/jeppeFQ/BID-workshop-projekt))
- **Eksamen:** mandag 16. november 2026 kl. 8.00 til tirsdag 17. november 2026 kl. 16.00
- **Beskeder og øvelsesfiler:** [Moodle](https://www.moodle.aau.dk/course/view.php?id=59710)

## Grundbøger

- Kernighan, B. W. (2021): *Understanding the Digital World*, 2. udgave. Princeton University Press.
- Downey, A. B. (2024): [*Think Python*, 3. udgave](https://allendowney.github.io/ThinkPython/index.html). O'Reilly Media. Frit tilgængelig online.

## Plan og litteratur

| # | Dato | Emne | Læs | Workshop |
|---|---|---|---|---|
| 1 | 15/9 | [Computere, algoritmer og Python](lektioner/01-computere-algoritmer-og-python/index.qmd) | Studieordningen · Kernighan kap. 1–3 · Downey: forordet | Installation af Python og kommandolinjen |
| 2 | 18/9 | [Intro til Python](lektioner/02-intro-til-python/index.qmd) | | Python-øvelser |
| 3 | 22/9 | [Git og versionskontrol](lektioner/03-git-og-versionskontrol/index.qmd) | Pro Git kap. 1–2 · *Getting Started with GitHub* | Git i praksis og Python-øvelser |
| 4 | 30/9 | [Programmeringsparadigmer og algoritmer](lektioner/04-paradigmer-og-algoritmer/index.qmd) | Kernighan kap. 6–7 · Downey kap. 4–6 | Mini-projektet: en bestilling fra en kunde |
| 5 | 2/10 | [Softwaredesign](lektioner/05-softwaredesign/index.qmd) | Downey kap. 14–16 | Videre arbejde med mini-projektet |
| 6 | 5/10 | [Workshop: mini-projektet](lektioner/06-python-workshop/index.qmd) | Downey kap. 8–13 | Mini-projektet |
| 7 | 7/10 | [Machine learning og kunstig intelligens](lektioner/07-machine-learning-og-ai/index.qmd) | Kernighan kap. 12 | Python-øvelser |
| 8 | 20/10 | [SQL og databaser](lektioner/08-sql-og-databaser/index.qmd) | Downey kap. 13 · *What is SQLite?* · IBM om REST API | Python/SQL-øvelser |
| 9 | 23/10 | [Plain text, compilere og markup](lektioner/09-plain-text-compilere-og-markup/index.qmd) | Kernighan kap. 5 og 10 · Healy, *The Plain Person's Guide to Plain Text Social Science* | Markdown-øvelser |
| 10 | 27/10 | [Chatbots, NLP og ChatGPT](lektioner/10-chatbots-nlp-og-chatgpt/index.qmd) | *Tænker sprogmodeller?* (skim) | Eksamensforberedelse |

Fulde litteraturhenvisninger står på hver lektions side.

## Sådan er repositoryet bygget op

```
bid/
├── index.qmd              forsiden
├── _quarto.yml            menu, sidefod og fælles indstillinger
├── _variables.yml         semester, datoer og links (rettes én gang om året)
├── _ordliste.yml          ordliste til slides (hover-forklaringer)
├── kursus/                om kurset, plan, mini-projekt, eksamen, værktøjer
├── lektioner/
│   └── 05-softwaredesign/
│       ├── index.qmd      lektionens side: beskrivelse, litteratur, materiale
│       ├── slides.qmd     slides (format: sds1-revealjs)
│       └── billeder/
├── assets/                AAU-logo og bølger
├── _skabeloner/lektion/   skabelon til en ny lektion
├── _extensions/
│   ├── sds1/              kursets design (samme som SDS1): designsystem, celler, layouts, figurer
│   └── r-wasm/live/       quarto-live (Python i browseren)
└── tools/ny.py            opretter en ny lektion
```

## Vedligeholdelse

Du skal bruge [Quarto](https://quarto.org) 1.6 eller nyere. Der kræves ikke Python for at bygge siden, fordi al kode køres i læserens browser.

```bash
quarto preview        # se siden lokalt, opdateres når du gemmer
quarto render         # byg hele siden i _site/
```

Når du pusher til `main`, bygger og udgiver GitHub Actions siden automatisk (`.github/workflows/publish.yml`). Første gang: *Settings → Pages → Source: GitHub Actions*.

**Ny lektion**

```bash
python3 tools/ny.py lektion 11 "Titel på lektionen"
```

Ret derefter `index.qmd` (dato, beskrivelse, `workshop`, `status`) og `slides.qmd` i den nye mappe. Lektionen dukker selv op på forsiden og i planen, sorteret efter `lektion`.

**Felter øverst i en lektions `index.qmd`**

| Felt | Betydning |
|---|---|
| `lektion` | Nummeret i listerne. Bestemmer rækkefølgen |
| `date` | Dato for undervisningen |
| `description` | Én sætning, der vises i listerne |
| `workshop` | Dagens workshop, vises under beskrivelsen |
| `status` | `klar` (links til slides vises), `kommer`, `anden` (anden underviser) eller `moodle` (materiale på Moodle) |
| `slides` | `true`, når der ligger en `slides.qmd` i mappen |
| `litteratur` | Kort litteraturliste til planen |

**Slides: sådan bygger du en lektion**

Start fra `_skabeloner/lektion/slides.qmd`. Den viser byggeklodserne én gang. Designet ligger ét sted, `_extensions/sds1/`, og skal aldrig kopieres ud i lektionerne. Det er det samme design som på SDS1; ret det ét sted, og kopiér mappen til det andet kursus.

*Accentfarve.* Hver lektion har én farve til links, fremhævninger, statuslinje og Kør-knap:

```yaml
accent: turkis      # lyseblaa | turkis | orange | lilla | gul
```

*Layouts*

| Skriv | Giver |
|---|---|
| (titelslidet laves af YAML) | Titel med bølger, lektionsmærkat, QR-kode og link |
| `# Overskrift` + én linje | Sektion: farvet flade med nummer (01, 02 ...) |
| `## {.udsagn}` + én sætning | Udsagn: én sætning eller ét tal, meget stort |
| `## Overskrift` | Indhold. To kolonner: `:::: {.to-kol}` med to `::: {.kol}`. Tre: `:::: {.to-kol .tre-kol}` |
| `## Overskrift {.kodelab}` | Kodelab: cellen fylder slidet, editor til venstre, output til højre |
| `## Overskrift {.opgave}` | Opgave: `::: {.opgavetekst}` til venstre, cellen til højre |
| `## Sidst i dag {.sidst}` | Afslutning med kort (`:::: {.kort-raekke}`) og logo |

*Tre slags celler:* `:::: {.demo}` (kører af sig selv), `:::: {.proev}` (kan redigeres) og `:::: {.oevelse}` (huller, hint, løsning og automatisk tjek). Se skabelonen.

- **Forklaring.** Hver kodeblok skal have en `::: {.forklaring}`: nummererede trin til en læser, der aldrig har kodet. `{1}` eller `{2-3}` først i et punkt fremhæver de kodelinjer, punktet handler om.
- **Gæt først.** `:::: {.proev gaet="Hvad sker der?" valg="4|22|En fejl"}` skjuler outputtet, til der er gættet og kørt.
- **Forslag.** `:::: {.proev forslag="Skift 84 ud med 30."}` står under editoren.
- **Lange linjer.** Celler og kodeblokke med lange linjer får selv en lidt mindre skrift og en bredere editor. Lange celler ruller inde i editoren.
- **Ordliste.** `[algoritme]{.ord}` slår op i `_ordliste.yml` i roden (én linje pr. ord). Brug den sparsomt: første gang et ord bliver forklaret.
- **Begrebsfigurer.** `::: {.figur figur="git" fil="analyse.ipynb"}` med `:::` under. Figurerne har knapperne *Næste trin* og *Forfra*, en tekst til skærmlæsere og ingen animation ved "reducer bevægelse". Hver figur er beskrevet lige over sin funktion:
  - `figurer.js` (fælles med SDS1): `gennemsnit`, `maske`, `variabel`, `funktion`, `gruppe`, `indeks`, `alias`, `spor`, `taeller`, `join`, `omform`, `anatomi`, `kobling`, `stak`, `rens`, `soejler`, `dtm`, `tegn`, `ordbog`, `tfidf`, `pca`, `kmeans`
  - `figurer-it.js`: `arkitektur`, `cpu`, `bits`, `slange`, `retur`, `gren`, `filtrae`, `terminal`, `vcs`, `git`, `fork`, `branch`, `gitignore`, `synk` (fetch/pull/push), `lag`, `percentil`, `klasse`, `sekvens`, `saetning`
  - `figurer-data.js`: `regler`, `cirkler`, `pixels`, `bayes`, `befolkning`, `tidslinje`, `kaede`, `tabeldele`, `sql`, `markup`, `vektorer`, `analogi`, `markov`, `softmax`, `attention`
- **Diagrammer.** Mermaid virker (` ```{mermaid} `), men en figur fra listen ovenfor passer bedre ind i designet.
- **Nedtælling.** `[3 min]{.timer tid=180}`.
- **Pas på:** brug ikke `###` inde i bokse (Quarto laver dem om til nye slides). Brug fed tekst.

*Hvor ligger hvad*

| Fil i `_extensions/sds1/` | Indhold |
|---|---|
| `resources/design.css` | Designsystemet: variable (farver, skrift), layouts, celler, figurer, mørk tilstand |
| `resources/sds1.js` | Komponenter: husket kode, gæt først, linjefokus, status, værktøjer, ordliste |
| `resources/figurer.js`, `figurer-it.js`, `figurer-data.js` | Begrebsfigurer |
| `resources/skrift/` | Barlow og JetBrains Mono (ingen Google Fonts) |
| `celler.lua`, `sds1.lua`, `forklaring.lua` | Oversætter markeringerne ovenfor |

**Nyt semester**

1. Ret `semester`, `moodle` og `eksamen` i `_variables.yml`.
2. Ret `date` (og evt. `status`) i hver lektions `index.qmd`.
3. Ret tabellen *Vigtige datoer* i `kursus/plan.qmd` og tabellen i denne README.
4. Vil du gemme det gamle semester, så lav et tag først: `git tag e26 && git push --tags`.

## Billeder, der mangler

Fem slides viser en grå boks, *Billedet mangler*, fordi billederne ikke lå i de offentlige repositories:

- `lektioner/07-machine-learning-og-ai/resources/pic-accident.jpg` og `peppespizza.jpeg`
- `lektioner/10-chatbots-nlp-og-chatgpt/resources/fig-pca-politik.png` og `fig-koensakse.png`

Læg filerne på de stier, så dukker de op.

## Licens

Tekst, slides og øvelser: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.da). Kode: MIT. AAU's logo og bølger, tredjepartsbilleder og datasæt er undtaget. Se [LICENSE.md](LICENSE.md).
