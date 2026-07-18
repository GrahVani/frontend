const fs = require('fs');
const path = require('path');

const baseDir = 'src/components/learning-runtime/interactive';
const outputFile = 'src/components/learning-runtime/interactive/interactive-map.ts';

let mapEntries = [];

const tiers = ['tier-1', 'tier-2'];
for (const tier of tiers) {
  const tierPath = path.join(baseDir, tier);
  if (!fs.existsSync(tierPath)) continue;
  
  const modules = fs.readdirSync(tierPath);
  for (const mod of modules) {
    if (!mod.startsWith('module-')) continue;
    
    const modPath = path.join(tierPath, mod);
    const components = fs.readdirSync(modPath);
    
    for (const comp of components) {
      const compPath = path.join(modPath, comp);
      if (fs.statSync(compPath).isDirectory()) {
        // Skip placeholder directories that have no entry file yet — importing
        // them would break the build with "Module not found".
        const hasEntry = fs.existsSync(path.join(compPath, 'index.tsx')) || fs.existsSync(path.join(compPath, 'index.ts'));
        if (!hasEntry) continue;
        const importStr = `  "${tier}/${mod}/${comp}": () => import("@/components/learning-runtime/interactive/${tier}/${mod}/${comp}/index")`;
        mapEntries.push(importStr);
      }
    }
  }
}

const content = `// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
export const interactiveMap: Record<string, () => Promise<any>> = {
${mapEntries.join(',\n')}
};
`;

fs.writeFileSync(outputFile, content);
console.log('Generated interactive-map.ts with ' + mapEntries.length + ' entries.');
