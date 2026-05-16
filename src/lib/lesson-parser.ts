/**
 * Parses a 12-section lesson bodyMarkdown into structured data
 * for the interactive lesson components. No backend changes required.
 */

// ─── Types matching what Lesson1Sections expects ─────────────────

export interface ParsedPrerequisite {
  title: string;
  detail: string;
}

export interface ParsedVedanga {
  num: number;
  name: string;
  devanagari: string;
  bodyPart: string;
  bodyIcon: string;
  function: string;
  color: string;
  highlight?: boolean;
}

export interface ParsedMetaphor {
  part: string;
  vedanga: string;
  icon: string;
  explanation: string;
  color: string;
  highlight?: boolean;
}

export interface ParsedComparisonItem {
  term: string;
  meaning: string;
  what: string;
  relation: string;
  example: string;
  color: string;
}

export interface ParsedComparison {
  vedanga: ParsedComparisonItem;
  vedanta: ParsedComparisonItem;
}

export interface ParsedSloka {
  id: string;
  authority: string;
  devanagari: string;
  iast: string;
  english: string;
  source: string;
  commentary: string;
}

export interface ParsedWorkedExample {
  title: string;
  scenario: string;
  analysis: string;
}

export interface ParsedMistake {
  title: string;
  what: string;
  why: string;
  fix: string;
}

export interface ParsedCitation {
  ref: string;
  note: string;
}

export interface ParsedCitations {
  primary: ParsedCitation[];
  modern: ParsedCitation[];
  further: ParsedCitation[];
  crossRefs: ParsedCitation[];
}

export interface ParsedLessonBody {
  sectionTitles: Record<number, string>;
  subsectionTitles: Record<string, string>;
  hookText: string;
  prerequisites: ParsedPrerequisite[];
  vedangaTable: ParsedVedanga[];
  bodyMetaphors: ParsedMetaphor[];
  comparison: ParsedComparison;
  nonCoverage: string[];
  slokas: ParsedSloka[];
  workedExamples: ParsedWorkedExample[];
  commonMistakes: ParsedMistake[];
  rememberItems: string[];
  summaryParagraphs: string[];
  citations: ParsedCitations;
}

// ─── Color/icon mappings ─────────────────────────────────────────

const VEDANGA_META: Record<string, { color: string; icon: string }> = {
  "Siksa": { color: "#C62828", icon: "👃" },
  "Kalpa": { color: "#E65100", icon: "🙏" },
  "Vyakarana": { color: "#1565C0", icon: "👄" },
  "Nirukta": { color: "#6A1B9A", icon: "👂" },
  "Chandas": { color: "#2E7D32", icon: "🦶" },
  "Jyotisa": { color: "#E65100", icon: "👁️" },
};

const BODY_PART_META: Record<string, { color: string; icon: string }> = {
  "Nose": { color: "#C62828", icon: "👃" },
  "Hand": { color: "#E65100", icon: "🙏" },
  "Mouth": { color: "#1565C0", icon: "📖" },
  "Ear": { color: "#6A1B9A", icon: "👂" },
  "Foot": { color: "#2E7D32", icon: "🦶" },
  "Eye": { color: "#E65100", icon: "👁️" },
};

// ─── Diacritics → ASCII mapping ──────────────────────────────────
const DIACRITICS_MAP: Record<string, string> = {
  "ṣ": "s", "Ṣ": "S", "ā": "a", "Ā": "A", "ṅ": "n", "Ṅ": "N",
  "ī": "i", "Ī": "I", "ū": "u", "Ū": "U", "ś": "s", "Ś": "S",
  "ṇ": "n", "Ṇ": "N", "ṛ": "r", "Ṛ": "R", "ṭ": "t", "Ṭ": "T",
  "ḍ": "d", "Ḍ": "D", "ḥ": "h", "Ḥ": "H", "ṃ": "m", "Ṃ": "M",
  "ñ": "n", "Ñ": "N", "ḷ": "l", "Ḷ": "L",
};
const DIACRITICS_RE = new RegExp(`[${Object.keys(DIACRITICS_MAP).join("")}]`, "g");
const DEVANAGARI_RE = /[\u0900-\u097F]+/g;

