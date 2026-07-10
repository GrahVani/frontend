const fs = require('fs');
const content = fs.readFileSync('src/components/learning-runtime/interactive/registry-data.ts', 'utf8');
const lines = content.split(/\r?\n/);

let inMap = false;
const zEntries = [];
for (const line of lines) {
  if (line.includes("INTERACTIVE_REGISTRY")) { inMap = true; continue; }
  if (inMap && /^\};/.test(line.trim())) { inMap = false; continue; }
  if (!inMap) continue;
  
  const m = line.match(/^\s*"([^"]+)":\s*\{\s*path:\s*"([^"]+)",\s*exportName:\s*(null|"([^"]*)")\s*\}/);
  if (m && m[1].startsWith('z')) {
    zEntries.push(m[1]);
  }
}
console.log('Z entries found:', zEntries);
