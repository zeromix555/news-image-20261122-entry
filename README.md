[![make.fun · news-image-20261122](https://make.fun/badge/news-image-20261122.svg)](https://make.fun/bounty/news-image-20261122?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261122)
[![rank](https://make.fun/badge/news-image-20261122/zeromix555/news-image-20261122-entry/rank.svg)](https://make.fun/bounty/news-image-20261122/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261122)
[![reward](https://make.fun/badge/news-image-20261122/zeromix555/news-image-20261122-entry/reward.svg)](https://make.fun/bounty/news-image-20261122?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261122)

# The World in One Day — Sunday, 22 November 2026

An entry for the [make.fun bounty "Sum up 22 November's world news in one image"](https://make.fun/bounty/news-image-20261122) ($100 in USDC).

A make.fun `news-image-20261122` entry. The program writes one image that sums
up the world's news of Sunday 22 November 2026 to `/output/entry.png`.

## The image

A newspaper front page — "THE WORLD IN ONE DAY — SUNDAY, 22 NOVEMBER 2026" —
built around a generated illustration of Earth at night over the Persian Gulf,
with explosions, missile trails and warships. The lead story is the widening
Gulf war, with six story cards drawn in crisp text:

1. **Gulf / Lead** — Iran strikes a US air base in Kuwait and targets in
   Bahrain; tankers are hit off Oman and a vessel is attacked in the Strait
   of Hormuz.
2. **Climate / COP31, Antalya** — Climate talks close in on a final deal
   after a deadlock over fossil fuels.
3. **Disaster / Peru** — A magnitude 6.9 earthquake shakes the Andes; no
   damage or casualties reported at first.
4. **War / Ukraine** — Drones hit a Russian cargo ship in the Baltic; a
   drone falls in Poland; Russia fires 400 drones and 110 missiles at
   Ukraine.
5. **Diplomacy / Shenzhen** — Trump, Xi and Putin meet at the APEC summit;
   Trump says an Iran deal could last 20 years.
6. **Americas** — Brazil's jailed ex-president Bolsonaro is admitted to
   intensive care; the arrest of cartel kingpin "El Chapo Isidro" sparks
   deadly violence in Sinaloa, Mexico.

Plus an "Also today" strip (Estonia to close its border with Russia, a boat
capsizing in Nigeria, South Africa's local elections, Nepal's PM to meet
Modi).

All headlines and labels are drawn programmatically, so every word is spelled
exactly as reported. Sources: BBC, Reuters, AP, Times of India, Arab News.

## Run

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies the `entry.png` beside it to `$MAKEFUN_OUTPUT_DIR/entry.png`
(`/output/entry.png` in the grader). No network, no dependencies, deterministic:
both runs write the same bytes.

## License

MIT — see `LICENSE`.
