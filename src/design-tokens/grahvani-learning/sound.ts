/**
 * Grahvani Learning — Sound Vocabulary
 * Mirrors §7 of frontend/docs/learning-module/00-design-constitution.md (v0.2).
 *
 * Sound is opt-in (muted by default). Restricted to four occasions:
 * correct-placement chime, section-completion swell, lesson-completion motif,
 * optional sloka recitation audio.
 */

export type SoundSlug =
  | "chime-correct"
  | "swell-section"
  | "motif-lesson-complete";

export interface SoundAsset {
  slug: SoundSlug;
  durationMs: number;
  description: string;
  webmPath: string;
  mp3FallbackPath: string;
}

export const soundRegistry: Record<SoundSlug, SoundAsset> = {
  "chime-correct": {
    slug: "chime-correct",
    durationMs: 600,
    description: "Low temple-bell tone, 220 Hz fundamental, soft decay",
    webmPath: "/assets/learning/sound/chime-correct.webm",
    mp3FallbackPath: "/assets/learning/sound/chime-correct.mp3",
  },
  "swell-section": {
    slug: "swell-section",
    durationMs: 800,
    description: "Held tonic chord, E major open fifth",
    webmPath: "/assets/learning/sound/swell-section.webm",
    mp3FallbackPath: "/assets/learning/sound/swell-section.mp3",
  },
  "motif-lesson-complete": {
    slug: "motif-lesson-complete",
    durationMs: 1200,
    description: "Three-note rising motif C → E → G, soft attack",
    webmPath: "/assets/learning/sound/motif-lesson-complete.webm",
    mp3FallbackPath: "/assets/learning/sound/motif-lesson-complete.mp3",
  },
} as const;

const MUTE_STORAGE_KEY = "grahvani-learning-sound-muted";

export function isSoundMuted(): boolean {
  if (typeof window === "undefined") return true; // SSR default: muted
  const stored = window.localStorage.getItem(MUTE_STORAGE_KEY);
  // Default state is muted; only unmute if explicitly set to "false"
  return stored !== "false";
}

export function setSoundMuted(muted: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MUTE_STORAGE_KEY, String(muted));
}
