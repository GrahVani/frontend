/**
 * Curriculum index — server-side enumeration of the entire curriculum tree.
 *
 * Walks the curriculum directory (read from a path resolved relative to the
 * monorepo root) and produces a typed structure: Tier → Modules → Chapters →
 * Lessons. Each lesson record includes the title, slug, target minutes, and
 * Bloom levels parsed from the lesson front-matter.
 *
 * This is the data source for the gamified learning dashboard at /learn.
 * Cached at the module level so each request reads the filesystem only once.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface CurriculumLesson {
  /** "lesson-01-jyotisha-as-vedanga" */
  slug: string;
  /** Numeric sequence within chapter (1, 2, 3…) */
  sequence: number;
  /** Display title (front-matter `title`). */
  title: string;
  /** Optional Devanāgarī title (front-matter `title_devanagari`). */
  titleDevanagari?: string;
  /** Approximate total minutes (front-matter `target_minutes_total` ?? 25). */
  targetMinutes: number;
  /** Bloom levels (e.g., ["Remember", "Understand"]). */
  bloomLevels: string[];
  /** Whether the lesson is fully authored (front-matter present + body non-empty). */
  isAuthored: boolean;
  /** URL path: "/learn/tier-1/module-1/chapter-1/lesson-1" */
  href: string;
  /** Canonical front-matter slug for progress-store keying. */
  canonicalSlug: string;
}

export interface CurriculumChapter {
  /** "chapter-01-what-jyotisha-is" */
  slug: string;
  sequence: number;
  /** Display name extracted from chapter-overview.md heading. */
  title: string;
  lessons: CurriculumLesson[];
}

export interface CurriculumModule {
  /** "module-01-introduction-to-jyotisha" */
  slug: string;
  sequence: number;
  /** Display name from module-overview.md heading. */
  title: string;
  /** Optional Devanāgarī or Sanskrit subtitle. */
  subtitle?: string;
  chapters: CurriculumChapter[];
  totalLessons: number;
  totalAuthoredLessons: number;
}

export interface CurriculumTier {
  /** "tier-1-foundation" */
  slug: string;
  sequence: 1 | 2 | 3;
  /** "Foundation" / "Practice" / "Mastery". */
  title: string;
  modules: CurriculumModule[];
  totalLessons: number;
  totalAuthoredLessons: number;
  /** Whether this tier is currently buildable (only Tier 1 in MVP). */
  isAvailable: boolean;
}

const TIER_META: Record<1 | 2 | 3, { title: string; isAvailable: boolean }> = {
  1: { title: "Foundation", isAvailable: true },
  2: { title: "Practice", isAvailable: false },
  3: { title: "Mastery", isAvailable: false },
};

/** Resolve the curriculum directory absolute path. */
function curriculumRoot(): string {
  // Frontend is at /Users/.../Grahvani/frontend ; curriculum at /Users/.../Grahvani/curriculum
  return path.resolve(process.cwd(), "../curriculum");
}

