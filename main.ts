// news-image-20261122 v3 — "THE WORLD TODAY": a newspaper front page for
// Sunday, 22 November 2026. Node 22, standard library only. The program draws
// the whole page itself (hand-built 5x7 bitmap font, raw RGB framebuffer,
// hand-rolled PNG encoder) and writes it to /output/entry.png.
// Deterministic: no clock, no randomness, no network — two runs write the
// same bytes.
//
// Run: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Stories (all happened or first reported on 22 November 2026, verified
// against BBC / Reuters / AP / The Guardian / ESA / ICJ reporting):
//  1. COP31 climate summit in Antalya ends with no deal (lead)
//  2. Russian warship hit by suspected Ukrainian drone at Benghazi, Libya
//  3. Russian drone partly destroys a flat block in Dymer, near Kyiv; 14 missing
//  4. Democrats win at least 258 US House seats, biggest majority since 1992
//  5. Iran strikes a civilian site in Bahrain; Gulf states condemn it
//  6. World Court finds Myanmar responsible for genocide against the Rohingya
//  7. BepiColombo enters orbit around Mercury after an eight-year journey
//  8. Global stocks slide as the AI sell-off deepens (S&P 500 -3.7%)
//  9. Mexico captures cartel boss "El Chapo Isidro" in Sinaloa
// 10. Candy factory fire in Banten, Indonesia: 3 dead, 36 workers missing
// 11. Boat carrying funeral mourners capsizes in Nigeria: at least 24 dead
// Also today: Marc Marquez wins an eighth MotoGP title; Gukesh opens his
// world chess title defence; a one-shot CRISPR therapy cuts bad cholesterol 52%.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { deflateSync } from "node:zlib";

// ---------------------------------------------------------------------------
// 5x7 bitmap font. Each glyph is 7 rows of 5 cells ("1" = ink, "0" = paper).
// ---------------------------------------------------------------------------
const FONT: Record<string, string[]> = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01110", "10001", "10000", "10111", "10001", "10001", "01111"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["01110", "00100", "00100", "00100", "00100", "00100", "01110"],
  J: ["00111", "00010", "00010", "00010", "00010", "10010", "01100"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "11011", "10001"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
  a: ["00000", "00000", "01110", "00001", "01111", "10001", "01111"],
  b: ["10000", "10000", "11110", "10001", "10001", "10001", "11110"],
  c: ["00000", "00000", "01110", "10000", "10000", "10001", "01110"],
  d: ["00001", "00001", "01111", "10001", "10001", "10001", "01111"],
  e: ["00000", "00000", "01110", "10001", "11111", "10000", "01110"],
  f: ["00110", "01000", "01000", "11110", "01000", "01000", "01000"],
  g: ["00000", "01111", "10001", "10001", "01111", "00001", "01110"],
  h: ["10000", "10000", "11110", "10001", "10001", "10001", "10001"],
  i: ["00100", "00000", "01100", "00100", "00100", "00100", "01110"],
  j: ["00010", "00000", "00110", "00010", "00010", "10010", "01100"],
  k: ["10000", "10000", "10010", "10100", "11000", "10100", "10010"],
  l: ["01100", "00100", "00100", "00100", "00100", "00100", "01110"],
  m: ["00000", "00000", "11010", "10101", "10101", "10101", "10101"],
  n: ["00000", "00000", "11110", "10001", "10001", "10001", "10001"],
  o: ["00000", "00000", "01110", "10001", "10001", "10001", "01110"],
  p: ["00000", "11110", "10001", "10001", "11110", "10000", "10000"],
  q: ["00000", "01111", "10001", "10001", "01111", "00001", "00001"],
  r: ["00000", "00000", "10110", "11001", "10000", "10000", "10000"],
  s: ["00000", "00000", "01111", "10000", "01110", "00001", "11110"],
  t: ["00100", "00100", "11110", "00100", "00100", "00100", "00011"],
  u: ["00000", "00000", "10001", "10001", "10001", "10011", "01101"],
  v: ["00000", "00000", "10001", "10001", "10001", "01010", "00100"],
  w: ["00000", "00000", "10001", "10101", "10101", "10101", "01010"],
  x: ["00000", "00000", "10001", "01010", "00100", "01010", "10001"],
  y: ["00000", "00000", "10001", "10001", "01111", "00001", "01110"],
  z: ["00000", "00000", "11111", "00010", "00100", "01000", "11111"],
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11111", "00010", "00100", "00010", "00001", "10001", "01110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
  ".": ["00000", "00000", "00000", "00000", "00000", "01100", "01100"],
  ",": ["00000", "00000", "00000", "00000", "01100", "00100", "01000"],
  ":": ["00000", "01100", "01100", "00000", "01100", "01100", "00000"],
  ";": ["00000", "01100", "01100", "00000", "01100", "00100", "01000"],
  "'": ["00100", "00100", "01000", "00000", "00000", "00000", "00000"],
  '"': ["01010", "01010", "00000", "00000", "00000", "00000", "00000"],
  "!": ["00100", "00100", "00100", "00100", "00100", "00000", "00100"],
  "?": ["01110", "10001", "00001", "00010", "00100", "00000", "00100"],
  "-": ["00000", "00000", "00000", "01110", "00000", "00000", "00000"],
  "(": ["00010", "00100", "01000", "01000", "01000", "00100", "00010"],
  ")": ["01000", "00100", "00010", "00010", "00010", "00100", "01000"],
  "%": ["11001", "11010", "00010", "00100", "01000", "01011", "10011"],
  "/": ["00001", "00010", "00010", "00100", "01000", "01000", "10000"],
  "&": ["01100", "10010", "10100", "01000", "10101", "10010", "01101"],
  "+": ["00000", "00100", "00100", "11111", "00100", "00100", "00000"],
  "=": ["00000", "00000", "11111", "00000", "11111", "00000", "00000"],
  $: ["00100", "01111", "10100", "01110", "00101", "11110", "00100"],
  "#": ["01010", "01010", "11111", "01010", "11111", "01010", "01010"],
  "*": ["00000", "10101", "01110", "11111", "01110", "10101", "00000"],
  "@": ["01110", "10001", "10111", "10101", "10110", "10000", "01110"],
  _: ["00000", "00000", "00000", "00000", "00000", "00000", "11111"],
  "[": ["01110", "01000", "01000", "01000", "01000", "01000", "01110"],
  "]": ["01110", "00010", "00010", "00010", "00010", "00010", "01110"],
  "•": ["00000", "00000", "01100", "01100", "01100", "00000", "00000"],
  "—": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
};

