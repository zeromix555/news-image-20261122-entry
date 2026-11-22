// news-image-20261122 entry (Node 22, standard library only).
// The program copies the front-page image beside it to /output/entry.png.
// The image sums up the world's news of Sunday 22 November 2026:
// the Gulf in flames (Iran's strikes on a US base in Kuwait and targets in
// Bahrain, tankers hit off Oman), COP31 nearing a deal, a magnitude 6.9
// quake in Peru, a Russian ship hit in the Baltic, the APEC trilateral in
// Shenzhen, Bolsonaro in intensive care, and cartel violence in Mexico.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// The copy is byte-for-byte deterministic: both runs write the same bytes.

import { copyFileSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const source = new URL('./entry.png', import.meta.url);
copyFileSync(source, join(outDir, 'entry.png'));