function stripDiacritics(text: string): string {
  return text
    .replace(DEVANAGARI_RE, "")
    .replace(DIACRITICS_RE, (ch) => DIACRITICS_MAP[ch] || ch)
    .replace(/\s{2,}/g, " ")
    .trim();
}

function sanitizeStrings<T>(obj: T): T {
  if (typeof obj === "string") return stripDiacritics(obj) as unknown as T;
  if (Array.isArray(obj)) return obj.map(sanitizeStrings) as unknown as T;
  if (obj && typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) out[k] = sanitizeStrings(v);
    return out as T;
  }
  return obj;
}

// ─── Helpers ─────────────────────────────────────────────────────

function stripMarkdownBold(md: string): string {
  return md.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1").trim();
}

function splitIntoSections(md: string): Array<{ num: number; title: string; content: string }> {
  const sections: Array<{ num: number; title: string; content: string }> = [];
  const regex = /^#\s+§(\d+(?:\.\d+)?)\s+(.+)$/gm;
  let match: RegExpExecArray | null;
  let lastIndex = 0;
  let lastSection: { num: number; title: string; content: string } | null = null;

  while ((match = regex.exec(md)) !== null) {
    if (lastSection) {
      lastSection.content = md.slice(lastIndex, match.index).trim();
    }
    lastSection = { num: parseFloat(match[1]), title: match[2].trim(), content: "" };
    sections.push(lastSection);
    lastIndex = match.index + match[0].length;
  }

  if (lastSection) {
    lastSection.content = md.slice(lastIndex).trim();
  }

  return sections;
}

function splitSubsections(content: string): Array<{ num: string; title: string; content: string }> {
  const subs: Array<{ num: string; title: string; content: string }> = [];
  const regex = /^##\s+(\d+\.\d+)\s+(.+)$/gm;
  let match: RegExpExecArray | null;
  let lastIndex = 0;
  let lastSub: { num: string; title: string; content: string } | null = null;

  while ((match = regex.exec(content)) !== null) {
    if (lastSub) {
      lastSub.content = content.slice(lastIndex, match.index).trim();
    }
    lastSub = { num: match[1].trim(), title: match[2].trim(), content: "" };
    subs.push(lastSub);
    lastIndex = match.index + match[0].length;
  }

  if (lastSub) {
    lastSub.content = content.slice(lastIndex).trim();
  }

  return subs;
}

function parseBlockquotes(content: string): string[] {
  const blocks: string[] = [];
  const lines = content.split("\n");
  let current: string[] = [];

  for (const line of lines) {
    if (line.startsWith("> ")) {
      current.push(line.replace(/^>\s?/, ""));
    } else if (line.trim() === ">") {
      current.push("");
    } else {
      if (current.length > 0) {
        blocks.push(current.join("\n").trim());
        current = [];
      }
    }
  }

  if (current.length > 0) {
    blocks.push(current.join("\n").trim());
  }

  return blocks;
}

// ─── Section parsers ─────────────────────────────────────────────

function parseHook(content: string): string {
  return content.trim();
}

function parsePrerequisites(content: string): ParsedPrerequisite[] {
  const items: ParsedPrerequisite[] = [];
  const bulletRegex = /^-\s+\*\*([^*]+)\*\*\.?\s*(.*)$/gm;
  let match: RegExpExecArray | null;

  while ((match = bulletRegex.exec(content)) !== null) {
    items.push({ title: match[1].trim(), detail: match[2].trim() });
  }

  // Fallback: any bullet line
  if (items.length === 0) {
    const fallbackRegex = /^-\s+(.+)$/gm;
    while ((match = fallbackRegex.exec(content)) !== null) {
      const line = match[1].trim();
      const boldMatch = line.match(/^\*\*([^*]+)\*\*[\s:.—]+(.+)$/);
      if (boldMatch) {
        items.push({ title: boldMatch[1].trim(), detail: boldMatch[2].trim() });
      } else {
        items.push({ title: line, detail: "" });
      }
    }
  }

  return items;
}

