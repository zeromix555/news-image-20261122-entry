// news-image-20261122 — v2 entry program.
//
// The entry image is a front page drawn for Sunday 22 November 2026:
// a masthead, a lead story on the Gulf tanker attacks, three illustrated
// panels (COP31 in Antalya, the Peru earthquake, the Shenzhen trilateral),
// three text cards (UN killer-robot talks, Nepal's new PM in Delhi, the
// Sinaloa cartel arrest) and an also-today strip. The picture itself was
// composed offline and is shipped in this repository as entry.png, so this
// program only has to copy it into the grader's output directory.
//
// Deterministic by construction: a byte-for-byte copy, no network, no
// clock, no randomness. Running it twice writes identical bytes.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");

// The grader sets MAKEFUN_OUTPUT_DIR; local runs fall back to ./out.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? join(here, "out");
const target = join(outDir, "entry.png");

mkdirSync(outDir, { recursive: true });

const bytes = readFileSync(source);
writeFileSync(target, bytes);

// Read back what was written so a truncated copy can never pass silently.
const written = readFileSync(target);
if (written.length !== bytes.length || !written.equals(bytes)) {
  throw new Error("entry.png copy mismatch: output differs from source");
}

console.log(`entry.png: ${bytes.length} bytes -> ${target}`);
