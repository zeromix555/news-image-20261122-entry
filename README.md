# The World in One Day — Sunday, 22 November 2026

A one-image front page summing up the world news of Sunday 22 November
2026, built for the make.fun competition
[news-image-20261122](https://make.fun/bounty/news-image-20261122).

## What the image shows

- **Lead — Gulf crisis:** two tankers struck off Oman; Iran hits a US base
  in Kuwait and targets in Bahrain as Qatar-mediated talks open.
- **Climate — Antalya:** COP31 nears a final deal after all-night talks.
- **Earthquake — Peru:** a magnitude 6.8 quake shakes the Andes; 15 injured.
- **APEC — Shenzhen:** the first Trump–Xi–Putin trilateral skips Ukraine.
- **UN — Geneva:** no ban on "killer robots"; rules work continues to 2028.
- **Diplomacy — Delhi:** Nepal's rapper-turned-PM Balendra Shah lands in Delhi.
- **Mexico — Sinaloa:** a cartel kingpin's arrest sparks deadly violence.
- **Also today:** Nigeria boat capsize, Bolsonaro in ICU, Hartha power
  station fire in Iraq, a 6.8 quake in the Banda Sea.

## How it is built

Four photographs were generated for the lead and the three illustrated
panels; the front page (masthead, headlines, decks, strip) was composed
with a Python/PIL script and shipped as `entry.png`. `main.ts` is a
deterministic program: it copies `entry.png` to
`$MAKEFUN_OUTPUT_DIR/entry.png` (or `./out/entry.png` locally).

Run it locally:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see `LICENSE`.
