import fs from "fs";
import path from "path";

const dataPath = "src/components/learning-runtime/interactive/registry-data.ts";
const outDir = "src/components/learning-runtime/interactive/registries";

if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

const content = fs.readFileSync(dataPath, "utf8");
const lines = content.split(/\r?\n/);

const entries = [];
let inMap = false;
for (const line of lines) {
  if (line.includes("INTERACTIVE_REGISTRY")) { inMap = true; continue; }
  if (inMap && /^\};/.test(line.trim())) { inMap = false; continue; }
  if (!inMap) continue;
  if (line.trim() === "") continue;
  if (line.trim().startsWith("//")) continue;

  const m = line.match(
    /^\s*"([^"]+)":\s*\{\s*path:\s*"([^"]+)",\s*exportName:\s*(null|"([^"]*)")\s*\}/,
  );
  if (m) {
    entries.push({
      slug: m[1],
      path: m[2],
      exportName: m[4] ?? null,
    });
  }
}

// Group by first character
const groups = {};
for (const entry of entries) {
  let char = entry.slug[0].toLowerCase();
  if (!/[a-z]/.test(char)) char = "other";
  
  if (!groups[char]) groups[char] = [];
  groups[char].push(entry);
}

console.log(`Parsed ${entries.length} entries into ${Object.keys(groups).length} buckets`);

// Write bucket files
for (const [char, bucketEntries] of Object.entries(groups)) {
  const outPath = path.join(outDir, `registry-${char}.ts`);
  const out = [];
  out.push('import dynamic from "next/dynamic";');
  out.push('');
  out.push('export const REGISTRY = {');
  for (const entry of bucketEntries) {
    if (entry.exportName === null) {
      out.push(`  "${entry.slug}": dynamic(() => import("../${entry.path}")),`);
    } else {
      out.push(`  "${entry.slug}": dynamic(() => import("../${entry.path}").then(m => ({ default: m.${entry.exportName} }))),`);
    }
  }
  out.push('};');
  out.push('');
  fs.writeFileSync(outPath, out.join("\n"), "utf8");
}

// Write the dynamic loader index
const indexOutPath = "src/components/learning-runtime/interactive/dynamic-loader.ts";
const indexOut = [];
indexOut.push('/**');
indexOut.push(' * Partitioned dynamic loader.');
indexOut.push(' * Solves Turbopack OOM by splitting 860+ chunks into small alphabetical buckets.');
indexOut.push(' */');
indexOut.push('');
indexOut.push('export async function loadInteractive(slug: string) {');
indexOut.push('  let char = slug[0].toLowerCase();');
indexOut.push('  if (!/[a-z]/.test(char)) char = "other";');
indexOut.push('  ');
indexOut.push('  try {');
indexOut.push('    const mod = await import(`./registries/registry-${char}`);');
indexOut.push('    return mod.REGISTRY[slug] || null;');
indexOut.push('  } catch (err) {');
indexOut.push('    console.error("Failed to load registry bucket for", slug, err);');
indexOut.push('    return null;');
indexOut.push('  }');
indexOut.push('}');
indexOut.push('');
fs.writeFileSync(indexOutPath, indexOut.join("\n"), "utf8");

console.log("✓ Done");
