/**
 * Scholar rank ladder — derived purely from masteredCount.
 *
 * Each rank carries an English handle, a Devanāgarī handle, and a threshold
 * (number of mastered lessons needed to attain it). The ladder is referenced
 * by the dashboard's identity slot, sticky ribbon greeting, and any future
 * ceremony / unlock animation.
 *
 * Adding a rank: append to RANK_LADDER and ensure thresholds remain strictly
 * monotonically increasing.
 */

export interface Rank {
  name: string;
  devanagari: string;
  threshold: number;
  description: string;
}

export const RANK_LADDER: Rank[] = [
  { name: "Aspirant",      devanagari: "जिज्ञासुः",   threshold: 0,   description: "The threshold of the path" },
  { name: "Pilgrim",       devanagari: "तीर्थयात्री", threshold: 1,   description: "Has taken the first step" },
  { name: "Padānuga",      devanagari: "पदानुगः",     threshold: 3,   description: "Walking in the footsteps" },
  { name: "Adhyāyī",       devanagari: "अध्यायी",     threshold: 8,   description: "A formal student" },
  { name: "Sādhaka",       devanagari: "साधकः",       threshold: 20,  description: "A dedicated practitioner" },
  { name: "Vidyārthī",     devanagari: "विद्यार्थी",   threshold: 50,  description: "A seeker of knowledge" },
  { name: "Paṇḍita",       devanagari: "पण्डितः",     threshold: 120, description: "A learned one" },
  { name: "Ācārya",        devanagari: "आचार्यः",     threshold: 300, description: "A teacher of the path" },
  { name: "Tīrtha-Sūrya",  devanagari: "तीर्थसूर्यः", threshold: 598, description: "Sun of the sacred path" },
];

export interface RankResolution {
  current: Rank;
  next: Rank | null;
  progressToNext: number; // 0..1
  remainingToNext: number;
}

export function getRankFor(masteredCount: number): RankResolution {
  const sorted = [...RANK_LADDER].sort((a, b) => a.threshold - b.threshold);
  let current = sorted[0];
  let nextIdx = -1;
  for (let i = 0; i < sorted.length; i++) {
    if (masteredCount >= sorted[i].threshold) {
      current = sorted[i];
      nextIdx = i + 1;
    } else {
      break;
    }
  }
  const next = nextIdx >= 0 && nextIdx < sorted.length ? sorted[nextIdx] : null;
  let progressToNext = 1;
  let remainingToNext = 0;
  if (next) {
    const span = next.threshold - current.threshold;
    const into = masteredCount - current.threshold;
    progressToNext = span > 0 ? Math.min(1, into / span) : 1;
    remainingToNext = Math.max(0, next.threshold - masteredCount);
  }
  return { current, next, progressToNext, remainingToNext };
}