/** Extract "Module 01 — Introduction to Jyotiṣa" → "Introduction to Jyotiṣa". */
function parseModuleTitle(markdown: string, fallback: string): { title: string; subtitle?: string } {
  const firstHeading = markdown.match(/^#\s+(.+)$/m);
  if (!firstHeading) return { title: fallback };
  const heading = firstHeading[1].trim();
  // Pattern: "Module 01 — Introduction to Jyotiṣa"
  const m = heading.match(/^Module\s+\d+\s*[—–-]\s*(.+)$/);
  return { title: m ? m[1].trim() : heading };
}

/** Extract "Module 01 · Chapter 1 — What Jyotiṣa Is…" → "What Jyotiṣa Is…". */
function parseChapterTitle(markdown: string, fallback: string): string {
  const firstHeading = markdown.match(/^#\s+(.+)$/m);
  if (!firstHeading) return fallback;
  const heading = firstHeading[1].trim();
  const m = heading.match(/^.*Chapter\s+\d+\s*[—–-]\s*(.+)$/);
  return m ? m[1].trim() : heading;
}

function readMarkdown(filepath: string): string | null {
  try {
    return fs.readFileSync(filepath, "utf-8");
  } catch {
    return null;
  }
}

function buildLessonHref(tierNum: number, moduleNum: number, chapterNum: number, sequence: number): string {
  return `/learn/tier-${tierNum}/module-${moduleNum}/chapter-${chapterNum}/lesson-${sequence}`;
}

/** Convert "module-01-introduction-…" → 1; "chapter-03-…" → 3; "lesson-02-…" → 2. */
function extractSequence(slug: string): number {
  const m = slug.match(/^(?:module|chapter|lesson)-(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

/** Sort by sequence ascending, falling back to slug. */
function bySequence<T extends { sequence: number; slug: string }>(a: T, b: T): number {
  if (a.sequence !== b.sequence) return a.sequence - b.sequence;
  return a.slug.localeCompare(b.slug);
}

function loadLessonsForChapter(chapterDir: string, tierNum: number, moduleNum: number, chapterNum: number): CurriculumLesson[] {
  let entries: string[] = [];
  try {
    entries = fs.readdirSync(chapterDir);
  } catch {
    return [];
  }
  const lessons: CurriculumLesson[] = [];
  for (const entry of entries) {
    if (!entry.startsWith("lesson-") || !entry.endsWith(".md")) continue;
    const filepath = path.join(chapterDir, entry);
    const raw = readMarkdown(filepath);
    if (!raw) continue;
    const { data: fm, content: body } = matter(raw);
    const sequence = extractSequence(entry);
    const isAuthored = Boolean(fm.title && body.trim().length > 200);
    lessons.push({
      slug: entry.replace(/\.md$/, ""),
      sequence,
      title: typeof fm.title === "string" ? fm.title : `Lesson ${sequence}`,
      titleDevanagari: typeof fm.title_devanagari === "string" ? fm.title_devanagari : undefined,
      targetMinutes: typeof fm.target_minutes_total === "number" ? fm.target_minutes_total : 25,
      bloomLevels: Array.isArray(fm.bloom_levels) ? (fm.bloom_levels as string[]) : [],
      isAuthored,
      href: buildLessonHref(tierNum, moduleNum, chapterNum, sequence),
      canonicalSlug: typeof fm.slug === "string" ? fm.slug : entry.replace(/\.md$/, ""),
    });
  }
  lessons.sort(bySequence);
  return lessons;
}

function loadChaptersForModule(moduleDir: string, tierNum: number, moduleNum: number): CurriculumChapter[] {
  let entries: string[] = [];
  try {
    entries = fs.readdirSync(moduleDir);
  } catch {
    return [];
  }
  const chapters: CurriculumChapter[] = [];
  for (const entry of entries) {
    if (!entry.startsWith("chapter-")) continue;
    const chapterDir = path.join(moduleDir, entry);
    let isDir = false;
    try {
      isDir = fs.statSync(chapterDir).isDirectory();
    } catch {
      continue;
    }
    if (!isDir) continue;
    const overview = readMarkdown(path.join(chapterDir, "00-chapter-overview.md"));
    const sequence = extractSequence(entry);
    chapters.push({
      slug: entry,
      sequence,
      title: overview ? parseChapterTitle(overview, entry) : humanise(entry.replace(/^chapter-\d+-/, "")),
      lessons: loadLessonsForChapter(chapterDir, tierNum, moduleNum, sequence),
    });
  }
  chapters.sort(bySequence);
  return chapters;
}

function loadModulesForTier(tierDir: string, tierNum: number): CurriculumModule[] {
  let entries: string[] = [];
  try {
    entries = fs.readdirSync(tierDir);
  } catch {
    return [];
  }
  const modules: CurriculumModule[] = [];
  for (const entry of entries) {
    if (!entry.startsWith("module-")) continue;
    const moduleDir = path.join(tierDir, entry);
    let isDir = false;
    try {
      isDir = fs.statSync(moduleDir).isDirectory();
    } catch {
      continue;
    }
    if (!isDir) continue;
    const overview = readMarkdown(path.join(moduleDir, "00-module-overview.md"));
    const sequence = extractSequence(entry);
    const { title } = overview
      ? parseModuleTitle(overview, entry)
      : { title: humanise(entry.replace(/^module-\d+-/, "")) };
    const chapters = loadChaptersForModule(moduleDir, tierNum, sequence);
    const totalLessons = chapters.reduce((acc, c) => acc + c.lessons.length, 0);
    const totalAuthoredLessons = chapters.reduce(
      (acc, c) => acc + c.lessons.filter((l) => l.isAuthored).length,
      0,
    );
    modules.push({
      slug: entry,
      sequence,
      title,
      chapters,
      totalLessons,
      totalAuthoredLessons,
    });
  }
  modules.sort(bySequence);
  return modules;
}

function humanise(s: string): string {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

let _cachedIndex: CurriculumTier[] | null = null;

export function getCurriculumIndex(): CurriculumTier[] {
  if (_cachedIndex) return _cachedIndex;
  const root = curriculumRoot();
  const tiers: CurriculumTier[] = [];
  for (const tierNum of [1, 2, 3] as const) {
    const tierSlug = tierNum === 1 ? "tier-1-foundation" : tierNum === 2 ? "tier-2-practice" : "tier-3-mastery";
    const tierDir = path.join(root, tierSlug);
    let exists = false;
    try {
      exists = fs.statSync(tierDir).isDirectory();
    } catch {
      exists = false;
    }
    const meta = TIER_META[tierNum];
    if (!exists) {
      tiers.push({
        slug: tierSlug,
        sequence: tierNum,
        title: meta.title,
        modules: [],
        totalLessons: 0,
        totalAuthoredLessons: 0,
        isAvailable: false,
      });
      continue;
    }
    const modules = loadModulesForTier(tierDir, tierNum);
    const totalLessons = modules.reduce((acc, m) => acc + m.totalLessons, 0);
    const totalAuthoredLessons = modules.reduce((acc, m) => acc + m.totalAuthoredLessons, 0);
    tiers.push({
      slug: tierSlug,
      sequence: tierNum,
      title: meta.title,
      modules,
      totalLessons,
      totalAuthoredLessons,
      isAvailable: meta.isAvailable && modules.length > 0,
    });
  }
  _cachedIndex = tiers;
  return tiers;
}