function parseVedangaTable(content: string): ParsedVedanga[] {
  const lines = content.split("\n").filter((l) => l.trim().startsWith("|"));
  if (lines.length < 3) return [];

  // Skip header and separator
  const dataLines = lines.slice(2);
  const result: ParsedVedanga[] = [];

  for (const line of dataLines) {
    const cells = line
      .split("|")
      .map((c) => c.trim())
      .filter((c) => c);
    if (cells.length < 5) continue;

    const num = parseInt(cells[0].replace(/\*\*/g, "").trim(), 10);
    const name = cells[1].replace(/\*\*/g, "").trim();
    const devanagari = cells[2].trim();
    const bodyPartRaw = cells[3].replace(/\*\*/g, "").trim();
    const func = cells[4].replace(/\*\*/g, "").replace(/\*/g, "").trim();

    const meta = VEDANGA_META[stripDiacritics(name)] || { color: "#666", icon: "•" };
    const bodyPart = bodyPartRaw;

    result.push({
      num,
      name,
      devanagari,
      bodyPart,
      bodyIcon: meta.icon,
      function: func,
      color: meta.color,
      highlight: stripDiacritics(name) === "Jyotisa",
    });
  }

  return result;
}

function parseBodyMetaphors(content: string): ParsedMetaphor[] {
  const items: ParsedMetaphor[] = [];
  const bulletRegex = /^-\s+The\s+\*\*(\w+)\s+\(([^)]+)\)\*\*\s+is\s+(.+)$/gm;
  let match: RegExpExecArray | null;

  while ((match = bulletRegex.exec(content)) !== null) {
    const part = match[1].trim();
    const vedanga = match[2].trim();
    const explanation = match[3].trim();
    const meta = BODY_PART_META[part] || { color: "#666", icon: "•" };

    items.push({
      part,
      vedanga,
      icon: meta.icon,
      explanation,
      color: meta.color,
      highlight: vedanga === "Jyotiṣa",
    });
  }

  return items;
}

function parseComparison(content: string): ParsedComparison {
  const vedanga: ParsedComparisonItem = {
    term: "Vedāṅga (वेदाङ्ग)",
    meaning: '"Limb of the Veda"',
    what: "Six supporting disciplines (Śikṣā, Kalpa, Vyākaraṇa, Nirukta, Chandas, Jyotiṣa)",
    relation: "Infrastructure for using the Veda",
    example: "Jyotiṣa is a Vedāṅga",
    color: "#E65100",
  };

  const vedanta: ParsedComparisonItem = {
    term: "Vedānta (वेदान्त)",
    meaning: '"End / culmination of the Veda"',
    what: "Philosophical tradition — Upaniṣads + commentaries (Advaita, Viśiṣṭādvaita, Dvaita schools)",
    relation: "Philosophical distillation of what the Veda means",
    example: "Advaita Vedānta is a Vedānta school",
    color: "#1565C0",
  };

  // Try to enrich from markdown bullets
  const bulletRegex = /^-\s+\*\*([^*]+)\*\*\s*\(([^)]+)\)\s*[—-]\s*"?([^"\n]+)"?/gm;
  let match: RegExpExecArray | null;
  while ((match = bulletRegex.exec(content)) !== null) {
    const name = match[1].trim();
    if (name.includes("Vedāṅga")) {
      vedanga.meaning = `"${match[3].trim()}"`;
    } else if (name.includes("Vedānta")) {
      vedanta.meaning = `"${match[3].trim()}"`;
    }
  }

  return { vedanga, vedanta };
}

function parseNonCoverage(content: string): string[] {
  const items: string[] = [];
  const regex = /^-\s+(.+)$/gm;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    items.push(match[1].trim());
  }
  return items;
}

