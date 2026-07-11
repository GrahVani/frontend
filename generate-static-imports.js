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