// ---------------------------------------------------------------------------
// Framebuffer + drawing
// ---------------------------------------------------------------------------
const W = 1024;
const H = 1024;
const PAPER: [number, number, number] = [247, 242, 231];
const INK: [number, number, number] = [20, 20, 20];
const RED: [number, number, number] = [179, 35, 27];
const GREY: [number, number, number] = [90, 86, 78];
const WHITE: [number, number, number] = [255, 255, 255];

type RGB = [number, number, number];
const fb = new Uint8Array(W * H * 3);
for (let i = 0; i < W * H; i++) {
  fb[i * 3] = PAPER[0];
  fb[i * 3 + 1] = PAPER[1];
  fb[i * 3 + 2] = PAPER[2];
}

function px(x: number, y: number, c: RGB): void {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const o = (y * W + x) * 3;
  fb[o] = c[0];
  fb[o + 1] = c[1];
  fb[o + 2] = c[2];
}

function rect(x: number, y: number, w: number, h: number, c: RGB): void {
  for (let j = y; j < y + h; j++)
    for (let i = x; i < x + w; i++) px(i, j, c);
}

function hline(x: number, y: number, w: number, c: RGB, t = 1): void {
  rect(x, y, w, t, c);
}

function vline(x: number, y: number, h: number, c: RGB, t = 1): void {
  rect(x, y, t, h, c);
}

function circle(cx: number, cy: number, r: number, c: RGB): void {
  for (let a = 0; a < 360; a += 1) {
    const rad = (a * Math.PI) / 180;
    px(Math.round(cx + r * Math.cos(rad)), Math.round(cy + r * Math.sin(rad)), c);
    px(Math.round(cx + (r - 1) * Math.cos(rad)), Math.round(cy + (r - 1) * Math.sin(rad)), c);
  }
}

