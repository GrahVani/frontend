/* ─── Data & Types ─── */

export interface YugaData {
  key: string;
  name: string;
  altName: string;
  devanagari: string;
  color: string;
  proportion: number;
  humanYears: number;
  divyaYears: number;
  dharmaLegs: number;
  gloss: string;
  sandhya: number;
  sandhyamsa: number;
  core: number;
}

export const YUGAS: YugaData[] = [
  {
    key: "satya",
    name: "Satya",
    altName: "Kṛta",
    devanagari: "सत्य",
    color: "#C28220",
    proportion: 4,
    humanYears: 1728000,
    divyaYears: 4800,
    dharmaLegs: 4,
    gloss: "Universal righteousness; truth predominates",
    sandhya: 144000,
    sandhyamsa: 144000,
    core: 1440000,
  },
  {
    key: "treta",
    name: "Tretā",
    altName: "",
    devanagari: "त्रेता",
    color: "#A23A1E",
    proportion: 3,
    humanYears: 1296000,
    divyaYears: 3600,
    dharmaLegs: 3,
    gloss: "Dharma slightly diminished; some unrighteousness emerges",
    sandhya: 108000,
    sandhyamsa: 108000,
    core: 1080000,
  },
  {
    key: "dvapara",
    name: "Dvāpara",
    altName: "",
    devanagari: "द्वापर",
    color: "#4A6FA5",
    proportion: 2,
    humanYears: 864000,
    divyaYears: 2400,
    dharmaLegs: 2,
    gloss: "Dharma half-eroded; mixed righteousness and unrighteousness",
    sandhya: 72000,
    sandhyamsa: 72000,
    core: 720000,
  },
  {
    key: "kali",
    name: "Kali",
    altName: "",
    devanagari: "कलि",
    color: "#4A4A5A",
    proportion: 1,
    humanYears: 432000,
    divyaYears: 1200,
    dharmaLegs: 1,
    gloss: "Dharma severely diminished; unrighteousness predominates",
    sandhya: 36000,
    sandhyamsa: 36000,
    core: 360000,
  },
];

export const TOTAL_PROPORTION = 10;
export const MAHAYUGA_HUMAN = 4320000;
export const MAHAYUGA_DIVYA = 12000;

export type VisualMode = "proportion" | "absolute" | "divya" | "sandhya" | "dharma";

export interface Checkpoint {
  question: string;
  answerKey: string;
  hint: string;
}

export const CHECKPOINTS: Checkpoint[] = [
  {
    question: "Click the yuga that has 3 legs of dharma.",
    answerKey: "treta",
    hint: "Remember: Satya = 4, Tretā = 3, Dvāpara = 2, Kali = 1.",
  },
  {
    question: "Click the yuga that lasts 432,000 human years.",
    answerKey: "kali",
    hint: "Kali is the base unit. All other yugas are multiples of Kali's duration.",
  },
  {
    question: "Click the yuga that occupies 40% of the Mahā-Yuga.",
    answerKey: "satya",
    hint: "Satya has proportion 4 out of 10 total = 40%.",
  },
];

/* ─── Mode config ─── */
export const MODES: { key: VisualMode; label: string; shortLabel: string }[] = [
  { key: "proportion", label: "Proportion", shortLabel: "Ratio" },
  { key: "absolute", label: "Absolute Duration", shortLabel: "Years" },
  { key: "divya", label: "Divya-varṣa", shortLabel: "Divya" },
  { key: "sandhya", label: "Saṁdhyā", shortLabel: "Twilight" },
  { key: "dharma", label: "Dharma Legs", shortLabel: "Dharma" },
];

/* ─── Formatting ─── */
export function fmt(n: number): string {
  return n.toLocaleString();
}

export function fmtCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

/* ─── SVG path helpers ─── */

export function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

export function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return ["M", start.x, start.y, "A", r, r, 0, largeArcFlag, 0, end.x, end.y].join(" ");
}

/** Build a donut-sector path: outer arc → inner arc (reversed) → close */
export function donutSectorPath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startAngle: number,
  endAngle: number
): string {
  const outerStart = polarToCartesian(cx, cy, rOuter, startAngle);
  const outerEnd = polarToCartesian(cx, cy, rOuter, endAngle);
  const innerStart = polarToCartesian(cx, cy, rInner, startAngle);
  const innerEnd = polarToCartesian(cx, cy, rInner, endAngle);

  const largeArc = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", outerStart.x, outerStart.y,
    "A", rOuter, rOuter, 0, largeArc, 1, outerEnd.x, outerEnd.y,
    "L", innerEnd.x, innerEnd.y,
    "A", rInner, rInner, 0, largeArc, 0, innerStart.x, innerStart.y,
    "Z",
  ].join(" ");
}

/** Subdivide a sector angle into N equal parts; returns array of [start, end] pairs */
export function subdivideArc(startAngle: number, endAngle: number, ratios: number[]): [number, number][] {
  const total = ratios.reduce((a, b) => a + b, 0);
  const span = endAngle - startAngle;
  const out: [number, number][] = [];
  let cursor = startAngle;
  for (const r of ratios) {
    const piece = (r / total) * span;
    out.push([cursor, cursor + piece]);
    cursor += piece;
  }
  return out;
}

/* ─── Sector geometry for the wheel ─── */
export const CX = 400;
export const CY = 400;
const R_OUTER = 280;
const R_INNER = 90;

export interface SectorGeom {
  key: string;
  startAngle: number;
  endAngle: number;
  midAngle: number;
  path: string;
  labelX: number;
  labelY: number;
}

export function buildSectors(): SectorGeom[] {
  let cursor = 0;
  return YUGAS.map((y) => {
    const sweep = (y.proportion / TOTAL_PROPORTION) * 360;
    const start = cursor;
    const end = cursor + sweep;
    const mid = start + sweep / 2;
    const path = donutSectorPath(CX, CY, R_OUTER, R_INNER, start, end);
    const labelR = (R_OUTER + R_INNER) / 2;
    const labelPos = polarToCartesian(CX, CY, labelR, mid);
    cursor = end;
    return {
      key: y.key,
      startAngle: start,
      endAngle: end,
      midAngle: mid,
      path,
      labelX: labelPos.x,
      labelY: labelPos.y,
    };
  });
}

/* ─── Orbital marker position helper ─── */
export function getOrbitalPosition(angleDeg: number) {
  return polarToCartesian(CX, CY, 310, angleDeg);
}

/* ─── Static sector data (memoizable) ─── */
export const SECTOR_GEOMS = buildSectors();
