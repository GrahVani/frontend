/**
 * Shared curriculum path resolver for server components and loaders.
 * Resolves the absolute path to the `curriculum/` directory across dev, standalone runner, and container environments.
 */

import fs from "node:fs";
import path from "node:path";

export function getCurriculumRoot(): string {
  // 1. Explicit environment variable override
  if (process.env.CURRICULUM_PATH && fs.existsSync(process.env.CURRICULUM_PATH)) {
    return process.env.CURRICULUM_PATH;
  }

  // 2. Candidate directories across development and production layouts
  const candidates = [
    path.resolve(process.cwd(), "../curriculum"),
    path.resolve(process.cwd(), "curriculum"),
    "/app/curriculum",
    "/curriculum",
    path.resolve(__dirname, "../../../../../curriculum"),
    path.resolve(__dirname, "../../../../../../curriculum")
  ];

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
        // Verify it contains tier-1-foundation to ensure it's the actual curriculum root
        const testTier = path.join(candidate, "tier-1-foundation");
        if (fs.existsSync(testTier)) {
          return candidate;
        }
      }
    } catch {
      // Ignore filesystem errors and check next candidate
    }
  }

  // Fallback to relative parent if no valid candidate matched
  return path.resolve(process.cwd(), "../curriculum");
}