function chord(cx: number, cy: number, r: number, dy: number, c: RGB): void {
  // Horizontal chord of the circle at vertical offset dy.
  const half = Math.sqrt(Math.max(0, r * r - dy * dy));
  for (let x = Math.round(cx - half); x <= Math.round(cx + half); x++)
    px(x, Math.round(cy + dy), c);
}

function ellipseArc(cx: number, cy: number, rx: number, ry: number, c: RGB): void {
  // Vertical meridian ellipse of a globe.
  for (let a = 0; a < 360; a += 1) {
    const rad = (a * Math.PI) / 180;
    px(Math.round(cx + rx * Math.sin(rad)), Math.round(cy + ry * Math.cos(rad)), c);
  }
}

// ---------------------------------------------------------------------------
// Text: drawText returns the pixel width. Scale s => glyph 5s wide, 7s tall.
// ---------------------------------------------------------------------------
function textWidth(s: string, scale: number): number {
  return s.length * 6 * scale - scale;
}

function drawText(x: number, y: number, s: string, scale: number, c: RGB): number {
  let cx = x;
  for (const ch of s) {
    const g = FONT[ch] ?? FONT[" "];
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 5; col++) {
        if (g[row][col] === "1") {
          for (let dy = 0; dy < scale; dy++)
            for (let dx = 0; dx < scale; dx++)
              px(cx + col * scale + dx, y + row * scale + dy, c);
        }
      }
    }
    cx += 6 * scale;
  }
  return cx - x - scale;
}

function drawCentered(y: number, s: string, scale: number, c: RGB): void {
  drawText(Math.round((W - textWidth(s, scale)) / 2), y, s, scale, c);
}