function parseSlokas(content: string): ParsedSloka[] {
  const blocks = parseBlockquotes(content);
  const slokas: ParsedSloka[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const authorityMatch = block.match(/\*\*Classical authority\s*[—-]\s*(.+?)\*\*/i);
    const devanagariMatch = block.match(/\*\*देवनागरी[^*]*\*\*\n+([\s\S]+?)\n\*\*IAST\*\*/);
    const iastMatch = block.match(/\*\*IAST\*\*\n+([\s\S]+?)\n\*\*English/);
    const englishMatch = block.match(/\*\*English\s*\(([^)]+)\)\*\*\n+>\s*"?([^"]+)"?/);
    const commentaryMatch = block.match(/\*\*Brief commentary\*\*\n+([\s\S]+)/);

    const authority = authorityMatch ? authorityMatch[1].trim() : `Sloka ${i + 1}`;
    const devanagari = devanagariMatch
      ? devanagariMatch[1].trim().replace(/^>\s?/gm, "").replace(/\n+/g, "\n")
      : "";
    const iast = iastMatch
      ? iastMatch[1].trim().replace(/^>\s?/gm, "").replace(/\n+/g, "\n")
      : "";
    const source = englishMatch ? englishMatch[1].trim() : "";
    const english = englishMatch ? englishMatch[2].trim() : "";
    const commentary = commentaryMatch ? commentaryMatch[1].trim() : "";

    if (devanagari || iast) {
      slokas.push({
        id: `sloka-${i + 1}`,
        authority,
        devanagari,
        iast,
        english,
        source,
        commentary,
      });
    }
  }

  return slokas;
}

function parseWorkedExamples(content: string): ParsedWorkedExample[] {
  const examples: ParsedWorkedExample[] = [];
  const regex = /^##\s+Recognition\s+\d+:\s+(.+)$/gm;
  let match: RegExpExecArray | null;
  const positions: Array<{ title: string; start: number }> = [];

  while ((match = regex.exec(content)) !== null) {
    positions.push({ title: match[1].trim(), start: match.index });
  }

  for (let i = 0; i < positions.length; i++) {
    const end = i < positions.length - 1 ? positions[i + 1].start : content.length;
    const sectionContent = content.slice(positions[i].start, end).replace(/^##\s+.+\n+/, "").trim();

    // Split into scenario (first sentence/paragraph) and analysis (rest)
    const lines = sectionContent.split("\n").filter((l) => l.trim());
    const scenario = lines[0]?.trim() || "";
    const analysis = lines.slice(1).join(" ").trim() || scenario;

    examples.push({
      title: positions[i].title,
      scenario,
      analysis,
    });
  }

  return examples;
}

function parseCommonMistakes(content: string): ParsedMistake[] {
  const blocks = parseBlockquotes(content);
  const mistakes: ParsedMistake[] = [];

  for (const block of blocks) {
    const titleMatch = block.match(/⚠️\s*\*\*Common mistake[^:]+:\s*(.+?)\*\*/i);
    const whatMatch = block.match(/\*\*What happens:\*\*\s*([\s\S]+?)\n\*\*Why it happens:/);
    const whyMatch = block.match(/\*\*Why it happens:\*\*\s*([\s\S]+?)\n\*\*How to avoid:/);
    const fixMatch = block.match(/\*\*How to avoid:\*\*\s*([\s\S]+)/);

    if (titleMatch) {
      mistakes.push({
        title: titleMatch[1].trim(),
        what: whatMatch ? whatMatch[1].trim() : "",
        why: whyMatch ? whyMatch[1].trim() : "",
        fix: fixMatch ? fixMatch[1].trim() : "",
      });
    }
  }

  return mistakes;
}

function parseRememberItems(content: string): string[] {
  const blocks = parseBlockquotes(content);
  const items: string[] = [];

  for (const block of blocks) {
    const match = block.match(/💡\s*\*\*Remember:\*\*\s*([\s\S]+)/);
    if (match) {
      items.push(match[1].trim());
    }
  }

  return items;
}

function parseSummaryParagraphs(content: string): string[] {
  return content
    .split("\n\n")
    .map((p) => p.trim())
    .filter((p) => p.length > 0 && !p.startsWith("#"));
}

function parseCitations(content: string, primarySources: ParsedCitation[], modernSources: ParsedCitation[]): ParsedCitations {
  const further: ParsedCitation[] = [];
  const crossRefs: ParsedCitation[] = [];

  const lines = content.split("\n");
  let section: "primary" | "modern" | "further" | "cross" | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("**Primary classical sources")) section = "primary";
    else if (trimmed.startsWith("**Modern translations")) section = "modern";
    else if (trimmed.startsWith("**Going deeper")) section = "further";
    else if (trimmed.startsWith("**Cross-references")) section = "cross";
    else if (trimmed.startsWith("**Next in this chapter")) section = null;
    else if (trimmed.startsWith("-") && section === "further") {
      const match = trimmed.match(/^-\s+\*(.+?)\*\s*\(([^)]+)\)/);
      if (match) {
        further.push({ ref: match[1].trim(), note: match[2].trim() });
      } else {
        const text = trimmed.replace(/^-\s+/, "").trim();
        further.push({ ref: text, note: "" });
      }
    } else if (trimmed.startsWith("-") && section === "cross") {
      const text = trimmed.replace(/^-\s+/, "").trim();
      crossRefs.push({ ref: text, note: "" });
    }
  }

  return {
    primary: primarySources,
    modern: modernSources,
    further,
    crossRefs,
  };
}

