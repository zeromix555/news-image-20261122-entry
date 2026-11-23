[![make.fun · news-image-20261122](https://make.fun/badge/news-image-20261122.svg)](https://make.fun/bounty/news-image-20261122?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261122)
[![rank](https://make.fun/badge/news-image-20261122/zeromix555/news-image-20261122-entry/rank.svg)](https://make.fun/bounty/news-image-20261122/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261122)
[![reward](https://make.fun/badge/news-image-20261122/zeromix555/news-image-20261122-entry/reward.svg)](https://make.fun/bounty/news-image-20261122?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261122)

# The World Today — Sunday, 22 November 2026

An entry for the [make.fun bounty "Sum up 22 November's world news in one image"](https://make.fun/bounty/news-image-20261122) ($100 in USDC).

## The image

`entry.png` is a newspaper front page for Sunday, 22 November 2026, under
the masthead "THE WORLD TODAY". Eleven stories from that one day share a
single page, led by the COP31 climate summit in Antalya ending with no
deal on fossil fuels. Around it: a Russian warship hit by a suspected
Ukrainian drone at Benghazi, a Russian drone strike on a flat block in
Dymer near Kyiv, the Democrats' 258-seat House majority, an Iranian
strike on a site in Bahrain, the World Court's genocide ruling against
Myanmar, BepiColombo reaching Mercury, the AI sell-off on world markets,
and the capture of cartel boss "El Chapo Isidro" in Sinaloa. The "Also
today" strip adds the Nigeria boat capsize, the Banten candy factory
fire, Marquez's eighth MotoGP title, Gukesh opening his chess title
defence, and a one-shot CRISPR therapy cutting bad cholesterol by 52%.

Every headline is drawn as crisp text on the page, so each story reads
clearly at a glance and every word is spelled exactly as reported.
Sources include BBC, Reuters, AP, The Guardian, ESA, and the ICJ.

## How it is made

`main.ts` (Node 22, standard library only) draws the whole page itself:
a hand-built 5x7 bitmap font, a raw RGB framebuffer, and a hand-rolled
PNG encoder. No network, no clock, no randomness — two runs write the
same bytes.

## Run

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Output: `out/entry.png`, 1024x1024, under 1 MiB.