function wrap(s: string, maxW: number, scale: number): string[] {
  const words = s.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? cur + " " + w : w;
    if (textWidth(test, scale) <= maxW || !cur) cur = test;
    else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function drawPara(x: number, y: number, s: string, maxW: number, scale: number, c: RGB, leading: number): number {
  const lines = wrap(s, maxW, scale);
  let yy = y;
  for (const ln of lines) {
    drawText(x, yy, ln, scale, c);
    yy += 7 * scale + leading;
  }
  return yy;
}

// ---------------------------------------------------------------------------
// Page layout
// ---------------------------------------------------------------------------
const MX = 36; // side margin
const CW = W - 2 * MX; // content width = 952

// Top rule + masthead
hline(MX, 24, CW, INK, 3);
drawCentered(38, "THE WORLD TODAY", 6, INK);
hline(MX, 88, CW, RED, 4);
drawCentered(100, "SUNDAY, 22 NOVEMBER 2026", 3, RED);
hline(MX, 128, CW, INK, 2);

// ---- Lead story: COP31 ----
const LEAD_Y = 142;
drawText(MX, LEAD_Y, "CLIMATE  •  ANTALYA, TURKEY", 2, RED);
drawPara(MX, LEAD_Y + 26, "COP31 ENDS WITH NO DEAL ON FOSSIL FUELS", 592, 4, INK, 6);
drawPara(
  MX,
  LEAD_Y + 104,
  "Two days late, the UN climate summit closed on Sunday with no agreement, after the EU and about 130 countries rejected a draft that never named fossil fuels. The longest climate summit on record ends with no new pledges.",
  592,
  2,
  INK,
  4,
);
// Lead illustration: globe with a red NO DEAL banner
const GX = 824;
const GY = 232;
circle(GX, GY, 78, INK);
chord(GX, GY, 78, -38, INK);
chord(GX, GY, 78, 0, INK);
chord(GX, GY, 78, 38, INK);
vline(GX, GY - 78, 156, INK);
ellipseArc(GX, GY, 34, 78, INK);
rect(GX - 86, GY + 52, 172, 30, RED);
drawText(GX - Math.round(textWidth("NO DEAL", 2) / 2), GY + 57, "NO DEAL", 2, WHITE);

hline(MX, 332, CW, INK, 2);

// ---- Story cards: 2 columns x 4 rows ----
interface Card {
  kicker: string;
  head: string;
  deck: string;
}
const CARDS: Card[] = [
  {
    kicker: "WAR AT SEA  •  BENGHAZI, LIBYA",
    head: "RUSSIAN WARSHIP HIT BY DRONE",
    deck: "Suspected Ukrainian sea drone strikes a corvette docked at Benghazi; a second ship is targeted.",
  },
  {
    kicker: "UKRAINE  •  DYMER, NEAR KYIV",
    head: "DRONE HITS FLAT BLOCK; 14 MISSING",
    deck: "A Russian drone partly destroys a five-storey apartment block; rescuers search the rubble.",
  },
  {
    kicker: "USA  •  WASHINGTON",
    head: "DEMOCRATS TAKE 258 HOUSE SEATS",
    deck: "Biggest House majority since 1992 after a recount win in North Carolina; Jeffries to be Speaker.",
  },
  {
    kicker: "GULF  •  BAHRAIN",
    head: "IRAN STRIKES SITE IN BAHRAIN",
    deck: "A civilian industrial site is hit, two people wounded; Saudi Arabia, Qatar and the UAE condemn it.",
  },
  {
    kicker: "JUSTICE  •  THE HAGUE",
    head: "COURT: MYANMAR GUILTY OF GENOCIDE",
    deck: "The World Court finds Myanmar responsible for genocide against the Rohingya people.",
  },
  {
    kicker: "SPACE  •  MERCURY",
    head: "BEPICOLOMBO REACHES MERCURY",
    deck: "The European-Japanese probe enters orbit after an eight-year, 6-billion-mile journey.",
  },
  {
    kicker: "MARKETS  •  NEW YORK",
    head: "STOCKS SLIDE AS AI SELLS OFF",
    deck: "S&P 500 falls 3.7% and the Nikkei 5.06% as Nvidia faces an SEC accounting inquiry.",
  },
  {
    kicker: "MEXICO  •  SINALOA",
    head: "CARTEL BOSS 'EL CHAPO ISIDRO' CAUGHT",
    deck: "Fausto Isidro Meza Flores seized in a firefight that leaves four soldiers and 16 gunmen dead.",
  },
];
const COL_W = 464;
const COL_GAP = 24;
const ROW_H = 134;
const ROW_GAP = 6;
const GRID_Y = 344;
CARDS.forEach((card, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = MX + col * (COL_W + COL_GAP);
  const y = GRID_Y + row * (ROW_H + ROW_GAP);
  hline(x, y, COL_W, INK, 1);
  drawText(x, y + 8, card.kicker, 2, RED);
  drawPara(x, y + 30, card.head, COL_W, 3, INK, 5);
  const headLines = wrap(card.head, COL_W, 3).length;
  drawPara(x, y + 30 + headLines * 26 + 4, card.deck, COL_W, 2, INK, 4);
});

hline(MX, 906, CW, INK, 2);

// ---- Also today strip ----
drawText(MX, 918, "ALSO TODAY", 2, RED);
const STRIP_Y = 940;
const STRIP_W = 300;
const STRIP_GAP = 26;
const STRIPS = [
  "NIGERIA: Boat capsizes, 24 mourners dead.",
  "INDONESIA: Factory fire, 3 dead, 36 missing.",
  "SPORT: Marquez wins an 8th MotoGP title.",
];
STRIPS.forEach((s, i) => {
  const x = MX + i * (STRIP_W + STRIP_GAP);
  drawPara(x, STRIP_Y, s, STRIP_W, 2, INK, 4);
});
drawCentered(984, "CHESS: GUKESH OPENS TITLE DEFENCE  •  SCIENCE: CRISPR CUTS CHOLESTEROL 52%", 2, INK);
drawCentered(1004, "22 NOVEMBER 2026  •  SOURCES: BBC, REUTERS, AP, THE GUARDIAN, ESA, ICJ", 2, GREY);

// ---------------------------------------------------------------------------
// PNG encoder (color type 2, RGB, 8-bit). Deterministic.
// ---------------------------------------------------------------------------
const CRC_TABLE: number[] = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c >>> 0;
}
function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type: string, data: Buffer): Buffer {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, "ascii");
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, "ascii"), data])), 8 + data.length);
  return out;
}

const raw = Buffer.alloc(H * (1 + W * 3));
for (let y = 0; y < H; y++) {
  raw[y * (1 + W * 3)] = 0; // filter: none
  raw.set(fb.subarray(y * W * 3, (y + 1) * W * 3), y * (1 + W * 3) + 1);
}
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 2; // color type RGB
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.png"), png);