// ─── Main entry point ────────────────────────────────────────────

export function parseLessonBody(
  markdown: string,
  apiPrimarySources: Array<{ ref: string; note?: string }> = [],
  apiModernSources: Array<{ ref: string; note?: string }> = []
): ParsedLessonBody {
  const sections = splitIntoSections(markdown);

  // Find sections by number
  const s1 = sections.find((s) => s.num === 1);
  const s2 = sections.find((s) => s.num === 2);
  const s4 = sections.find((s) => s.num === 4);
  const s5 = sections.find((s) => s.num === 5);
  const s6 = sections.find((s) => s.num === 6);
  const s8 = sections.find((s) => s.num === 8);
  const s9 = sections.find((s) => s.num === 9);
  const s11 = sections.find((s) => s.num === 11);
  const s12 = sections.find((s) => s.num === 12);

  // Parse §4 subsections
  let vedangaTable: ParsedVedanga[] = [];
  let bodyMetaphors: ParsedMetaphor[] = [];
  let comparison = parseComparison("");
  let nonCoverage: string[] = [];

  let subsectionTitles: Record<string, string> = {};

  if (s4) {
    const subs = splitSubsections(s4.content);
    const sub41 = subs.find((s) => s.num === "4.1");
    const sub42 = subs.find((s) => s.num === "4.2");
    const sub43 = subs.find((s) => s.num === "4.3");
    const sub44 = subs.find((s) => s.num === "4.4");

    if (sub41) { vedangaTable = parseVedangaTable(sub41.content); subsectionTitles["4.1"] = sub41.title; }
    if (sub42) { bodyMetaphors = parseBodyMetaphors(sub42.content); subsectionTitles["4.2"] = sub42.title; }
    if (sub43) { comparison = parseComparison(sub43.content); subsectionTitles["4.3"] = sub43.title; }
    if (sub44) { nonCoverage = parseNonCoverage(sub44.content); subsectionTitles["4.4"] = sub44.title; }
  }

  const sectionTitles: Record<number, string> = {};
  for (const s of sections) {
    sectionTitles[s.num] = s.title;
  }

  return sanitizeStrings({
    sectionTitles,
    subsectionTitles,
    hookText: s1 ? parseHook(s1.content) : "",
    prerequisites: s2 ? parsePrerequisites(s2.content) : [],
    vedangaTable,
    bodyMetaphors,
    comparison,
    nonCoverage,
    slokas: s5 ? parseSlokas(s5.content) : [],
    workedExamples: s6 ? parseWorkedExamples(s6.content) : [],
    commonMistakes: s8 ? parseCommonMistakes(s8.content) : [],
    rememberItems: s9 ? parseRememberItems(s9.content) : [],
    summaryParagraphs: s11 ? parseSummaryParagraphs(s11.content) : [],
    citations: s12
      ? parseCitations(
          s12.content,
          apiPrimarySources.map((s) => ({ ref: s.ref, note: s.note || "" })),
          apiModernSources.map((s) => ({ ref: s.ref, note: s.note || "" }))
        )
      : { primary: [], modern: [], further: [], crossRefs: [] },
  });
}
